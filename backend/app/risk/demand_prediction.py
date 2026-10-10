def predict_water_demand(
    consumption_history: list[float],
    forecast_days: int = 7,
):
    """
    Predict daily water demand using recent consumption history.
    Uses a weighted average that gives more importance to recent usage.
    """

    if forecast_days < 1:
        raise ValueError("forecast_days must be at least 1")

    if not consumption_history:
        return {
            "prediction_status": "INSUFFICIENT_DATA",
            "predicted_daily_demand_liters": None,
            "forecast_days": forecast_days,
            "daily_predictions": [],
            "method": "weighted_average",
        }

    if any(value < 0 for value in consumption_history):
        raise ValueError("Consumption values cannot be negative")

    # Use at most the latest 7 observations.
    recent_history = consumption_history[-7:]

    # Give more weight to recent consumption.
    weights = list(range(1, len(recent_history) + 1))
    total_weight = sum(weights)

    predicted_demand = sum(
        value * weight
        for value, weight in zip(recent_history, weights)
    ) / total_weight

    predicted_demand = round(predicted_demand, 2)

    daily_predictions = [
        {
            "day": day,
            "predicted_demand_liters": predicted_demand,
        }
        for day in range(1, forecast_days + 1)
    ]

    return {
        "prediction_status": "SUCCESS",
        "predicted_daily_demand_liters": predicted_demand,
        "forecast_days": forecast_days,
        "daily_predictions": daily_predictions,
        "method": "weighted_average",
    }
