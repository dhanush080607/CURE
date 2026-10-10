import { ViewShell, Panel, StatCard, KeyValue } from "../components/ViewPrimitives";

const PROFILE = [
  { level: "Surface 10 m", speed: "14 km/h", dir: "ENE" },
  { level: "850 hPa (~1,500 m)", speed: "26 km/h", dir: "E" },
  { level: "500 hPa (~5,500 m)", speed: "38 km/h", dir: "ESE" },
  { level: "250 hPa (~10,500 m)", speed: "85 km/h", dir: "W" },
];

export default function WindView({ location }) {
  return (
    <ViewShell
      title="Wind vector analysis"
      badge="Surface & aloft"
      subtitle={`${location.name || location.city} · anemometer telemetry and gradient winds`}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Sustained" value={location.windSpeed ?? "--"} unit="km/h" sub="10 m sensor" tone="accent" />
        <StatCard label="Peak gust" value={location.windGust ?? "--"} unit="km/h" sub="last 60 minutes" tone="warn" />
        <StatCard label="Direction" value={location.windDirection ?? "--"} sub="bearing" />
        <StatCard label="Shear index" value="Low" sub="stable boundary layer" tone="good" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Compass">
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="relative h-48 w-48" aria-hidden="true">
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: "1px solid var(--border)" }}
              />
              <div
                className="absolute inset-8 rounded-full"
                style={{ border: "1px solid var(--border)" }}
              />
              <div
                className="absolute inset-16 rounded-full"
                style={{ border: "1px solid var(--border)" }}
              />
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
                  transform: "translate(-50%,-100%) rotate(68deg)",
                }}
              />
              <div
                className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: "var(--accent)", boxShadow: "0 0 0 5px var(--accent-wash)" }}
              />
            </div>
            <p className="text-[11px]" style={{ color: "var(--ink-2)" }}>
              Dominant flow {location.windDirection ?? "--"} at {location.windSpeed ?? "--"} km/h
            </p>
          </div>
        </Panel>

        <Panel title="Vertical profile">
          <KeyValue rows={PROFILE.map((p) => [`${p.level}`, `${p.speed} · ${p.dir}`])} />
        </Panel>
      </div>
    </ViewShell>
  );
}
