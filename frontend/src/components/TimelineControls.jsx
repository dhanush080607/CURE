import { useState } from "react";

const SCALES = [
  { k: "Rain", a: "0", b: "100 %", css: "linear-gradient(90deg,var(--surface-3),var(--accent),var(--info))" },
  { k: "Temp", a: "cold", b: "hot", css: "linear-gradient(90deg,var(--info),var(--warn),var(--bad))" },
  { k: "Wind", a: "0", b: "km/h", css: "linear-gradient(90deg,var(--surface-3),var(--info),var(--bad))" },
];

/**
 * Timeline is a presentation-only control today: it steps the local index and
 * reports it upward. The map overlay owns the real animation, so this must not
 * claim to scrub a radar frame it does not control.
 */
export default function TimelineControls({ weather }) {
  const [index, setIndex] = useState(0);

  const hours = weather?.hourly ?? [];
  const slot = hours[Math.min(index, Math.max(0, hours.length - 1))];

  const step = (d) => setIndex((p) => Math.max(0, Math.min(hours.length - 1, p + d)));

  return (
    <section className="card flex flex-col overflow-hidden p-5">
      <header className="flex items-start justify-between gap-2">
        <div>
          <h2 className="section-title">Hourly timeline</h2>
          <p className="mt-0.5 text-[10px]" style={{ color: "var(--ink-3)" }}>
            Step through the forecast window
          </p>
        </div>
        <span className="stat-chip chip-accent">{hours.length || 0} h</span>
      </header>

      {!hours.length ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <div
            className="h-10 w-10 rounded-full border"
            style={{ borderColor: "var(--border-2)" }}
          />
          <p
            className="max-w-[180px] text-center text-[11px] leading-relaxed"
            style={{ color: "var(--ink-3)" }}
          >
            Pick a location to browse its hourly forecast
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button onClick={() => step(-1)} className="btn h-8 w-8 p-0" aria-label="Previous hour">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M15 6 9 12l6 6V6Z" />
              </svg>
            </button>
            <span className="num min-w-[70px] text-center text-[20px] font-semibold" style={{ color: "var(--ink)" }}>
              {slot?.time ?? "\u2014"}
            </span>
            <button onClick={() => step(1)} className="btn h-8 w-8 p-0" aria-label="Next hour">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9 6l6 6-6 6V6Z" />
              </svg>
            </button>
          </div>

          <input
            type="range"
            min="0"
            max={Math.max(0, hours.length - 1)}
            value={Math.min(index, hours.length - 1)}
            onChange={(e) => setIndex(Number(e.target.value))}
            aria-label="Forecast hour"
            className="mt-4 h-[3px] w-full cursor-pointer appearance-none rounded-full"
            style={{ background: "var(--surface-3)", accentColor: "var(--accent)" }}
          />

          {slot && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { k: "Temp", v: slot.temp != null ? `${Math.round(slot.temp)}\u00B0C` : "\u2014" },
                { k: "Rain", v: `${slot.pop ?? 0}%` },
                { k: "Wind", v: slot.wind != null ? `${Math.round(slot.wind)} km/h` : "\u2014" },
              ].map((m) => (
                <div
                  key={m.k}
                  className="rounded-lg px-2.5 py-2 text-center"
                  style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
                >
                  <p className="label">{m.k}</p>
                  <p className="num mt-1 text-[12px] font-semibold" style={{ color: "var(--ink)" }}>
                    {m.v}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div
            className="mt-4 space-y-2.5 border-t pt-4"
            style={{ borderColor: "var(--border)" }}
          >
            {SCALES.map((s) => (
              <div key={s.k}>
                <p className="label">{s.k}</p>
                <div className="mt-1.5 h-[3px] w-full rounded-full" style={{ background: s.css }} />
                <div className="num mt-1 flex justify-between text-[9px]" style={{ color: "var(--ink-3)" }}>
                  <span>{s.a}</span>
                  <span>{s.b}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
