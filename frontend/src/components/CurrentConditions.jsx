import { aqiTone, conditionMeta, convertTemp, timeOnly, uvLabel, uvTone } from "../data/liveWeather";

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

export default function CurrentConditions({ place, weather, unit }) {
  const has = Boolean(weather);
  const degraded = Boolean(weather?.degraded);
  const [, label] = conditionMeta(weather?.weatherCode);
  const tone = aqiTone(weather?.aqi);
  const uv = weather?.uvIndex;

  const stats = [
    { label: "Humidity", value: weather?.humidity != null ? `${weather.humidity}%` : "\u2014" },
    {
      label: "Wind",
      value: weather?.windSpeed != null ? `${weather.windSpeed}` : "\u2014",
      sub: `km/h ${weather?.windDirection ?? ""}`.trim(),
    },
    {
      label: "Gusts",
      value: weather?.windGust != null ? `${weather.windGust}` : "\u2014",
      sub: "km/h",
    },
    {
      label: "Pressure",
      value: weather?.pressure ? `${weather.pressure}` : "\u2014",
      sub: "hPa",
    },
    {
      label: "UV index",
      value: uv != null ? `${uv}` : "\u2014",
      sub: uvLabel(uv),
    },
    {
      label: "Visibility",
      value: weather?.visibility != null ? `${weather.visibility}` : "\u2014",
      sub: "km",
    },
  ];

  return (
    <section className="card animate-fadeIn overflow-hidden">
      <header className="section-header">
        <div className="min-w-0">
          <h2 className="section-title">Current conditions</h2>
          <p className="mt-0.5 truncate text-[11px]" style={{ color: "var(--ink-3)" }}>
            {place?.name ?? "No location selected"}
            {place?.admin1 ? ` \u00B7 ${place.admin1}` : ""}
          </p>
        </div>
        <span
          className={`stat-chip ${
            degraded ? "chip-warn" : has ? "chip-good" : "chip-warn"
          }`}
          title={
            degraded
              ? "Primary source unavailable, showing fallback data"
              : undefined
          }
        >
          {degraded ? "Fallback" : has ? "Live" : "Idle"}
        </span>
      </header>

      <div className="p-5">
        {!has ? (
          <p className="py-6 text-center text-[12px]" style={{ color: "var(--ink-3)" }}>
            Click the map or search for a location to load live conditions.
          </p>
        ) : (
          <>
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-0.5">
                  <span
                    className="num text-[46px] font-semibold leading-none tracking-tight"
                    style={{ color: "var(--ink)" }}
                  >
                    {convertTemp(weather.temp, unit)}
                  </span>
                  <span className="text-[20px] font-normal" style={{ color: "var(--ink-3)" }}>
                    &deg;{unit}
                  </span>
                </div>
                <p className="mt-2 text-[13px]" style={{ color: "var(--ink-2)" }}>
                  {label}
                </p>
                <p className="mt-1 text-[11px]" style={{ color: "var(--ink-3)" }}>
                  Feels like{" "}
                  <span className="num" style={{ color: "var(--ink-2)" }}>
                    {convertTemp(weather.feelsLike, unit)}&deg;{unit}
                  </span>
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="label">Air quality</p>
                <p
                  className="num mt-1 text-[30px] font-semibold leading-none"
                  style={{ color: "var(--ink)" }}
                >
                  {weather.aqi ?? "\u2014"}
                </p>
                <span className={`stat-chip mt-1.5 ${tone.tone}`}>{tone.label}</span>
              </div>
            </div>

            {weather.aqi != null && (
              <div className="progress-bar mt-4">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min((weather.aqi / 120) * 100, 100)}%`,
                    background: tone.bar,
                  }}
                />
              </div>
            )}

            <div className="mt-5 grid grid-cols-2 gap-2">
              {stats.map((s) => (
                <Cell key={s.label} label={s.label} value={s.value} sub={s.sub} />
              ))}
            </div>

            <div
              className="mt-5 flex items-center justify-between border-t pt-3 text-[11px]"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="num" style={{ color: "var(--ink-2)" }}>
                {timeOnly(weather.daily?.[0]?.sunrise)}
              </span>
              <span className="text-[10px]" style={{ color: "var(--ink-3)" }}>
                Sunrise &rarr; sunset
              </span>
              <span className="num" style={{ color: "var(--ink-2)" }}>
                {timeOnly(weather.daily?.[0]?.sunset)}
              </span>
            </div>

            <div
              className="mt-3 flex items-center justify-between rounded-lg px-3 py-2"
              style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
            >
              <span className="label">UV category</span>
              <span className={`stat-chip ${uvTone(uv)}`}>{uvLabel(uv)}</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
