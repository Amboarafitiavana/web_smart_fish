"""Pydantic schemas for the `Alert` resource."""
from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict

from app.models.alert import AlertLevel


class AlertBase(BaseModel):
    sensor_id: int
    level: AlertLevel
    message: str = Field(..., min_length=1)


class AlertCreate(AlertBase):
    pass


class AlertUpdate(BaseModel):
    """Only resolution status is meant to change after creation."""
    is_resolved: bool


class AlertResponse(AlertBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_resolved: bool
    created_at: datetime