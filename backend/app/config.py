"""CURE backend configuration."""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

API_TITLE = "CURE API"
API_DESCRIPTION = (
    "Climate & Utility Risk Engine - weather intelligence and water runway analysis."
)
API_VERSION = "1.0.0"

# Origins allowed to call this API during local development.
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

DATABASE_PATH = Path(os.getenv("CURE_DB_PATH", BASE_DIR / "data" / "cure.db"))

WEATHER_CACHE_SECONDS = int(os.getenv("CURE_CACHE_SECONDS", "300"))

# Optional local AI. Disabled by default so the API runs without Ollama installed.
OLLAMA_ENABLED = os.getenv("CURE_OLLAMA_ENABLED", "false").lower() == "true"
OLLAMA_MODEL = os.getenv("CURE_OLLAMA_MODEL", "llama3.2:3b")
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
