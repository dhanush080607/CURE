def calculate_heat_adjustment(
    max_temperature_c: float,
    heat_warning: bool,
):
    """
    Calculate an illustrative increase in water demand
    based on heat conditions.

    This is an MVP heuristic, not a scientific prediction.
    """

    if heat_warning or max_temperature_c >= 38:
        adjustment_percent = 15
        heat_status = "HIGH"

    elif max_temperature_c >= 35:
        adjustment_percent = 10
        heat_status = "ELEVATED"

    elif max_temperature_c >= 32:
        adjustment_percent = 5
        heat_status = "MODERATE"

    else:
        adjustment_percent = 0
        heat_status = "NORMAL"

    return {
        "max_temperature_c": max_temperature_c,
        "heat_warning": heat_warning,
        "heat_status": heat_status,
        "demand_adjustment_percent": adjustment_percent,
    }