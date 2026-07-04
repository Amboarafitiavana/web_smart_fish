"""
Centralized model imports.

Importing this package ensures every ORM model is registered on
Base.metadata, and allows other layers to do:
    from app.models import User, Sensor, SensorType, Measurement, Alert
instead of reaching into each individual module.
"""
from app.models.user import User, UserRole
from app.models.sensor_type import SensorType
from app.models.sensor import Sensor, SensorStatus
from app.models.measurement import Measurement
from app.models.alert import Alert, AlertLevel

__all__ = [
    "User",
    "UserRole",
    "SensorType",
    "Sensor",
    "SensorStatus",
    "Measurement",
    "Alert",
    "AlertLevel",
]