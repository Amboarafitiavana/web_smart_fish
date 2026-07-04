"""
Password hashing utilities.

Uses passlib with bcrypt — the current standard for secure password storage.
Never store or compare plain-text passwords anywhere else in the codebase.
"""
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """Hash a plain-text password before persisting it."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check a plain-text password against a stored bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)