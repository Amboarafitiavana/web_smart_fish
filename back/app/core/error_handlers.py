"""
Global exception handlers, registered once on the FastAPI app.

Centralizes error-to-HTTP-response translation so route handlers no
longer need repeated try/except blocks. Also acts as a safety net for
unexpected database or runtime errors that would otherwise surface as
a bare 500 with no useful JSON body.
"""
import logging

from fastapi import Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.core.exceptions import NotFoundError, ConflictError

logger = logging.getLogger("smart_fish")


async def not_found_handler(request: Request, exc: NotFoundError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": str(exc)},
    )


async def conflict_handler(request: Request, exc: ConflictError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"detail": exc.message},
    )


async def sqlalchemy_error_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
    logger.error("Database error on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": "A database error occurred. Please try again later."},
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred."},
    )