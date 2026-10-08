from app.risk.heat_engine import calculate_heat_adjustment
from app.risk.consumption_engine import calculate_average_consumption


def calculate_water_risk(
    tank_capacity_liters: float,
    tank_level_percent: float,
    consumption_history: list[float],
    max_temperature_c: float,
    heat_warning: bool,
):
    # 1. Calculate current available water
    available_water = (
        tank_capacity_liters * tank_level_percent / 100
    )

    # 2. Calculate average consumption from history
    consumption_data = calculate_average_consumption(
        consumption_history
    )

    average_daily_consumption = (
        consumption_data["average_daily_consumption_liters"]
    )
    consumption_trend = consumption_data["consumption_trend"]

    # 3. Calculate heat impact
    heat_data = calculate_heat_adjustment(
        max_temperature_c=max_temperature_c,
        heat_warning=heat_warning,
    )

    adjustment_percent = heat_data["demand_adjustment_percent"]

    # 4. Project consumption under current heat conditions
    projected_daily_consumption = (
        average_daily_consumption
        * (1 + adjustment_percent / 100)
    )

    # 5. Calculate water runway
    if projected_daily_consumption <= 0:
        water_runway_days = None
    else:
        water_runway_days = (
            available_water / projected_daily_consumption
        )

    # 6. Determine risk
    if water_runway_days is None:
        risk_level = "WATCH"
        recommendation = (
            "Consumption data shows zero usage. "
            "Verify consumption data before making a tanker decision."
        )
        risk_reason = (
            "Risk cannot be fully assessed because consumption "
            "data shows zero usage."
        )
    elif water_runway_days < 2:
        risk_level = "HIGH"
        recommendation = "Plan a tanker immediately."
        risk_reason = (
            f"Water runway is only {round(water_runway_days, 2)} days."
        )
    elif water_runway_days < 4:
        risk_level = "WATCH"
        recommendation = "Review tanker planning soon."
        risk_reason = (
            f"Water runway is {round(water_runway_days, 2)} days "
            "and requires closer monitoring."
        )
    else:
        risk_level = "LOW"
        recommendation = "Current water supply appears stable."
        risk_reason = (
            f"Water runway is {round(water_runway_days, 2)} days "
            "based on current projected consumption."
        )

    return {
        "available_water_liters": round(
            available_water, 2
        ),
        "average_daily_consumption_liters": round(
            average_daily_consumption, 2
        ),
        "consumption_trend": consumption_trend,
        "projected_daily_consumption_liters": round(
            projected_daily_consumption, 2
        ),
        "days_of_history": consumption_data["days_analyzed"],
        "max_temperature_c": max_temperature_c,
        "heat_warning": heat_warning,
        "heat_adjustment_percent": adjustment_percent,
        "water_runway_days": (
            round(water_runway_days, 2)
            if water_runway_days is not None
            else None
        ),
        "risk_level": risk_level,
        "risk_reason": risk_reason,
        "recommendation": recommendation,
    }