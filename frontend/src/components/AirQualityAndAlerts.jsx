import { useState } from "react";
import { REGIONAL_ALERTS } from "../data/mockWeatherData";
import { aqiTone } from "../data/liveWeather";

const POLLUTANTS = (loc) => [
  { label: "PM2.5", value: loc.pm25, max: 75 },
  { label: "PM10", value: loc.pm10, max: 150 },
];

export default function AirQualityAndAlerts({ location }) {
  const [open, setOpen] = useState(null);
  const tone = aqiTone(location.aqi);

  return (
    <div className="space-y-4">
      <section className="card overflow-hidden">
        <header className="section-header">
          <h2 className="section-title">Air quality</h2>
          <span className={`stat-chip ${tone.tone}`}>{tone.label}</span>
        </header>

        <div className="p-4">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="num text-[34px] font-semibold leading-none tracking-tight" style={{ color: "var(--ink)" }}>
                {location.aqi ?? "--"}
              </span>
              <span className="text-[11px]" style={{ color: "var(--ink-3)" }}>
                AQI
              </span>
            </div>
          </div>

          <div className="progress-bar mt-3">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(((location.aqi ?? 0) / 120) * 100, 100)}%`,
                background: tone.bar,
              }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {POLLUTANTS(location).map((p) => (
              <div
                key={p.label}
                className="rounded-lg px-3 py-2.5"
                style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
              >
                <p className="label">{p.label}</p>
                <p className="num mt-1.5 text-[15px] font-semibold" style={{ color: "var(--ink)" }}>
                  {p.value ?? "--"}
                  <span className="ml-1 text-[10px] font-normal" style={{ color: "var(--ink-3)" }}>
                    &micro;g/m&sup3;
                  </span>
                </p>
                <div className="progress-bar mt-2">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(((p.value ?? 0) / p.max) * 100, 100)}%`,
                      background: tone.bar,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card overflow-hidden">
        <header className="section-header">
          <h2 className="section-title">Bulletins</h2>
          <span className="num text-[10px]" style={{ color: "var(--ink-3)" }}>
            {REGIONAL_ALERTS.length}
          </span>
        </header>

        <ul className="p-2">
          {REGIONAL_ALERTS.map((a) => {
            const critical = a.severity === "critical";
            const expanded = open === a.id;
            return (
              <li key={a.id}>
                <button
                  onClick={() => setOpen(expanded ? null : a.id)}
                  className="w-full rounded-lg border border-transparent px-2.5 py-2.5 text-left transition-colors hover:bg-[var(--surface-2)] hover:border-[var(--border)]"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="dot mt-1.5 shrink-0"
                      style={{ background: critical ? "var(--bad)" : "var(--warn)" }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium" style={{ color: "var(--ink)" }}>
                        {a.type}
                      </p>
                      <p className="mt-0.5 text-[10px]" style={{ color: "var(--ink-3)" }}>
                        {a.region}
                      </p>
                    </div>
                    <span className="num shrink-0 text-[10px]" style={{ color: "var(--ink-3)" }}>
                      {a.issued}
                    </span>
                  </div>

                  {expanded && (
                    <div className="mt-2.5 border-t pt-2.5" style={{ borderColor: "var(--border)" }}>
                      <p className="text-[11px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
                        {a.description}
                      </p>
                      <span className="stat-chip chip-accent mt-2">{a.source}</span>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
