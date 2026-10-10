import { HOURLY_FORECAST_MADANAPALLE } from "../data/mockWeatherData";

const ICONS = {
  rain: "\uD83D\uDCA7",
  sunny: "\u2600\uFE0F",
  "clear-night": "\uD83C\uDF19",
  cloudy: "\u2601\uFE0F",
  "partly-cloudy": "\u26C5",
  storm: "\u26C8\uFE0F",
};

export default function HourlyForecast({ unit }) {
  const fmt = (c) => (unit === "C" ? `${c}\u00B0` : `${Math.round((c * 9) / 5 + 32)}\u00B0`);

  return (
    <section className="card overflow-hidden">
      <header className="section-header">
        <h2 className="section-title">Next 24 hours</h2>
        <span className="text-[10px]" style={{ color: "var(--ink-3)" }}>Open-Meteo</span>
      </header>

      <div className="flex gap-1.5 overflow-x-auto p-3">
        {HOURLY_FORECAST_MADANAPALLE.map((slot, i) => {
          const isNow = i === 0;
          return (
            <div
              key={i}
              className="flex w-[58px] shrink-0 flex-col items-center gap-2 rounded-lg border px-1 py-2.5"
              style={{
                borderColor: isNow ? "color-mix(in srgb, var(--accent) 40%, transparent)" : "var(--border)",
                background: isNow ? "var(--accent-wash)" : "var(--surface-2)",
              }}
            >
              <span
                className="text-[10px] font-medium"
                style={{ color: isNow ? "var(--accent)" : "var(--ink-3)" }}
              >
                {isNow ? "Now" : slot.time}
              </span>
              <span className="text-lg leading-none">{ICONS[slot.conditionCode] ?? "\u26C5"}</span>
              <span className="num text-[12px] font-semibold" style={{ color: "var(--ink)" }}>
                {fmt(slot.temp)}
              </span>
              <div className="w-full">
                <div className="h-[3px] w-full overflow-hidden rounded-full" style={{ background: "var(--surface-3)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${slot.pop}%`, background: "var(--accent)", opacity: 0.7 }}
                  />
                </div>
                <p className="num mt-1 text-center text-[9px]" style={{ color: "var(--ink-3)" }}>
                  {slot.pop}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
