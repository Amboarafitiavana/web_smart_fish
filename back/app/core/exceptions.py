"""
Domain-level exceptions, raised by the service layer.

Kept independent of FastAPI (no HTTPException here) so that services stay
usable outside an HTTP context (e.g. from the future MQTT listener).
The API layer is responsible for translating these into HTTP responses.
"""


class NotFoundError(Exception):
    """Raised when a requested resource does not exist."""
    def __init__(self, resource: str, identifier: int | str) -> None:
        self.resource = resource
        self.identifier = identifier
        super().__init__(f"{resource} with id={identifier} not found")


class ConflictError(Exception):
    """Raised when an operation violates a uniqueness constraint (e.g. duplicate email)."""
    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)