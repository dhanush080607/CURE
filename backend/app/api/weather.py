import logging

from fastapi import APIRouter, HTTPException, Query

from app.services.weather_service import get_weather, search_places

log = logging.getLogger(__name__)

router = APIRouter(prefix="/weather", tags=["Weather"])


def _upstream_error(exc: Exception, what: str) -> HTTPException:
    """Log the real cause server-side; never echo it to the caller."""

    log.warning("%s upstream failed: %s: %s", what, type(exc).__name__, exc)
    return HTTPException(status_code=502, detail=f"{what} upstream unavailable.")


@router.get("/current")
async def current_weather(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
):
    """Current conditions, 24 hourly steps and a 7-day outlook for a point."""

    try:
        return await get_weather(latitude, longitude)
    except Exception as exc:
        raise _upstream_error(exc, "Weather") from exc


@router.get("/forecast")
async def forecast(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
):
    """Alias of /current kept for readability at call sites."""

    return await current_weather(latitude=latitude, longitude=longitude)


@router.get("/search")
async def search(
    q: str = Query(..., min_length=2),
    count: int = Query(8, ge=1, le=25),
):
    """Geocoding search for the location picker."""

    try:
        return await search_places(q, count)
    except Exception as exc:
        raise _upstream_error(exc, "Geocoding") from exc
