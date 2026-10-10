"""Checks for the water demand predictor.

Runs standalone (``python test_demand_prediction.py``) and is collectable by
pytest without requiring it as a dependency.
"""

from app.risk.demand_prediction import predict_water_demand

HISTORY = [7200, 7600, 7400, 8000, 7300, 7700, 7500]
EXPECTED_DEMAND = 7564.29


def test_predicts_weighted_average():
    result = predict_water_demand(HISTORY, forecast_days=7)

    assert result["prediction_status"] == "SUCCESS"
    assert result["predicted_daily_demand_liters"] == EXPECTED_DEMAND
    assert result["forecast_days"] == 7
    assert len(result["daily_predictions"]) == 7
    assert result["method"] == "weighted_average"


def test_only_latest_seven_observations_are_used():
    padded = [10_000] * 20 + HISTORY
    result = predict_water_demand(padded, forecast_days=7)

    assert result["predicted_daily_demand_liters"] == EXPECTED_DEMAND


def test_recent_values_dominate_older_values():
    rising = [1000, 1000, 1000, 1000, 1000, 1000, 9000]
    result = predict_water_demand(rising, forecast_days=1)

    assert result["predicted_daily_demand_liters"] > 2000


def test_single_day_forecast_returns_single_prediction():
    result = predict_water_demand(HISTORY, forecast_days=1)

    assert len(result["daily_predictions"]) == 1
    assert result["daily_predictions"][0]["day"] == 1


def test_empty_history_reports_insufficient_data():
    result = predict_water_demand([], forecast_days=7)

    assert result["prediction_status"] == "INSUFFICIENT_DATA"
    assert result["predicted_daily_demand_liters"] is None
    assert result["daily_predictions"] == []


def test_rejects_invalid_forecast_days():
    for bad in (0, -1):
        try:
            predict_water_demand(HISTORY, forecast_days=bad)
        except ValueError:
            continue
        raise AssertionError(f"forecast_days={bad} should raise ValueError")


def test_rejects_negative_consumption():
    try:
        predict_water_demand([7200, -100], forecast_days=7)
    except ValueError:
        return
    raise AssertionError("negative consumption should raise ValueError")


if __name__ == "__main__":
    for name, fn in sorted(dict(globals()).items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print(f"PASS  {name}")

    print(f"\nAll checks passed. Predicted daily demand: {EXPECTED_DEMAND} L")