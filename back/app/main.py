"""
Application entry point.

Run with: uvicorn app.main:app --reload
"""
import asyncio

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.mqtt.mqtt_client import start_mqtt
from app.core.config import settings
from app.core.exceptions import NotFoundError, ConflictError
from app.core.error_handlers import (
    not_found_handler,
    conflict_handler,
    sqlalchemy_error_handler,
    unhandled_exception_handler,
)
from app.database.database import get_db
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.APP_NAME,
    description="REST API for the Smart Fish IoT monitoring system.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


@app.on_event("startup")
async def start_mqtt_event() -> None:
    # Captured here (inside a running event loop) so the MQTT thread can
    # schedule WebSocket broadcasts onto this same loop.
    loop = asyncio.get_running_loop()
    start_mqtt(loop)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Order matters: FastAPI checks handlers most-specific-first regardless of
# registration order, but SQLAlchemyError must be registered before the
# generic Exception handler for clarity of intent.
app.add_exception_handler(NotFoundError, not_found_handler)
app.add_exception_handler(ConflictError, conflict_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_error_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Health"])
def read_root() -> dict:
    """Basic liveness check — confirms the API process is running."""
    return {"app": settings.APP_NAME, "status": "running"}


@app.get("/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)) -> dict:
    """
    Readiness check — confirms the API can actually reach the database,
    not just that the process is alive.
    """
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}