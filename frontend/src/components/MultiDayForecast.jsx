import { TEN_DAY_FORECAST_MADANAPALLE } from "../data/mockWeatherData";

const COND_ICONS = {
  sunny: "\u2600\uFE0F",
  rain: "\uD83D\uDCA7",
  cloudy: "\u2601\uFE0F",
  "partly-cloudy": "\u26C5",
  storm: "\u26C8\uFE0F",
};

export default function MultiDayForecast({ unit }) {
  const fmt = (c) => (unit === "C" ? `${c}\u00B0` : `${Math.round((c * 9) / 5 + 32)}\u00B0`);

  const days = TEN_DAY_FORECAST_MADANAPALLE.slice(0, 7);
  const mins = days.map((d) => d.minTemp);
  const maxs = days.map((d) => d.maxTemp);
  const lo = Math.min(...mins);
  const hi = Math.max(...maxs);
  const span = hi - lo || 1;

  return (
    <section className="card overflow-hidden">
      <header className="section-header">
        <h2 className="section-title">7-day outlook</h2>
        <span className="num text-[10px]" style={{ color: "var(--ink-3)" }}>
          {lo}\u00B0 &ndash; {hi}\u00B0
        </span>
      </header>

      <ul className="p-2">
        {days.map((d, i) => {
          const left = ((d.minTemp - lo) / span) * 100;
          const width = Math.max(12, ((d.maxTemp - d.minTemp) / span) * 100);
          const isToday = i === 0;

          return (
            <li
              key={i}
              className="flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-[var(--surface-2)]"
              style={{ background: isToday ? "var(--surface-2)" : "transparent" }}
            >
              <div className="w-12 shrink-0">
                <p
                  className="text-[12px] font-medium leading-none"
                  style={{ color: isToday ? "var(--ink)" : "var(--ink-2)" }}
                >
                  {isToday ? "Today" : d.day}
                </p>
                <p className="num mt-1 text-[10px]" style={{ color: "var(--ink-3)" }}>
                  {d.date}
                </p>
              </div>

              <div className="flex w-10 shrink-0 items-center gap-1.5">
                <span className="text-base leading-none">{COND_ICONS[d.conditionCode] ?? "\u26C5"}</span>
                {d.pop > 0 && (
                  <span className="num text-[9px]" style={{ color: "var(--accent)" }}>
                    {d.pop}%
                  </span>
                )}
              </div>

              <span className="num w-8 shrink-0 text-right text-[11px]" style={{ color: "var(--ink-3)" }}>
                {fmt(d.minTemp)}
              </span>

              <div className="relative h-1 flex-1 overflow-hidden rounded-full" style={{ background: "var(--surface-3)" }}>
                <div
                  className="absolute inset-y-0 rounded-full"
                  style={{
                    left: `${Math.max(0, left)}%`,
                    width: `${Math.min(100 - left, width)}%`,
                    background: isToday ? "var(--accent)" : "var(--ink-3)",
                    opacity: isToday ? 1 : 0.45,
                  }}
                />
              </div>

              <span className="num w-8 shrink-0 text-[11px] font-semibold" style={{ color: "var(--ink)" }}>
                {fmt(d.maxTemp)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
