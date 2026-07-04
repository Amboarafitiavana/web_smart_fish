"""Alert endpoints."""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.exceptions import NotFoundError
from app.schemas.alert import AlertCreate, AlertUpdate, AlertResponse
from app.services import alert_service

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("", response_model=List[AlertResponse])
def list_alerts(
    is_resolved: Optional[bool] = Query(default=None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> List[AlertResponse]:
    return alert_service.list_alerts(db, is_resolved=is_resolved, skip=skip, limit=limit)


@router.get("/{alert_id}", response_model=AlertResponse)
def get_alert(alert_id: int, db: Session = Depends(get_db)) -> AlertResponse:
    try:
        return alert_service.get_alert(db, alert_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.post("", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
def create_alert(payload: AlertCreate, db: Session = Depends(get_db)) -> AlertResponse:
    try:
        return alert_service.create_alert(db, payload)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.patch("/{alert_id}", response_model=AlertResponse)
def update_alert(
    alert_id: int,
    payload: AlertUpdate,
    db: Session = Depends(get_db),
) -> AlertResponse:
    try:
        return alert_service.update_alert(db, alert_id, payload)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alert(alert_id: int, db: Session = Depends(get_db)) -> None:
    try:
        alert_service.delete_alert(db, alert_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))