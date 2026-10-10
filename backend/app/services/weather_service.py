import httpx


def get_weather_forecast(latitude: float, longitude: float):
    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "apparent_temperature,"
            "is_day,"
            "precipitation,"
            "wind_speed_10m"
        ),
        "daily": (
            "temperature_2m_max,"
            "temperature_2m_min,"
            "precipitation_probability_max,"
            "uv_index_max"
        ),
        "forecast_days": 7,
        "timezone": "auto",
    }

    with httpx.Client(timeout=15) as client:
        response = client.get(url, params=params)
        response.raise_for_status()

    data = response.json()
    current = data.get("current", {})
    daily = data.get("daily", {})

    return {
        "latitude": latitude,
        "longitude": longitude,
        "current": {
            "temperature_c": current.get("temperature_2m"),
            "feels_like_c": current.get("apparent_temperature"),
            "humidity_percent": current.get("relative_humidity_2m"),
            "wind_speed_kmh": current.get("wind_speed_10m"),
            "precipitation_mm": current.get("precipitation"),
            "is_day": current.get("is_day"),
            "time": current.get("time"),
        },
        "daily": {
            "dates": daily.get("time", []),
            "max_temperatures_c": daily.get(
                "temperature_2m_max", []
            ),
            "min_temperatures_c": daily.get(
                "temperature_2m_min", []
            ),
            "precipitation_probability_percent": daily.get(
                "precipitation_probability_max", []
            ),
            "uv_index_max": daily.get("uv_index_max", []),
        },
        "max_temperatures_c": daily.get("temperature_2m_max", []),
        "forecast_days": len(daily.get("time", [])),
    }