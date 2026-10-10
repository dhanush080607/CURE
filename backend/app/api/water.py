from fastapi import APIRouter, Query
from pydantic import BaseModel, Field, field_validator

from app.ai import agent
from app.risk.risk_engine import calculate_water_risk
from app.services.weather_service import get_weather

router = APIRouter(tags=["CURE"])


class WaterRiskRequest(BaseModel):
    tank_capacity_liters: float = Field(..., gt=0)
    tank_level_percent: float = Field(..., ge=0, le=100)
    consumption_history: list[float] = Field(..., min_length=1)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

    @field_validator("consumption_history")
    @classmethod
    def non_negative(cls, values):
        if any(v < 0 for v in values):
            raise ValueError("Consumption values cannot be negative")
        return values


@router.post("/water/risk")
async def water_risk(data: WaterRiskRequest):
    """Deterministic water runway plus an optional AI explanation."""

    weather = await get_weather(data.latitude, data.longitude)

    temperatures = [
        t
        for t in [weather.get("temp")]
        if isinstance(t, (int, float))
    ]
    if weather.get("daily"):
        daily_maxes = [d.get("max") for d in weather["daily"] if d.get("max") is not None]
        temperatures.extend(daily_maxes)

    max_temperature = max(temperatures) if temperatures else 0.0
    heat_warning = max_temperature >= 38

    risk = calculate_water_risk(
        tank_capacity_liters=data.tank_capacity_liters,
        tank_level_percent=data.tank_level_percent,
        consumption_history=data.consumption_history,
        max_temperature_c=max_temperature,
        heat_warning=heat_warning,
    )

    explanation = await agent.explain(risk)

    return {
        **risk,
        "consumption_history": data.consumption_history,
        "weather_source": weather.get("source"),
        "max_temperature_window_c": max_temperature,
        **explanation,
    }


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=500)
    risk_data: dict


@router.post("/ai/ask")
async def ask(payload: AskRequest):
    """Grounded question answering over a risk payload."""

    result = await agent.answer(payload.question, payload.risk_data)
    return {"question": payload.question, **result}
