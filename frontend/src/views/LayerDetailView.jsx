import { ViewShell, StatCard } from "../components/ViewPrimitives";
import { conditionMeta, convertTemp } from "../data/liveWeather";

const LAYERS = {
  rainfall: {
    title: "Rainfall & precipitation",
    badge: "Hydro",
    description: "Accumulation, instantaneous rate and precipitation probability.",
  },
  clouds: {
    title: "Cloud cover",
    badge: "Infrared",
    description: "Total sky cover and cloud classification for the selected point.",
  },
  pressure: {
    title: "Barometric pressure",
    badge: "MSLP",
    description: "Mean sea level pressure and tendency from the forecast model.",
  },
  satellite: {
    title: "Satellite imagery",
    badge: "Composite",
    description: "Raster imagery layers available through the map overlay controls.",
  },
  lightning: {
    title: "Lightning detection",
    badge: "VLF / LF",
    description: "Total lightning detection is not part of the current free feed.",
  },
  live_weather: {
    title: "Live observation",
    badge: "Telemetry",
    description: "Consolidated real-time surface meteorology for the selected point.",
  },
};

export default function LayerDetailView({ kind = "live_weather", place, weather, unit = "C" }) {
  const meta = LAYERS[kind] ?? LAYERS.live_weather;

  const cards =
    kind === "live_weather"
      ? [
          { label: "Temperature", value: convertTemp(weather?.temp, unit), unit: `\u00B0${unit}`, sub: "2 m", tone: "accent" },
          { label: "Humidity", value: weather?.humidity, unit: "%", sub: "relative" },
          { label: "Wind", value: weather?.windSpeed, unit: "km/h", sub: weather?.windDirection },
          { label: "Pressure", value: weather?.pressure, unit: "hPa", sub: "mean sea level" },
        ]
      : kind === "rainfall"
        ? [
            { label: "Rain chance", value: weather?.daily?.[0]?.pop, unit: "%", sub: "today", tone: "accent" },
            { label: "Precipitation", value: weather?.precipitation, unit: "mm", sub: "current hour" },
            { label: "Hours with rain", value: countRainHours(weather), unit: "h", sub: "next 24 h", tone: "info" },
            { label: "Peak probability", value: peakPop(weather), unit: "%", sub: "next 7 days" },
          ]
        : kind === "clouds"
          ? [
              { label: "Sky cover", value: weather?.cloudCover, unit: "%", sub: "total", tone: "accent" },
              { label: "Condition", value: weather ? conditionMeta(weather.weatherCode)[1] : null, sub: "WMO code", tone: "info" },
              { label: "Opaque hours", value: countCloudyHours(weather), unit: "h", sub: "next 24 h" },
              { label: "Clear hours", value: countClearHours(weather), unit: "h", sub: "next 24 h", tone: "good" },
            ]
          : kind === "pressure"
            ? [
                { label: "Pressure", value: weather?.pressure, unit: "hPa", sub: "mean sea level", tone: "accent" },
                { label: "Trend", value: pressureTrend(weather), unit: "hPa", sub: "1-hour change" },
                { label: "Range", value: weather ? pressureRange(weather) : null, unit: "hPa", sub: "next 24 h", tone: "info" },
                { label: "Elevation", value: weather?.elevation != null ? `${Math.round(weather.elevation)}` : null, unit: "m", sub: "above sea level" },
              ]
            : kind === "satellite"
              ? [
                  { label: "Imagery", value: "Raster", sub: "via map overlays", tone: "accent" },
                  { label: "Basemap", value: "Vector", sub: "OpenFreeMap" },
                  { label: "Radar", value: "Composite", sub: "RainViewer", tone: "info" },
                  { label: "Resolution", value: "\u2014", sub: "not exposed" },
                ]
              : [
                  { label: "Strikes 1 h", value: null, sub: "not in free feed" },
                  { label: "Flash rate", value: null, sub: "not in free feed" },
                  { label: "Peak current", value: null, sub: "not in free feed" },
                  { label: "Risk", value: "Unknown", sub: "awaiting source" },
                ];

  return (
    <ViewShell
      title={meta.title}
      badge={meta.badge}
      subtitle={
        place?.name ? `${place.name} \u00B7 ${meta.description}` : meta.description
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c, i) => (
          <StatCard
            key={c.label}
            label={c.label}
            value={c.value == null ? "\u2014" : String(c.value)}
            unit={c.unit}
            sub={c.sub}
            tone={i === 0 ? (c.tone ?? "ink") : "ink"}
          />
        ))}
      </div>
    </ViewShell>
  );
}

function countRainHours(w) {
  if (!w?.hourly) return null;
  return w.hourly.filter((h) => (h.pop ?? 0) >= 40).length;
}

function peakPop(w) {
  if (!w?.daily?.length) return null;
  return Math.max(...w.daily.map((d) => d.pop ?? 0));
}

function countCloudyHours(w) {
  if (!w?.hourly) return null;
  return w.hourly.filter((h) => [0, 1].includes(h.code)).length;
}

function countClearHours(w) {
  if (!w?.hourly) return null;
  return w.hourly.filter((h) => h.code === 0).length;
}

function pressureTrend(w) {
  const p = (w?.hourly ?? []).map((h) => h.pressure).filter((v) => v != null);
  if (p.length < 2) return null;
  const d = p[p.length - 1] - p[0];
  return d > 0 ? `+${d}` : `${d}`;
}

function pressureRange(w) {
  const p = (w?.hourly ?? []).map((h) => h.pressure).filter((v) => v != null);
  if (!p.length) return null;
  return Math.max(...p) - Math.min(...p);
}
