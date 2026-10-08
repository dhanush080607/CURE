def calculate_average_consumption(
    consumption_history: list[float],
):
    if not consumption_history:
        return {
            "average_daily_consumption_liters": 0,
            "days_analyzed": 0,
            "consumption_trend": "UNKNOWN",
        }

    average_consumption = (
        sum(consumption_history) / len(consumption_history)
    )

    # Need at least two values to determine a trend
    if len(consumption_history) < 2:
        consumption_trend = "UNKNOWN"
    else:
        first = consumption_history[0]
        last = consumption_history[-1]

        difference = last - first

        # 5% tolerance to avoid calling tiny changes a trend
        if average_consumption == 0:
            consumption_trend = "STABLE"
        elif difference > average_consumption * 0.05:
            consumption_trend = "INCREASING"
        elif difference < -average_consumption * 0.05:
            consumption_trend = "DECREASING"
        else:
            consumption_trend = "STABLE"

    return {
        "average_daily_consumption_liters": round(
            average_consumption,
            2,
        ),
        "days_analyzed": len(consumption_history),
        "consumption_trend": consumption_trend,
    }