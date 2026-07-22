"""
Password hashing utilities.

Uses passlib with bcrypt — the current standard for secure password storage.
Never store or compare plain-text passwords anywhere else in the codebase.
"""
from passlib.context import CryptContext

from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """Hash a plain-text password before persisting it."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check a plain-text password against a stored bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(subject: str, extra_claims: Optional[dict] = None) -> str:
    """Create a signed JWT for the given subject (typically the user id)."""
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {"sub": str(subject), "exp": expire}
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Decode and validate a JWT. Raises jwt exceptions on failure."""
    return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])