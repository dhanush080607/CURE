import { ViewShell, Panel, StatCard, KeyValue } from "../components/ViewPrimitives";
import { convertTemp, dayLabel } from "../data/liveWeather";

export default function TemperatureView({ place, weather, unit }) {
  const daily = (weather?.daily ?? []).slice(0, 7);
  const temps = daily.flatMap((d) => [d.min, d.max]).filter((v) => v != null);
  const lo = temps.length ? Math.min(...temps) : null;
  const hi = temps.length ? Math.max(...temps) : null;
  const span = hi != null && lo != null ? hi - lo || 1 : 1;

  return (
    <ViewShell
      title="Temperature analysis"
      badge="Daily range"
      subtitle={
        place?.name
          ? `${place.name} \u00B7 observed and forecast`
          : "Select a location to begin"
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Observed"
          value={convertTemp(weather?.temp, unit) ?? "\u2014"}
          unit={`\u00B0${unit}`}
          sub="2 m air temperature"
          tone="accent"
        />
        <StatCard
          label="Feels like"
          value={convertTemp(weather?.feelsLike, unit) ?? "\u2014"}
          unit={`\u00B0${unit}`}
          sub="apparent temperature"
        />
        <StatCard
          label="7-day low"
          value={convertTemp(lo, unit) ?? "\u2014"}
          unit={`\u00B0${unit}`}
          sub="forecast minimum"
          tone="info"
        />
        <StatCard
          label="7-day high"
          value={convertTemp(hi, unit) ?? "\u2014"}
          unit={`\u00B0${unit}`}
          sub="forecast maximum"
          tone="warn"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Daily range">
          {daily.length === 0 ? (
            <p className="py-6 text-center text-[12px]" style={{ color: "var(--ink-3)" }}>
              Select a location to see the 7-day range.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {daily.map((d, i) => {
                const left = lo != null ? ((d.min - lo) / span) * 100 : 0;
                const width = lo != null ? Math.max(10, ((d.max - d.min) / span) * 100) : 10;
                return (
                <li key={d.date} className="flex items-center gap-3">
                  <span className="w-[64px] shrink-0 text-[11px]" style={{ color: "var(--ink-2)" }}>
                    {dayLabel(d.date, i)}
                  </span>
                  <span
                    className="num w-9 shrink-0 text-right text-[11px]"
                    style={{ color: "var(--ink-3)" }}
                  >
                    {convertTemp(d.min, unit)}&deg;
                  </span>
                  <div
                    className="relative h-1.5 flex-1 overflow-hidden rounded-full"
                    style={{ background: "var(--surface-3)" }}
                  >
                    <div
                      className="absolute inset-y-0 rounded-full"
                      style={{
                        left: `${Math.max(0, left)}%`,
                        width: `${Math.min(100 - Math.max(0, left), width)}%`,
                        background:
                          "linear-gradient(90deg,var(--info),var(--warn),var(--bad))",
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <span
                    className="num w-9 shrink-0 text-[11px] font-semibold"
                    style={{ color: "var(--ink)" }}
                  >
                    {convertTemp(d.max, unit)}&deg;
                  </span>
                </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel title="Reading">
          <KeyValue
            rows={[
              ["Unit", unit === "C" ? "Celsius" : "Fahrenheit"],
              ["Source", weather ? (weather.source === "wttr" ? "wttr.in" : "Open-Meteo") : "\u2014"],
              ["Timezone", weather?.timezone || "\u2014"],
              ["Elevation", weather?.elevation != null ? `${Math.round(weather.elevation)} m` : "\u2014"],
            ]}
          />
        </Panel>
      </div>
    </ViewShell>
  );
}
