from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.water import router as water_router
from app.api.heat import router as heat_router
from app.api.consumption import router as consumption_router
from app.api.weather import router as weather_router
from app.api.ai import router as ai_router
from app.database import get_connection, init_database



app = FastAPI(
    title="CURE API",
    description="Climate & Utility Risk Engine",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API Routers
app.include_router(water_router)
app.include_router(heat_router)
app.include_router(consumption_router)
app.include_router(weather_router)
app.include_router(ai_router)


@app.get("/")
def root():
    return {
        "project": "CURE",
        "status": "online",
        "message": "Climate & Utility Risk Engine",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}

@app.on_event("startup")
def startup_event():
    init_database()