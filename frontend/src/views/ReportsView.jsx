import { ViewShell, Panel, StatCard } from "../components/ViewPrimitives";
import { convertTemp, shortDate, timeOnly } from "../data/liveWeather";

export default function ReportsView({ place, weather, unit = "C" }) {
  const daily = (weather?.daily ?? []).slice(0, 3);
  const hourly = (weather?.hourly ?? []).slice(0, 6);

  return (
    <ViewShell
      title="Operational reports"
      subtitle={
        place?.name
          ? `Archive &amp; briefings for ${place.name}`
          : "Select a location to begin"
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Sunrise"
          value={timeOnly(weather?.daily?.[0]?.sunrise)}
          sub="local time"
          tone="warn"
        />
        <StatCard
          label="Sunset"
          value={timeOnly(weather?.daily?.[0]?.sunset)}
          sub="local time"
          tone="info"
        />
        <StatCard
          label="High today"
          value={convertTemp(weather?.daily?.[0]?.max, unit)}
          unit={`\u00B0${unit}`}
          sub="forecast maximum"
        />
        <StatCard
          label="Rain chance"
          value={weather?.daily?.[0]?.pop != null ? `${weather.daily[0].pop}` : "\u2014"}
          unit="%"
          sub="today"
          tone="good"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Panel title="Daily outlook">
          {daily.length === 0 ? (
            <p className="py-6 text-center text-[12px]" style={{ color: "var(--ink-3)" }}>
              Select a location to generate the outlook.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {daily.map((d) => (
                <li key={d.date} className="flex items-center justify-between gap-3 text-[12px]">
                  <span style={{ color: "var(--ink-2)" }}>{shortDate(d.date)}</span>
                  <span className="num" style={{ color: "var(--ink-3)" }}>
                    {convertTemp(d.min, unit)}&deg; / {convertTemp(d.max, unit)}&deg;{unit}
                  </span>
                  <span className="num" style={{ color: "var(--ink-2)" }}>
                    {d.pop != null ? `${d.pop}% rain` : "no rain data"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Next hours">
          {hourly.length === 0 ? (
            <p className="py-6 text-center text-[12px]" style={{ color: "var(--ink-3)" }}>
              Select a location to see the hourly trend.
            </p>
          ) : (
            <ul className="space-y-2">
              {hourly.map((h, i) => (
                <li key={i} className="flex items-center justify-between gap-3 text-[12px]">
                  <span style={{ color: "var(--ink-3)" }}>{i === 0 ? "Now" : h.time}</span>
                  <span className="num font-semibold" style={{ color: "var(--ink)" }}>
                    {convertTemp(h.temp, unit)}&deg;{unit}
                  </span>
                  <span className="num" style={{ color: "var(--ink-3)" }}>
                    {h.wind != null ? `${Math.round(h.wind)} km/h` : "\u2014"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </ViewShell>
  );
}

