import { ViewShell, Panel, StatCard, KeyValue } from "../components/ViewPrimitives";
import { aqiTone } from "../data/liveWeather";

export default function AirQualityView({ location }) {
  const tone = aqiTone(location.aqi);

  return (
    <ViewShell
      title="Air quality & particulates"
      badge="CPCB / WHO"
      subtitle={`${location.name || location.city} · optical particle counter telemetry`}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Overall AQI"
          value={location.aqi ?? "--"}
          sub={tone.label}
          tone="accent"
        />
        <StatCard
          label="PM2.5"
          value={location.pm25 ?? "--"}
          unit="µg/m³"
          sub="fine particulate"
        />
        <StatCard
          label="PM10"
          value={location.pm10 ?? "--"}
          unit="µg/m³"
          sub="coarse particulate"
        />
        <StatCard
          label="AQ band"
          value={tone.label}
          sub="European AQI scale"
          tone={tone.tone === "chip-good" ? "good" : tone.tone === "chip-warn" ? "warn" : "bad"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Index scale">
          <div
            className="relative h-2 w-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg,var(--good),var(--warn),var(--bad))",
            }}
          />
          <div className="num mt-2 flex justify-between text-[10px]" style={{ color: "var(--ink-3)" }}>
            <span>0</span>
            <span>20</span>
            <span>40</span>
            <span>60</span>
            <span>80</span>
            <span>100+</span>
          </div>
        </Panel>

        <Panel title="Reference thresholds">
          <KeyValue
            rows={[
              ["PM2.5 annual (WHO)", "5 µg/m³"],
              ["PM2.5 24 h (WHO)", "15 µg/m³"],
              ["PM10 24 h (WHO)", "45 µg/m³"],
              ["Current status", tone.label],
            ]}
          />
        </Panel>
      </div>
    </ViewShell>
  );
}
