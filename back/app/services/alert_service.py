"""Business logic for the Alert resource."""
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.models.alert import Alert
from app.services.sensor_service import get_sensor
from app.schemas.alert import AlertCreate, AlertUpdate


def get_alert(db: Session, alert_id: int) -> Alert:
    alert = db.get(Alert, alert_id)
    if alert is None:
        raise NotFoundError("Alert", alert_id)
    return alert


def list_alerts(
    db: Session,
    is_resolved: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
) -> List[Alert]:
    stmt = select(Alert)
    if is_resolved is not None:
        stmt = stmt.where(Alert.is_resolved == is_resolved)

    stmt = stmt.order_by(Alert.created_at.desc()).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def create_alert(db: Session, payload: AlertCreate) -> Alert:
    # Ensures the referenced sensor exists; raises NotFoundError otherwise.
    get_sensor(db, payload.sensor_id)

    alert = Alert(**payload.model_dump())
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


def update_alert(db: Session, alert_id: int, payload: AlertUpdate) -> Alert:
    alert = get_alert(db, alert_id)
    alert.is_resolved = payload.is_resolved
    db.commit()
    db.refresh(alert)
    return alert


def delete_alert(db: Session, alert_id: int) -> None:
    alert = get_alert(db, alert_id)
    db.delete(alert)
    db.commit()