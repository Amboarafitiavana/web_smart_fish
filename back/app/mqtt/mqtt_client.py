import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import List, Optional

import paho.mqtt.client as mqtt

from app.database.database import SessionLocal
from app.models.measurement import Measurement
from app.models.alert import Alert
from app.api.v1.websocket import manager

logger = logging.getLogger("smart_fish.mqtt")

MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC = "smartfish/data"

# mapping capteurs — aligné sur le firmware ESP32 réel :
# DS18B20 (temperature), analog turbidity module (turbidity),
# MQ137 (ammonia), Gravity TDS module (tds), LDR (light)
SENSOR_MAP = {
    "temperature": 1,
    "turbidity": 2,
    "ammonia": 3,
    "tds": 4,
    "light": 5
}

# seuils intelligents — dérivés des conditions déjà codées dans le firmware
# (temperatureOK, tdsOK, turbiditeOK, ammoniacOK). Valeurs en unités brutes
# ADC (0-4095) pour turbidity/ammonia/light tant qu'aucune courbe de
# calibration n'existe. "light" n'a volontairement aucun seuil : le
# firmware ne définit pas de plage saine pour la luminosité pour l'instant.
THRESHOLDS = {
    "temperature": {"min": 20, "max": 30},
    "turbidity": {"min": 1500},   # NOTE: pour ce module, une valeur BASSE = eau PLUS trouble.
                                    # L'alerte "too LOW" signifie donc "turbidité physique élevée".
    "ammonia": {"max": 1500},      # valeur brute MQ137 ; plus haut = plus d'ammoniac détecté
    "tds": {"min": 100, "max": 1000},
    # "light": pas de seuil pour l'instant — à calibrer une fois des
    # relevés réels observés en conditions d'installation.
}


# -----------------------------
# ALERT LOGIC ENGINE
# -----------------------------
def create_alert(db, sensor_id, level, message, value) -> dict:
    alert = Alert(
        sensor_id=sensor_id,
        level=level,
        message=message,
        is_resolved=False
    )
    db.add(alert)
    print(f"🚨 ALERT [{level}] -> {message} | value={value}")

    return {
        "sensor_id": sensor_id,
        "level": level,
        "message": message,
        "value": value,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


def check_alert(key, value, sensor_id, db) -> List[dict]:
    rule = THRESHOLDS.get(key)
    if not rule:
        return []

    created: List[dict] = []

    if "min" in rule and value < rule["min"]:
        created.append(create_alert(
            db,
            sensor_id,
            "critical" if value < rule["min"] * 0.8 else "warning",
            f"{key} too LOW ({value})",
            value
        ))

    if "max" in rule and value > rule["max"]:
        created.append(create_alert(
            db,
            sensor_id,
            "critical" if value > rule["max"] * 1.2 else "warning",
            f"{key} too HIGH ({value})",
            value
        ))

    return created


_event_loop: Optional[asyncio.AbstractEventLoop] = None


def _schedule_broadcast(message: dict) -> None:
    if _event_loop is None:
        logger.warning("Event loop not ready yet, dropping broadcast: %s", message)
        return
    asyncio.run_coroutine_threadsafe(manager.broadcast(message), _event_loop)


# -----------------------------
# MQTT EVENTS
# -----------------------------
def on_connect(client, userdata, flags, rc):
    print("MQTT Connected:", rc)
    client.subscribe(MQTT_TOPIC)


def on_message(client, userdata, msg):
    db = None
    try:
        raw = msg.payload.decode()
        print("MQTT RAW:", raw)

        data = json.loads(raw)

        db = SessionLocal()

        measurement_payloads: List[dict] = []
        alert_payloads: List[dict] = []

        for key, sensor_id in SENSOR_MAP.items():
            if key in data:
                value = data[key]

                db.add(
                    Measurement(
                        sensor_id=sensor_id,
                        value=value
                    )
                )

                measurement_payloads.append({
                    "sensor_id": sensor_id,
                    "key": key,
                    "value": value,
                    "recorded_at": datetime.now(timezone.utc).isoformat(),
                })

                alert_payloads.extend(check_alert(key, value, sensor_id, db))

        db.commit()
        print("Snapshot processed ✔")

        if measurement_payloads:
            _schedule_broadcast({"type": "measurement_update", "data": measurement_payloads})
        if alert_payloads:
            _schedule_broadcast({"type": "alert_new", "data": alert_payloads})

    except Exception as e:
        print("MQTT ERROR:", e)

    finally:
        if db:
            db.close()


def start_mqtt(loop: Optional[asyncio.AbstractEventLoop] = None):
    global _event_loop
    _event_loop = loop

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.loop_start()

    print("🚀 SmartFish MQTT Phase 3 started...")