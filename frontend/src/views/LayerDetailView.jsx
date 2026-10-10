import { ViewShell, StatCard, Panel, LogList } from "../components/ViewPrimitives";

const LAYERS = {
  rainfall: {
    title: "Rainfall & precipitation",
    badge: "Hydro sensors",
    description:
      "Tipping-bucket accumulation, instantaneous rate, and soil saturation outlook for the catchment.",
    metrics: (l) => [
      { label: "2-hour rainfall", value: l.rainfallLast2h ?? "--", unit: "mm", tone: "accent" },
      { label: "Rain rate", value: l.rainRate ?? "--", unit: "mm/h", tone: "info" },
      { label: "Accumulation", value: "--", unit: "mm", sub: "monthly total" },
      { label: "Soil saturation", value: "--", unit: "%", sub: "root zone" },
    ],
  },
  clouds: {
    title: "Cloud cover & ceilometer",
    badge: "Ceilometer",
    description:
      "Cloud base height, boundary layer depth and infrared cloud fraction for the station.",
    metrics: () => [
      { label: "Cloud cover", value: "--", unit: "%", sub: "total sky cover" },
      { label: "Base ceiling", value: "--", unit: "m", sub: "above ground" },
      { label: "Top altitude", value: "--", unit: "m", sub: "above sea level" },
      { label: "Cloud type", value: "--", sub: "ceilometer class" },
    ],
  },
  pressure: {
    title: "Barometric pressure",
    badge: "MSLP reduced",
    description:
      "Mean sea level pressure reduction, three-hour tendency, and frontal gradient analysis.",
    metrics: (l) => [
      { label: "Station pressure", value: l.pressure ?? "--", unit: "hPa", tone: "accent" },
      { label: "3-hour tendency", value: "--", unit: "hPa", sub: "barometer trend" },
      { label: "Altimeter", value: "--", unit: "inHg", sub: "station pressure" },
      { label: "Gradient", value: "--", unit: "hPa", sub: "per 100 km" },
    ],
  },
  satellite: {
    title: "Satellite imagery",
    badge: "Thermal IR",
    description:
      "Thermal infrared, water vapour and visible channel composite pass over the region.",
    metrics: () => [
      { label: "Channel", value: "10.8 µm", sub: "thermal infrared" },
      { label: "Resolution", value: "1.0", unit: "km", sub: "nadir" },
      { label: "Brightness temp", value: "--", unit: "K", sub: "cloud tops" },
      { label: "Pass time", value: "--", sub: "UTC" },
    ],
  },
  lightning: {
    title: "Lightning detection",
    badge: "VLF / LF",
    description:
      "Total lightning detection across the network, split into cloud-to-ground and intra-cloud.",
    metrics: () => [
      { label: "Strikes 1 h", value: "--", unit: "km", sub: "within range" },
      { label: "Flash rate", value: "--", unit: "/min", sub: "regional" },
      { label: "Peak current", value: "--", unit: "kA", sub: "strongest" },
      { label: "Risk", value: "--", sub: "surface activity" },
    ],
  },
  live_weather: {
    title: "Live observation",
    badge: "Station telemetry",
    description: "Consolidated real-time surface meteorology for the selected station.",
    metrics: (l, u) => [
      {
        label: "Temperature",
        value: u === "C" ? l.temp : Math.round((l.temp * 9) / 5 + 32),
        unit: `°${u}`,
        tone: "accent",
      },
      { label: "Humidity", value: l.humidity ?? "--", unit: "%" },
      {
        label: "Wind",
        value: l.windSpeed ?? "--",
        unit: "km/h",
        sub: l.windDirection,
      },
      { label: "Elevation", value: l.altitude?.split(" ")[0] ?? "--", unit: "m", sub: "above sea level" },
    ],
  },
};

export default function LayerDetailView({ activeTab, location, unit = "C" }) {
  const meta = LAYERS[activeTab] ?? LAYERS.live_weather;
  const metrics = meta.metrics(location, unit);

  return (
    <ViewShell
      title={meta.title}
      badge={meta.badge}
      subtitle={`${location.name || location.city} · ${meta.description}`}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <StatCard
            key={m.label}
            label={m.label}
            value={m.value}
            unit={m.unit}
            sub={m.sub}
            tone={i === 0 ? (m.tone ?? "ink") : "ink"}
          />
        ))}
      </div>

      <Panel title="Instrumentation">
        <LogList
          items={[
            "Telemetry ingestion active with no dropped packets in the last 24 hours",
            "Calibration record current for all connected instruments",
            "Next scheduled diagnostic cycle runs automatically",
          ]}
        />
      </Panel>
    </ViewShell>
  );
}
