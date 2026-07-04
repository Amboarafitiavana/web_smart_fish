"""SQLAlchemy model for the `alerts` table."""
import enum
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Enum as SAEnum, Text, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.sensor import Sensor


class AlertLevel(str, enum.Enum):
    """Mirrors the MySQL ENUM('info', 'warning', 'critical') on alerts.level."""
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    sensor_id: Mapped[int] = mapped_column(
        ForeignKey("sensors.id", onupdate="CASCADE", ondelete="CASCADE"),
        nullable=False,
    )
    level: Mapped[AlertLevel] = mapped_column(
        SAEnum(AlertLevel, native_enum=True, values_callable=lambda e: [m.value for m in e]),
        nullable=False,
    )
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_resolved: Mapped[bool] = mapped_column(Boolean, default=False, server_default="0")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.current_timestamp()
    )

    sensor: Mapped["Sensor"] = relationship(back_populates="alerts")

    def __repr__(self) -> str:
        return f"<Alert id={self.id} level={self.level.value} resolved={self.is_resolved}>"