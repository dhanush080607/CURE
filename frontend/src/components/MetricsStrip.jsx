const PANELS = [
  {
    id: "temp",
    label: "Temperature",
    value: (w, unit) => toNum(w?.temp, unit),
    unit: (unit) => `\u00B0${unit}`,
    sub: (w, unit) =>
      w?.feelsLike != null
        ? `feels ${toNum(w.feelsLike, unit)}\u00B0${unit}`
        : "apparent",
  },
  {
    id: "humidity",
    label: "Humidity",
    value: (w) => (w?.humidity != null ? `${Math.round(w.humidity)}` : "\u2014"),
    unit: () => "%",
    sub: () => "relative",
  },
  {
    id: "wind",
    label: "Wind",
    value: (w) => (w?.windSpeed != null ? `${Math.round(w.windSpeed)}` : "\u2014"),
    unit: () => "km/h",
    sub: (w) => w?.windDirection || "direction",
  },
  {
    id: "aqi",
    label: "Air quality",
    value: (w) => (w?.aqi != null ? `${Math.round(w.aqi)}` : "\u2014"),
    unit: () => "AQI",
    sub: () => "European scale",
  },
  {
    id: "pressure",
    label: "Pressure",
    value: (w) => (w?.pressure ? `${w.pressure}` : "\u2014"),
    unit: () => "hPa",
    sub: () => "mean sea level",
  },
];

function toNum(celsius, unit) {
  if (celsius == null || Number.isNaN(celsius)) return "\u2014";
  return String(
    unit === "C" ? Math.round(celsius) : Math.round((celsius * 9) / 5 + 32)
  );
}

export default function MetricsStrip({ weather, unit = "C" }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {PANELS.map((p) => {
        const shown = p.value(weather, unit);
        return (
          <div
            key={p.id}
            className="card px-4 py-3.5 transition-colors hover:border-[var(--border-2)]"
          >
            <p className="label">{p.label}</p>
            <p
              className="num mt-1.5 text-[22px] font-semibold leading-none tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              {shown}
              {shown !== "\u2014" && (
                <span className="ml-1 text-[11px] font-normal" style={{ color: "var(--ink-3)" }}>
                  {p.unit(unit)}
                </span>
              )}
            </p>
            <p className="mt-2 text-[10px]" style={{ color: "var(--ink-3)" }}>
              {p.sub(weather, unit)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
