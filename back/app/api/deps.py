"""
Shared FastAPI dependencies, imported by route modules.

Currently re-exports the database session dependency. This is also the
designated location for future dependencies such as JWT authentication
(e.g. get_current_user).
"""
from app.database.database import get_db

__all__ = ["get_db"]