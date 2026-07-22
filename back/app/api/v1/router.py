"""Aggregates all v1 endpoint routers into a single router."""
from fastapi import APIRouter

from app.api.v1.endpoints import users, sensor_types, sensors, measurements, alerts
from app.api.v1.endpoints import websocket_router
from app.api.v1.endpoints import auth
...


api_router = APIRouter()
api_router.include_router(auth.router)


api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(sensor_types.router)
api_router.include_router(sensors.router)
api_router.include_router(measurements.router)
api_router.include_router(alerts.router)
api_router.include_router(websocket_router.router)