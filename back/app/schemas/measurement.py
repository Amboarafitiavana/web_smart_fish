"""Pydantic schemas for the `Measurement` resource.

No update schema is provided: a measurement is an immutable record once
written, consistent with IoT sensor logging (corrections are new readings,
not edits to old ones).
"""
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field, ConfigDict


class MeasurementBase(BaseModel):
    sensor_id: int
    value: Decimal = Field(..., max_digits=10, decimal_places=2)


class MeasurementCreate(MeasurementBase):
    pass


class MeasurementResponse(MeasurementBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recorded_at: datetime