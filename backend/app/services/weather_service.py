"""Live weather, air quality and geocoding from keyless public APIs."""

from typing import Any

from app.services.http_client import fetch_json

FORECAST = "https://api.open-meteo.com/v1/forecast"
AIR_QUALITY = "https://air-quality-api.open-meteo.com/v1/air-quality"
GEOCODING = "https://geocoding-api.open-meteo.com/v1/search"
WTTR = "https://wttr.in"

CURRENT_FIELDS = (
    "temperature_2m,relative_humidity_2m,apparent_temperature,"
    "pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,"
    "wind_gusts_10m,weather_code,cloud_cover,precipitation,visibility,uv_index"
)
HOURLY_FIELDS = (
    "temperature_2m,relative_humidity_2m,weather_code,"
    "precipitation_probability,precipitation,pressure_msl,wind_speed_10m,is_day"
)
DAILY_FIELDS = (
    "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,"
    "precipitation_probability_max"
)

CARDINALS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]


def degrees_to_cardinal(deg: float | None) -> str | None:
    if deg is None:
        return None
    return CARDINALS[int(round(deg / 45)) % 8]


def _hour_label(iso: str) -> str:
    return iso[11:16] if len(iso) >= 16 else iso


def _time_only(iso: str | None) -> str | None:
    if not iso:
        return None
    return iso[11:16] if len(iso) >= 16 else iso


def _shape(raw: dict[str, Any], air: dict[str, Any] | None) -> dict[str, Any]:
    current = raw.get("current") or {}
    daily = raw.get("daily") or {}
    hourly = raw.get("hourly") or {}

    now_iso = current.get("time", "")
    times = hourly.get("time") or []
    # `current.time` carries minutes while hourly stamps are always on the hour,
    # so indexOf() would miss and silently restart the window at midnight.
    start = next((i for i, t in enumerate(times) if t[:13] >= now_iso[:13]), 0)

    humidity_series = hourly.get("relative_humidity_2m") or []

    hours = []
    for i in range(start, min(start + 24, len(times))):
        hours.append(
            {
                "time": _hour_label(times[i]),
                "temp": (hourly.get("temperature_2m") or [None])[i],
                "code": (hourly.get("weather_code") or [None])[i],
                "pop": (hourly.get("precipitation_probability") or [0])[i] or 0,
                "wind": (hourly.get("wind_speed_10m") or [None])[i],
                "humidity": humidity_series[i] if i < len(humidity_series) else None,
                "pressure": _round_or_none((hourly.get("pressure_msl") or [None])[i]),
                "precip": (hourly.get("precipitation") or [0])[i] or 0,
                "isDay": (hourly.get("is_day") or [1])[i] != 0,
            }
        )

    days = []
    d_times = daily.get("time") or []
    for i, date in enumerate(d_times):
        days.append(
            {
                "date": date,
                "max": _at(daily.get("temperature_2m_max"), i),
                "min": _at(daily.get("temperature_2m_min"), i),
                "code": _at(daily.get("weather_code"), i),
                "pop": _at(daily.get("precipitation_probability_max"), i) or 0,
                "sunrise": _time_only(_at(daily.get("sunrise"), i)),
                "sunset": _time_only(_at(daily.get("sunset"), i)),
            }
        )

    air_current = (air or {}).get("current") or {}

    visibility = current.get("visibility")
    return {
        "source": "open-meteo",
        "temp": current.get("temperature_2m"),
        "feelsLike": current.get("apparent_temperature"),
        "humidity": current.get("relative_humidity_2m"),
        "pressure": _round_or_none(
            current.get("pressure_msl") or current.get("surface_pressure")
        ),
        "windSpeed": current.get("wind_speed_10m"),
        "windGust": current.get("wind_gusts_10m"),
        "windDirection": degrees_to_cardinal(current.get("wind_direction_10m")),
        "visibility": round(visibility / 1000) if isinstance(visibility, (int, float)) else None,
        "uvIndex": current.get("uv_index"),
        "weatherCode": current.get("weather_code"),
        "cloudCover": current.get("cloud_cover"),
        "precipitation": current.get("precipitation"),
        "aqi": air_current.get("european_aqi"),
        "pm25": air_current.get("pm2_5"),
        "pm10": air_current.get("pm10"),
        "elevation": raw.get("elevation"),
        "timezone": raw.get("timezone_abbreviation"),
        "observedAt": current.get("time"),
        "hourly": hours,
        "daily": days,
    }


def _at(series: list | None, index: int):
    if not series or index >= len(series):
        return None
    return series[index]


def _round_or_none(value):
    return round(value) if isinstance(value, (int, float)) else None


async def get_weather(latitude: float, longitude: float) -> dict[str, Any]:
    """Current conditions, 24 hourly steps and a 7-day outlook."""

    base_params = {
        "latitude": latitude,
        "longitude": longitude,
        "timezone": "auto",
        "forecast_days": 7,
    }

    try:
        raw = await fetch_json(
            FORECAST,
            params={
                **base_params,
                "current": CURRENT_FIELDS,
                "hourly": HOURLY_FIELDS,
                "daily": DAILY_FIELDS,
            },
        )
        air = await fetch_json(
            AIR_QUALITY,
            params={
                **base_params,
                "current": "pm10,pm2_5,european_aqi",
            },
            retries=0,
        )
        return _shape(raw, air)
    except Exception:
        return await _from_wttr(latitude, longitude)


async def _from_wttr(latitude: float, longitude: float) -> dict[str, Any]:
    """Fallback source when Open-Meteo is unreachable."""

    import httpx

    label = f"{latitude},{longitude}"
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(f"{WTTR}/{label}", params={"format": "j1"})
        response.raise_for_status()
        data = response.json()

    cur = (data.get("current_condition") or [{}])[0]
    days = []
    for day in (data.get("weather") or [])[:7]:
        astronomy = (day.get("astronomy") or [{}])[0]
        days.append(
            {
                "date": day.get("date"),
                "max": _to_int(day.get("maxtempC")),
                "min": _to_int(day.get("mintempC")),
                "code": None,
                "pop": 0,
                "sunrise": astronomy.get("sunrise"),
                "sunset": astronomy.get("sunset"),
            }
        )

    return {
        "source": "wttr",
        "temp": _to_int(cur.get("temp_C")),
        "feelsLike": _to_int(cur.get("FeelsLikeC")),
        "humidity": _to_int(cur.get("humidity")),
        "pressure": _to_int(cur.get("pressure")),
        "windSpeed": _to_int(cur.get("windspeedKmph")),
        "windGust": None,
        "windDirection": cur.get("winddir16Point"),
        "visibility": _to_int(cur.get("visibility")) or None,
        "uvIndex": _to_int(cur.get("uvIndex")),
        "weatherCode": _to_int(cur.get("weatherCode")),
        "cloudCover": _to_int(cur.get("cloudcover")),
        "precipitation": _to_float(cur.get("precipMM")),
        "aqi": None,
        "pm25": None,
        "pm10": None,
        "elevation": None,
        "timezone": None,
        "observedAt": cur.get("observation_time"),
        "hourly": [],
        "daily": days,
        "degraded": True,
    }


def _to_int(value):
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return None


def _to_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


async def search_places(query: str, count: int = 8) -> list[dict[str, Any]]:
    """Geocoding search used by the location picker."""

    data = await fetch_json(
        GEOCODING,
        params={"name": query, "count": count, "language": "en", "format": "json"},
    )

    return [
        {
            "id": f"{r['latitude']},{r['longitude']}",
            "name": r.get("name"),
            "lat": r.get("latitude"),
            "lon": r.get("longitude"),
            "country": r.get("country", ""),
            "countryCode": r.get("country_code", ""),
            "admin1": r.get("admin1", ""),
            "timezone": r.get("timezone", ""),
            "elevation": r.get("elevation"),
        }
        for r in (data.get("results") or [])
    ]
