import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PRESSURE_HISTORY_MADANAPALLE } from "../data/mockWeatherData";

const METRICS = {
  pressure: { label: "Pressure", color: "var(--accent)", unit: "hPa", domain: [1005, 1018] },
  temp: { label: "Temp", color: "var(--warn)", unit: "\u00B0C", domain: ["auto", "auto"] },
  wind: { label: "Wind", color: "var(--info)", unit: "km/h", domain: ["auto", "auto"] },
};

export default function OperationalAnalytics({ location, unit }) {
  const [metric, setMetric] = useState("pressure");
  const cfg = METRICS[metric];
  const chartUnit = metric === "temp" ? (unit === "C" ? "\u00B0C" : "\u00B0F") : cfg.unit;

  return (
    <section className="card flex h-[300px] flex-col overflow-hidden p-4">
      <header className="flex items-start justify-between gap-2">
        <div>
          <h2 className="section-title">Diagnostics</h2>
          <p className="mt-0.5 text-[10px]" style={{ color: "var(--ink-3)" }}>
            Station telemetry
          </p>
        </div>
        <div className="segment shrink-0">
          {Object.entries(METRICS).map(([key, m]) => (
            <button
              key={key}
              onClick={() => setMetric(key)}
              className={`segment-item ${metric === key ? "active" : ""}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mt-3.5 grid grid-cols-4 gap-1.5">
        {[
          { k: "Wind", v: location.windSpeed },
          { k: "Press.", v: location.pressure },
          { k: "Humid.", v: location.humidity },
          { k: "AQI", v: location.aqi },
        ].map((m) => (
          <div
            key={m.k}
            className="rounded-lg px-1.5 py-2 text-center"
            style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
          >
            <p className="label truncate">{m.k}</p>
            <p className="num mt-1 text-[12px] font-semibold" style={{ color: "var(--ink)" }}>
              {m.v ?? "--"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={PRESSURE_HISTORY_MADANAPALLE}
            margin={{ top: 6, right: 6, left: -28, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`op-${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cfg.color} stopOpacity="0.28" />
                <stop offset="100%" stopColor={cfg.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="var(--border-2)"
              tick={{ fontSize: 9, fill: "var(--ink-3)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--border-2)"
              domain={cfg.domain}
              tick={{ fontSize: 9, fill: "var(--ink-3)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ stroke: "var(--border-2)" }}
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div
                    className="rounded-lg px-2.5 py-2"
                    style={{ border: "1px solid var(--border-2)", background: "var(--surface)" }}
                  >
                    <p className="num text-[10px]" style={{ color: "var(--ink-3)" }}>{label}</p>
                    <p className="num mt-1 text-[12px] font-semibold" style={{ color: "var(--ink)" }}>
                      {payload[0].value} {chartUnit}
                    </p>
                  </div>
                ) : null
              }
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={cfg.color}
              strokeWidth={2}
              fill={`url(#op-${metric})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
