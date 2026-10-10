import { useEffect, useRef, useState } from "react";
import { searchPlaces } from "../data/liveWeather";
import { useDebounced } from "../hooks/useWeather";

const RECENT_KEY = "cure.recent";

function readRecent() {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    // Stored values are user-writable, so drop anything that is not a finite
    // coordinate pair. Rendering later calls .toFixed() on these.
    return raw
      .filter(
        (r) =>
          r &&
          typeof r === "object" &&
          Number.isFinite(Number(r.lat)) &&
          Number.isFinite(Number(r.lon))
      )
      .slice(0, 6);
  } catch {
    return [];
  }
}

function fmtCoord(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(2) : "—";
}

export default function LocationSearch({ onClose, onPick }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState(readRecent);
  const inputRef = useRef(null);
  const debounced = useDebounced(query, 280);
  const q = query.trim();
  const busy = q.length >= 2 && q !== debounced.trim();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const dq = debounced.trim();
    if (dq.length < 2) return;

    let alive = true;
    searchPlaces(dq)
      .then((r) => {
        if (alive) setResults(r);
      })
      .catch(() => {
        if (alive) setResults([]);
      });
    return () => {
      alive = false;
    };
  }, [debounced]);

  const handleQuery = (value) => {
    setQuery(value);
    if (value.trim().length < 2) setResults([]);
  };

  const remember = (place) => {
    try {
      const next = [
        { id: place.id, name: place.name, lat: place.lat, lon: place.lon, country: place.country },
        ...readRecent().filter((r) => r.id !== place.id),
      ].slice(0, 6);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      setRecent(next);
    } catch {
      /* storage unavailable */
    }
  };

  const pick = (place) => {
    remember(place);
    onPick(place);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[14vh]">
      <button
        className="absolute inset-0 cursor-default backdrop-blur-sm"
        style={{ background: "color-mix(in srgb, var(--bg) 72%, transparent)" }}
        onClick={onClose}
        aria-label="Close location search"
        tabIndex={-1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search for a location"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl animate-slideUp"
        style={{
          border: "1px solid var(--border-2)",
          background: "var(--surface)",
          boxShadow: "var(--shadow-pop)",
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            placeholder="Search any city, town or place"
            aria-label="Search for a city, town or place"
            className="flex-1 bg-transparent text-[14px] outline-none"
            style={{ color: "var(--ink)" }}
          />
          {busy && (
            <span
              className="h-3.5 w-3.5 animate-spin rounded-full border-2"
              style={{ borderColor: "var(--border-2)", borderTopColor: "var(--accent)" }}
            />
          )}
          <button
            onClick={onClose}
            className="btn h-7 px-2.5 text-[11px]"
            aria-label="Close search"
          >
            Esc
          </button>
        </div>

        {query.trim().length < 2 && recent.length > 0 && (
          <div className="border-t" style={{ borderColor: "var(--border)" }}>
            <p className="label px-4 pb-1 pt-3">Recent</p>
            <ul className="pb-2">
              {recent.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => pick(r)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-[var(--surface-2)]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13px]" style={{ color: "var(--ink)" }}>
                        {r.name}
                      </span>
                      <span className="block truncate text-[11px]" style={{ color: "var(--ink-3)" }}>
                        {[r.country].filter(Boolean).join(", ")}
                      </span>
                    </span>
                    <span className="num shrink-0 text-[11px]" style={{ color: "var(--ink-3)" }}>
                      {fmtCoord(r.lat)}, {fmtCoord(r.lon)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.length > 0 && (
          <div className="border-t" style={{ borderColor: "var(--border)" }}>
            <p className="label px-4 pb-1 pt-3">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
            <ul className="max-h-72 overflow-y-auto pb-2">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => pick(r)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[var(--surface-2)]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13px]" style={{ color: "var(--ink)" }}>
                        {r.name}
                      </span>
                      <span className="block truncate text-[11px]" style={{ color: "var(--ink-3)" }}>
                        {[r.admin1, r.country].filter(Boolean).join(", ")}
                      </span>
                    </span>
                    <span className="num shrink-0 text-[11px]" style={{ color: "var(--ink-3)" }}>
                      {fmtCoord(r.lat)}, {fmtCoord(r.lon)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {debounced.trim().length >= 2 && !busy && results.length === 0 && (
          <p className="border-t px-4 py-6 text-center text-[12px]" style={{ borderColor: "var(--border)", color: "var(--ink-3)" }}>
            No matches for &ldquo;{debounced.trim()}&rdquo;
          </p>
        )}

        <div
          className="flex items-center justify-between border-t px-4 py-2 text-[10px]"
          style={{ borderColor: "var(--border)", color: "var(--ink-3)" }}
        >
          <span>Free search &middot; Open-Meteo geocoding</span>
          <span className="num">{results.length || ""}</span>
        </div>
      </div>
    </div>
  );
}
