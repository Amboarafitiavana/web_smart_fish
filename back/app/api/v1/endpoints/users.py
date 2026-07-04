"""User endpoints."""
from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services import user_service

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=List[UserResponse])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> List[UserResponse]:
    return user_service.list_users(db, skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)) -> UserResponse:
    return user_service.get_user(db, user_id)


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)) -> UserResponse:
    return user_service.create_user(db, payload)


@router.patch("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db),
) -> UserResponse:
    return user_service.update_user(db, user_id, payload)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)) -> None:
    user_service.delete_user(db, user_id)