from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.ai import agent
from app.api.deps import auth_enabled, rate_limit, require_api_key
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

# Weather reads stay open. Everything that reads or mutates stored state, or
# spends an upstream call on demand, is gated by the optional API key and a
# per-client rate limit.
app.include_router(weather_router, dependencies=[Depends(rate_limit)])
app.include_router(
    tanks_router, dependencies=[Depends(require_api_key), Depends(rate_limit)]
)
app.include_router(
    water_router, dependencies=[Depends(require_api_key), Depends(rate_limit)]
)


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
        "auth_required": auth_enabled(),
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "ai_backend": "ollama" if await agent.probe() else "deterministic",
        "weather_cache": cache_stats(),
    }
