"""
Pydantic schemas for WebSocket real-time message envelopes.

Every message sent over /ws/live follows the shape:
    {"type": "<message_type>", "data": {...}}

This keeps the wire format self-describing so the frontend can dispatch
on `type` without guessing the payload shape.
"""
from datetime import datetime
from decimal import Decimal
from typing import List, Literal, Union

from pydantic import BaseModel


class MeasurementBroadcastItem(BaseModel):
    sensor_id: int
    key: str
    value: Decimal
    recorded_at: datetime


class MeasurementBroadcast(BaseModel):
    type: Literal["measurement_update"] = "measurement_update"
    data: List[MeasurementBroadcastItem]


class AlertBroadcastItem(BaseModel):
    sensor_id: int
    level: str
    message: str
    value: Decimal
    created_at: datetime


class AlertBroadcast(BaseModel):
    type: Literal["alert_new"] = "alert_new"
    data: List[AlertBroadcastItem]


class ConnectionStatusMessage(BaseModel):
    type: Literal["connected", "pong"]
    data: dict = {}


RealtimeMessage = Union[MeasurementBroadcast, AlertBroadcast, ConnectionStatusMessage]