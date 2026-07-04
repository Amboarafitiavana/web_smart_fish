"""Pydantic schemas for the `SensorType` resource."""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class SensorTypeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    unit: str = Field(..., min_length=1, max_length=20)
    description: Optional[str] = Field(default=None, max_length=255)


class SensorTypeCreate(SensorTypeBase):
    pass


class SensorTypeUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=50)
    unit: Optional[str] = Field(default=None, min_length=1, max_length=20)
    description: Optional[str] = Field(default=None, max_length=255)


class SensorTypeResponse(SensorTypeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime