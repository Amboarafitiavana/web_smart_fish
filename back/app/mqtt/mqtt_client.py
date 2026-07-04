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

# mapping capteurs
SENSOR_MAP = {
    "temperature": 1,
    "turbidity": 2,
    "ph": 3,
    "oxygen": 4,
    "water_level": 5
}

# seuils intelligents
THRESHOLDS = {
    "temperature": {"min": 24, "max": 30},
    "ph": {"min": 6.5, "max": 8.0},
    "turbidity": {"max": 20},
    "oxygen": {"min": 5},
    "water_level": {"min": 20}
}

# Captured once at FastAPI startup, used to schedule broadcasts from the
# MQTT thread onto the asyncio event loop. None until start_mqtt() runs.
_event_loop: Optional[asyncio.AbstractEventLoop] = None


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

    # Returned separately from the ORM object: broadcasting needs plain
    # values before commit() (the ORM object's server-generated fields
    # like created_at aren't populated until after commit + refresh).
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


def _schedule_broadcast(message: dict) -> None:
    """
    Schedule manager.broadcast(message) onto the FastAPI event loop from
    the MQTT thread. No-op (with a warning) if the loop hasn't been
    captured yet — e.g. a message arrives before startup finishes.
    """
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

        # -------------------------
        # 1. SAVE MEASUREMENTS
        # -------------------------
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

                # -------------------------
                # 2. CHECK ALERTS
                # -------------------------
                alert_payloads.extend(check_alert(key, value, sensor_id, db))

        db.commit()
        print("Snapshot processed ✔")

        # -------------------------
        # 3. BROADCAST TO WEBSOCKET CLIENTS
        # -------------------------
        if measurement_payloads:
            _schedule_broadcast({"type": "measurement_update", "data": measurement_payloads})
        if alert_payloads:
            _schedule_broadcast({"type": "alert_new", "data": alert_payloads})

    except Exception as e:
        print("MQTT ERROR:", e)

    finally:
        if db:
            db.close()


# -----------------------------
# START MQTT
# -----------------------------
def start_mqtt(loop: Optional[asyncio.AbstractEventLoop] = None):
    global _event_loop
    _event_loop = loop

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.loop_start()

    print("🚀 SmartFish MQTT Phase 3 started...")