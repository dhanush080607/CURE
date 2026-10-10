import { conditionMeta, convertTemp, dayLabel, shortDate } from "../data/liveWeather";

export default function MultiDayForecast({ weather, unit }) {
  const days = (weather?.daily ?? []).slice(0, 7);
  const mins = days.map((d) => d.min).filter((v) => v != null);
  const maxs = days.map((d) => d.max).filter((v) => v != null);
  const lo = mins.length ? Math.min(...mins) : null;
  const hi = maxs.length ? Math.max(...maxs) : null;
  const span = hi != null && lo != null ? hi - lo || 1 : 1;

  return (
    <section className="card overflow-hidden">
      <header className="section-header">
        <h2 className="section-title">7-day outlook</h2>
        <span className="num text-[10px]" style={{ color: "var(--ink-3)" }}>
          {lo != null ? `${convertTemp(lo, unit)}\u00B0 \u2013 ${convertTemp(hi, unit)}\u00B0` : ""}
        </span>
      </header>

      {days.length === 0 ? (
        <p className="px-5 py-8 text-center text-[12px]" style={{ color: "var(--ink-3)" }}>
          Daily forecast appears once a location is loaded.
        </p>
      ) : (
        <ul className="p-2">
          {days.map((d, i) => {
            // A missing min/max made these NaN, which rendered as "NaN%" widths.
            const hasRange = d.min != null && d.max != null && lo != null;
            const left = hasRange ? ((d.min - lo) / span) * 100 : 0;
            const width = hasRange ? Math.max(12, ((d.max - d.min) / span) * 100) : 12;
            const isToday = i === 0;
            const [, icon] = conditionMeta(d.code);

            return (
              <li
                key={d.date}
                className="flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-[var(--surface-2)]"
                style={{ background: isToday ? "var(--surface-2)" : "transparent" }}
              >
                <div className="w-[68px] shrink-0">
                  <p
                    className="text-[12px] font-medium leading-none"
                    style={{ color: isToday ? "var(--ink)" : "var(--ink-2)" }}
                  >
                    {dayLabel(d.date, i)}
                  </p>
                  <p className="num mt-1 text-[10px]" style={{ color: "var(--ink-3)" }}>
                    {shortDate(d.date)}
                  </p>
                </div>

                <div className="flex w-10 shrink-0 items-center gap-1.5">
                  <span className="text-base leading-none">{icon}</span>
                  {d.pop > 0 && (
                    <span className="num text-[9px]" style={{ color: "var(--accent)" }}>
                      {d.pop}%
                    </span>
                  )}
                </div>

<span className="num w-8 shrink-0 text-right text-[11px]" style={{ color: "var(--ink-3)" }}>
                      {convertTemp(d.min, unit)}&deg;
                    </span>

                <div
                  className="relative h-1 flex-1 overflow-hidden rounded-full"
                  style={{ background: "var(--surface-3)" }}
                >
                  <div
                    className="absolute inset-y-0 rounded-full"
                    style={{
                      left: `${Math.max(0, left)}%`,
                      width: `${Math.min(100 - Math.max(0, left), width)}%`,
                      background: isToday ? "var(--accent)" : "var(--ink-3)",
                      opacity: isToday ? 1 : 0.4,
                    }}
                  />
                </div>

                <span className="num w-8 shrink-0 text-[11px] font-semibold" style={{ color: "var(--ink)" }}>
                  {convertTemp(d.max, unit)}&deg;
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
