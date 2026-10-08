import httpx


def get_weather_forecast(latitude: float, longitude: float):
    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": "temperature_2m_max",
        "forecast_days": 3,
        "timezone": "auto",
    }

    with httpx.Client(timeout=10) as client:
        response = client.get(
            url,
            params=params,
        )

    response.raise_for_status()

    data = response.json()

    temperatures = data["daily"]["temperature_2m_max"]

    return {
        "latitude": latitude,
        "longitude": longitude,
        "forecast_days": len(temperatures),
        "max_temperatures_c": temperatures,
    }