import { ViewShell, Panel, StatCard, KeyValue } from "../components/ViewPrimitives";
import { SAMPLE_LOCATIONS } from "../data/mockWeatherData";

export default function TemperatureView({ location, unit }) {
  const toU = (c) => (unit === "C" ? Math.round(c) : Math.round((c * 9) / 5 + 32));

  const stations = SAMPLE_LOCATIONS.slice(0, 6).map((s) => ({
    ...s,
    display: toU(s.temp),
  }));
  const temps = stations.map((s) => s.display);
  const lo = Math.min(...temps);
  const hi = Math.max(...temps);

  return (
    <ViewShell
      title="Temperature analysis"
      badge="Surface & profile"
      subtitle={`${location.name || location.city} · thermograph and inversion diagnostics`}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Observed" value={toU(location.temp)} unit={`°${unit}`} sub="2 m air temperature" tone="accent" />
        <StatCard label="Feels like" value={toU(location.feelsLike ?? location.temp)} unit={`°${unit}`} sub="apparent temperature" />
        <StatCard label="Diurnal range" value={hi - lo} unit={`°${unit}`} sub="across monitoring network" tone="info" />
        <StatCard label="30-yr anomaly" value="+0.4" unit={`°${unit}`} sub="vs seasonal normal" tone="warn" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Network comparison">
          <KeyValue
            rows={stations.map((s) => [s.city, `${s.display}°${unit}`])}
          />
        </Panel>

        <Panel title="Range">
          <div className="pt-1">
            <div
              className="relative h-2 w-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg,#3b82f6,#22d3ee,#fbbf24,#f43f5e)",
              }}
            />
            <div
              className="mt-3 flex items-center justify-between text-[11px]"
              style={{ color: "var(--ink-3)" }}
            >
              <span className="num">{lo}°{unit}</span>
              <span className="num">{hi}°{unit}</span>
            </div>
          </div>
        </Panel>
      </div>
    </ViewShell>
  );
}
