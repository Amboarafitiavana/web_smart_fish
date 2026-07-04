"""SQLAlchemy model for the `users` table."""
import enum
from datetime import datetime

from sqlalchemy import String, Enum as SAEnum, TIMESTAMP, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class UserRole(str, enum.Enum):
    """Mirrors the MySQL ENUM('admin', 'user') on users.role."""
    ADMIN = "admin"
    USER = "user"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    fullname: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        SAEnum(UserRole, native_enum=True, values_callable=lambda e: [m.value for m in e]),
        nullable=False,
        default=UserRole.USER,
        server_default=UserRole.USER.value,
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, server_default=func.current_timestamp()
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r} role={self.role.value}>"