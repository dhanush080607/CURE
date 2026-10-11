
import math


def predict_water_demand(
    consumption_history: list[float],
    forecast_days: int = 7,
    forecast_temperatures_c: list[float] | None = None,
):
    """
    Estimate daily water demand using recent consumption
    and an optional temperature forecast.

    The heat adjustment is an illustrative assumption,
    not a scientifically calibrated demand model.
    """

    if (
        not isinstance(forecast_days, int)
        or isinstance(forecast_days, bool)
        or forecast_days < 1
    ):
        raise ValueError("forecast_days must be at least 1")

    if not consumption_history:
        return {
            "prediction_status": "INSUFFICIENT_DATA",
            "predicted_daily_demand_liters": None,
            "forecast_days": forecast_days,
            "daily_predictions": [],
            "method": "weighted_average",
        }

    if any(
        not isinstance(value, (int, float))
        or isinstance(value, bool)
        or not math.isfinite(value)
        or value < 0
        for value in consumption_history
    ):
        raise ValueError("Consumption values must be finite, non-negative numbers")

    if forecast_temperatures_c is not None and any(
        not isinstance(temp, (int, float))
        or isinstance(temp, bool)
        or not math.isfinite(temp)
        for temp in forecast_temperatures_c
    ):
        raise ValueError("Forecast temperatures must be valid numbers")

    recent_history = consumption_history[-7:]
    weights = list(range(1, len(recent_history) + 1))
    total_weight = sum(weights)

    baseline_demand = sum(
        value * weight
        for value, weight in zip(recent_history, weights)
    ) / total_weight

    daily_predictions = []

    for day in range(forecast_days):
        if forecast_temperatures_c and day < len(forecast_temperatures_c):
            temperature = forecast_temperatures_c[day]
        else:
            temperature = None

        # Illustrative assumption:
        # demand rises by 2% per degree above 30°C.
        heat_adjustment_percent = (
            max(0, temperature - 30) * 2
            if temperature is not None
            else 0
        )

        predicted_demand = baseline_demand * (
            1 + heat_adjustment_percent / 100
        )

        daily_predictions.append({
            "day": day + 1,
            "predicted_demand_liters": round(predicted_demand, 2),
            "temperature_c": temperature,
            "heat_adjustment_percent": round(
                heat_adjustment_percent, 2
            ),
        })

    first_day_demand = daily_predictions[0]["predicted_demand_liters"]

    return {
        "prediction_status": "SUCCESS",
        "predicted_daily_demand_liters": first_day_demand,
        "forecast_days": forecast_days,
        "daily_predictions": daily_predictions,
        "method": "weighted_average",
    }
