import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [formData, setFormData] = useState({
    tank_capacity_liters: 50000,
    tank_level_percent: 62,
    consumption_history: [
      7200,
      7600,
      7400,
      8000,
      7300,
      7700,
      7500,
    ],
    latitude: 13.55,
    longitude: 78.5,
  });

  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: Number(value),
    }));
  };

  const updateConsumption = (index, value) => {
    setFormData((previous) => {
      const updatedHistory = [...previous.consumption_history];

      updatedHistory[index] = Number(value);

      return {
        ...previous,
        consumption_history: updatedHistory,
      };
    });
  };

  const analyzeRisk = async () => {
    setLoading(true);
    setRiskData(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/water/risk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch water risk");
      }

      const data = await response.json();

      setRiskData(data);
    } catch (error) {
      console.error(error);
      alert("Could not connect to CURE backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header / Judge Pitch Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
                💧
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">
                  CURE
                </h1>

                <p className="text-sm text-cyan-400">
                  Climate & Utility Risk Engine
                </p>
              </div>
            </div>

            <div className="hidden rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 sm:block">
              <p className="text-xs text-slate-500">
                CURE ENGINE
              </p>

              <p className="mt-1 text-sm font-semibold text-cyan-400">
                ● Online
              </p>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-slate-400">
            Predict water supply risk before it becomes a crisis.
            CURE combines consumption, water availability, and climate
            conditions to estimate your water runway and recommend action.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Live Risk Snapshot Row */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Water Available
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {riskData
                ? `${riskData.available_water_liters.toLocaleString()} L`
                : "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Water Runway
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {riskData
                ? riskData.water_runway_days !== null
                  ? `${riskData.water_runway_days} days`
                  : "Unavailable"
                : "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Current Risk
            </p>

            <p
              className={`mt-2 text-2xl font-bold ${
                !riskData
                  ? "text-slate-500"
                  : riskData.risk_level === "HIGH"
                  ? "text-red-400"
                  : riskData.risk_level === "WATCH"
                  ? "text-orange-400"
                  : "text-emerald-400"
              }`}
            >
              {riskData ? riskData.risk_level : "—"}
            </p>
          </div>
        </div>

        {/* Input Section */}
        <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h3 className="mb-6 text-xl font-semibold">
            Water Supply Details
          </h3>

          <div className="grid gap-6 md:grid-cols-2">

            {/* Tank Capacity */}
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Tank Capacity (Liters)
              </label>

              <input
                type="number"
                value={formData.tank_capacity_liters}
                onChange={(e) =>
                  updateField(
                    "tank_capacity_liters",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Tank Level */}
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Current Tank Level (%)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={formData.tank_level_percent}
                onChange={(e) =>
                  updateField(
                    "tank_level_percent",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Latitude */}
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Latitude
              </label>

              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) =>
                  updateField("latitude", e.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Longitude */}
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Longitude
              </label>

              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) =>
                  updateField("longitude", e.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

          </div>
        </section>

        {/* Consumption */}
        <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h3 className="mb-2 text-xl font-semibold">
            Daily Consumption
          </h3>

          <p className="mb-6 text-sm text-slate-400">
            Enter the last 7 days of water consumption in liters.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">

            {formData.consumption_history.map((value, index) => (
              <div key={index}>

                <label className="mb-2 block text-sm text-slate-400">
                  Day {index + 1}
                </label>

                <input
                  type="number"
                  min="0"
                  value={value}
                  onChange={(e) =>
                    updateConsumption(
                      index,
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-cyan-400"
                />

              </div>
            ))}

          </div>
        </section>

        {/* Analyze Button */}
        <button
          onClick={analyzeRisk}
          disabled={loading}
          className="mb-10 w-full rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
        >
          {loading ? "Analyzing Water Risk..." : "Analyze Water Risk"}
        </button>

        {/* Results */}
        {riskData && (
          <section>

            {/* Main Risk Banner */}
            <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Risk Status
              </p>

              <h2
                className={`text-3xl font-black ${
                  riskData.risk_level === "HIGH"
                    ? "text-red-400"
                    : riskData.risk_level === "WATCH"
                    ? "text-orange-400"
                    : "text-emerald-400"
                }`}
              >
                {riskData.risk_level}
              </h2>

              <p className="mt-2 text-lg text-white">
                {riskData.water_runway_days !== null
                  ? `${riskData.water_runway_days} days of water runway`
                  : "Water runway cannot be calculated"}
              </p>

              {riskData.risk_reason && (
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Why this risk?
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {riskData.risk_reason}
                  </p>
                </div>
              )}

              <div className="mt-4 border-t border-slate-800/80 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Recommendation
                </p>

                <p className="mt-1 font-medium text-slate-200">
                  {riskData.recommendation}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold">
                Detailed Metrics
              </h3>

              <p className="mt-2 text-slate-400">
                Detailed metrics generated from your water, consumption,
                and weather data.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

              {/* Available Water */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">
                  Available Water
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {riskData.available_water_liters.toLocaleString()} L
                </p>
              </div>

              {/* Runway */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">
                  Water Runway
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {riskData.water_runway_days !== null
                    ? `${riskData.water_runway_days} days`
                    : "N/A"}
                </p>
              </div>

              {/* Risk */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">
                  Risk Level
                </p>

                <p
                  className={`mt-2 text-3xl font-bold ${
                    riskData.risk_level === "LOW"
                      ? "text-green-400"
                      : riskData.risk_level === "WATCH"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {riskData.risk_level}
                </p>
              </div>

              {/* Temperature */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">
                  Max Temperature
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {riskData.max_temperature_c}°C
                </p>
              </div>

            </div>

            {/* Consumption Chart */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h4 className="mb-2 text-lg font-semibold">
                7-Day Water Consumption
              </h4>

              <p className="mb-6 text-sm text-slate-400">
                Daily water usage based on your recent consumption history.
              </p>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={(riskData.consumption_history || []).map((value, index) => ({
                      day: `Day ${index + 1}`,
                      consumption: value,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

                    <XAxis
                      dataKey="day"
                      stroke="#94a3b8"
                    />

                    <YAxis
                      stroke="#94a3b8"
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                        color: "#ffffff",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="consumption"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Water Supply Status */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <div className="mb-6">
                <h4 className="text-lg font-semibold">
                  Water Supply Status
                </h4>

                <p className="mt-1 text-sm text-slate-400">
                  Current tank availability based on your input.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">

                {/* Tank Level */}
                <div>

                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      Tank Level
                    </span>

                    <span className="font-semibold">
                      {formData.tank_level_percent}%
                    </span>
                  </div>

                  <div className="h-6 overflow-hidden rounded-full bg-slate-800">

                    <div
                      className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                      style={{
                        width: `${formData.tank_level_percent}%`,
                      }}
                    />

                  </div>

                  <div className="mt-3 flex justify-between text-sm text-slate-400">
                    <span>
                      {riskData.available_water_liters.toLocaleString()} L available
                    </span>

                    <span>
                      {formData.tank_capacity_liters.toLocaleString()} L capacity
                    </span>
                  </div>

                </div>

                {/* Runway */}
                <div>

                  <p className="text-sm text-slate-400">
                    Estimated Water Runway
                  </p>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      {riskData.water_runway_days !== null
                        ? riskData.water_runway_days
                        : "N/A"}
                    </span>

                    {riskData.water_runway_days !== null && (
                      <span className="text-slate-400">
                        days
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-slate-400">
                    Based on current consumption and projected demand.
                  </p>

                </div>

              </div>

            </div>

            {/* Weather Intelligence */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <div className="mb-6">
                <h4 className="text-lg font-semibold">
                  Weather & Heat Intelligence
                </h4>

                <p className="mt-1 text-sm text-slate-400">
                  Upcoming temperatures that influence projected water demand.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">

                {(riskData.weather_forecast || []).map((temperature, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <p className="text-sm text-slate-400">
                      Day {index + 1}
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {temperature}°C
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Maximum temperature
                    </p>
                  </div>
                ))}

              </div>

              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-slate-400">
                      Heat Adjustment
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {riskData.heat_adjustment_percent}%
                    </p>

                    {riskData.heat_status && (
                      <p
                        className={`mt-1 text-sm font-medium ${
                          riskData.heat_status === "HIGH"
                            ? "text-red-400"
                            : riskData.heat_status === "ELEVATED"
                            ? "text-orange-400"
                            : riskData.heat_status === "MODERATE"
                            ? "text-yellow-400"
                            : "text-emerald-400"
                        }`}
                      >
                        Status: {riskData.heat_status}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-400">
                      Heat Warning
                    </p>

                    <p
                      className={`mt-1 font-semibold ${
                        riskData.heat_warning
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {riskData.heat_warning ? "ACTIVE" : "NONE"}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* More Details */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <h4 className="mb-4 text-lg font-semibold">
                  Consumption Analysis
                </h4>

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Average daily consumption
                    </span>

                    <span>
                      {riskData.average_daily_consumption_liters} L
                    </span>
                  </div>

                  {riskData.consumption_trend && (
                    <div>
                      <p className="mt-2 text-sm text-slate-400">
                        Consumption Trend
                      </p>
                      <p
                        className={`text-lg font-semibold ${
                          riskData.consumption_trend === "INCREASING"
                            ? "text-red-400"
                            : riskData.consumption_trend === "DECREASING"
                            ? "text-emerald-400"
                            : riskData.consumption_trend === "STABLE"
                            ? "text-cyan-400"
                            : "text-slate-400"
                        }`}
                      >
                        {riskData.consumption_trend}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">
                      Projected daily consumption
                    </span>

                    <span>
                      {riskData.projected_daily_consumption_liters} L
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Days analyzed
                    </span>

                    <span>
                      {riskData.days_of_history}
                    </span>
                  </div>

                </div>
              </div>

              {/* Recommendation & AI Advice */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <h4 className="mb-4 text-lg font-semibold">
                  Recommendation
                </h4>

                <p className="text-slate-300">
                  {riskData.recommendation}
                </p>

                {riskData.risk_reason && (
                  <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Why this risk?
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {riskData.risk_reason}
                    </p>
                  </div>
                )}

                <div className="mt-5 border-t border-slate-800 pt-5">

                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
                      🤖
                    </div>

                    <div>
                      <h4 className="font-semibold">
                        CURE AI
                      </h4>

                      <p className="text-xs text-slate-500">
                        AI-powered water risk explanation
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="whitespace-pre-line text-sm leading-7 text-slate-300">
                      {riskData.ai_advice.replace(/\*\*/g, "")}
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </section>
        )}

        {/* Live System Status Bar */}
        <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>

            <span className="text-sm text-slate-300">
              CURE Risk Engine
            </span>

            <span className="text-xs text-emerald-400">
              ONLINE
            </span>
          </div>

          <span className="text-xs text-slate-500">
            Weather + Consumption + Risk Analysis
          </span>
        </div>

        {/* How CURE Decides */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-xl font-bold text-white">
            How CURE Decides
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            CURE combines current water availability, recent consumption,
            and upcoming heat conditions to estimate water runway and risk.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm font-semibold text-cyan-400">
                01 · Water
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Calculates available water from tank capacity and current level.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm font-semibold text-cyan-400">
                02 · Consumption
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Analyzes recent usage and identifies the consumption trend.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm font-semibold text-cyan-400">
                03 · Climate
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Uses weather conditions to adjust projected water demand.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm font-semibold text-cyan-400">
                04 · Risk
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Estimates water runway and produces an actionable risk level.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-800 pt-6 text-center">
          <p className="text-sm text-slate-500">
            CURE — Climate & Utility Risk Engine
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Turning climate and consumption data into actionable water-risk insights.
          </p>
        </footer>

      </main>
    </div>
  );
}

export default App;