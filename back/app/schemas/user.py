"""Pydantic schemas for the `User` resource."""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, ConfigDict

from app.models.user import UserRole


class UserBase(BaseModel):
    fullname: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    role: UserRole = UserRole.USER


class UserCreate(UserBase):
    """Payload to create a new user. Password is plain text here —
    hashing happens in the service layer, never in the schema."""
    password: str = Field(..., min_length=8, max_length=128)


class UserUpdate(BaseModel):
    """All fields optional to support partial updates (PATCH)."""
    fullname: Optional[str] = Field(default=None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(default=None, min_length=8, max_length=128)
    role: Optional[UserRole] = None


class UserResponse(UserBase):
    """Public representation of a user. Password is intentionally excluded."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime