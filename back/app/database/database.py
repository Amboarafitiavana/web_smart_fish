"""
Database engine and session management.

Provides:
- `engine`: the shared SQLAlchemy engine, configured from settings.
- `SessionLocal`: a session factory bound to that engine.
- `get_db`: a FastAPI dependency that yields a session per request
  and guarantees it is closed afterwards, even if an error occurs.
"""
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.core.config import settings

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,  # verifies connections are alive before using them
    pool_recycle=3600,   # recycles connections older than 1 hour (avoids MySQL timeouts)
    echo=settings.DEBUG,  # logs SQL statements when running in debug mode
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session for the
    lifetime of a single request, and closes it afterwards.

    Usage:
        @router.get("/sensors")
        def list_sensors(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()