import { useState, useEffect } from "react";
import { TIMELINE_SLICES } from "../data/mockWeatherData";

const SCALES = [
  { k: "Wind", a: "0", b: "120 km/h", css: "linear-gradient(90deg,var(--surface-3),var(--info),var(--bad))" },
  { k: "Rain", a: "0", b: "25+ mm/h", css: "linear-gradient(90deg,var(--surface-3),var(--accent),var(--warn),var(--bad))" },
  { k: "Temp", a: "10", b: "45 \u00B0C", css: "linear-gradient(90deg,var(--surface-3),var(--info),var(--warn),var(--bad))" },
  { k: "Pressure", a: "980", b: "1030 hPa", css: "linear-gradient(90deg,var(--surface-3),var(--accent))" },
];

export default function TimelineControls({ activeSliceIndex, onChangeSliceIndex }) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      onChangeSliceIndex((prev) => (prev + 1) % TIMELINE_SLICES.length);
    }, 2000 / speed);
    return () => clearInterval(id);
  }, [playing, speed, onChangeSliceIndex]);

  const step = (delta) =>
    onChangeSliceIndex(
      (prev) => (prev + delta + TIMELINE_SLICES.length) % TIMELINE_SLICES.length
    );

  return (
    <section className="card flex h-[300px] flex-col overflow-hidden p-4">
      <header className="flex items-start justify-between gap-2">
        <div>
          <h2 className="section-title">Timeline</h2>
          <p className="mt-0.5 text-[10px]" style={{ color: "var(--ink-3)" }}>
            Forecast playback
          </p>
        </div>
        <span className="stat-chip chip-accent">{speed}&times;</span>
      </header>

      <div className="mt-4 flex items-center gap-2">
        <button onClick={() => step(-1)} className="btn h-8 w-8 p-0" aria-label="Step back">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M15 6 9 12l6 6V6Z" />
          </svg>
        </button>

        <button
          onClick={() => setPlaying((p) => !p)}
          className="btn btn-primary h-8 w-8 p-0"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          )}
        </button>

        <button onClick={() => step(1)} className="btn h-8 w-8 p-0" aria-label="Step forward">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9 6l6 6-6 6V6Z" />
          </svg>
        </button>

        <button onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))} className="btn ml-auto">
          {speed}&times; speed
        </button>
      </div>

      <div className="mt-4">
        <input
          type="range"
          min="0"
          max={TIMELINE_SLICES.length - 1}
          value={activeSliceIndex}
          onChange={(e) => onChangeSliceIndex(Number(e.target.value))}
          aria-label="Timeline position"
          className="h-[3px] w-full cursor-pointer appearance-none rounded-full"
          style={{ background: "var(--surface-3)", accentColor: "var(--accent)" }}
        />
        <div className="mt-2.5 flex justify-between">
          {TIMELINE_SLICES.map((s, i) => (
            <button
              key={s.time}
              onClick={() => onChangeSliceIndex(i)}
              className="num text-[10px] transition-colors"
              style={{ color: i === activeSliceIndex ? "var(--accent)" : "var(--ink-3)" }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-4" style={{ borderColor: "var(--border)" }}>
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
    </section>
  );
}
