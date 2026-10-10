export default function InteractiveLayers({ place, weather }) {
  const has = Boolean(weather);

  const rows = [
    {
      label: "Coordinates",
      value:
        place?.lat != null ? `${place.lat.toFixed(4)}, ${place.lon.toFixed(4)}` : "\u2014",
    },
    { label: "Timezone", value: weather?.timezone || "\u2014" },
    {
      label: "Elevation",
      value: weather?.elevation != null ? `${Math.round(weather.elevation)} m` : "\u2014",
    },
    {
      label: "Data source",
      value: weather ? (weather.source === "wttr" ? "wttr.in" : "Open-Meteo") : "\u2014",
    },
    { label: "Forecast days", value: has ? String(weather.daily?.length ?? 0) : "\u2014" },
    { label: "Hourly points", value: has ? String(weather.hourly?.length ?? 0) : "\u2014" },
    { label: "Response", value: has ? "complete" : "idle" },
  ];

  return (
    <section className="card overflow-hidden">
      <header className="section-header shrink-0">
        <div>
          <h2 className="section-title">Station detail</h2>
          <p className="mt-0.5 text-[10px]" style={{ color: "var(--ink-3)" }}>
            Active feed metadata
          </p>
        </div>
        <span className={`stat-chip ${has ? "chip-good" : "chip-warn"}`}>
          {has ? "Active" : "Idle"}
        </span>
      </header>

      <ul className="scroll-thin flex-1 space-y-1 overflow-y-auto p-3">
        {rows.map((r) => (
          <li
            key={r.label}
            className="flex items-center justify-between gap-3 rounded-lg px-3 py-2"
            style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
          >
            <span className="text-[11px]" style={{ color: "var(--ink-3)" }}>{r.label}</span>
            <span className="num text-[11px] font-medium" style={{ color: "var(--ink)" }}>
              {r.value}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
