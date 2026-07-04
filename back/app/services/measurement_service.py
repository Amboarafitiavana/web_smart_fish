"""Business logic for the Measurement resource."""
from datetime import datetime
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.models.measurement import Measurement
from app.services.sensor_service import get_sensor
from app.schemas.measurement import MeasurementCreate


def get_measurement(db: Session, measurement_id: int) -> Measurement:
    measurement = db.get(Measurement, measurement_id)
    if measurement is None:
        raise NotFoundError("Measurement", measurement_id)
    return measurement


def list_measurements_by_sensor(
    db: Session,
    sensor_id: int,
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    skip: int = 0,
    limit: int = 500,
) -> List[Measurement]:
    # Ensures the sensor exists before querying its measurements.
    get_sensor(db, sensor_id)

    stmt = select(Measurement).where(Measurement.sensor_id == sensor_id)
    if start is not None:
        stmt = stmt.where(Measurement.recorded_at >= start)
    if end is not None:
        stmt = stmt.where(Measurement.recorded_at <= end)

    stmt = stmt.order_by(Measurement.recorded_at.desc()).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def create_measurement(db: Session, payload: MeasurementCreate) -> Measurement:
    # Ensures the referenced sensor exists; raises NotFoundError otherwise.
    get_sensor(db, payload.sensor_id)

    measurement = Measurement(**payload.model_dump())
    db.add(measurement)
    db.commit()
    db.refresh(measurement)
    return measurement