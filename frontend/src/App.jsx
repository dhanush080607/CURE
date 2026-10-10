import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API_URL = "http://127.0.0.1:8000/water/risk";

const INITIAL_FORM = {
  tank_capacity_liters: 50000,
  tank_level_percent: 62,
  consumption_history: [7200, 7600, 7400, 8000, 7300, 7700, 7500],
  latitude: 13.55,
  longitude: 78.5,
};

const formatNumber = (value, digits = 1) => {
  const n = Number(value);
  return Number.isFinite(n)
    ? n.toLocaleString("en-IN", { maximumFractionDigits: digits })
    : "—";
};

function Panel({ title, subtitle, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-slate-900/65 p-5 shadow-xl shadow-black/10 ${className}`}
    >
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm leading-6 text-slate-400">{subtitle}</p>
      )}
      {children}
    </section>
  );
}

function Metric({ label, value, detail, tone = "cyan" }) {
  const tones = {
    cyan: "border-cyan-300/20",
    green: "border-emerald-300/20",
    amber: "border-amber-300/20",
    red: "border-rose-300/20",
  };

  return (
    <div
      className={`rounded-xl border bg-[#080e1c] p-4 ${
        tones[tone] || tones.cyan
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-3 break-words text-2xl font-semibold text-white">
        {value}
      </p>
      {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
    </div>
  );
}

function RiskBadge({ level }) {
  const value = String(level || "NOT RUN").toUpperCase();

  const color = ["HIGH", "CRITICAL"].includes(value)
    ? "border-rose-400/30 bg-rose-400/10 text-rose-200"
    : ["WATCH", "MEDIUM"].includes(value)
      ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
      : value === "LOW"
        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
        : "border-slate-600 bg-slate-800 text-slate-300";

  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-xs font-bold tracking-wide ${color}`}
    >
      {value}
    </span>
  );
}

export default function App() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const chartData = useMemo(() => {
    const values = Array.isArray(riskData?.consumption_history)
      ? riskData.consumption_history
      : formData.consumption_history;

    return values.map((value, index) => ({
      day: `Day ${index + 1}`,
      consumption: Number(value) || 0,
    }));
  }, [riskData, formData.consumption_history]);

  const updateField = (field, value) => {
    setFormData((old) => ({
      ...old,
      [field]: value === "" ? "" : Number(value),
    }));
  };

  const updateConsumption = (index, value) => {
    setFormData((old) => {
      const history = [...old.consumption_history];
      history[index] = value === "" ? "" : Number(value);

      return { ...old, consumption_history: history };
    });
  };

  async function analyzeRisk(event) {
    event?.preventDefault();
    setErrorMsg("");

    if (!(Number(formData.tank_capacity_liters) > 0)) {
      setErrorMsg("Tank capacity must be greater than zero.");
      return;
    }

    if (
      Number(formData.tank_level_percent) < 0 ||
      Number(formData.tank_level_percent) > 100
    ) {
      setErrorMsg("Tank level must be between 0 and 100%.");
      return;
    }

    if (
      formData.consumption_history.some(
        (value) =>
          value === "" ||
          !Number.isFinite(Number(value)) ||
          Number(value) < 0
      )
    ) {
      setErrorMsg(
        "Enter a valid non-negative value for every consumption day."
      );
      return;
    }

    if (
      !Number.isFinite(Number(formData.latitude)) ||
      Number(formData.latitude) < -90 ||
      Number(formData.latitude) > 90 ||
      !Number.isFinite(Number(formData.longitude)) ||
      Number(formData.longitude) < -180 ||
      Number(formData.longitude) > 180
    ) {
      setErrorMsg("Enter valid latitude and longitude coordinates.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        tank_capacity_liters: Number(formData.tank_capacity_liters),
        tank_level_percent: Number(formData.tank_level_percent),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        consumption_history: formData.consumption_history.map(Number),
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const raw = await response.text();
      let data;

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          "The backend returned an unreadable response. Check its terminal logs."
        );
      }

      if (!response.ok) {
        const detail = data?.detail;

        throw new Error(
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail.map((item) => item.msg).join(", ")
              : `Request failed with HTTP ${response.status}.`
        );
      }

      setRiskData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("CURE risk analysis failed:", error);

      setErrorMsg(
        error instanceof TypeError
          ? "Could not reach the backend. Confirm Uvicorn is running at 127.0.0.1:8000 and CORS is configured."
          : error.message || "Risk analysis failed."
      );
    } finally {
      setLoading(false);
    }
  }

  const level = riskData?.risk_level;
  const runway = riskData?.water_runway_days;

  const waterAvailable =
    (Number(formData.tank_capacity_liters) *
      Number(formData.tank_level_percent)) /
    100;

  const tone =
    level === "HIGH" ? "red" : level === "WATCH" ? "amber" : "cyan";

  return (
    <div className="min-h-screen bg-[#050914] text-slate-100">
      {/* Background lighting */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#050914]/90 backdrop-blur-xl">
        <div className="relative mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-xl text-slate-950">
              💧
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  CURE
                </h1>

                <span className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-200">
                  Risk Engine
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Climate & Utility Risk Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300">
            <span
              className={`h-2 w-2 rounded-full ${
                loading
                  ? "animate-pulse bg-amber-300"
                  : riskData
                    ? "bg-emerald-400"
                    : "bg-slate-500"
              }`}
            />
            {loading
              ? "Analyzing"
              : riskData
                ? "Analysis complete"
                : "Ready to analyze"}
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="mb-7 grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
              Water Intelligence / Operations Overview
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Make every drop
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                count with confidence.
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Assess water availability using tank capacity, recent
              consumption, and location. Results come from your CURE backend.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Last Analysis
            </p>

            <p className="mt-2 text-sm font-medium text-white">
              {lastUpdated
                ? lastUpdated.toLocaleString()
                : "No analysis run yet"}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Weather details appear only when provided by your API response.
            </p>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div
            role="alert"
            className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-100"
          >
            <div>
              <p className="font-semibold">
                Analysis could not be completed
              </p>
              <p className="mt-1 text-rose-100/80">{errorMsg}</p>
            </div>

            <button
              type="button"
              onClick={() => setErrorMsg("")}
              className="rounded-lg px-2 py-1 hover:bg-white/10"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[350px_minmax(0,1fr)]">
          {/* Input panel */}
          <form
            onSubmit={analyzeRisk}
            className="h-fit rounded-2xl border border-white/10 bg-slate-900/65 p-5 shadow-xl shadow-black/10"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">
              Inputs
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Water System Parameters
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Adjust the values, then run an assessment.
            </p>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">
                  Tank capacity (liters)
                </span>

                <input
                  type="number"
                  min="1"
                  required
                  value={formData.tank_capacity_liters}
                  onChange={(e) =>
                    updateField("tank_capacity_liters", e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#080e1c] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10"
                />
              </label>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="tank-level" className="text-sm text-slate-300">
                    Current tank level
                  </label>

                  <span className="text-sm font-semibold text-cyan-200">
                    {formData.tank_level_percent}%
                  </span>
                </div>

                <input
                  id="tank-level"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.tank_level_percent}
                  onChange={(e) =>
                    updateField("tank_level_percent", e.target.value)
                  }
                  className="w-full accent-cyan-300"
                />

                <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                  <span>Empty</span>
                  <span>Full</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">
                    Latitude
                  </span>

                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.latitude}
                    onChange={(e) => updateField("latitude", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#080e1c] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/60"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">
                    Longitude
                  </span>

                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.longitude}
                    onChange={(e) => updateField("longitude", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#080e1c] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/60"
                  />
                </label>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">
                    Consumption History
                  </p>
                  <span className="text-xs text-slate-500">L / day</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  {formData.consumption_history.map((value, index) => (
                    <label key={index} className="block">
                      <span className="mb-1.5 block text-xs text-slate-400">
                        Day {index + 1}
                      </span>

                      <input
                        type="number"
                        min="0"
                        required
                        value={value}
                        onChange={(e) =>
                          updateConsumption(index, e.target.value)
                        }
                        className="w-full rounded-lg border border-white/10 bg-[#080e1c] px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-cyan-300/15 bg-cyan-300/[0.05] p-3">
                <p className="text-xs text-slate-400">
                  Estimated water currently in tank
                </p>

                <p className="mt-1 text-lg font-semibold text-white">
                  {formatNumber(waterAvailable, 0)} L
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    Run Risk Analysis <span>→</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-500">
                POST <code className="text-slate-400">/water/risk</code>
              </p>
            </div>
          </form>

          {/* Results */}
          <div className="min-w-0 space-y-5">
            <Panel
              title="Water Security Snapshot"
              subtitle="Key metrics returned by your risk engine."
            >
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Risk Classification
                </p>
                <RiskBadge level={level} />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
                <Metric
                  label="Water runway"
                  value={runway == null ? "—" : `${formatNumber(runway, 2)} days`}
                  detail="Estimated days remaining"
                  tone={tone}
                />

                <Metric
                  label="Available water"
                  value={`${formatNumber(waterAvailable, 0)} L`}
                  detail={`${formData.tank_level_percent}% of tank capacity`}
                  tone="green"
                />

                <Metric
                  label="Heat adjustment"
                  value={
                    riskData?.heat_adjustment_percent == null
                      ? "—"
                      : `${formatNumber(riskData.heat_adjustment_percent)}%`
                  }
                  detail="Backend-reported adjustment"
                  tone="amber"
                />

                <Metric
                  label="Risk status"
                  value={level || "Pending"}
                  detail="Classification from API"
                  tone={tone}
                />
              </div>

              {!riskData && (
                <p className="mt-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-4 text-sm leading-6 text-slate-400">
                  Run an analysis to populate these cards with backend results.
                </p>
              )}

              {loading && (
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-300" />
                </div>
              )}
            </Panel>

            {/* Consumption chart */}
            <Panel
              title="Consumption History"
              subtitle="Daily values used for this assessment."
            >
              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="consumptionFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#67e8f9"
                          stopOpacity={0.32}
                        />
                        <stop
                          offset="100%"
                          stopColor="#67e8f9"
                          stopOpacity={0.01}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      stroke="#1e293b"
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="day"
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#0b1222",
                        border: "1px solid #263449",
                        borderRadius: 12,
                        color: "#e2e8f0",
                      }}
                      labelStyle={{ color: "#a5f3fc" }}
                      formatter={(value) => [
                        `${formatNumber(value, 0)} L`,
                        "Consumption",
                      ]}
                    />

                    <Area
                      type="monotone"
                      dataKey="consumption"
                      stroke="#67e8f9"
                      strokeWidth={2.5}
                      fill="url(#consumptionFill)"
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            {/* AI guidance and context */}
            <div className="grid gap-5 md:grid-cols-2">
              <Panel
                title="AI Operational Guidance"
                subtitle="Advice generated by your backend."
              >
                {riskData?.ai_advice ? (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                    {String(riskData.ai_advice).replace(/\*\*/g, "")}
                  </p>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    AI guidance will appear here after a successful analysis.
                  </p>
                )}
              </Panel>

              <Panel
                title="Assessment Context"
                subtitle="Parameters used in this request."
              >
                <dl className="mt-3 space-y-3 text-sm">
                  <div className="flex justify-between gap-4 border-b border-white/5 pb-3">
                    <dt className="text-slate-400">Coordinates</dt>
                    <dd className="text-right font-mono text-slate-200">
                      {formatNumber(formData.latitude, 3)},{" "}
                      {formatNumber(formData.longitude, 3)}
                    </dd>
                  </div>

                  <div className="flex justify-between gap-4 border-b border-white/5 pb-3">
                    <dt className="text-slate-400">Tank capacity</dt>
                    <dd className="text-right text-slate-200">
                      {formatNumber(formData.tank_capacity_liters, 0)} L
                    </dd>
                  </div>

                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-400">Endpoint</dt>
                    <dd className="text-right font-mono text-xs text-cyan-200">
                      POST /water/risk
                    </dd>
                  </div>
                </dl>
              </Panel>
            </div>
          </div>
        </div>

        <footer className="mt-8 flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-semibold text-slate-300">CURE</span> ·
            Climate & Utility Risk Engine
          </p>
          <p>
            Local development dashboard · Verify backend results before
            operational use
          </p>
        </footer>
      </main>
    </div>
  );
}