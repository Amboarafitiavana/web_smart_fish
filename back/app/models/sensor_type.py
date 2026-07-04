"""SQLAlchemy model for the `sensor_types` table."""
from datetime import datetime
from typing import List, Optional, TYPE_CHECKING

from sqlalchemy import String, TIMESTAMP, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.sensor import Sensor


class SensorType(Base):
    __tablename__ = "sensor_types"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    unit: Mapped[str] = mapped_column(String(20), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, server_default=func.current_timestamp()
    )

    sensors: Mapped[List["Sensor"]] = relationship(
        back_populates="sensor_type",
        cascade="save-update, merge",
    )

    def __repr__(self) -> str:
        return f"<SensorType id={self.id} name={self.name!r} unit={self.unit!r}>"