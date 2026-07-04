"""Pydantic schemas for the `Sensor` resource."""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

from app.models.sensor import SensorStatus
from app.schemas.sensor_type import SensorTypeResponse


class SensorBase(BaseModel):
    sensor_type_id: int
    serial_number: Optional[str] = Field(default=None, max_length=100)
    status: SensorStatus = SensorStatus.ACTIVE


class SensorCreate(SensorBase):
    pass


class SensorUpdate(BaseModel):
    sensor_type_id: Optional[int] = None
    serial_number: Optional[str] = Field(default=None, max_length=100)
    status: Optional[SensorStatus] = None


class SensorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sensor_type_id: int
    serial_number: Optional[str]
    status: SensorStatus
    installed_at: datetime
    sensor_type: SensorTypeResponse