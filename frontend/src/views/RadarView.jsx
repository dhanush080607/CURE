import { ViewShell, Panel, StatCard, KeyValue } from "../components/ViewPrimitives";
import { conditionMeta } from "../data/liveWeather";

export default function RadarView({ place, weather }) {
  const [icon, label] = conditionMeta(weather?.weatherCode);

  return (
    <ViewShell
      title="Precipitation radar"
      badge="RainViewer"
      subtitle={
        place?.name
          ? `${place.name} \u00B7 live composite echo layer`
          : "Select a location to begin"
      }
      action={
        <p
          className="rounded-lg px-3 py-1.5 text-[10px]"
          style={{
            border: "1px solid var(--border)",
            background: "var(--surface-2)",
            color: "var(--ink-3)",
          }}
        >
          Enable the Radar overlay on the dashboard map
        </p>
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Condition"
          value={weather ? label : "\u2014"}
          sub={weather ? `WMO code ${weather.weatherCode}` : "no data"}
          tone="accent"
        />
        <StatCard
          label="Cloud cover"
          value={weather?.cloudCover != null ? `${Math.round(weather.cloudCover)}` : "\u2014"}
          unit="%"
          sub="sky fraction"
          tone="info"
        />
        <StatCard
          label="Precipitation"
          value={
            weather?.precipitation != null
              ? `${Number(weather.precipitation).toFixed(1)}`
              : "\u2014"
          }
          unit="mm"
          sub="current hour"
        />
        <StatCard
          label="Rain chance"
          value={weather?.daily?.[0]?.pop != null ? `${weather.daily[0].pop}` : "\u2014"}
          unit="%"
          sub="today"
          tone="good"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Echo layer">
          <div
            className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-xl"
            style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
          >
            <span className="text-[44px] leading-none">{icon}</span>
            <p className="text-[13px]" style={{ color: "var(--ink-2)" }}>
              {weather ? label : "No observation for this location"}
            </p>
            <p
              className="max-w-[320px] text-center text-[11px] leading-relaxed"
              style={{ color: "var(--ink-3)" }}
            >
              Reflectivity imagery is rendered on the dashboard map through the
              RainViewer overlay. This page shows the matching surface
              observations for the selected point.
            </p>
          </div>
        </Panel>

        <Panel title="Hourly rainfall probability">
          {(weather?.hourly ?? []).length === 0 ? (
            <p className="py-6 text-center text-[12px]" style={{ color: "var(--ink-3)" }}>
              Select a location to see the 24-hour probability trace.
            </p>
          ) : (
            <ul className="space-y-2">
              {weather.hourly.slice(0, 12).map((h, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span
                    className="num w-10 shrink-0 text-[11px]"
                    style={{ color: "var(--ink-3)" }}
                  >
                    {i === 0 ? "Now" : h.time}
                  </span>
                  <div
                    className="h-[3px] flex-1 overflow-hidden rounded-full"
                    style={{ background: "var(--surface-3)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${h.pop ?? 0}%`,
                        background: "var(--accent)",
                        opacity: 0.75,
                      }}
                    />
                  </div>
                  <span
                    className="num w-9 shrink-0 text-right text-[11px]"
                    style={{ color: "var(--ink-2)" }}
                  >
                    {h.pop ?? 0}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="Feed">
        <KeyValue
          rows={[
            ["Provider", "RainViewer"],
            ["Data", weather?.source === "wttr" ? "wttr.in" : "Open-Meteo"],
            ["Coverage", "global, where available"],
            ["Refresh", "every 10 minutes"],
          ]}
        />
      </Panel>
    </ViewShell>
  );
}
