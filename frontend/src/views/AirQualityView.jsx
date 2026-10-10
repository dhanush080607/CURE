import { ViewShell, Panel, StatCard, KeyValue } from "../components/ViewPrimitives";
import { aqiTone } from "../data/liveWeather";

export default function AirQualityView({ place, weather }) {
  const tone = aqiTone(weather?.aqi);
  const has = weather?.aqi != null;

  return (
    <ViewShell
      title="Air quality &amp; particulates"
      badge="European AQI"
      subtitle={
        place?.name
          ? `${place.name} \u00B7 particulate monitoring`
          : "Select a location to begin"
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Overall AQI" value={has ? `${Math.round(weather.aqi)}` : "\u2014"} sub={tone.label} tone="accent" />
        <StatCard
          label="PM2.5"
          value={weather?.pm25 != null ? `${weather.pm25}` : "\u2014"}
          unit="\u00B5g/m\u00B3"
          sub="fine particulate"
        />
        <StatCard
          label="PM10"
          value={weather?.pm10 != null ? `${weather.pm10}` : "\u2014"}
          unit="\u00B5g/m\u00B3"
          sub="coarse particulate"
        />
        <StatCard label="Band" value={has ? tone.label : "\u2014"} sub="EPA index scale" tone="info" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Index scale">
          <div
            className="h-2 w-full rounded-full"
            style={{ background: "linear-gradient(90deg,var(--good),var(--warn),var(--bad))" }}
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

        <Panel title="WHO reference thresholds">
          <KeyValue
            rows={[
              ["PM2.5 annual", "5 \u00B5g/m\u00B3"],
              ["PM2.5 24-hour", "15 \u00B5g/m\u00B3"],
              ["PM10 24-hour", "45 \u00B5g/m\u00B3"],
              ["Current band", has ? tone.label : "\u2014"],
            ]}
          />
        </Panel>
      </div>
    </ViewShell>
  );
}
