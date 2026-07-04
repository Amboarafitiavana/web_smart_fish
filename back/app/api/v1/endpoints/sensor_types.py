"""Sensor type endpoints."""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.exceptions import NotFoundError, ConflictError
from app.schemas.sensor_type import SensorTypeCreate, SensorTypeUpdate, SensorTypeResponse
from app.services import sensor_type_service

router = APIRouter(prefix="/sensor-types", tags=["Sensor Types"])


@router.get("", response_model=List[SensorTypeResponse])
def list_sensor_types(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> List[SensorTypeResponse]:
    return sensor_type_service.list_sensor_types(db, skip=skip, limit=limit)


@router.get("/{sensor_type_id}", response_model=SensorTypeResponse)
def get_sensor_type(sensor_type_id: int, db: Session = Depends(get_db)) -> SensorTypeResponse:
    try:
        return sensor_type_service.get_sensor_type(db, sensor_type_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.post("", response_model=SensorTypeResponse, status_code=status.HTTP_201_CREATED)
def create_sensor_type(
    payload: SensorTypeCreate,
    db: Session = Depends(get_db),
) -> SensorTypeResponse:
    try:
        return sensor_type_service.create_sensor_type(db, payload)
    except ConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc))


@router.patch("/{sensor_type_id}", response_model=SensorTypeResponse)
def update_sensor_type(
    sensor_type_id: int,
    payload: SensorTypeUpdate,
    db: Session = Depends(get_db),
) -> SensorTypeResponse:
    try:
        return sensor_type_service.update_sensor_type(db, sensor_type_id, payload)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.delete("/{sensor_type_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sensor_type(sensor_type_id: int, db: Session = Depends(get_db)) -> None:
    try:
        sensor_type_service.delete_sensor_type(db, sensor_type_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))