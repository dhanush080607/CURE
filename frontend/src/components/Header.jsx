import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { THEMES } from "../theme";

const THEME_ICON = {
  light: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2.5v2M12 19.5v2M4.4 4.4l1.4 1.4M18.2 18.2l1.4 1.4M2.5 12h2M19.5 12h2M4.4 19.6l1.4-1.4M18.2 5.8l1.4-1.4" />
    </svg>
  ),
  dark: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  ),
  system: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path strokeLinecap="round" d="M8 20.5h8" />
    </svg>
  ),
};

const IS_MAC =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || "");

function useClock() {
  const [clock, setClock] = useState({ local: "--:--:--", utc: "--:--:--", tz: "" });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      setClock({
        local: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
        utc: `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}`,
        tz,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return clock;
}

export default function Header({
  place,
  weather,
  unit,
  onToggleUnit,
  theme,
  onThemeChange,
  onOpenSearch,
}) {
  const clock = useClock();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenSearch]);

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{
        borderColor: "var(--border)",
        background: "color-mix(in srgb, var(--bg) 86%, transparent)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-[1800px] items-center gap-4 px-4 sm:px-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Go to dashboard"
        >
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"
                stroke="var(--accent)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="2.4" fill="var(--accent)" />
            </svg>
          </div>
          <span className="leading-none">
            <span className="block text-[13px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
              METEO<span style={{ color: "var(--ink-3)", fontWeight: 400 }}>/intelligence</span>
            </span>
            <span className="mt-1 hidden text-[10px] sm:block" style={{ color: "var(--ink-3)" }}>
              Climate &amp; water operations
            </span>
          </span>
        </button>

        <button
          onClick={onOpenSearch}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full px-3 py-2 text-left transition-colors hover:border-[var(--border-2)] sm:max-w-sm"
          style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" strokeLinecap="round" />
          </svg>
          <span className="truncate text-[12px]" style={{ color: "var(--ink-3)" }}>
            {place?.name ? `${place.name}, ${place.country || ""}`.replace(/,\s*$/, "") : "Search any location"}
          </span>
          <kbd
            className="num ml-auto hidden shrink-0 rounded px-1.5 py-0.5 text-[9px] sm:block"
            style={{ border: "1px solid var(--border-2)", color: "var(--ink-3)" }}
          >
            {IS_MAC ? "K" : "Ctrl K"}
          </kbd>
        </button>

        <div className="flex flex-1 items-center justify-end gap-2">
          {place?.lat != null && (
            <div
              className="hidden items-center gap-2 rounded-full px-2.5 py-1.5 lg:flex"
              style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
            >
              <span className={`dot ${weather ? "bg-[var(--good)] animate-pulse" : "bg-[var(--warn)]"}`} />
              <div className="leading-tight">
                <p className="text-[11px] font-medium" style={{ color: "var(--ink)" }}>
                  {place.name}
                </p>
                <p className="num text-[9px]" style={{ color: "var(--ink-3)" }}>
                  {place.lat.toFixed(2)}, {place.lon.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <div className="segment" role="group" aria-label="Temperature unit">
            {["C", "F"].map((u) => (
              <button
                key={u}
                onClick={() => {
                  if (u !== unit) onToggleUnit();
                }}
                aria-pressed={unit === u}
                className={`segment-item ${unit === u ? "active" : ""}`}
              >
                &deg;{u}
              </button>
            ))}
          </div>

          <div
            className="hidden rounded-full px-2.5 py-1.5 text-right leading-tight md:block"
            style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
          >
            <p className="num text-[11px]" style={{ color: "var(--ink)" }}>{clock.local}</p>
            <p className="num mt-0.5 text-[9px]" style={{ color: "var(--ink-3)" }}>
              {clock.utc} UTC
            </p>
          </div>

          <div className="segment" role="group" aria-label="Theme">
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => onThemeChange(t)}
                title={`${t[0].toUpperCase()}${t.slice(1)} theme`}
                aria-label={`${t} theme`}
                aria-pressed={theme === t}
                className={`segment-item px-2 ${theme === t ? "active" : ""}`}
              >
                {THEME_ICON[t]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
