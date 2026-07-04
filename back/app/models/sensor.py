"""SQLAlchemy model for the `sensors` table."""
import enum
from datetime import datetime
from typing import List, Optional, TYPE_CHECKING

from sqlalchemy import String, Enum as SAEnum, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.sensor_type import SensorType
    from app.models.measurement import Measurement
    from app.models.alert import Alert


class SensorStatus(str, enum.Enum):
    """Mirrors the MySQL ENUM('active', 'inactive', 'maintenance') on sensors.status."""
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"


class Sensor(Base):
    __tablename__ = "sensors"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    sensor_type_id: Mapped[int] = mapped_column(
        ForeignKey("sensor_types.id", onupdate="CASCADE", ondelete="RESTRICT"),
        nullable=False,
    )
    serial_number: Mapped[Optional[str]] = mapped_column(String(100), unique=True, nullable=True)
    status: Mapped[SensorStatus] = mapped_column(
        SAEnum(SensorStatus, native_enum=True, values_callable=lambda e: [m.value for m in e]),
        default=SensorStatus.ACTIVE,
        server_default=SensorStatus.ACTIVE.value,
    )
    installed_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.current_timestamp()
    )

    sensor_type: Mapped["SensorType"] = relationship(back_populates="sensors")
    measurements: Mapped[List["Measurement"]] = relationship(
        back_populates="sensor",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    alerts: Mapped[List["Alert"]] = relationship(
        back_populates="sensor",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __repr__(self) -> str:
        return f"<Sensor id={self.id} serial={self.serial_number!r} status={self.status.value}>"