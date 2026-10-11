import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useState } from "react";

const METRICS = {
  temp: { label: "Temp", color: "var(--warn)", unit: "\u00B0C", domain: ["auto", "auto"] },
  wind: { label: "Wind", color: "var(--info)", unit: "km/h", domain: ["auto", "auto"] },
  humidity: { label: "Humidity", color: "var(--accent)", unit: "%", domain: [0, 100] },
  pressure: { label: "Pressure", color: "var(--diag-pressure)", unit: "hPa", domain: ["auto", "auto"] },
};

export default function OperationalAnalytics({ weather }) {
  const [metric, setMetric] = useState("temp");
  const cfg = METRICS[metric];

  const hourly = weather?.hourly ?? [];
  const data = hourly.map((h, i) => ({
    label: i === 0 ? "Now" : h.time,
    temp: h.temp,
    wind: h.wind,
    humidity: h.humidity,
    pressure: h.pressure,
  }));

  const hasChart = hourly.length > 1;

  return (
    <section className="card overflow-hidden p-5">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="section-title">Diagnostics</h2>
          <p className="mt-0.5 text-[10px]" style={{ color: "var(--ink-3)" }}>
            24-hour profile
          </p>
        </div>
        <div className="segment max-w-full flex-wrap">
          {Object.entries(METRICS).map(([key, m]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMetric(key)}
              disabled={!hasChart}
              aria-pressed={metric === key}
              title={!hasChart ? "Select a location to load forecast data" : undefined}
              className={`segment-item ${metric === key ? "active" : ""}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </header>

      {!hasChart ? (
        <div className="mt-4 flex h-80 w-full flex-col items-center justify-center gap-2">
          <div
            className="h-10 w-10 rounded-full border"
            style={{ borderColor: "var(--border-2)" }}
          />
          <p className="max-w-[190px] text-center text-[11px] leading-relaxed" style={{ color: "var(--ink-3)" }}>
            Pick a location on the map to plot its 24-hour profile
          </p>
        </div>
      ) : (
        <div className="mt-4 h-80 w-full">
          <AreaChart
            width={640}
            height={320}
            data={data}
            margin={{ top: 6, right: 6, left: -26, bottom: 0 }}
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              <linearGradient id={`diag-${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cfg.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={cfg.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              interval="preserveStartEnd"
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
                    <p className="num text-[12px] font-semibold" style={{ color: "var(--ink)" }}>
                      {payload[0].value != null ? payload[0].value.toFixed(1) : "\u2014"} {cfg.unit}
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
              fill={`url(#diag-${metric})`}
              dot={false}
              connectNulls
            />
          </AreaChart>
        </div>
      )}
    </section>
  );
}
