"""Business logic for the SensorType resource."""
from typing import List

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError, ConflictError
from app.models.sensor_type import SensorType
from app.schemas.sensor_type import SensorTypeCreate, SensorTypeUpdate


def get_sensor_type(db: Session, sensor_type_id: int) -> SensorType:
    sensor_type = db.get(SensorType, sensor_type_id)
    if sensor_type is None:
        raise NotFoundError("SensorType", sensor_type_id)
    return sensor_type


def list_sensor_types(db: Session, skip: int = 0, limit: int = 100) -> List[SensorType]:
    stmt = select(SensorType).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def create_sensor_type(db: Session, payload: SensorTypeCreate) -> SensorType:
    existing = db.execute(
        select(SensorType).where(SensorType.name == payload.name)
    ).scalar_one_or_none()
    if existing is not None:
        raise ConflictError(f"A sensor type named '{payload.name}' already exists")

    sensor_type = SensorType(**payload.model_dump())
    db.add(sensor_type)
    db.commit()
    db.refresh(sensor_type)
    return sensor_type


def update_sensor_type(db: Session, sensor_type_id: int, payload: SensorTypeUpdate) -> SensorType:
    sensor_type = get_sensor_type(db, sensor_type_id)
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(sensor_type, field, value)

    db.commit()
    db.refresh(sensor_type)
    return sensor_type


def delete_sensor_type(db: Session, sensor_type_id: int) -> None:
    sensor_type = get_sensor_type(db, sensor_type_id)
    db.delete(sensor_type)
    db.commit()