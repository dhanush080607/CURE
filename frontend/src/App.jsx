
import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const API_URL = "http://127.0.0.1:8000/water/risk";

const initialHistory = [7200, 7600, 7400, 8000, 7300, 7700, 7500];

const initialForm = {
  tank_capacity_liters: 50000,
  tank_level_percent: 62,
  consumption_history: initialHistory,
  latitude: 13.55,
  longitude: 78.5,
};

const navItems = [
  { id: "overview", icon: "◫", label: "Overview" },
  { id: "water", icon: "≈", label: "Water intelligence" },
  { id: "climate", icon: "☼", label: "Climate monitor" },
  { id: "insights", icon: "✧", label: "AI insights" },
];

const consumptionData = [
  { day: "Mon", usage: 7200, previous: 6800 },
  { day: "Tue", usage: 7600, previous: 7200 },
  { day: "Wed", usage: 7400, previous: 7500 },
  { day: "Thu", usage: 8000, previous: 7300 },
  { day: "Fri", usage: 7300, previous: 7100 },
  { day: "Sat", usage: 7700, previous: 6900 },
  { day: "Sun", usage: 7500, previous: 7200 },
];

const forecastData = [
  { day: "Today", usage: 7500, available: 31000 },
  { day: "Tue", usage: 7300, available: 23500 },
  { day: "Wed", usage: 7900, available: 15600 },
  { day: "Thu", usage: 7200, available: 8400 },
  { day: "Fri", usage: 7000, available: 1400 },
  { day: "Sat", usage: 6800, available: 0 },
  { day: "Sun", usage: 6900, available: 0 },
];

function Icon({ children, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center ${className}`}
    >
      {children}
    </span>
  );
}

function Panel({ children, className = "", id }) {
  return (
    <section
      id={id}
      className={`rounded-2xl border border-white/[0.08] bg-[#101a28]/90 shadow-[0_10px_40px_rgba(0,0,0,0.12)] ${className}`}
    >
      {children}
    </section>
  );
}

function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
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

function Badge({ children, tone = "cyan" }) {
  const tones = {
    cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    green: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    amber: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    red: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    slate: "border-white/10 bg-white/5 text-slate-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold ${tones[tone] || tones.cyan}`}
    >
      {children}
    </span>
  );
}

function MetricCard({ label, value, unit, change, icon, tone = "cyan", detail }) {
  const iconTones = {
    cyan: "bg-cyan-400/10 text-cyan-300",
    green: "bg-emerald-400/10 text-emerald-300",
    amber: "bg-amber-400/10 text-amber-300",
    violet: "bg-violet-400/10 text-violet-300",
  };

  return (
    <Panel className="group p-5 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/20">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <span className={`grid h-9 w-9 place-items-center rounded-xl text-lg ${iconTones[tone]}`}>
          {icon}
        </span>
      </div>
      <div className="mt-5 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tracking-tight text-white">
          {value}
        </span>
        {unit && <span className="text-xs text-slate-400">{unit}</span>}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-500">{detail}</span>
        {change && (
          <span className="text-[10px] font-semibold text-cyan-300">
            {change}
          </span>
        )}
      </div>
    </Panel>
  );
}

function RiskBadge({ level }) {
  const normalized = String(level || "WATCH").toUpperCase();
  const tone =
    normalized === "HIGH" || normalized === "CRITICAL"
      ? "red"
      : normalized === "LOW"
        ? "green"
        : "amber";

  return <Badge tone={tone}>{normalized} RISK</Badge>;
}

function WaterGauge({ percent }) {
  const clamped = Math.max(0, Math.min(100, Number(percent) || 0));
  const color =
    clamped <= 20 ? "#fb7185" : clamped <= 40 ? "#fbbf24" : "#22d3ee";

  return (
    <div className="relative mx-auto grid h-44 w-44 place-items-center">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
        <circle
          cx="90"
          cy="90"
          r="72"
          fill="none"
          stroke="rgba(148,163,184,0.10)"
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
          strokeDasharray={`${(clamped / 100) * 452.39} 452.39`}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-semibold tracking-tight text-white">
          {Math.round(clamped)}<span className="text-xl">%</span>
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
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-lg text-cyan-300">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-500">{label}</p>
        <p className="mt-1 truncate text-sm font-semibold text-slate-200">{value}</p>
      </div>
    </div>
  );
}

function App() {
  const [form, setForm] = useState(initialForm);
  const [activeTab, setActiveTab] = useState("overview");
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [heatIndex, setHeatIndex] = useState(34);
  const [chartMode, setChartMode] = useState("usage");
  const [notifications, setNotifications] = useState(true);

  const averageConsumption = useMemo(() => {
    const values = form.consumption_history;
    return values.reduce((sum, value) => sum + Number(value || 0), 0) /
      Math.max(values.length, 1);
  }, [form.consumption_history]);

  const waterAvailable =
    (Number(form.tank_capacity_liters) *
      Number(form.tank_level_percent)) /
    100;

  const estimatedRunway =
    averageConsumption > 0 ? waterAvailable / averageConsumption : 0;

  const heatAdjustment = Math.max(0, (heatIndex - 28) * 1.8);
  const adjustedRunway = estimatedRunway / (1 + heatAdjustment / 100);

  const localRisk =
    adjustedRunway <= 2
      ? "HIGH"
      : adjustedRunway <= 4
        ? "WATCH"
        : "LOW";

  const riskLevel = riskData?.risk_level || localRisk;
  const runway =
    riskData?.water_runway_days ??
    riskData?.runway_days ??
    Number(adjustedRunway.toFixed(1));

  const displayedHeatAdjustment =
    riskData?.heat_adjustment_percent ?? Number(heatAdjustment.toFixed(1));

  const liters = Math.max(0, waterAvailable);
  const formatLiters = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);

  const currentTime = lastUpdated
    ? lastUpdated.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not synced";

  const chartData = consumptionData.map((item, index) => ({
    ...item,
    usage: Number(form.consumption_history[index] ?? item.usage),
  }));

  const riskTone =
    String(riskLevel).toUpperCase() === "HIGH" ||
    String(riskLevel).toUpperCase() === "CRITICAL"
      ? "red"
      : String(riskLevel).toUpperCase() === "LOW"
        ? "green"
        : "amber";

  useEffect(() => {
    document.title = "CURE — Climate & Utility Intelligence";
  }, []);

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
    } catch (err) {
      setError(
        `${err.message}. Showing locally calculated estimates until the API is reachable.`
      );
    } finally {
      setLoading(false);
    }
  }

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

  const aiAdvice =
    riskData?.ai_advice ||
    riskData?.recommendation ||
    (localRisk === "HIGH"
      ? "Water reserves are under pressure. Prioritize essential usage, inspect for leaks, and plan replenishment as soon as possible."
      : localRisk === "WATCH"
        ? "Your reserve needs attention. Review high-consumption activities, monitor daily usage, and prepare a replenishment plan."
        : "Current reserves look relatively stable under your entered assumptions. Continue monitoring usage and maintain a replenishment buffer.");

  const activeTitle =
    navItems.find((item) => item.id === activeTab)?.label || "Overview";

  return (
    <div className="min-h-screen bg-[#080e18] text-slate-100 selection:bg-cyan-300/20">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[460px] w-[460px] rounded-full bg-cyan-500/[0.055] blur-[130px]" />
        <div className="absolute right-[-150px] top-[25%] h-[420px] w-[420px] rounded-full bg-blue-500/[0.05] blur-[140px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1800px]">
        <aside className="hidden w-[248px] shrink-0 flex-col border-r border-white/[0.07] bg-[#0b121e]/90 px-5 py-6 lg:flex">
          <button
            onClick={() => setActiveTab("overview")}
            className="mb-10 flex items-center gap-3 text-left"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/20 to-blue-500/10 text-2xl text-cyan-300">
              ◈
            </span>
            <span>
              <span className="block text-lg font-bold tracking-[0.16em] text-white">
                CURE<span className="text-cyan-300">.</span>
              </span>
              <span className="mt-0.5 block text-[9px] tracking-[0.16em] text-slate-500">
                CLIMATE INTELLIGENCE
              </span>
            </span>
          </button>

          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Workspace
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-medium transition ${
                  activeTab === item.id
                    ? "border border-cyan-300/10 bg-cyan-300/[0.09] text-cyan-200"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
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
            <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
              Monitoring
            </p>
            <div className="space-y-4 px-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                Water system
                <span className="ml-auto text-[10px] text-emerald-300">Active</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Risk engine
                <span className="ml-auto text-[10px] text-cyan-300">Ready</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span
                  className={`h-2 w-2 rounded-full ${riskData ? "bg-emerald-400" : "bg-amber-400"}`}
                />
                API connection
                <span className="ml-auto text-[10px] text-slate-500">
                  {riskData ? "Synced" : "Local"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-auto rounded-2xl border border-cyan-300/10 bg-gradient-to-br from-cyan-300/[0.09] to-blue-500/[0.03] p-4">
            <span className="text-xl text-cyan-300">✧</span>
            <p className="mt-3 text-sm font-semibold text-white">
              Build a resilient future.
            </p>
            <p className="mt-2 text-[11px] leading-5 text-slate-400">
              Turn climate signals into smarter everyday decisions.
            </p>
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" />
            </div>
            <p className="mt-2 text-[9px] text-slate-500">
              Climate-aware resource planning
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#080e18]/90 px-4 py-4 backdrop-blur-xl sm:px-7 xl:px-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>Workspace</span>
                  <span>/</span>
                  <span className="text-cyan-300">{activeTitle}</span>
                </div>
                <h1 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {activeTab === "overview"
                    ? "Environmental overview"
                    : activeTitle}
                </h1>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 sm:flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-slate-400">
                    {riskData ? `Synced ${currentTime}` : "Preview mode"}
                  </span>
                </div>
                <button
                  onClick={() => setNotifications((value) => !value)}
                  className={`grid h-10 w-10 place-items-center rounded-xl border text-lg transition ${
                    notifications
                      ? "border-white/10 bg-white/[0.04] text-slate-300 hover:text-white"
                      : "border-amber-300/20 bg-amber-300/10 text-amber-300"
                  }`}
                  title={notifications ? "Mute alert indicator" : "Enable alert indicator"}
                >
                  ♧
                </button>
                <button
                  onClick={runAnalysis}
                  disabled={loading}
                  className="rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-[0_0_25px_rgba(103,232,249,0.10)] transition hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-60"
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
                      ? "bg-cyan-300/10 text-cyan-200"
                      : "bg-white/[0.03] text-slate-400"
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </header>

          <div className="space-y-7 px-4 py-6 sm:px-7 xl:px-10">
            {error && (
              <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4">
                <div>
                  <p className="text-sm font-semibold text-amber-200">
                    API connection notice
                  </p>
                  <p className="mt-1 text-xs leading-5 text-amber-100/70">
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
                <p className="mt-1 text-xs text-slate-500">
                  Water availability · Consumption patterns · Climate pressure
                </p>
              </div>
              <Badge tone="slate">DEMO LOCATION · {form.latitude}, {form.longitude}</Badge>
            </div>

            {(activeTab === "overview" || activeTab === "water") && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                  <MetricCard
                    label="Available water"
                    value={formatLiters(liters)}
                    unit="L"
                    icon="≈"
                    tone="cyan"
                    detail={`${form.tank_level_percent}% of total capacity`}
                    change="Current estimate"
                  />
                  <MetricCard
                    label="Water runway"
                    value={Number(runway).toFixed(1)}
                    unit="days"
                    icon="◷"
                    tone="green"
                    detail="Based on daily usage"
                    change="Forecast"
                  />
                  <MetricCard
                    label="Average daily use"
                    value={formatLiters(averageConsumption)}
                    unit="L/day"
                    icon="↗"
                    tone="violet"
                    detail="7-day consumption inputs"
                    change="Usage profile"
                  />
                  <MetricCard
                    label="Heat adjustment"
                    value={Number(displayedHeatAdjustment).toFixed(1)}
                    unit="%"
                    icon="☼"
                    tone="amber"
                    detail={`Current model input: ${heatIndex}°C`}
                    change="Climate factor"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[1.45fr_0.8fr]">
                  <Panel className="overflow-hidden">
                    <div className="flex flex-wrap items-start justify-between gap-3 p-5 sm:p-6">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                          Resource analytics
                        </p>
                        <h2 className="mt-2 text-lg font-semibold text-white">
                          Water consumption
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                          Daily usage across your monitoring window
                        </p>
                      </div>
                      <div className="flex rounded-lg border border-white/[0.07] bg-white/[0.025] p-1">
                        <button
                          onClick={() => setChartMode("usage")}
                          className={`rounded-md px-3 py-1.5 text-[10px] ${
                            chartMode === "usage"
                              ? "bg-cyan-300/15 text-cyan-200"
                              : "text-slate-500"
                          }`}
                        >
                          Usage
                        </button>
                        <button
                          onClick={() => setChartMode("compare")}
                          className={`rounded-md px-3 py-1.5 text-[10px] ${
                            chartMode === "compare"
                              ? "bg-cyan-300/15 text-cyan-200"
                              : "text-slate-500"
                          }`}
                        >
                          Compare
                        </button>
                      </div>
                    </div>

                    <div className="h-[270px] w-full px-2 pb-3 sm:px-5">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 12, right: 10, left: -15, bottom: 0 }}>
                          <defs>
                            <linearGradient id="usageFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.25} />
                              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
                          <XAxis
                            dataKey="day"
                            tick={{ fill: "#64748b", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                          />
                          <YAxis
                            tick={{ fill: "#64748b", fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `${value / 1000}k`}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "#111d2c",
                              border: "1px solid rgba(148,163,184,0.15)",
                              borderRadius: 12,
                              color: "#e2e8f0",
                              fontSize: 12,
                            }}
                            formatter={(value) => [`${formatLiters(value)} L`, ""]}
                          />
                          {chartMode === "compare" && (
                            <Area
                              type="monotone"
                              dataKey="previous"
                              stroke="#818cf8"
                              fill="#818cf8"
                              fillOpacity={0.04}
                              strokeDasharray="4 4"
                              strokeWidth={1.5}
                            />
                          )}
                          <Area
                            type="monotone"
                            dataKey="usage"
                            stroke="#22d3ee"
                            strokeWidth={2.5}
                            fill="url(#usageFill)"
                            activeDot={{ r: 5, fill: "#67e8f9", stroke: "#0f172a", strokeWidth: 2 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] px-5 py-4">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span className="h-2 w-2 rounded-full bg-cyan-300" />
                        {chartMode === "compare" ? "Current usage" : "Daily consumption"}
                        {chartMode === "compare" && (
                          <>
                            <span className="ml-2 h-2 w-2 rounded-full bg-indigo-400" />
                            Previous period
                          </>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        Illustrative comparison baseline
                      </span>
                    </div>
                  </Panel>

                  <Panel className="p-5 sm:p-6">
                    <SectionTitle
                      eyebrow="Live reserve estimate"
                      title="Water reserve"
                      description="Adjust your tank level to update the estimate."
                      action={<RiskBadge level={riskLevel} />}
                    />
                    <WaterGauge percent={form.tank_level_percent} />

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Tank fill level</span>
                      <span className="font-semibold text-cyan-200">
                        {form.tank_level_percent}%
                      </span>
                    </div>
                    <input
                      aria-label="Tank fill percentage"
                      type="range"
                      min="0"
                      max="100"
                      value={form.tank_level_percent}
                      onChange={(e) => updateField("tank_level_percent", Number(e.target.value))}
                      className="mt-3 w-full cursor-pointer accent-cyan-300"
                    />
                    <div className="mt-2 flex justify-between text-[10px] text-slate-600">
                      <span>Empty</span>
                      <span>Half full</span>
                      <span>Full</span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <MiniStat label="Available reserve" value={`${formatLiters(liters)} L`} icon="◉" />
                      <MiniStat label="Estimated runway" value={`${Number(runway).toFixed(1)} days`} icon="◷" />
                    </div>
                  </Panel>
                </div>
              </>
            )}

            {(activeTab === "overview" || activeTab === "climate") && (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                <Panel className="p-5 sm:p-6">
                  <SectionTitle
                    eyebrow="Climate monitor"
                    title="Heat stress simulator"
                    description="Explore how temperature assumptions affect water pressure."
                    action={<span className="text-2xl text-amber-300">☼</span>}
                  />

                  <div className="rounded-xl border border-amber-300/10 bg-gradient-to-r from-amber-300/[0.08] to-rose-400/[0.03] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-slate-400">Simulated temperature</p>
                        <p className="mt-2 text-4xl font-semibold text-white">
                          {heatIndex}<span className="text-xl text-amber-300">°C</span>
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
                    <div className="mt-2 flex justify-between text-[10px] text-slate-500">
                      <span>20°C</span>
                      <span>32°C</span>
                      <span>45°C</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <MiniStat
                      label="Estimated heat adjustment"
                      value={`${heatAdjustment.toFixed(1)}%`}
                      icon="↗"
                    />
                    <MiniStat
                      label="Adjusted runway"
                      value={`${adjustedRunway.toFixed(1)} days`}
                      icon="◷"
                    />
                  </div>
                  <p className="mt-4 text-[10px] leading-5 text-slate-500">
                    Simulation only: the temperature adjustment is a simple illustrative model,
                    not a measured forecast or validated physical prediction.
                  </p>
                </Panel>

                <Panel className="p-5 sm:p-6">
                  <SectionTitle
                    eyebrow="Risk intelligence"
                    title="Environmental status"
                    description="An at-a-glance view of the current model estimates."
                  />
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 text-xl text-cyan-300">≈</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">Water availability</p>
                        <p className="mt-1 text-[11px] text-slate-500">Calculated from tank capacity and level</p>
                      </div>
                      <RiskBadge level={riskLevel} />
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-400/10 text-xl text-amber-300">☼</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">Heat exposure</p>
                        <p className="mt-1 text-[11px] text-slate-500">Based on the adjustable temperature assumption</p>
                      </div>
                      <Badge tone={heatIndex >= 38 ? "red" : heatIndex >= 33 ? "amber" : "green"}>
                        {heatIndex >= 38 ? "High" : heatIndex >= 33 ? "Elevated" : "Moderate"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-400/10 text-xl text-emerald-300">⌁</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">Consumption profile</p>
                        <p className="mt-1 text-[11px] text-slate-500">Average based on entered history</p>
                      </div>
                      <Badge tone="cyan">Tracking</Badge>
                    </div>
                  </div>
                </Panel>
              </div>
            )}

            {(activeTab === "overview" || activeTab === "water") && (
              <Panel className="p-5 sm:p-6">
                <SectionTitle
                  eyebrow="Planning workspace"
                  title="Configure your water system"
                  description="Edit the assumptions used by the local estimator and backend analysis."
                />
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <label className="block">
                    <span className="text-xs text-slate-400">Tank capacity (liters)</span>
                    <input
                      type="number"
                      min="1"
                      value={form.tank_capacity_liters}
                      onChange={(e) => updateField("tank_capacity_liters", Math.max(1, Number(e.target.value)))}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a111c] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-slate-400">Latitude</span>
                    <input
                      type="number"
                      step="0.01"
                      value={form.latitude}
                      onChange={(e) => updateField("latitude", Number(e.target.value))}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a111c] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-slate-400">Longitude</span>
                    <input
                      type="number"
                      step="0.01"
                      value={form.longitude}
                      onChange={(e) => updateField("longitude", Number(e.target.value))}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a111c] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
                    />
                  </label>
                  <div className="flex items-end">
                    <button
                      onClick={runAnalysis}
                      disabled={loading}
                      className="w-full rounded-xl bg-cyan-300 px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60"
                    >
                      {loading ? "Analyzing system…" : "Analyze my system →"}
                    </button>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/[0.06] pt-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-medium text-slate-300">
                      Daily consumption history
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Edit liters per day to update the estimate
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
                    {form.consumption_history.map((value, index) => (
                      <label key={index} className="block">
                        <span className="mb-1.5 block text-[10px] text-slate-500">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={value}
                          onChange={(e) => updateConsumption(index, Math.max(0, Number(e.target.value)))}
                          className="w-full rounded-lg border border-white/[0.08] bg-[#0a111c] px-2.5 py-2.5 text-xs text-slate-200 outline-none focus:border-cyan-300/40"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </Panel>
            )}

            {(activeTab === "overview" || activeTab === "insights") && (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                <Panel className="relative overflow-hidden p-5 sm:p-6">
                  <div className="pointer-events-none absolute right-[-25px] top-[-40px] h-40 w-40 rounded-full bg-violet-400/[0.08] blur-3xl" />
                  <SectionTitle
                    eyebrow="AI decision support"
                    title="Recommended next steps"
                    description="Guidance based on the current estimate and backend response, when available."
                    action={<span className="grid h-10 w-10 place-items-center rounded-xl border border-violet-300/20 bg-violet-300/10 text-xl text-violet-300">✧</span>}
                  />

                  <div className="relative rounded-xl border border-violet-300/10 bg-gradient-to-br from-violet-300/[0.07] to-cyan-300/[0.03] p-5">
                    <div className="flex items-center gap-2">
                      <Badge tone="cyan">PRIORITY BRIEFING</Badge>
                      <span className="text-[10px] text-slate-500">Water resilience</span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-200">{aiAdvice}</p>
                    <button
                      onClick={runAnalysis}
                      disabled={loading}
                      className="mt-5 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-2.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-300/[0.14] disabled:opacity-50"
                    >
                      {loading ? "Refreshing…" : "Refresh analysis ↗"}
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/[0.06] p-3">
                      <span className="text-[10px] text-slate-500">Action 01</span>
                      <p className="mt-2 text-xs font-medium text-white">Review usage</p>
                      <p className="mt-1 text-[10px] leading-4 text-slate-500">Identify avoidable daily consumption.</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] p-3">
                      <span className="text-[10px] text-slate-500">Action 02</span>
                      <p className="mt-2 text-xs font-medium text-white">Check reserves</p>
                      <p className="mt-1 text-[10px] leading-4 text-slate-500">Verify the actual tank level.</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] p-3">
                      <span className="text-[10px] text-slate-500">Action 03</span>
                      <p className="mt-2 text-xs font-medium text-white">Plan ahead</p>
                      <p className="mt-1 text-[10px] leading-4 text-slate-500">Prepare a replenishment buffer.</p>
                    </div>
                  </div>
                </Panel>

                <Panel className="p-5 sm:p-6">
                  <SectionTitle
                    eyebrow="Resilience planning"
                    title="Runway outlook"
                    description="Illustrative scenario based on a starting reserve and estimated usage."
                  />
                  <div className="mb-5 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div>
                      <p className="text-[10px] text-slate-500">Estimated runway</p>
                      <p className="mt-1 text-2xl font-semibold text-white">
                        {Number(runway).toFixed(1)} <span className="text-xs font-normal text-slate-400">days</span>
                      </p>
                    </div>
                    <RiskBadge level={riskLevel} />
                  </div>

                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={forecastData} margin={{ top: 8, right: 0, left: -22, bottom: 0 }}>
                        <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
                        <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: "#111d2c",
                            border: "1px solid rgba(148,163,184,0.15)",
                            borderRadius: 12,
                            color: "#e2e8f0",
                            fontSize: 11,
                          }}
                        />
                        <Bar dataKey="usage" name="Illustrative usage (L)" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-3 text-[10px] leading-5 text-slate-500">
                    This chart is an illustrative scenario, not a weather-service forecast.
                    Connect your forecast API data before treating it as a prediction.
                  </p>
                </Panel>
              </div>
            )}

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] py-5">
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span className="text-sm text-cyan-300">◈</span>
                <span>CURE · Climate & Utility Risk Engine</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-600">
                <span>Risk engine: {riskData ? "API result" : "Local estimate"}</span>
                <span>Updated: {currentTime}</span>
                <span>Built for a more resilient future</span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
