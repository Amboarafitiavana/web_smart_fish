"""Sensor endpoints."""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.exceptions import NotFoundError, ConflictError
from app.schemas.sensor import SensorCreate, SensorUpdate, SensorResponse
from app.services import sensor_service

router = APIRouter(prefix="/sensors", tags=["Sensors"])


@router.get("", response_model=List[SensorResponse])
def list_sensors(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> List[SensorResponse]:
    return sensor_service.list_sensors(db, skip=skip, limit=limit)


@router.get("/{sensor_id}", response_model=SensorResponse)
def get_sensor(sensor_id: int, db: Session = Depends(get_db)) -> SensorResponse:
    try:
        return sensor_service.get_sensor(db, sensor_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.post("", response_model=SensorResponse, status_code=status.HTTP_201_CREATED)
def create_sensor(payload: SensorCreate, db: Session = Depends(get_db)) -> SensorResponse:
    try:
        return sensor_service.create_sensor(db, payload)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except ConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc))


@router.patch("/{sensor_id}", response_model=SensorResponse)
def update_sensor(
    sensor_id: int,
    payload: SensorUpdate,
    db: Session = Depends(get_db),
) -> SensorResponse:
    try:
        return sensor_service.update_sensor(db, sensor_id, payload)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except ConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc))


@router.delete("/{sensor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sensor(sensor_id: int, db: Session = Depends(get_db)) -> None:
    try:
        sensor_service.delete_sensor(db, sensor_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))