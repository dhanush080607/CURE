import { conditionMeta, convertTemp } from "../data/liveWeather";

export default function HourlyForecast({ weather, unit }) {
  const slots = weather?.hourly ?? [];

  return (
    <section className="card overflow-hidden">
      <header className="section-header">
        <h2 className="section-title">Next 24 hours</h2>
        <span className="text-[10px]" style={{ color: "var(--ink-3)" }}>
          {weather ? "Open-Meteo" : ""}
        </span>
      </header>

      {slots.length === 0 ? (
        <p className="px-5 py-8 text-center text-[12px]" style={{ color: "var(--ink-3)" }}>
          Hourly forecast appears once a location is loaded.
        </p>
      ) : (
        <div className="scroll-thin flex gap-1.5 overflow-x-auto p-3">
          {slots.map((s, i) => {
            const [, icon] = conditionMeta(s.code);
            const isNow = i === 0;
            return (
              <div
                key={i}
                className="flex w-[58px] shrink-0 flex-col items-center gap-2 rounded-lg border px-1 py-2.5"
                style={{
                  borderColor: isNow
                    ? "color-mix(in srgb, var(--accent) 40%, transparent)"
                    : "var(--border)",
                  background: isNow ? "var(--accent-wash)" : "var(--surface-2)",
                }}
              >
                <span
                  className="num text-[10px] font-medium"
                  style={{ color: isNow ? "var(--accent)" : "var(--ink-3)" }}
                >
                  {isNow ? "Now" : s.time}
                </span>
                <span className="text-lg leading-none">{icon}</span>
                <span className="num text-[12px] font-semibold" style={{ color: "var(--ink)" }}>
                  {convertTemp(s.temp, unit)}&deg;
                </span>
                <div className="w-full">
                  <div
                    className="h-[3px] w-full overflow-hidden rounded-full"
                    style={{ background: "var(--surface-3)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s.pop ?? 0}%`, background: "var(--accent)", opacity: 0.7 }}
                    />
                  </div>
                  <p className="num mt-1 text-center text-[9px]" style={{ color: "var(--ink-3)" }}>
                    {s.pop ?? 0}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
