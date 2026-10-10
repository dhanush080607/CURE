import { useEffect, useRef, useState, useCallback } from "react";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";

const OWM_KEY = (import.meta.env.VITE_OWM_KEY || "").trim();

const STYLES = {
  dark: "https://tiles.openfreemap.org/styles/dark",
  light: "https://tiles.openfreemap.org/styles/liberty",
};

const INDIA_BOUNDS = [
  [68.1, 6.5],
  [97.4, 35.6],
];

const OWM_TILES = {
  clouds: {
    build: () => `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
    opacity: 0.5,
  },
  temp: {
    build: () => `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
    opacity: 0.4,
  },
  wind: {
    build: () => `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
    opacity: 0.5,
  },
};

const RAINVIEWER_META = "https://api.rainviewer.com/public/weather-maps.json";
const RAINVIEWER_FRAME_MS = 450;

const OVERLAYS = [
  { id: "radar", label: "Radar", dot: "#22d3ee", keyless: true },
  { id: "clouds", label: "Clouds", dot: "#8a8a95", keyless: false },
  { id: "wind", label: "Wind", dot: "#8ab4f8", keyless: false },
  { id: "temp", label: "Temperature", dot: "#f5c451", keyless: false },
];

const EMPTY = { radar: false, temp: false, wind: false, clouds: false };

function themeName() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function WorldMap({ place, status, source, onSelectPoint, onOpenLocationSearch }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const radarRef = useRef({ timer: null, frames: [], source: null });
  const owmErrRef = useRef({ count: 0, flagged: false });
  const onSelectRef = useRef(onSelectPoint);
  const overlaysRef = useRef(EMPTY);
  const styleReadyRef = useRef(false);
  const fittedRef = useRef(false);
  const activeStyleRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  const [radarStatus, setRadarStatus] = useState("idle");
  const [owmStatus, setOwmStatus] = useState(OWM_KEY ? "ready" : "nokey");
  const [overlays, setOverlays] = useState(EMPTY);

  useEffect(() => {
    onSelectRef.current = onSelectPoint;
  }, [onSelectPoint]);

  useEffect(() => {
    overlaysRef.current = overlays;
  }, [overlays]);

  /* ---------------- map init ---------------- */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let disposed = false;
    let map = null;

    import("maplibre-gl").then((lib) => {
      if (disposed || mapRef.current) return;
      lib.setWorkerUrl(maplibreWorkerUrl);
      const { Map: MapLibreMap, NavigationControl, ScaleControl } = lib;

      const missingIcon = {
        width: 20,
        height: 20,
        data: new Uint8Array(400),
      };

      map = new MapLibreMap({
        container: containerRef.current,
        style: STYLES[themeName()],
        center: [78.9, 22.5],
        zoom: 4,
        minZoom: 2,
        maxZoom: 14,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
      });

      map.addControl(new NavigationControl({ showCompass: false }), "bottom-right");
      map.addControl(new ScaleControl({ unit: "metric", maxWidth: 90 }), "bottom-left");

      activeStyleRef.current = STYLES[themeName()];

      map.setMissingStyleImageResolver((params) => {
        if (params?.name) {
          const dot = document.createElement("canvas");
          dot.width = 12;
          dot.height = 12;
          const ctx = dot.getContext("2d");
          if (ctx) {
            ctx.beginPath();
            ctx.arc(6, 6, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#4c9aff";
            ctx.fill();
          }
          return {
            width: 12,
            height: 12,
            data: dot,
          };
        }
        return missingIcon;
      });

      map.on("error", (e) => {
        const msg = String(e?.error?.message || "");
        if (msg.includes("tile.openweathermap.org")) {
          owmErrRef.current.count += 1;
          if (owmErrRef.current.count > 8 && !owmErrRef.current.flagged) {
            owmErrRef.current.flagged = true;
            setOwmStatus("failed");
          }
        }
      });

      map.on("click", (e) => {
        onSelectRef.current?.({ lat: e.lngLat.lat, lon: e.lngLat.lng });
      });

      map.on("load", () => {
        if (disposed) return;
        styleReadyRef.current = true;
        setMapReady(true);
        if (!fittedRef.current) {
          fittedRef.current = true;
          map.fitBounds(INDIA_BOUNDS, { padding: 48, duration: 0 });
        }
      });

      map.on("styledata", () => {
        styleReadyRef.current = false;
      });

      map.on("idle", () => {
        styleReadyRef.current = true;
      });

      map.getCanvas().style.cursor = "crosshair";
      mapRef.current = map;
    });

    return () => {
      disposed = true;
      if (radarRef.current.timer) clearInterval(radarRef.current.timer);
      radarRef.current = { timer: null, frames: [], source: null };
      map?.remove();
      mapRef.current = null;
      styleReadyRef.current = false;
      setMapReady(false);
    };
  }, []);

  /* ---------------- theme -> basemap style ---------------- */
  useEffect(() => {
    const apply = () => {
      const next = STYLES[themeName()];
      const map = mapRef.current;
      if (!map) return;
      // `getStyle()` returns parsed style JSON, not the stylesheet URL, so the
      // applied URL is tracked in a ref instead.
      if (activeStyleRef.current === next) return;

      activeStyleRef.current = next;
      styleReadyRef.current = false;
      map.setStyle(next);

      const settle = () => {
        styleReadyRef.current = true;
        setOverlays({ ...EMPTY });
        if (fittedRef.current && place?.lat != null) {
          map.easeTo({ center: [place.lon, place.lat], zoom: 9, duration: 600 });
        }
      };

      if (map.isStyleLoaded()) settle();
      else map.once("idle", settle);
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
    // `place` is read only to re-centre after a style swap; it must not itself
    // retrigger this effect, otherwise every selection reloads the basemap.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady]);

  /* ---------------- fly to selected place ---------------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !place || place.lat == null) return;

    const fly = () => {
      map.easeTo({ center: [place.lon, place.lat], zoom: 9, duration: 800 });
    };

    if (styleReadyRef.current) fly();
    else map.once("idle", fly);
  }, [place]);

  const toggle = useCallback((id) => {
    setOverlays((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const stopRadar = useCallback((map) => {
    if (radarRef.current.timer) {
      clearInterval(radarRef.current.timer);
      radarRef.current.timer = null;
    }
    if (!map) return;
    if (map.getLayer?.("radar")) map.removeLayer("radar");
    // The source must be dropped too, otherwise re-enabling throws
    // "There is already a source with id 'radar-src'".
    if (map.getSource?.("radar-src")) map.removeSource("radar-src");
    radarRef.current.frames = [];
  }, []);

  /* ---------------- radar ---------------- */

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;

    if (!overlays.radar) {
      stopRadar(map);
      return;
    }

    let cancelled = false;
    fetch(RAINVIEWER_META)
      .then((r) => {
        if (!r.ok) throw new Error("RainViewer");
        return r.json();
      })
      .then((meta) => {
        if (cancelled) return;
        const past = meta?.radar?.past ?? [];
        if (!past.length) throw new Error("no frames");

        const frames = past.map((f) => `${meta.host}${f.path}/256/{z}/{x}/{y}/8/1_1.png`);

        stopRadar(map);

        map.addSource("radar-src", {
          type: "raster",
          tiles: [frames[frames.length - 1]],
          tileSize: 256,
          maxzoom: 7,
        });
        map.addLayer({
          id: "radar",
          type: "raster",
          source: "radar-src",
          paint: { "raster-opacity": 0.72 },
        });
        radarRef.current.frames = frames;
        setRadarStatus("live");

        let cursor = 0;
        radarRef.current.timer = setInterval(() => {
          cursor = (cursor + 1) % frames.length;
          const src = map.getSource("radar-src");
          if (src) src.setTiles([frames[cursor]]);
        }, RAINVIEWER_FRAME_MS);
      })
      .catch(() => { if (!cancelled) { stopRadar(map); setRadarStatus("error"); } });

    return () => {
      cancelled = true;
    };
  }, [overlays.radar, mapReady, stopRadar]);

  /* ---------------- openweathermap overlays ---------------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map || !OWM_KEY) return;

    Object.entries(OWM_TILES).forEach(([id, cfg]) => {
      const layerId = `owm-${id}`;
      const shouldShow = overlays[id];

      if (shouldShow && !map.getLayer(layerId)) {
        if (!map.getSource(layerId)) {
          map.addSource(layerId, {
            type: "raster",
            tiles: [cfg.build()],
            tileSize: 256,
            maxzoom: 12,
          });
        }
        map.addLayer({
          id: layerId,
          type: "raster",
          source: layerId,
          paint: { "raster-opacity": cfg.opacity },
        });
      } else if (!shouldShow && map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
    });
  }, [overlays, mapReady]);

  const loading = status === "loading";

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="h-[440px] w-full sm:h-[520px] lg:h-[600px]">
        <div ref={containerRef} className="h-full w-full" />
      </div>

      {!mapReady && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3"
          style={{ background: "var(--surface)" }}
        >
          <div
            className="h-8 w-8 animate-spin rounded-full border-2"
            style={{ borderColor: "var(--border-2)", borderTopColor: "var(--accent)" }}
          />
          <p className="text-[11px]" style={{ color: "var(--ink-3)" }}>
            Loading basemap
          </p>
        </div>
      )}

      {mapReady && (
        <>
          {!place?.name && !loading && (
            <div
              className="glass pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full px-3.5 py-1.5"
              style={{ border: "1px solid var(--border)" }}
            >
              <p className="text-[11px]" style={{ color: "var(--ink-2)" }}>
                Click anywhere on the map to load weather
              </p>
            </div>
          )}

          {loading && (
            <div
              className="glass absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full px-3.5 py-1.5"
              style={{ border: "1px solid var(--border)" }}
            >
              <span
                className="h-2.5 w-2.5 animate-spin rounded-full border-2"
                style={{ borderColor: "var(--border-2)", borderTopColor: "var(--accent)" }}
              />
              <span className="text-[11px]" style={{ color: "var(--ink-2)" }}>
                Loading conditions
              </span>
            </div>
          )}

          <div
            className="glass absolute right-3 top-3 z-10 w-[152px] rounded-xl border p-1"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="label px-1.5 py-1">Overlays</p>
            {OVERLAYS.map((b) => {
              const locked = !b.keyless && !OWM_KEY;
              return (
                <button
                  key={b.id}
                  onClick={() => !locked && toggle(b.id)}
                  disabled={locked}
                  title={locked ? "Add VITE_OWM_KEY to .env and restart" : `Toggle ${b.label.toLowerCase()} overlay`}
                  aria-pressed={overlays[b.id]}
                  className={`layer-btn ${overlays[b.id] ? "active" : ""} ${locked ? "opacity-40" : ""}`}
                >
                  <span
                    className="dot"
                    style={{ background: b.dot, opacity: overlays[b.id] ? 1 : 0.3 }}
                  />
                  {b.label}
                  {locked && (
                    <span className="ml-auto text-[9px]" style={{ color: "var(--ink-3)" }}>
                      KEY
                    </span>
                  )}
                  {b.id === "radar" && overlays.radar && (
                    <span
                      className={`dot ml-auto ${
                        radarStatus === "live"
                          ? "bg-[var(--good)] animate-pulse"
                          : radarStatus === "error"
                            ? "bg-[var(--bad)]"
                            : "bg-[var(--warn)]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
            {owmStatus === "failed" && (
              <p className="px-1.5 py-1 text-[9px] leading-snug" style={{ color: "var(--bad)" }}>
                Tile host rejected the key.
              </p>
            )}
          </div>

          <div className="glass absolute bottom-2 left-2 z-10 rounded-md px-1.5 py-0.5 text-[9px] leading-tight"
            style={{ border: "1px solid var(--border)", color: "var(--ink-3)" }}
          >
            OpenFreeMap &middot; OpenStreetMap
          </div>

          <div className="absolute bottom-2 right-2 z-10 flex flex-col items-end gap-1.5">
            <div className="flex gap-1.5">
              {source && (
                <span
                  className="glass rounded-md px-1.5 py-0.5 text-[9px]"
                  style={{ border: "1px solid var(--border)", color: "var(--ink-3)" }}
                >
                  {source === "wttr" ? "wttr.in" : "Open-Meteo"}
                </span>
              )}
              {overlays.radar && (
                <span
                  className="glass rounded-md px-1.5 py-0.5 text-[9px]"
                  style={{ border: "1px solid var(--border)", color: "var(--ink-3)" }}
                >
                  RainViewer
                </span>
              )}
              {OWM_KEY && overlays.temp && (
                <span
                  className="glass rounded-md px-1.5 py-0.5 text-[9px]"
                  style={{ border: "1px solid var(--border)", color: "var(--ink-3)" }}
                >
                  OpenWeatherMap
                </span>
              )}
            </div>
            <button
              onClick={onOpenLocationSearch}
              className="glass rounded-md px-2 py-1 text-[10px] font-medium transition-colors hover:border-[var(--border-2)]"
              style={{ border: "1px solid var(--border)", color: "var(--ink-2)" }}
            >
              Change location
            </button>
          </div>
        </>
      )}
    </div>
  );
}
