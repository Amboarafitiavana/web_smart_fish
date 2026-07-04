"""
Application configuration module.

Loads environment variables from the .env file and exposes them through
a typed Settings object. This is the single source of truth for configuration
across the whole backend — no module should call os.getenv() directly.
"""
import os
from pathlib import Path
from typing import List

from dotenv import load_dotenv

# Resolve the path to the .env file relative to the project root
# (backend/.env), regardless of where the app is started from.
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)


class Settings:
    """
    Typed application settings, populated from environment variables.

    Raises a RuntimeError at import time if a required variable is missing,
    so misconfiguration is caught immediately instead of failing later
    inside a request handler.
    """

    def __init__(self) -> None:
        # --- Application ---
        self.APP_NAME: str = os.getenv("APP_NAME", "Smart Fish API")
        self.APP_ENV: str = os.getenv("APP_ENV", "development")
        self.DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
        self.API_V1_PREFIX: str = os.getenv("API_V1_PREFIX", "/api/v1")

        # --- Database ---
        self.DB_HOST: str = self._require("DB_HOST")
        self.DB_PORT: int = int(os.getenv("DB_PORT", "3306"))
        self.DB_USER: str = self._require("DB_USER")
        self.DB_PASSWORD: str = self._require("DB_PASSWORD")
        self.DB_NAME: str = self._require("DB_NAME")

        # --- CORS ---
        raw_origins = os.getenv("CORS_ORIGINS", "")
        self.CORS_ORIGINS: List[str] = (
            [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
            if raw_origins
            else []
        )

        # --- MQTT (reserved for future integration, not used yet) ---
        self.MQTT_BROKER_HOST: str = os.getenv("MQTT_BROKER_HOST", "localhost")
        self.MQTT_BROKER_PORT: int = int(os.getenv("MQTT_BROKER_PORT", "1883"))
        self.MQTT_USERNAME: str = os.getenv("MQTT_USERNAME", "")
        self.MQTT_PASSWORD: str = os.getenv("MQTT_PASSWORD", "")
        self.MQTT_TOPIC_PREFIX: str = os.getenv("MQTT_TOPIC_PREFIX", "smartfish/sensors")

    @staticmethod
    def _require(var_name: str) -> str:
        """Fetch a required environment variable or fail fast with a clear error."""
        value = os.getenv(var_name)
        if value is None or value == "":
            raise RuntimeError(
                f"Missing required environment variable: '{var_name}'. "
                f"Check your .env file."
            )
        return value

    @property
    def database_url(self) -> str:
        """Build the SQLAlchemy connection URL for MySQL via PyMySQL."""
        return (
            f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?charset=utf8mb4"
        )


# Single shared instance, imported wherever configuration is needed.
settings = Settings()