import { METRICS_STRIP } from "../data/mockWeatherData";

export default function MetricsStrip() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {METRICS_STRIP.map((m) => (
        <div
          key={m.id}
          className="card px-3.5 py-3 transition-colors hover:border-[var(--border-2)]"
        >
          <p
            className="num text-[18px] font-semibold leading-none tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            {m.value}
          </p>
          <p className="mt-2 text-[11px] leading-snug" style={{ color: "var(--ink-3)" }}>
            {m.label}
          </p>
        </div>
      ))}
    </div>
  );
}
