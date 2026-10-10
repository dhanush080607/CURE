import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import WeatherBackground from "./components/WeatherBackground";
import "./weather-background.css";

const API_URL = "http://127.0.0.1:8000/water/risk";

const initialHistory = [7200, 7600, 7400, 8000, 7300, 7700, 7500];

const navItems = [
  { id: "overview", icon: "◫", label: "Overview" },
  { id: "water", icon: "≈", label: "Water intelligence" },
  { id: "climate", icon: "☼", label: "Climate monitor" },
  { id: "insights", icon: "✧", label: "AI insights" },
  { id: "history", icon: "◷", label: "Water history" },
];

const initialForm = {
  tank_capacity_liters: 50000,
  tank_level_percent: 62,
  consumption_history: initialHistory,
  latitude: 13.55,
  longitude: 78.5,
};

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Panel({ children, className = "", id }) {
  return (
    <section
      id={id}
      className={`rounded-2xl border border-white/10 bg-[#101a28]/65 shadow-[0_12px_50px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-colors hover:border-cyan-300/20 ${className}`}
    >
      {children}
    </section>
  );
}

function Badge({ children, tone = "cyan" }) {
  const styles = {
    cyan: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
    green: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
    amber: "border-amber-300/20 bg-amber-300/10 text-amber-200",
    red: "border-rose-300/20 bg-rose-300/10 text-rose-200",
    slate: "border-white/10 bg-white/5 text-slate-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold ${styles[tone] || styles.cyan}`}
    >
      {children}
    </span>
  );
}

function RiskBadge({ level }) {
  const value = String(level || "WATCH").toUpperCase();

  const tone =
    value === "HIGH" || value === "CRITICAL"
      ? "red"
      : value === "LOW"
        ? "green"
        : "amber";

  return <Badge tone={tone}>{value} RISK</Badge>;
}

function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
            {eyebrow}
          </p>
        )}
        <h2 className="text-lg font-semibold tracking-tight text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-400">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function MetricCard({ label, value, unit, icon, detail, tone = "cyan" }) {
  const iconStyles = {
    cyan: "bg-cyan-300/10 text-cyan-200",
    green: "bg-emerald-300/10 text-emerald-200",
    amber: "bg-amber-300/10 text-amber-200",
    violet: "bg-violet-300/10 text-violet-200",
  };

  return (
    <Panel className="group p-5 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-slate-400">{label}</p>
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl text-lg ${iconStyles[tone]}`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-5 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tracking-tight text-white">
          {value}
        </span>
        {unit && <span className="text-xs text-slate-400">{unit}</span>}
      </div>
      <p className="mt-3 text-[11px] text-slate-500">{detail}</p>
    </Panel>
  );
}

function WaterGauge({ percent }) {
  const amount = Math.max(0, Math.min(100, Number(percent) || 0));
  const color =
    amount <= 20 ? "#fb7185" : amount <= 40 ? "#fbbf24" : "#22d3ee";

  return (
    <div className="relative mx-auto grid h-44 w-44 place-items-center">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
        <circle
          cx="90"
          cy="90"
          r="72"
          fill="none"
          stroke="rgba(148,163,184,0.12)"
          strokeWidth="12"
        />
        <circle
          cx="90"
          cy="90"
          r="72"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(amount / 100) * 452.39} 452.39`}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-semibold text-white">
          {Math.round(amount)}
          <span className="text-xl">%</span>
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">
          Tank capacity
        </p>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/10 p-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-lg text-cyan-200">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-500">{label}</p>
        <p className="mt-1 truncate text-sm font-semibold text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [activeTab, setActiveTab] = useState("overview");
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [heatIndex, setHeatIndex] = useState(34);
  const [chartMode, setChartMode] = useState("usage");
  const [backgroundMode, setBackgroundMode] = useState("storm");

  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const loadWeather = useCallback(async () => {
    setWeatherLoading(true);
    setWeatherError("");

    try {
      const params = new URLSearchParams({
        latitude: String(form.latitude),
        longitude: String(form.longitude),
      });

      const response = await fetch(
        `http://127.0.0.1:8000/weather/forecast?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Weather API returned ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setWeatherError(err.message || "Unable to load weather.");
    } finally {
      setWeatherLoading(false);
    }
  }, [form.latitude, form.longitude]);

  const loadWaterHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/water/history");

      if (!response.ok) {
        throw new Error(`History API returned ${response.status}`);
      }

      const data = await response.json();
      setHistoryData(data.history || []);
    } catch (err) {
      setHistoryError(err.message || "Unable to load water history.");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "CURE — Climate & Utility Risk Engine";
    loadWeather();
    loadWaterHistory();
  }, [loadWeather, loadWaterHistory]);

  const averageConsumption = useMemo(() => {
    const values = form.consumption_history.map(Number);
    return (
      values.reduce((sum, value) => sum + value, 0) /
      Math.max(values.length, 1)
    );
  }, [form.consumption_history]);

  const availableWater =
    (Number(form.tank_capacity_liters) * Number(form.tank_level_percent)) / 100;

  const estimatedRunway =
    averageConsumption > 0 ? availableWater / averageConsumption : 0;

  const heatAdjustment = Math.max(0, (heatIndex - 28) * 1.8);

  const adjustedRunway = estimatedRunway / (1 + heatAdjustment / 100);

  const localRisk =
    adjustedRunway <= 2 ? "HIGH" : adjustedRunway <= 4 ? "WATCH" : "LOW";

  const riskLevel = riskData?.risk_level || localRisk;

  const predictedDemand =
    riskData?.predicted_daily_demand_liters ?? null;

  const demandForecast = Array.isArray(riskData?.demand_forecast)
    ? riskData.demand_forecast
    : [];

  const demandPredictionStatus =
    riskData?.demand_prediction_status || "NOT_RUN";

  const runway =
    riskData?.water_runway_days ??
    riskData?.runway_days ??
    Number(adjustedRunway.toFixed(1));

  const displayedHeatAdjustment =
    riskData?.heat_adjustment_percent ?? Number(heatAdjustment.toFixed(1));

  const formatNumber = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);

  const activeTitle =
    navItems.find((item) => item.id === activeTab)?.label || "Overview";

  const currentTime = lastUpdated
    ? lastUpdated.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not synced";

  const chartData = form.consumption_history.map((usage, index) => ({
    day: dayNames[index],
    usage: Number(usage),
    previous: [6800, 7200, 7500, 7300, 7100, 6900, 7200][index],
  }));

  const aiAdvice =
    riskData?.ai_advice ||
    riskData?.recommendation ||
    (localRisk === "HIGH"
      ? "Your current estimate indicates limited water reserves. Prioritize essential use, check for leaks, and plan replenishment."
      : localRisk === "WATCH"
        ? "Your water reserve needs attention. Review high-consumption activities and prepare a replenishment plan."
        : "Your estimated reserve looks relatively stable under the current assumptions. Continue monitoring daily usage and keep a safety buffer.");

  function updateField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setRiskData(null);
  }

  function updateConsumption(index, value) {
    setForm((previous) => ({
      ...previous,
      consumption_history: previous.consumption_history.map((item, i) =>
        i === index ? Number(value) : item
      ),
    }));
    setRiskData(null);
  }

  async function runAnalysis() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tank_capacity_liters: Number(form.tank_capacity_liters),
          tank_level_percent: Number(form.tank_level_percent),
          consumption_history: form.consumption_history.map(Number),
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || `API returned ${response.status}`
        );
      }

      setRiskData(data);
      setLastUpdated(new Date());
      await loadWaterHistory();
    } catch (err) {
      setError(
        `${err.message}. The dashboard is showing locally calculated estimates.`
      );
    } finally {
      setLoading(false);
    }
  }

  const isOverview = activeTab === "overview";
  const isWater = activeTab === "water";
  const isClimate = activeTab === "climate";
  const isInsights = activeTab === "insights";
  const isHistory = activeTab === "history";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080e18] text-slate-100 selection:bg-cyan-300/20">
      {/* Animated atmospheric layer */}
      <WeatherBackground mode={backgroundMode} />

      {/* Dashboard remains above the background */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1800px]">
        <aside className="hidden w-[248px] shrink-0 flex-col border-r border-white/[0.08] bg-[#09111e]/55 px-5 py-6 backdrop-blur-xl lg:flex">
          <button
            onClick={() => setActiveTab("overview")}
            className="mb-10 flex items-center gap-3 text-left"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-2xl text-cyan-200">
              ◈
            </span>
            <span>
              <span className="block text-lg font-bold tracking-[0.16em] text-white">
                CURE<span className="text-cyan-300">.</span>
              </span>
              <span className="mt-0.5 block text-[9px] tracking-[0.16em] text-slate-400">
                CLIMATE INTELLIGENCE
              </span>
            </span>
          </button>

          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </p>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-medium transition ${
                  activeTab === item.id
                    ? "border border-cyan-300/15 bg-cyan-300/[0.12] text-cyan-100"
                    : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-9">
            <p className="mb-4 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
              System status
            </p>
            <div className="space-y-4 px-3">
              {[
                ["Water system", "Active", "bg-emerald-400"],
                ["Risk engine", "Ready", "bg-cyan-400"],
                [
                  "API connection",
                  riskData ? "Synced" : "Local",
                  riskData ? "bg-emerald-400" : "bg-amber-400",
                ],
              ].map(([label, value, dot]) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-xs text-slate-300"
                >
                  <span className={`h-2 w-2 rounded-full ${dot}`} />
                  {label}
                  <span className="ml-auto text-[10px] text-slate-400">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/10 to-blue-400/[0.04] p-4">
            <span className="text-xl text-cyan-200">✧</span>
            <p className="mt-3 text-sm font-semibold text-white">
              Build a resilient future.
            </p>
            <p className="mt-2 text-[11px] leading-5 text-slate-300">
              Turn climate signals into smarter resource decisions.
            </p>
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" />
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#080e18]/60 px-4 py-4 backdrop-blur-2xl sm:px-7 xl:px-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>Workspace</span>
                  <span>/</span>
                  <span className="text-cyan-200">{activeTitle}</span>
                </div>
                <h1 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {isOverview ? "Environmental overview" : activeTitle}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <select
                  value={backgroundMode}
                  onChange={(e) => setBackgroundMode(e.target.value)}
                  aria-label="Background weather theme"
                  className="max-w-32 rounded-xl border border-white/10 bg-[#101a28]/80 px-2 py-2.5 text-[10px] text-slate-200 outline-none focus:border-cyan-300/40 sm:px-3 sm:text-xs"
                >
                  <option value="storm">Storm ambience</option>
                  <option value="clear">Sunset ambience</option>
                  <option value="heat">Heatwave ambience</option>
                </select>

                <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-black/10 px-3 py-2 sm:flex">
                  <span
                    className={`h-2 w-2 rounded-full ${riskData ? "bg-emerald-400" : "bg-amber-400"}`}
                  />
                  <span className="text-[10px] text-slate-300">
                    {riskData ? `Synced ${currentTime}` : "Preview mode"}
                  </span>
                </div>

                <button
                  onClick={runAnalysis}
                  disabled={loading}
                  className="rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60"
                >
                  {loading ? "Analyzing…" : "↻ Run analysis"}
                </button>
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-0.5 lg:hidden">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`shrink-0 rounded-lg px-3 py-2 text-[11px] ${
                    activeTab === item.id
                      ? "bg-cyan-300/15 text-cyan-100"
                      : "bg-black/20 text-slate-300"
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </header>

          <div className="space-y-7 px-4 py-6 sm:px-7 xl:px-10">
            {error && (
              <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-amber-300/20 bg-[#30230f]/80 p-4 backdrop-blur-xl">
                <div>
                  <p className="text-sm font-semibold text-amber-200">
                    API connection notice
                  </p>
                  <p className="mt-1 text-xs leading-5 text-amber-100/80">
                    {error}
                  </p>
                </div>
                <button
                  onClick={() => setError("")}
                  className="text-xs text-amber-200"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">
                  Your environment, at a glance
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Water availability · Consumption patterns · Climate pressure
                </p>
              </div>
              <Badge tone="slate">
                DEMO LOCATION · {form.latitude}, {form.longitude}
              </Badge>
            </div>

            {(isOverview || isWater) && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                  <MetricCard
                    label="Available water"
                    value={formatNumber(availableWater)}
                    unit="L"
                    icon="≈"
                    tone="cyan"
                    detail={`${form.tank_level_percent}% of tank capacity`}
                  />
                  <MetricCard
                    label="Water runway"
                    value={Number(runway).toFixed(1)}
                    unit="days"
                    icon="◷"
                    tone="green"
                    detail="Based on daily consumption"
                  />
                  <MetricCard
                    label="Average daily use"
                    value={formatNumber(averageConsumption)}
                    unit="L/day"
                    icon="↗"
                    tone="violet"
                    detail="Based on seven input values"
                  />
                  <MetricCard
                    label="Heat adjustment"
                    value={Number(displayedHeatAdjustment).toFixed(1)}
                    unit="%"
                    icon="☼"
                    tone="amber"
                    detail={`Simulation temperature: ${heatIndex}°C`}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[1.4fr_0.8fr]">
                  <Panel className="overflow-hidden">
                    <div className="flex flex-wrap items-start justify-between gap-3 p-5 sm:p-6">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
                          Resource analytics
                        </p>
                        <h2 className="mt-2 text-lg font-semibold text-white">
                          Water consumption
                        </h2>
                        <p className="mt-1 text-xs text-slate-300">
                          Daily usage across your monitoring window
                        </p>
                      </div>

                      <div className="flex rounded-lg border border-white/[0.08] bg-black/20 p-1">
                        {["usage", "compare"].map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setChartMode(mode)}
                            className={`rounded-md px-3 py-1.5 text-[10px] capitalize ${
                              chartMode === mode
                                ? "bg-cyan-300/15 text-cyan-100"
                                : "text-slate-300"
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-[270px] w-full px-2 pb-3 sm:px-5">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{ top: 12, right: 10, left: -15, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="cureUsageFill"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#22d3ee"
                                stopOpacity={0.35}
                              />
                              <stop
                                offset="100%"
                                stopColor="#22d3ee"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            stroke="rgba(148,163,184,0.13)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="day"
                            tick={{ fill: "#cbd5e1", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                          />
                          <YAxis
                            tick={{ fill: "#cbd5e1", fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `${value / 1000}k`}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "#101a28",
                              border: "1px solid rgba(148,163,184,0.2)",
                              borderRadius: 12,
                              color: "#f1f5f9",
                              fontSize: 12,
                            }}
                            formatter={(value) => [
                              `${formatNumber(value)} L`,
                              "",
                            ]}
                          />
                          {chartMode === "compare" && (
                            <Area
                              type="monotone"
                              dataKey="previous"
                              stroke="#a5b4fc"
                              fill="#818cf8"
                              fillOpacity={0.04}
                              strokeDasharray="4 4"
                              strokeWidth={1.5}
                            />
                          )}
                          <Area
                            type="monotone"
                            dataKey="usage"
                            stroke="#67e8f9"
                            strokeWidth={2.5}
                            fill="url(#cureUsageFill)"
                            activeDot={{
                              r: 5,
                              fill: "#67e8f9",
                              stroke: "#0f172a",
                              strokeWidth: 2,
                            }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="border-t border-white/[0.08] px-5 py-4 text-[10px] text-slate-300">
                      {chartMode === "compare"
                        ? "Comparison series is an illustrative baseline."
                        : "Daily consumption from the editable input values."}
                    </div>
                  </Panel>

                  <Panel className="p-5 sm:p-6">
                    <SectionTitle
                      eyebrow="Live reserve estimate"
                      title="Water reserve"
                      description="Adjust your tank level to update the local estimate."
                      action={<RiskBadge level={riskLevel} />}
                    />

                    <WaterGauge percent={form.tank_level_percent} />

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-300">Tank fill level</span>
                      <span className="font-semibold text-cyan-100">
                        {form.tank_level_percent}%
                      </span>
                    </div>

                    <input
                      aria-label="Tank fill percentage"
                      type="range"
                      min="0"
                      max="100"
                      value={form.tank_level_percent}
                      onChange={(e) =>
                        updateField("tank_level_percent", Number(e.target.value))
                      }
                      className="mt-3 w-full cursor-pointer accent-cyan-300"
                    />

                    <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                      <span>Empty</span>
                      <span>Half full</span>
                      <span>Full</span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <MiniStat
                        label="Available reserve"
                        value={`${formatNumber(availableWater)} L`}
                        icon="◉"
                      />
                      <MiniStat
                        label="Estimated runway"
                        value={`${Number(runway).toFixed(1)} days`}
                        icon="◷"
                      />
                    </div>
                  </Panel>
                </div>
              </>
            )}

            {/* Smart Demand Prediction */}
            {(isOverview || isWater) && (
              <Panel className="p-5 sm:p-6">
                <SectionTitle
                  eyebrow="Predictive intelligence"
                  title="Smart Demand Prediction"
                  description="Seven-day water demand forecast generated from consumption history."
                  action={
                    <Badge
                      tone={
                        demandPredictionStatus === "SUCCESS"
                          ? "green"
                          : "slate"
                      }
                    >
                      {demandPredictionStatus === "SUCCESS"
                        ? "Forecast ready"
                        : "Run analysis"}
                    </Badge>
                  }
                />

                {demandPredictionStatus === "SUCCESS" &&
                demandForecast.length > 0 ? (
                  <>
                    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <MetricCard
                        label="Predicted daily demand"
                        value={formatNumber(predictedDemand ?? 0)}
                        unit="L/day"
                        icon="↗"
                        tone="cyan"
                        detail="Weighted forecast from recent consumption"
                      />

                      <MetricCard
                        label="Total forecast demand"
                        value={formatNumber(
                          demandForecast.reduce(
                            (total, item) =>
                              total + Number(item.predicted_demand_liters || 0),
                            0
                          )
                        )}
                        unit="L / 7 days"
                        icon="≈"
                        tone="violet"
                        detail="Estimated demand across the forecast period"
                      />
                    </div>

                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={demandForecast}
                          margin={{ top: 12, right: 12, left: -12, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="cureDemandFill"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#22d3ee"
                                stopOpacity={0.35}
                              />
                              <stop
                                offset="100%"
                                stopColor="#22d3ee"
                                stopOpacity={0.02}
                              />
                            </linearGradient>
                          </defs>

                          <CartesianGrid
                            stroke="rgba(148,163,184,0.13)"
                            vertical={false}
                          />

                          <XAxis
                            dataKey="day"
                            tick={{ fill: "#cbd5e1", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(day) => `Day ${day}`}
                          />

                          <YAxis
                            tick={{ fill: "#cbd5e1", fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `${value / 1000}k`}
                          />

                          <Tooltip
                            contentStyle={{
                              background: "#101a28",
                              border: "1px solid rgba(148,163,184,0.2)",
                              borderRadius: 12,
                              color: "#f1f5f9",
                              fontSize: 12,
                            }}
                            formatter={(value) => [
                              `${formatNumber(Number(value))} L`,
                              "Predicted demand",
                            ]}
                            labelFormatter={(day) => `Day ${day}`}
                          />

                          <Area
                            type="monotone"
                            dataKey="predicted_demand_liters"
                            name="Predicted demand"
                            stroke="#67e8f9"
                            strokeWidth={2.5}
                            fill="url(#cureDemandFill)"
                            activeDot={{
                              r: 5,
                              fill: "#67e8f9",
                              stroke: "#0f172a",
                              strokeWidth: 2,
                            }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <p className="mt-4 text-[10px] leading-5 text-slate-400">
                      This baseline forecast assumes daily demand remains constant
                      across the seven-day period. Actual consumption may vary.
                    </p>
                  </>
                ) : (
                  <div className="rounded-xl border border-white/[0.08] bg-black/10 px-4 py-8 text-center">
                    <p className="text-sm font-medium text-white">
                      No demand forecast available yet
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      Run a water-risk analysis to generate the seven-day demand forecast.
                    </p>
                    <button
                      onClick={runAnalysis}
                      disabled={loading}
                      className="mt-4 rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-200 disabled:opacity-50"
                    >
                      {loading ? "Analyzing..." : "Generate forecast"}
                    </button>
                  </div>
                )}
              </Panel>
            )}

            {(isOverview || isClimate) && (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {/* Live Weather Monitor */}
                <Panel className="p-5 sm:p-6 xl:col-span-2">
                  <SectionTitle
                    eyebrow="Live climate intelligence"
                    title="Current Weather & Forecast"
                    description={`Weather conditions for ${form.latitude}, ${form.longitude}`}
                    action={
                      <button
                        onClick={loadWeather}
                        disabled={weatherLoading}
                        className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold text-cyan-100 hover:bg-cyan-300/20 disabled:opacity-50"
                      >
                        {weatherLoading ? "Refreshing..." : "↻ Refresh weather"}
                      </button>
                    }
                  />

                  {weatherError && (
                    <div className="mb-4 rounded-xl border border-rose-300/20 bg-rose-300/5 p-3 text-xs text-rose-200">
                      {weatherError}
                    </div>
                  )}

                  {weatherLoading && !weatherData && (
                    <p className="py-8 text-center text-sm text-slate-400">
                      Loading live weather data...
                    </p>
                  )}

                  {weatherData?.current && (
                    <>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricCard
                          label="Temperature"
                          value={weatherData.current.temperature_c ?? "—"}
                          unit="°C"
                          icon="☼"
                          detail="Current air temperature"
                          tone="amber"
                        />

                        <MetricCard
                          label="Feels like"
                          value={weatherData.current.feels_like_c ?? "—"}
                          unit="°C"
                          icon="♨"
                          detail="Apparent temperature"
                          tone="violet"
                        />

                        <MetricCard
                          label="Humidity"
                          value={weatherData.current.humidity_percent ?? "—"}
                          unit="%"
                          icon="≋"
                          detail="Relative humidity"
                          tone="cyan"
                        />

                        <MetricCard
                          label="Wind speed"
                          value={weatherData.current.wind_speed_kmh ?? "—"}
                          unit="km/h"
                          icon="↝"
                          detail="Current wind speed"
                          tone="green"
                        />
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <MiniStat
                          label="Current precipitation"
                          value={`${weatherData.current.precipitation_mm ?? "—"} mm`}
                          icon="☂"
                        />

                        <MiniStat
                          label="UV index · Daily maximum"
                          value={
                            weatherData.daily?.uv_index_max?.[0] ?? "—"
                          }
                          icon="☀"
                        />
                      </div>

                      {weatherData.daily?.dates?.length > 0 && (
                        <div className="mt-7 border-t border-white/[0.08] pt-6">
                          <div className="mb-4">
                            <h3 className="text-sm font-semibold text-white">
                              7-Day Temperature Forecast
                            </h3>
                            <p className="mt-1 text-xs text-slate-400">
                              Forecast maximum and minimum temperatures in °C
                            </p>
                          </div>

                          <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={weatherData.daily.dates.map((date, index) => ({
                                  day: new Date(
                                    `${date}T12:00:00`
                                  ).toLocaleDateString("en-IN", {
                                    weekday: "short",
                                    day: "numeric",
                                  }),
                                  maximum:
                                    weatherData.daily.max_temperatures_c?.[index] ?? null,
                                  minimum:
                                    weatherData.daily.min_temperatures_c?.[index] ?? null,
                                }))}
                              >
                                <defs>
                                  <linearGradient
                                    id="cureMaxTemperature"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor="#fb923c"
                                      stopOpacity={0.3}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor="#fb923c"
                                      stopOpacity={0}
                                    />
                                  </linearGradient>
                                </defs>

                                <CartesianGrid
                                  stroke="rgba(148,163,184,0.13)"
                                  vertical={false}
                                />

                                <XAxis
                                  dataKey="day"
                                  tick={{ fill: "#cbd5e1", fontSize: 10 }}
                                  axisLine={false}
                                  tickLine={false}
                                />

                                <YAxis
                                  unit="°"
                                  tick={{ fill: "#cbd5e1", fontSize: 10 }}
                                  axisLine={false}
                                  tickLine={false}
                                />

                                <Tooltip
                                  contentStyle={{
                                    background: "#101a28",
                                    border: "1px solid rgba(148,163,184,0.2)",
                                    borderRadius: 12,
                                    color: "#f1f5f9",
                                    fontSize: 12,
                                  }}
                                  formatter={(value, name) => [
                                    `${value ?? "—"}°C`,
                                    name === "maximum" ? "Maximum" : "Minimum",
                                  ]}
                                />

                                <Area
                                  type="monotone"
                                  dataKey="maximum"
                                  name="maximum"
                                  stroke="#fb923c"
                                  strokeWidth={2.5}
                                  fill="url(#cureMaxTemperature)"
                                  connectNulls={false}
                                />

                                <Area
                                  type="monotone"
                                  dataKey="minimum"
                                  name="minimum"
                                  stroke="#67e8f9"
                                  strokeWidth={2}
                                  fill="transparent"
                                  connectNulls={false}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      <p className="mt-4 text-[10px] text-slate-500">
                        Latest weather observation: {weatherData.current.time ?? "Unavailable"}.
                        Forecast values may change as new weather data becomes available.
                      </p>
                    </>
                  )}
                </Panel>

                <Panel className="p-5 sm:p-6">
                  <SectionTitle
                    eyebrow="Climate monitor"
                    title="Heat stress simulator"
                    description="Explore how temperature assumptions change the estimate."
                    action={<span className="text-2xl text-amber-200">☼</span>}
                  />

                  <div className="rounded-xl border border-amber-200/15 bg-gradient-to-r from-amber-300/10 to-rose-400/10 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-slate-300">Simulated temperature</p>
                        <p className="mt-2 text-4xl font-semibold text-white">
                          {heatIndex}
                          <span className="text-xl text-amber-200">°C</span>
                        </p>
                      </div>
                      <Badge tone={heatIndex >= 38 ? "red" : heatIndex >= 33 ? "amber" : "green"}>
                        {heatIndex >= 38 ? "Extreme heat" : heatIndex >= 33 ? "Elevated heat" : "Moderate"}
                      </Badge>
                    </div>

                    <input
                      aria-label="Simulated temperature"
                      type="range"
                      min="20"
                      max="45"
                      value={heatIndex}
                      onChange={(e) => {
                        setHeatIndex(Number(e.target.value));
                        setRiskData(null);
                      }}
                      className="mt-6 w-full cursor-pointer accent-amber-300"
                    />

                    <div className="mt-2 flex justify-between text-[10px] text-slate-300">
                      <span>20°C</span>
                      <span>32°C</span>
                      <span>45°C</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <MiniStat label="Estimated heat adjustment" value={`${heatAdjustment.toFixed(1)}%`} icon="↗" />
                    <MiniStat label="Adjusted runway" value={`${adjustedRunway.toFixed(1)} days`} icon="◷" />
                  </div>

                  <p className="mt-4 text-[10px] leading-5 text-slate-400">
                    The temperature adjustment is an illustrative model, not a measured forecast.
                  </p>
                </Panel>

                <Panel className="p-5 sm:p-6">
                  <SectionTitle
                    eyebrow="Risk intelligence"
                    title="Environmental status"
                    description="An at-a-glance view of the current model estimates."
                  />

                  <div className="space-y-3">
                    <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-black/10 p-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-300/10 text-xl text-cyan-200">≈</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">Water availability</p>
                        <p className="mt-1 text-[11px] text-slate-300">Tank capacity and level estimate</p>
                      </div>
                      <RiskBadge level={riskLevel} />
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-black/10 p-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-300/10 text-xl text-amber-200">☼</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">Heat exposure</p>
                        <p className="mt-1 text-[11px] text-slate-300">Adjustable temperature assumption</p>
                      </div>
                      <Badge tone={heatIndex >= 38 ? "red" : heatIndex >= 33 ? "amber" : "green"}>
                        {heatIndex >= 38 ? "High" : heatIndex >= 33 ? "Elevated" : "Moderate"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-black/10 p-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-300/10 text-xl text-emerald-200">⌁</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">Consumption profile</p>
                        <p className="mt-1 text-[11px] text-slate-300">Based on entered consumption history</p>
                      </div>
                      <Badge tone="cyan">Tracking</Badge>
                    </div>
                  </div>
                </Panel>
              </div>
            )}

            {(isOverview || isWater) && (
              <Panel className="p-5 sm:p-6">
                <SectionTitle
                  eyebrow="Planning workspace"
                  title="Configure your water system"
                  description="Edit the assumptions used by the local estimator and backend."
                />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <label className="block">
                    <span className="text-xs text-slate-300">Tank capacity (liters)</span>
                    <input
                      type="number"
                      min="1"
                      value={form.tank_capacity_liters}
                      onChange={(e) => updateField("tank_capacity_liters", Math.max(1, Number(e.target.value)))}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a111c]/80 px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs text-slate-300">Latitude</span>
                    <input
                      type="number"
                      step="0.01"
                      value={form.latitude}
                      onChange={(e) => updateField("latitude", Number(e.target.value))}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a111c]/80 px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs text-slate-300">Longitude</span>
                    <input
                      type="number"
                      step="0.01"
                      value={form.longitude}
                      onChange={(e) => updateField("longitude", Number(e.target.value))}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a111c]/80 px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
                    />
                  </label>
                </div>

                <div className="mt-6 border-t border-white/[0.08] pt-6">
                  <p className="text-xs font-semibold text-white">
                    7-day consumption history (liters/day)
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Modify daily usage values to simulate different patterns.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
                    {form.consumption_history.map((val, idx) => (
                      <div key={idx} className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <span className="text-[10px] font-bold text-cyan-300">
                          {dayNames[idx]}
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={val}
                          onChange={(e) => updateConsumption(idx, e.target.value)}
                          className="mt-2 w-full rounded-lg border border-white/10 bg-[#080e18] px-2.5 py-2 text-center text-xs font-semibold text-white outline-none focus:border-cyan-300/40"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            )}

            {isHistory && (
              <Panel className="p-5 sm:p-6">
                <SectionTitle
                  eyebrow="Database records"
                  title="Water history log"
                  description={`${historyData.length} saved water-risk records`}
                  action={
                    <button
                      onClick={loadWaterHistory}
                      disabled={historyLoading}
                      className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold text-cyan-100 disabled:opacity-50"
                    >
                      {historyLoading ? "Loading..." : "↻ Refresh"}
                    </button>
                  }
                />

                {historyError && (
                  <p className="mb-4 rounded-xl border border-rose-300/20 p-3 text-xs text-rose-200">
                    {historyError}
                  </p>
                )}

                {historyLoading && historyData.length === 0 && (
                  <p className="py-6 text-center text-sm text-slate-400">
                    Loading saved records...
                  </p>
                )}

                {!historyLoading && historyData.length === 0 && !historyError && (
                  <p className="py-6 text-center text-sm text-slate-400">
                    No saved water-risk records yet. Run an analysis first.
                  </p>
                )}

                <div className="space-y-3">
                  {historyData.map((record) => (
                    <div
                      key={record.id}
                      className="rounded-xl border border-white/[0.08] bg-black/10 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            Record #{record.id}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400">
                            {record.created_at
                              ? new Date(record.created_at).toLocaleString()
                              : "Date unavailable"}
                          </p>
                        </div>
                        <RiskBadge level={record.risk_level} />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <MiniStat
                          label="Available water"
                          value={`${Number(record.available_water_liters || 0).toLocaleString("en-IN")} L`}
                          icon="≈"
                        />
                        <MiniStat
                          label="Daily consumption"
                          value={`${Number(record.average_daily_consumption_liters || 0).toLocaleString("en-IN")} L`}
                          icon="↗"
                        />
                        <MiniStat
                          label="Water runway"
                          value={
                            record.water_runway_days == null
                              ? "Unknown"
                              : `${Number(record.water_runway_days).toFixed(1)} days`
                          }
                          icon="◷"
                        />
                        <MiniStat
                          label="Maximum temperature"
                          value={
                            record.max_temperature_c == null
                              ? "—"
                              : `${record.max_temperature_c}°C`
                          }
                          icon="☼"
                        />
                      </div>

                      <p className="mt-4 text-xs leading-5 text-slate-300">
                        {record.risk_reason || record.recommendation || "No explanation saved."}
                      </p>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {(isOverview || isInsights) && (
              <Panel className="p-5 sm:p-6">
                <SectionTitle
                  eyebrow="Intelligence console"
                  title="AI & Ollama Advisory"
                  description="Grounded guidance synthesized from your climate and tank telemetry."
                  action={<Badge tone="cyan">Active model</Badge>}
                />

                <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.04] p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200">
                      ✧
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        CURE Synthesis Engine
                      </p>
                      <p className="text-[11px] text-cyan-300/80">
                        Status: Ready & Operational
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 whitespace-pre-line text-xs leading-6 text-slate-200">
                    {aiAdvice}
                  </p>
                </div>
              </Panel>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}