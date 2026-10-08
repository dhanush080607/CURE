from fastapi import APIRouter, Query

from app.services.weather_service import get_weather_forecast

router = APIRouter(
    prefix="/weather",
    tags=["Weather"],
)


@router.get("/forecast")
def weather_forecast(
    latitude: float = Query(...),
    longitude: float = Query(...),
):
    return get_weather_forecast(
        latitude=latitude,
        longitude=longitude,
    )