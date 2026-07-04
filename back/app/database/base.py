"""
Declarative base for all SQLAlchemy ORM models.

Kept separate from database.py so that models can import Base without
pulling in the engine/session (avoids circular imports between
database/database.py and models/*.py).
"""
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base class inherited by every ORM model in the application."""
    pass