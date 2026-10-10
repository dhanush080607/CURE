import { aqiTone, uvLabel, uvTone, fmtTemp } from "../data/liveWeather";

function Cell({ label, value, sub }) {
  return (
    <div
      className="rounded-lg px-3 py-2.5"
      style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
    >
      <p className="label">{label}</p>
      <p className="num mt-1.5 text-[15px] font-semibold leading-none" style={{ color: "var(--ink)" }}>
        {value}
      </p>
      {sub && (
        <p className="mt-1.5 text-[10px]" style={{ color: "var(--ink-3)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export default function CurrentConditions({ location, unit }) {
  const temp = fmtTemp(location.temp, unit);
  const feels = fmtTemp(location.feelsLike ?? location.temp, unit);
  const tone = aqiTone(location.aqi);
  const uv = location.uvIndex;

  const stats = [
    { label: "Humidity", value: location.humidity != null ? `${location.humidity}%` : "\u2014" },
    {
      label: "Wind",
      value: location.windSpeed != null ? `${location.windSpeed}` : "\u2014",
      sub: `km/h ${location.windDirection ?? ""}`.trim(),
    },
    {
      label: "Gusts",
      value: location.windGust != null ? `${location.windGust}` : "\u2014",
      sub: "km/h",
    },
    {
      label: "Pressure",
      value: location.pressure != null ? `${location.pressure}` : "\u2014",
      sub: `hPa ${location.pressureTrend ?? ""}`.trim(),
    },
    { label: "UV index", value: uv != null ? `${uv}` : "\u2014", sub: uvLabel(uv) },
    {
      label: "Visibility",
      value: location.visibility != null ? `${location.visibility}` : "\u2014",
      sub: "km",
    },
  ];

  return (
    <section className="card animate-fadeIn overflow-hidden">
      <header className="section-header">
        <div className="min-w-0">
          <h2 className="section-title">Current conditions</h2>
          <p className="mt-0.5 truncate text-[11px]" style={{ color: "var(--ink-3)" }}>
            {location.name || location.city}
            {location.altitude ? ` \u00B7 ${location.altitude}` : ""}
          </p>
        </div>
        <span className={`stat-chip ${location.live ? "chip-good" : "chip-warn"}`}>
          {location.live ? "Live" : "Sample"}
        </span>
      </header>

      <div className="p-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span
                className="num text-[44px] font-semibold leading-none tracking-tight"
                style={{ color: "var(--ink)" }}
              >
                {temp}
              </span>
              <span className="text-lg font-normal" style={{ color: "var(--ink-3)" }}>
                {unit}
              </span>
            </div>
            <p className="mt-2 text-[13px]" style={{ color: "var(--ink-2)" }}>
              {location.condition ?? "\u2014"}
            </p>
            <p className="mt-1 text-[11px]" style={{ color: "var(--ink-3)" }}>
              Feels like <span className="num" style={{ color: "var(--ink-2)" }}>{feels}{unit}</span>
            </p>
          </div>

          {location.aqi != null && (
            <div className="shrink-0 text-right">
              <p className="label">Air quality</p>
              <p
                className="num mt-1 text-[28px] font-semibold leading-none"
                style={{ color: "var(--ink)" }}
              >
                {location.aqi}
              </p>
              <span className={`stat-chip mt-1.5 ${tone.tone}`}>{tone.label}</span>
            </div>
          )}
        </div>

        {location.aqi != null && (
          <div className="progress-bar mt-4">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min((location.aqi / 120) * 100, 100)}%`,
                background: tone.bar,
              }}
            />
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          {stats.map((s) => (
            <Cell key={s.label} label={s.label} value={s.value} sub={s.sub} />
          ))}
        </div>

        <div
          className="mt-4 flex items-center justify-between border-t pt-3 text-[11px]"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="num" style={{ color: "var(--ink-2)" }}>{location.sunrise} IST</span>
          <span className="text-[10px]" style={{ color: "var(--ink-3)" }}>Sunrise &rarr; sunset</span>
          <span className="num" style={{ color: "var(--ink-2)" }}>{location.sunset} IST</span>
        </div>

        <div
          className="mt-3 flex items-center justify-between rounded-lg px-3 py-2"
          style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
        >
          <span className="label">UV category</span>
          <span className={`stat-chip ${uvTone(uv)}`}>{uvLabel(uv)}</span>
        </div>
      </div>
    </section>
  );
}
