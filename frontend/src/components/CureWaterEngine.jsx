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

const API_BASE = (import.meta.env.VITE_API_BASE || "/api").replace(/\/$/, "");

const RISK_TONE = {
  LOW: "chip-good",
  WATCH: "chip-warn",
  HIGH: "chip-bad",
};

const initialForm = {
  tank_capacity_liters: 50000,
  tank_level_percent: 62,
  consumption_history: [7200, 7600, 7400, 8000, 7300, 7700, 7500],
  latitude: 13.6288,
  longitude: 78.48,
};

export default function CureWaterEngine() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: Number(v) }));

  const setUsage = (i, v) =>
    setForm((p) => {
      const next = [...p.consumption_history];
      next[i] = Number(v);
      return { ...p, consumption_history: next };
    });

  const run = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/water/risk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Backend responded ${res.status}`);
      setResult(await res.json());
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Could not reach the backend. Start it with: uvicorn app.main:app --reload"
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const available = (form.tank_capacity_liters * form.tank_level_percent) / 100;

  return (
    <div className="animate-fadeIn space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          {
            label: "Water available",
            value: `${Math.round(available).toLocaleString()} L`,
            sub: `of ${form.tank_capacity_liters.toLocaleString()} L capacity`,
            tone: "var(--ink)",
          },
          {
            label: "Water runway",
            value: result ? `${result.water_runway_days ?? "--"} days` : "—",
            sub: result ? "from backend result" : "run analysis to compute",
            tone: "var(--accent)",
          },
          {
            label: "Risk classification",
            value: result?.risk_level ?? "—",
            sub: result ? result.heat_status ?? "engine output" : "awaiting run",
            tone:
              result?.risk_level === "HIGH"
                ? "var(--bad)"
                : result?.risk_level === "WATCH"
                  ? "var(--warn)"
                  : "var(--ink)",
          },
        ].map((c) => (
          <div key={c.label} className="card px-4 py-3.5">
            <p className="label">{c.label}</p>
            <p
              className="num mt-1.5 text-[22px] font-semibold leading-none tracking-tight"
              style={{ color: c.tone }}
            >
              {c.value}
            </p>
            <p className="mt-2 text-[10px]" style={{ color: "var(--ink-3)" }}>
              {c.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="card overflow-hidden">
          <header className="section-header">
            <h2 className="section-title">Tank parameters</h2>
          </header>
          <div className="space-y-4 p-4">
            <div>
              <label className="label" htmlFor="cure-capacity">
                Tank capacity (litres)
              </label>
              <input
                id="cure-capacity"
                type="number"
                value={form.tank_capacity_liters}
                onChange={(e) => setField("tank_capacity_liters", e.target.value)}
                className="num mt-1.5 w-full rounded-lg px-3 py-2 text-[12px] outline-none"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--surface-2)",
                  color: "var(--ink)",
                }}
              />
            </div>

            <div>
              <label className="label" htmlFor="cure-level">
                Current level · {form.tank_level_percent}%
              </label>
              <input
                id="cure-level"
                type="range"
                min="0"
                max="100"
                value={form.tank_level_percent}
                onChange={(e) => setField("tank_level_percent", e.target.value)}
                className="mt-2 h-[3px] w-full cursor-pointer appearance-none rounded-full"
                style={{ background: "var(--surface-3)", accentColor: "var(--accent)" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="cure-lat">
                  Latitude
                </label>
                <input
                  id="cure-lat"
                  type="number"
                  step="0.0001"
                  value={form.latitude}
                  onChange={(e) => setField("latitude", e.target.value)}
                  className="num mt-1.5 w-full rounded-lg px-3 py-2 text-[12px] outline-none"
                  style={{
                    border: "1px solid var(--border)",
                    background: "var(--surface-2)",
                    color: "var(--ink)",
                  }}
                />
              </div>
              <div>
                <label className="label" htmlFor="cure-lon">
                  Longitude
                </label>
                <input
                  id="cure-lon"
                  type="number"
                  step="0.0001"
                  value={form.longitude}
                  onChange={(e) => setField("longitude", e.target.value)}
                  className="num mt-1.5 w-full rounded-lg px-3 py-2 text-[12px] outline-none"
                  style={{
                    border: "1px solid var(--border)",
                    background: "var(--surface-2)",
                    color: "var(--ink)",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="card overflow-hidden">
          <header className="section-header">
            <h2 className="section-title">Usage history</h2>
            <span className="text-[10px]" style={{ color: "var(--ink-3)" }}>
              L/day
            </span>
          </header>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-2">
              {form.consumption_history.map((v, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="label mb-1">D{i + 1}</span>
                  <input
                    type="number"
                    value={v}
                    onChange={(e) => setUsage(i, e.target.value)}
                    aria-label={`Day ${i + 1} usage in litres`}
                    className="num w-full rounded-md px-1 py-1.5 text-center text-[11px] outline-none"
                    style={{
                      border: "1px solid var(--border)",
                      background: "var(--surface-2)",
                      color: "var(--ink)",
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={form.consumption_history.map((v, i) => ({ day: `D${i + 1}`, usage: v }))}
                  margin={{ top: 6, right: 6, left: -24, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="var(--border-2)"
                    tick={{ fontSize: 9, fill: "var(--ink-3)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--border-2)"
                    tick={{ fontSize: 9, fill: "var(--ink-3)" }}
                    tickLine={false}
                    axisLine={false}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    content={({ active, payload, label }) =>
                      active && payload?.length ? (
                        <div
                          className="rounded-lg px-2.5 py-2"
                          style={{ border: "1px solid var(--border-2)", background: "var(--surface)" }}
                        >
                          <p className="num text-[10px]" style={{ color: "var(--ink-3)" }}>
                            {label}
                          </p>
                          <p className="num text-[12px] font-semibold" style={{ color: "var(--ink)" }}>
                            {payload[0].value} L
                          </p>
                        </div>
                      ) : null
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="usage"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "var(--accent)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={run} disabled={loading} className="btn btn-primary">
          {loading ? "Running analysis…" : "Run risk analysis"}
        </button>
        <span className="text-[11px]" style={{ color: "var(--ink-3)" }}>
          Posts to <span className="num">{API_BASE}/water/risk</span>
        </span>
      </div>

      {error && (
        <section
          className="card flex items-start gap-3 p-4"
          style={{ borderColor: "color-mix(in srgb, var(--bad) 40%, transparent)" }}
        >
          <span className="dot mt-1.5 shrink-0" style={{ background: "var(--bad)" }} />
          <div>
            <p className="text-[12px] font-medium" style={{ color: "var(--bad)" }}>
              Backend unavailable
            </p>
            <p className="mt-1 text-[11px]" style={{ color: "var(--ink-3)" }}>
              {error}
            </p>
          </div>
        </section>
      )}

      {result && (
        <section className="card overflow-hidden">
          <header className="section-header">
            <h2 className="section-title">Result</h2>
            <span className={`stat-chip ${RISK_TONE[result.risk_level] ?? "chip-warn"}`}>
              {result.risk_level}
            </span>
          </header>

          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
            {[
              ["Available", `${result.available_water_liters?.toLocaleString()} L`],
              ["Avg daily", `${result.average_daily_consumption_liters?.toLocaleString()} L`],
              ["Projected daily", `${result.projected_daily_consumption_liters?.toLocaleString()} L`],
              ["Runway", result.water_runway_days != null ? `${result.water_runway_days} d` : "n/a"],
              ["Max temp", `${result.max_temperature_c} °C`],
              ["Heat adj", `${result.heat_adjustment_percent}%`],
              ["Trend", result.consumption_trend],
              ["Days", `${result.days_of_history}`],
            ].map(([k, v]) => (
              <div
                key={k}
                className="rounded-lg px-3 py-2.5"
                style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
              >
                <p className="label">{k}</p>
                <p className="num mt-1 text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                  {v}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t px-4 py-4" style={{ borderColor: "var(--border)" }}>
            <div>
              <p className="label">Risk reason</p>
              <p className="mt-1 text-[12px]" style={{ color: "var(--ink-2)" }}>
                {result.risk_reason}
              </p>
            </div>
            <div>
              <p className="label">Recommendation</p>
              <p className="mt-1 text-[12px]" style={{ color: "var(--ink-2)" }}>
                {result.recommendation}
              </p>
            </div>
            {result.ai_advice && (
              <div
                className="rounded-lg p-3"
                style={{ background: "var(--accent-wash)", border: "1px solid var(--border)" }}
              >
                <p className="label">AI explanation</p>
                <p className="mt-1 text-[12px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
                  {result.ai_advice}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
