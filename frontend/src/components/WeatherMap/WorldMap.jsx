import { useEffect, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";
import { SAMPLE_LOCATIONS } from "../../data/mockWeatherData";
import { fetchLiveStations, conditionMeta, fmtTemp } from "../../data/liveWeather";

const USE_LIVE_STATIONS =
  import.meta.env.VITE_USE_LIVE_STATIONS !== "true";

const OWM_KEY = (import.meta.env.VITE_OWM_KEY || "").trim();
const OWM_TILES = {
  clouds: {
    build: () =>
      `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
    opacity: 0.5,
  },
  temp: {
    build: () =>
      `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
    opacity: 0.42,
  },
  wind: {
    build: () =>
      `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
    opacity: 0.55,
  },
};

const RAINVIEWER_META_URL = "https://api.rainviewer.com/public/weather-maps.json";
const RAINVIEWER_FRAME_MS = 450;

const OVERLAY_BUTTONS = [
  { id: "radar", label: "Radar", dot: "#22d3ee", keyless: true },
  { id: "clouds", label: "Clouds", dot: "#a09a92", keyless: false },
  { id: "wind", label: "Wind", dot: "#8ab4f8", keyless: false },
  { id: "temp", label: "Temperature", dot: "#f5c451", keyless: false },
];

function disposeMarkers(markersRef, popupRootsRef) {
  popupRootsRef.current.forEach((e) => e.root.unmount());
  popupRootsRef.current.clear();
  Object.values(markersRef.current).forEach((m) => m.remove());
  markersRef.current = {};
}

function stationMarkerEl(station, isSelected) {
  const color = isSelected
    ? "#7fee64"
    : station.isPrimary
      ? "var(--accent)"
      : "var(--ink-3)";
  const size = isSelected ? 15 : station.isPrimary ? 12 : 9;

  const el = document.createElement("div");
  el.className = "station-marker";
  el.style.cssText = `position:relative;width:${size}px;height:${size}px;color:${color};cursor:pointer;`;

  if (isSelected) {
    const pulse = document.createElement("div");
    pulse.className = "station-marker__pulse";
    el.appendChild(pulse);
  }

  const dot = document.createElement("div");
  dot.style.cssText = `position:absolute;inset:0;border-radius:9999px;background:${color};border:2px solid var(--bg);box-shadow:0 0 0 1px ${color}44;`;
  el.appendChild(dot);

  return el;
}

function PopupBody({ station, unit }) {
  const [icon, label] = conditionMeta(station.weatherCode);

  const cell = (k, v, accent) => (
    <div
      className="rounded-lg px-2.5 py-2"
      style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
    >
      <div className="label">{k}</div>
      <div
        className={`num mt-1 text-[13px] font-semibold ${accent ? "" : ""}`}
        style={{ color: accent ? "var(--accent)" : "var(--ink)" }}
      >
        {v}
      </div>
    </div>
  );

  return (
    <div className="w-[224px] p-3.5">
      <div className="mb-3 flex items-start justify-between gap-2 border-b pb-3"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
            {station.city || station.name}
          </div>
          <div className="mt-0.5 truncate text-[10px]" style={{ color: "var(--ink-3)" }}>
            {station.country}
          </div>
        </div>
        <div className="shrink-0 text-xl leading-none">{icon}</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {cell("Temperature", `${fmtTemp(station.temp, unit)}\u00B0${unit}`, true)}
        {cell("Condition", label)}
        {station.windSpeed != null &&
          cell("Wind", `${station.windSpeed} km/h ${station.windDirection || ""}`.trim())}
        {station.humidity != null && cell("Humidity", `${station.humidity}%`)}
      </div>

      <div
        className="mt-3 flex items-center justify-between border-t pt-2.5 text-[10px]"
        style={{ borderColor: "var(--border)", color: "var(--ink-3)" }}
      >
        <span className="num">
          {station.lat?.toFixed(3)}, {station.lon?.toFixed(3)}
        </span>
        <span style={{ color: station.live ? "var(--good)" : "var(--warn)" }}>
          {station.source || (station.live ? "live" : "sample")}
        </span>
      </div>
    </div>
  );
}

export default function WorldMap({
  selectedLocation,
  onSelectLocation,
  layers = [],
  unit = "C",
  currentTimeSlice,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const maplibreRef = useRef(null);
  const markersRef = useRef({});
  const popupRootsRef = useRef(new Map());
  const radarRef = useRef({ timer: null, index: 0 });
  const owmErrRef = useRef({ count: 0, flagged: false });
  const onSelectRef = useRef(onSelectLocation);
  const radarOpacityRef = useRef(0.5);

  const [stations, setStations] = useState(() =>
    SAMPLE_LOCATIONS.map((s, i) => ({ ...s, isPrimary: i === 0, live: false }))
  );
  const [mapReady, setMapReady] = useState(false);
  const [liveStatus, setLiveStatus] = useState("loading");
  const [source, setSource] = useState(null);
  const [radarStatus, setRadarStatus] = useState("idle");
  const [owmStatus, setOwmStatus] = useState(OWM_KEY ? "ready" : "nokey");
  const [overlays, setOverlays] = useState({
    radar: false,
    temp: false,
    wind: false,
    clouds: false,
  });

  useEffect(() => {
    onSelectRef.current = onSelectLocation;
  }, [onSelectLocation]);

  const radarActive = layers.find((l) => l.id === "radar")?.active ?? false;
  const windActive = layers.find((l) => l.id === "wind")?.active ?? false;
  const cloudsActive = layers.find((l) => l.id === "clouds")?.active ?? false;
  const tempActive = layers.find((l) => l.id === "temperature")?.active ?? false;

  const precipIntensity = Number(currentTimeSlice?.precipIntensity ?? 1);
  const radarOpacity = Math.max(0.3, Math.min(0.9, 0.4 + precipIntensity * 0.4));

  useEffect(() => {
    radarOpacityRef.current = radarOpacity;
  }, [radarOpacity]);

  useEffect(() => {
    let cancelled = false;
    if (!USE_LIVE_STATIONS) {
      setLiveStatus("sample");
      return;
    }
    fetchLiveStations(SAMPLE_LOCATIONS)
      .then((result) => {
        if (cancelled) return;
        setStations(result.stations);
        setSource(result.source);
        setLiveStatus("live");
      })
      .catch(() => !cancelled && setLiveStatus("error"));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let disposed = false;
    let map = null;

    import("maplibre-gl").then((lib) => {
      if (disposed || mapRef.current) return;
      maplibreRef.current = lib;
      lib.setWorkerUrl(maplibreWorkerUrl);
      const { Map: MapLibreMap, NavigationControl, AttributionControl } = lib;

      const theme = document.documentElement.dataset.theme || "dark";

      map = new MapLibreMap({
        container: containerRef.current,
        style:
          theme === "light"
            ? "https://tiles.openfreemap.org/styles/liberty"
            : "https://tiles.openfreemap.org/styles/dark",
        center: [78.35, 14.4],
        zoom: 5.6,
        minZoom: 2.5,
        maxZoom: 14,
        attributionControl: false,
      });

      map.addControl(new NavigationControl({ showCompass: false }), "bottom-right");
      map.addControl(new AttributionControl({ compact: true }), "bottom-left");

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

      map.on("load", () => !disposed && setMapReady(true));
      mapRef.current = map;
    });

    return () => {
      disposed = true;
      if (radarRef.current.timer) clearInterval(radarRef.current.timer);
      radarRef.current = { timer: null, index: 0 };
      map?.remove();
      mapRef.current = null;
      setMapReady(false);
      disposeMarkers(markersRef, popupRootsRef);
    };
  }, []);

  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    const { Marker, Popup } = maplibreRef.current ?? {};
    if (!map || !Marker || !Popup) return;

    disposeMarkers(markersRef, popupRootsRef);

    stations.forEach((station) => {
      const isSelected = selectedLocation?.id === station.id;

      const host = document.createElement("div");
      const root = createRoot(host);
      root.render(<PopupBody station={station} unit={unit} />);

      const popup = new Popup({
        offset: 16,
        closeButton: true,
        maxWidth: "260px",
        className: "station-popup",
      }).setDOMContent(host);

      const marker = new Marker({
        element: stationMarkerEl(station, isSelected),
        anchor: "center",
      })
        .setLngLat([station.lon, station.lat])
        .setPopup(popup)
        .addTo(map);

      marker.on("click", () => onSelectRef.current?.(station));

      popupRootsRef.current.set(station.id, { root, station });
      markersRef.current[station.id] = marker;
    });

    if (selectedLocation?.lon != null && selectedLocation?.lat != null) {
      map.easeTo({
        center: [selectedLocation.lon, selectedLocation.lat],
        zoom: Math.max(map.getZoom(), 6.2),
        duration: 900,
      });
    }
  }, [stations, selectedLocation, unit, mapReady]);

  const toggleOverlay = useCallback((id) => {
    setOverlays((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  useEffect(() => {
    setOverlays((prev) => ({
      ...prev,
      radar: radarActive,
      temp: tempActive,
      wind: windActive,
      clouds: cloudsActive,
    }));
  }, [radarActive, tempActive, windActive, cloudsActive]);

  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;

    if (!overlays.radar) {
      if (radarRef.current.timer) {
        clearInterval(radarRef.current.timer);
        radarRef.current.timer = null;
      }
      if (map.getLayer("radar")) map.removeLayer("radar");
      setRadarStatus((p) => (p === "error" ? p : "idle"));
      return;
    }

    let cancelled = false;
    fetch(RAINVIEWER_META_URL)
      .then((r) => {
        if (!r.ok) throw new Error("RainViewer");
        return r.json();
      })
      .then((meta) => {
        if (cancelled) return;
        const past = meta?.radar?.past ?? [];
        if (!past.length) throw new Error("no frames");

        const frames = past.map((f) => `${meta.host}${f.path}/256/{z}/{x}/{y}/8/1_1.png`);
        const latest = frames[frames.length - 1];

        if (map.getLayer("radar")) map.removeLayer("radar");
        if (!map.getSource("radar-src")) {
          map.addSource("radar-src", {
            type: "raster",
            tiles: [latest],
            tileSize: 256,
            maxzoom: 7,
          });
        } else {
          map.getSource("radar-src").setTiles([latest]);
        }

        map.addLayer({
          id: "radar",
          type: "raster",
          source: "radar-src",
          paint: { "raster-opacity": radarOpacityRef.current },
        });
        setRadarStatus("live");

        let cursor = 0;
        radarRef.current.index = frames.length - 1;
        radarRef.current.timer = setInterval(() => {
          cursor = (cursor + 1) % frames.length;
          radarRef.current.index = (frames.length - 1 + cursor) % frames.length;
          const src = map.getSource("radar-src");
          if (src) src.setTiles([frames[radarRef.current.index]]);
        }, RAINVIEWER_FRAME_MS);
      })
      .catch(() => !cancelled && setRadarStatus("error"));

    return () => {
      cancelled = true;
    };
  }, [overlays.radar, mapReady]);

  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    if (!map.getLayer("radar")) return;
    map.setPaintProperty("radar", "raster-opacity", radarOpacity);
  }, [radarOpacity, mapReady]);

  useEffect(() => {
    if (!mapReady || !OWM_KEY) return;
    const map = mapRef.current;

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

  const activeStation =
    stations.find((s) => s.id === selectedLocation?.id) ?? selectedLocation;
  const [condIcon] = conditionMeta(activeStation?.weatherCode);

  const liveBadge = {
    live: { dot: "bg-[var(--good)]", text: "Live" },
    loading: { dot: "bg-[var(--warn)]", text: "Loading" },
    sample: { dot: "bg-[var(--warn)]", text: "Sample" },
    error: { dot: "bg-[var(--bad)]", text: "Offline" },
  }[liveStatus];

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="h-[440px] w-full sm:h-[520px] lg:h-[580px]">
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
          <div className="glass absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full border px-2.5 py-1.5"
            style={{ borderColor: "var(--border)" }}
          >
            <span className={`dot ${liveBadge.dot}`} />
            <span className="text-[10px] font-medium" style={{ color: "var(--ink)" }}>
              {liveBadge.text}
            </span>
            {source && (
              <span className="text-[10px]" style={{ color: "var(--ink-3)" }}>
                {source}
              </span>
            )}
          </div>

          <div
            className="glass absolute right-3 top-3 z-10 w-[164px] rounded-xl border p-1"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="label px-1.5 py-1">Overlays</p>
            {OVERLAY_BUTTONS.map((btn) => {
              const locked = !btn.keyless && !OWM_KEY;
              return (
                <button
                  key={btn.id}
                  onClick={() => !locked && toggleOverlay(btn.id)}
                  disabled={locked}
                  title={locked ? "Add VITE_OWM_KEY to .env and restart" : btn.label}
                  className={`layer-btn ${overlays[btn.id] ? "active" : ""} ${locked ? "opacity-40" : ""}`}
                >
                  <span
                    className="dot"
                    style={{ background: btn.dot, opacity: overlays[btn.id] ? 1 : 0.35 }}
                  />
                  {btn.label}
                  {locked && (
                    <span className="ml-auto text-[9px]" style={{ color: "var(--ink-3)" }}>
                      KEY
                    </span>
                  )}
                  {btn.id === "radar" && overlays.radar && !locked && (
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

          {activeStation && (
            <div
              className="glass absolute bottom-8 left-3 z-10 w-[236px] animate-slideUp rounded-xl border p-3.5"
              style={{ borderColor: "var(--border-2)" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                    {activeStation.city}
                  </p>
                  <p className="mt-0.5 truncate text-[10px]" style={{ color: "var(--ink-3)" }}>
                    {activeStation.region || activeStation.country}
                  </p>
                </div>
                <span
                  className={`stat-chip ${activeStation.live ? "chip-good" : "chip-warn"}`}
                >
                  {activeStation.live ? "Live" : "Sample"}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="text-[28px] leading-none">{condIcon}</div>
                <div>
                  <div
                    className="num text-[26px] font-semibold leading-none tracking-tight"
                    style={{ color: "var(--ink)" }}
                  >
                    {fmtTemp(activeStation.temp, unit)}
                    <span className="ml-0.5 text-sm font-normal" style={{ color: "var(--ink-3)" }}>
                      {unit}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px]" style={{ color: "var(--ink-2)" }}>
                    {conditionMeta(activeStation.weatherCode)[1]}
                  </div>
                </div>
              </div>

              <div
                className="mt-3.5 grid grid-cols-3 divide-x border-t pt-3"
                style={{ borderColor: "var(--border)" }}
              >
                {[
                  {
                    k: "Humidity",
                    v: activeStation.humidity != null ? `${activeStation.humidity}%` : "\u2014",
                  },
                  {
                    k: "Wind",
                    v: activeStation.windSpeed != null ? `${activeStation.windSpeed}` : "\u2014",
                  },
                  {
                    k: "Gusts",
                    v: activeStation.windGust != null ? `${activeStation.windGust}` : "\u2014",
                  },
                ].map((m) => (
                  <div key={m.k} className="px-2 text-center first:pl-0 last:pr-0">
                    <p className="label">{m.k}</p>
                    <p className="num mt-1 text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                      {m.v}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className="glass absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between border-t px-3 py-1.5 text-[9px]"
            style={{ borderColor: "var(--border)", color: "var(--ink-3)" }}
          >
            <span>OpenFreeMap &middot; OpenMapTiles &middot; OpenStreetMap</span>
            <span>
              {overlays.radar && <span className="mr-2">RainViewer</span>}
              {OWM_KEY && (overlays.temp || overlays.wind || overlays.clouds) && (
                <span>OpenWeatherMap</span>
              )}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
