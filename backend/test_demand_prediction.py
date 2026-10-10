
from app.risk.demand_prediction import predict_water_demand


history = [7200, 7600, 7400, 8000, 7300, 7700, 7500]

result = predict_water_demand(history, forecast_days=7)

print("Prediction status:", result["prediction_status"])
print("Predicted daily demand:", result["predicted_daily_demand_liters"], "litres")
print("Forecast days:", result["forecast_days"])

for day in result["daily_predictions"]:
    print(day)
