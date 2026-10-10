from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.ai import agent
from app.api.tanks import router as tanks_router
from app.api.water import router as water_router
from app.api.weather import router as weather_router
from app.config import API_DESCRIPTION, API_TITLE, API_VERSION, CORS_ORIGINS
from app.database import init_database
from app.services import database
from app.services.http_client import cache_stats

app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather_router)
app.include_router(tanks_router)
app.include_router(water_router)


@app.on_event("startup")
def on_startup() -> None:
    database.init_db()
    init_database()
    database.seed_if_empty()


@app.get("/")
def root():
    return {
        "project": "CURE",
        "status": "online",
        "message": "Climate & Utility Risk Engine",
        "version": API_VERSION,
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "ai_backend": "ollama" if agent.is_available() else "deterministic",
        "weather_cache": cache_stats(),
    }
