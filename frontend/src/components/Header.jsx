import { useState, useEffect, useRef } from "react";
import { SAMPLE_LOCATIONS } from "../data/mockWeatherData";
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

export default function Header({
  selectedLocation,
  onSelectLocation,
  unit,
  onToggleUnit,
  theme,
  onThemeChange,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [clock, setClock] = useState({ utc: "--:--:--", ist: "--:--" });
  const searchRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const ist = new Date(now.getTime() + 5.5 * 3600 * 1000);
      setClock({
        utc: `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`,
        ist: `${pad(ist.getUTCHours())}:${pad(ist.getUTCMinutes())}`,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = SAMPLE_LOCATIONS.filter((loc) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return [loc.city, loc.name, loc.country, loc.region]
      .filter(Boolean)
      .some((v) => v.toLowerCase().includes(q));
  });

  const toF = (c) => Math.round((c * 9) / 5 + 32);

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg) 86%, transparent)" }}
    >
      <div className="mx-auto flex h-14 max-w-[1800px] items-center gap-4 px-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-2.5">
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
          <div className="leading-none">
            <div className="text-[13px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
              METEO<span style={{ color: "var(--ink-3)", fontWeight: 400 }}>/intelligence</span>
            </div>
            <div className="mt-1 hidden text-[10px] sm:block" style={{ color: "var(--ink-3)" }}>
              Climate &amp; water operations
            </div>
          </div>
        </div>

        <div ref={searchRef} className="relative min-w-0 flex-1 sm:max-w-sm">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="var(--ink-3)" strokeWidth="2" aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search stations"
            value={searchQuery}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            className="w-full rounded-full py-2 pl-9 pr-3 text-[12px] outline-none transition-colors"
            style={{
              border: "1px solid var(--border)",
              background: "var(--surface-2)",
              color: "var(--ink)",
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSearchOpen(false);
            }}
          />

          {searchOpen && (
            <div
              className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl animate-slideUp"
              style={{
                border: "1px solid var(--border-2)",
                background: "var(--surface)",
                boxShadow: "var(--shadow-pop)",
              }}
            >
              <div
                className="flex items-center justify-between border-b px-3 py-2"
                style={{ borderColor: "var(--border)" }}
              >
                <span className="label">Monitoring network</span>
                <span className="num text-[10px]" style={{ color: "var(--ink-3)" }}>
                  {filtered.length}
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filtered.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      onSelectLocation(loc);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex w-full items-center justify-between gap-3 border-b px-3 py-2.5 text-left transition-colors last:border-0 hover:bg-[var(--surface-2)]"
                    style={{
                      borderColor: "var(--border)",
                      background:
                        selectedLocation?.id === loc.id ? "var(--surface-2)" : "transparent",
                    }}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium" style={{ color: "var(--ink)" }}>
                        {loc.name || loc.city}
                      </p>
                      <p className="mt-0.5 truncate text-[10px]" style={{ color: "var(--ink-3)" }}>
                        {loc.region}
                      </p>
                    </div>
                    <span className="num shrink-0 text-[12px] font-semibold" style={{ color: "var(--accent)" }}>
                      {unit === "C" ? `${loc.temp}Â°` : `${toF(loc.temp)}Â°`}
                    </span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="px-3 py-6 text-center text-[11px]" style={{ color: "var(--ink-3)" }}>
                    No stations found
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <div
            className="hidden items-center gap-2 rounded-full px-2.5 py-1.5 lg:flex"
            style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
          >
            <span className="dot bg-[var(--good)]" />
            <div className="leading-tight">
              <p className="text-[11px] font-medium" style={{ color: "var(--ink)" }}>
                {selectedLocation?.city}
              </p>
              <p className="num text-[9px]" style={{ color: "var(--ink-3)" }}>
                {selectedLocation?.lat?.toFixed(2)}, {selectedLocation?.lon?.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="segment">
            {["C", "F"].map((u) => (
              <button
                key={u}
                onClick={onToggleUnit}
                className={`segment-item ${unit === u ? "active" : ""}`}
              >
                Â°{u}
              </button>
            ))}
          </div>

          <div
            className="hidden rounded-full px-2.5 py-1.5 text-right leading-tight md:block"
            style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
          >
            <p className="num text-[11px]" style={{ color: "var(--ink)" }}>{clock.utc}</p>
            <p className="num mt-0.5 text-[9px]" style={{ color: "var(--ink-3)" }}>
              {clock.ist} IST
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
