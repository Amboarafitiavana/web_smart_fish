"""Business logic for the Sensor resource."""
from typing import List

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.core.exceptions import NotFoundError, ConflictError
from app.models.sensor import Sensor
from app.services.sensor_type_service import get_sensor_type
from app.schemas.sensor import SensorCreate, SensorUpdate


def get_sensor(db: Session, sensor_id: int) -> Sensor:
    stmt = (
        select(Sensor)
        .options(joinedload(Sensor.sensor_type))
        .where(Sensor.id == sensor_id)
    )
    sensor = db.execute(stmt).scalar_one_or_none()
    if sensor is None:
        raise NotFoundError("Sensor", sensor_id)
    return sensor


def list_sensors(db: Session, skip: int = 0, limit: int = 100) -> List[Sensor]:
    stmt = (
        select(Sensor)
        .options(joinedload(Sensor.sensor_type))
        .offset(skip)
        .limit(limit)
    )
    return list(db.execute(stmt).scalars().all())


def create_sensor(db: Session, payload: SensorCreate) -> Sensor:
    # Ensures the referenced sensor type exists; raises NotFoundError otherwise.
    get_sensor_type(db, payload.sensor_type_id)

    if payload.serial_number is not None:
        existing = db.execute(
            select(Sensor).where(Sensor.serial_number == payload.serial_number)
        ).scalar_one_or_none()
        if existing is not None:
            raise ConflictError(
                f"A sensor with serial number '{payload.serial_number}' already exists"
            )

    sensor = Sensor(**payload.model_dump())
    db.add(sensor)
    db.commit()
    db.refresh(sensor)
    return get_sensor(db, sensor.id)  # reload with sensor_type joined


def update_sensor(db: Session, sensor_id: int, payload: SensorUpdate) -> Sensor:
    sensor = get_sensor(db, sensor_id)

    update_data = payload.model_dump(exclude_unset=True)
    if "sensor_type_id" in update_data:
        get_sensor_type(db, update_data["sensor_type_id"])

    for field, value in update_data.items():
        setattr(sensor, field, value)

    db.commit()
    db.refresh(sensor)
    return get_sensor(db, sensor.id)


def delete_sensor(db: Session, sensor_id: int) -> None:
    sensor = get_sensor(db, sensor_id)
    db.delete(sensor)
    db.commit()