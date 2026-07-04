"""SQLAlchemy model for the `measurements` table."""
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, Numeric, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.sensor import Sensor


class Measurement(Base):
    __tablename__ = "measurements"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    sensor_id: Mapped[int] = mapped_column(
        ForeignKey("sensors.id", onupdate="CASCADE", ondelete="CASCADE"),
        nullable=False,
    )
    value: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.current_timestamp()
    )

    sensor: Mapped["Sensor"] = relationship(back_populates="measurements")

    def __repr__(self) -> str:
        return f"<Measurement id={self.id} sensor_id={self.sensor_id} value={self.value}>"