from fastapi import APIRouter
from pydantic import BaseModel, Field, field_validator

from app.risk.risk_engine import calculate_water_risk
from app.services.weather_service import get_weather_forecast
from app.ai.agent import ask_cure


router = APIRouter(
    prefix="/water",
    tags=["Water"],
)


class WaterRiskRequest(BaseModel):
    tank_capacity_liters: float = Field(
        gt=0,
        description="Total tank capacity in liters"
    )

    tank_level_percent: float = Field(
        ge=0,
        le=100,
        description="Current tank level percentage"
    )

    consumption_history: list[float] = Field(
        min_length=1,
        description="Daily water consumption in liters"
    )

    latitude: float = Field(
        ge=-90,
        le=90,
        description="Latitude"
    )

    longitude: float = Field(
        ge=-180,
        le=180,
        description="Longitude"
    )

    @field_validator("consumption_history")
    @classmethod
    def validate_consumption(cls, values):
        if any(value < 0 for value in values):
            raise ValueError(
                "Consumption values cannot be negative"
            )

        return values


@router.post("/risk")
def water_risk(data: WaterRiskRequest):

    # -----------------------------
    # 1. Get weather forecast
    # -----------------------------
    weather = get_weather_forecast(
        latitude=data.latitude,
        longitude=data.longitude,
    )

    max_temperature = max(
        weather["max_temperatures_c"]
    )

    heat_warning = max_temperature >= 38

    # -----------------------------
    # 2. Calculate deterministic risk
    # -----------------------------
    risk_result = calculate_water_risk(
        tank_capacity_liters=data.tank_capacity_liters,
        tank_level_percent=data.tank_level_percent,
        consumption_history=data.consumption_history,
        max_temperature_c=max_temperature,
        heat_warning=heat_warning,
    )

    # -----------------------------
    # 3. Ask AI to explain result
    # -----------------------------
    ai_prompt = f"""
Explain the following CURE water-risk result.

Use ONLY the provided data.

Available water: {risk_result["available_water_liters"]} liters
Average daily consumption: {risk_result["average_daily_consumption_liters"]} liters
Projected daily consumption: {risk_result["projected_daily_consumption_liters"]} liters
Consumption trend: {risk_result["consumption_trend"]}
Water runway: {risk_result["water_runway_days"]}
Maximum temperature: {risk_result["max_temperature_c"]} °C
Heat warning: {risk_result["heat_warning"]}
Heat adjustment: {risk_result["heat_adjustment_percent"]}%
Risk level: {risk_result["risk_level"]}
Risk reason: {risk_result["risk_reason"]}
System recommendation: {risk_result["recommendation"]}

If water runway is null, explain that it cannot be calculated because projected consumption is zero. Do NOT describe it as zero days, infinite days, or an indefinite supply.

If consumption trend is INCREASING, mention that recent usage is increasing.
If consumption trend is DECREASING, mention that recent usage is decreasing.
If consumption trend is STABLE, mention that recent usage is relatively stable.
If consumption trend is UNKNOWN, do not make a trend claim.

Use the provided risk reason as the authoritative explanation for why the risk level was assigned.
Do not create a different reason.

Explain the result briefly and practically.
Do not change the risk level.
Do not invent additional measurements or thresholds.
Do not describe values as safe or unsafe unless explicitly stated above.

Return a concise plain-text explanation.
Do not use Markdown formatting such as **, ##, or bullet points.
"""

    ai_advice = ask_cure(ai_prompt)

    # -----------------------------
    # 4. Return complete result
    # -----------------------------
    return {
        **risk_result,
        "consumption_history": data.consumption_history,
        "weather_forecast": weather["max_temperatures_c"],
        "ai_advice": ai_advice,
    }