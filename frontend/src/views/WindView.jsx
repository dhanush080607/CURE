import { ViewShell, Panel, StatCard, KeyValue } from "../components/ViewPrimitives";

const PROFILE = [
  { level: "Surface 10 m", speed: "\u2014", dir: "\u2014" },
  { level: "850 hPa (~1,500 m)", speed: "\u2014", dir: "\u2014" },
  { level: "500 hPa (~5,500 m)", speed: "\u2014", dir: "\u2014" },
  { level: "250 hPa (~10,500 m)", speed: "\u2014", dir: "\u2014" },
];

export default function WindView({ place, weather }) {
  const deg = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
  const bearing = deg[weather?.windDirection] ?? 0;
  const hourlyWind = (weather?.hourly ?? []).slice(0, 6).map((h, i) => ({
    label: i === 0 ? "Now" : h.time,
    speed: h.wind,
  }));

  return (
    <ViewShell
      title="Wind vector analysis"
      badge="Surface"
      subtitle={
        place?.name
          ? `${place.name} \u00B7 anemometer telemetry`
          : "Select a location to begin"
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Sustained"
          value={weather?.windSpeed != null ? `${weather.windSpeed}` : "\u2014"}
          unit="km/h"
          sub="10 m sensor"
          tone="accent"
        />
        <StatCard
          label="Peak gust"
          value={weather?.windGust != null ? `${weather.windGust}` : "\u2014"}
          unit="km/h"
          sub="last hour"
          tone="warn"
        />
        <StatCard
          label="Direction"
          value={weather?.windDirection ?? "\u2014"}
          sub={`${bearing}\u00B0 bearing`}
        />
        <StatCard
          label="Next 6 h"
          value={hourlyWind.length ? `${hourlyWind.length}` : "—"}
          unit="pts"
          sub="hourly steps"
          tone="info"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Compass">
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="relative h-48 w-48" aria-hidden="true">
              <div className="absolute inset-0 rounded-full" style={{ border: "1px solid var(--border)" }} />
              <div className="absolute inset-8 rounded-full" style={{ border: "1px solid var(--border)" }} />
              <div className="absolute inset-16 rounded-full" style={{ border: "1px solid var(--border)" }} />
              {[
                ["N", "top-1 left-1/2 -translate-x-1/2"],
                ["S", "bottom-1 left-1/2 -translate-x-1/2"],
                ["E", "right-1 top-1/2 -translate-y-1/2"],
                ["W", "left-1 top-1/2 -translate-y-1/2"],
              ].map(([d, pos]) => (
                <span
                  key={d}
                  className={`absolute text-[11px] font-semibold ${pos}`}
                  style={{ color: "var(--ink-3)" }}
                >
                  {d}
                </span>
              ))}
              <div
                className="absolute left-1/2 top-1/2 h-20 w-1 origin-bottom rounded-full"
                style={{
                  background: "var(--accent)",
                  transform: `translate(-50%,-100%) rotate(${bearing}deg)`,
                }}
              />
              <div
                className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: "var(--accent)", boxShadow: "0 0 0 5px var(--accent-wash)" }}
              />
            </div>
            <p className="text-[11px]" style={{ color: "var(--ink-2)" }}>
              {weather?.windDirection
                ? `Flow ${weather.windDirection} at ${weather.windSpeed} km/h`
                : "No wind data for this location"}
            </p>
          </div>
        </Panel>

        <Panel title="Vertical profile">
          <KeyValue rows={PROFILE.map((p) => [p.level, `${p.speed} \u00B7 ${p.dir}`])} />
          <p className="mt-3 text-[11px]" style={{ color: "var(--ink-3)" }}>
            Aloft data requires a pressure-level model run, which is not part of the current
            free feed.
          </p>
        </Panel>
      </div>
    </ViewShell>
  );
}
