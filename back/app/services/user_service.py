"""Business logic for the User resource."""
from typing import List

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError, ConflictError
from app.core.security import hash_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


def get_user(db: Session, user_id: int) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise NotFoundError("User", user_id)
    return user


def get_user_by_email(db: Session, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    return db.execute(stmt).scalar_one_or_none()


def list_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    stmt = select(User).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def create_user(db: Session, payload: UserCreate) -> User:
    if get_user_by_email(db, payload.email) is not None:
        raise ConflictError(f"A user with email '{payload.email}' already exists")

    user = User(
        fullname=payload.fullname,
        email=payload.email,
        password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user_id: int, payload: UserUpdate) -> User:
    user = get_user(db, user_id)

    update_data = payload.model_dump(exclude_unset=True)
    if "password" in update_data:
        update_data["password"] = hash_password(update_data["password"])

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int) -> None:
    user = get_user(db, user_id)
    db.delete(user)
    db.commit()