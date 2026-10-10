import { aqiTone } from "../data/liveWeather";

const POLLUTANTS = [
  { label: "PM2.5", key: "pm25", max: 75 },
  { label: "PM10", key: "pm10", max: 150 },
];

const THRESHOLDS = [
  { label: "PM2.5 annual (WHO)", value: "5 \u00B5g/m\u00B3" },
  { label: "PM2.5 24 h (WHO)", value: "15 \u00B5g/m\u00B3" },
  { label: "PM10 24 h (WHO)", value: "45 \u00B5g/m\u00B3" },
];

export default function AirQualityAndAlerts({ weather }) {
  const has = Boolean(weather?.aqi != null);
  const tone = aqiTone(weather?.aqi);

  return (
    <section className="card overflow-hidden">
      <header className="section-header">
        <h2 className="section-title">Air quality</h2>
        <span className={`stat-chip ${has ? tone.tone : "chip-warn"}`}>
          {has ? tone.label : "No data"}
        </span>
      </header>

      {!has ? (
        <p className="px-5 py-8 text-center text-[12px]" style={{ color: "var(--ink-3)" }}>
          Particulate readings appear once a location is loaded.
        </p>
      ) : (
        <div className="p-5">
          <div className="flex items-baseline gap-1.5">
            <span className="num text-[36px] font-semibold leading-none tracking-tight" style={{ color: "var(--ink)" }}>
              {weather.aqi}
            </span>
            <span className="text-[11px]" style={{ color: "var(--ink-3)" }}>
              European AQI
            </span>
          </div>

          <div className="progress-bar mt-3">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min((weather.aqi / 120) * 100, 100)}%`,
                background: tone.bar,
              }}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {POLLUTANTS.map((p) => (
              <div
                key={p.label}
                className="rounded-lg px-3 py-2.5"
                style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
              >
                <p className="label">{p.label}</p>
                <p className="num mt-1.5 text-[15px] font-semibold" style={{ color: "var(--ink)" }}>
                  {weather[p.key] ?? "\u2014"}
                  <span className="ml-1 text-[10px] font-normal" style={{ color: "var(--ink-3)" }}>
                    &micro;g/m&sup3;
                  </span>
                </p>
                <div className="progress-bar mt-2">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(((weather[p.key] ?? 0) / p.max) * 100, 100)}%`,
                      background: tone.bar,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <p className="label">Reference thresholds</p>
            <dl className="mt-2 space-y-1.5">
              {THRESHOLDS.map((t) => (
                <div key={t.label} className="flex items-center justify-between gap-3">
                  <dt className="text-[11px]" style={{ color: "var(--ink-3)" }}>{t.label}</dt>
                  <dd className="num text-[11px]" style={{ color: "var(--ink-2)" }}>{t.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </section>
  );
}
