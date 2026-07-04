"""Measurement endpoints."""
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.exceptions import NotFoundError
from app.schemas.measurement import MeasurementCreate, MeasurementResponse
from app.services import measurement_service

router = APIRouter(prefix="/measurements", tags=["Measurements"])


@router.get("/sensor/{sensor_id}", response_model=List[MeasurementResponse])
def list_measurements_by_sensor(
    sensor_id: int,
    start: Optional[datetime] = Query(default=None, description="Filter: recorded_at >= start"),
    end: Optional[datetime] = Query(default=None, description="Filter: recorded_at <= end"),
    skip: int = 0,
    limit: int = 500,
    db: Session = Depends(get_db),
) -> List[MeasurementResponse]:
    try:
        return measurement_service.list_measurements_by_sensor(
            db, sensor_id, start=start, end=end, skip=skip, limit=limit
        )
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.get("/{measurement_id}", response_model=MeasurementResponse)
def get_measurement(measurement_id: int, db: Session = Depends(get_db)) -> MeasurementResponse:
    try:
        return measurement_service.get_measurement(db, measurement_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.post("", response_model=MeasurementResponse, status_code=status.HTTP_201_CREATED)
def create_measurement(
    payload: MeasurementCreate,
    db: Session = Depends(get_db),
) -> MeasurementResponse:
    try:
        return measurement_service.create_measurement(db, payload)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))