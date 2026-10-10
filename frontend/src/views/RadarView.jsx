import { useState } from "react";
import { ViewShell, Panel, StatCard, KeyValue, LogList } from "../components/ViewPrimitives";

export default function RadarView({ location }) {
  const [speed, setSpeed] = useState("Normal");
  const [dbz, setDbz] = useState(25);

  return (
    <ViewShell
      title="Doppler radar"
      badge="2.4 GHz"
      subtitle={`${location.name || location.city} · reflectivity return composite`}
      action={
        <div className="segment">
          {["Slow", "Normal", "Fast"].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`segment-item ${speed === s ? "active" : ""}`}
            >
              {s}
            </button>
          ))}
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <section
          className="card relative flex min-h-[440px] items-center justify-center overflow-hidden lg:col-span-8"
        >
          <div
            className="relative h-80 w-80 sm:h-96 sm:w-96"
            aria-hidden="true"
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  inset: i * 26,
                  border: "1px solid var(--border)",
                }}
              />
            ))}
            <div className="absolute inset-x-0 top-1/2 h-px" style={{ background: "var(--border)" }} />
            <div className="absolute inset-y-0 left-1/2 w-px" style={{ background: "var(--border)" }} />

            <div
              className="absolute inset-0 animate-spin rounded-full"
              style={{
                animationDuration: speed === "Slow" ? "8s" : speed === "Fast" ? "2.5s" : "4.5s",
              }}
            >
              <div
                className="h-1/2 w-1/2 origin-bottom-right"
                style={{
                  borderRight: "1px solid var(--accent)",
                  background: "linear-gradient(to top left, var(--accent-wash), transparent)",
                }}
              />
            </div>

            <div
              className="absolute h-3 w-3 rounded-full"
              style={{ background: "var(--accent)", boxShadow: "0 0 0 6px var(--accent-wash)" }}
            />
          </div>

          <p
            className="num absolute bottom-4 left-4 text-[10px]"
            style={{ color: "var(--ink-3)" }}
          >
            Max range 250 km · composite reflectivity
          </p>
        </section>

        <div className="space-y-4 lg:col-span-4">
          <Panel title="Reflectivity threshold">
            <div className="flex items-center justify-between">
              <span className="label">Threshold</span>
              <span className="num text-[13px] font-semibold" style={{ color: "var(--accent)" }}>
                {dbz} dBZ
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="65"
              value={dbz}
              onChange={(e) => setDbz(Number(e.target.value))}
              aria-label="Reflectivity threshold"
              className="mt-3 h-[3px] w-full cursor-pointer appearance-none rounded-full"
              style={{ background: "var(--surface-3)", accentColor: "var(--accent)" }}
            />
            <div
              className="mt-4 h-2 w-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg,#3b82f6,#34d399,#fbbf24,#f43f5e,#a855f7)",
              }}
            />
            <div className="num mt-1 flex justify-between text-[9px]" style={{ color: "var(--ink-3)" }}>
              <span>10</span>
              <span>35</span>
              <span>55+</span>
            </div>
          </Panel>

          <Panel title="Telemetry">
            <KeyValue
              rows={[
                ["Range resolution", "1 km"],
                ["Azimuth resolution", "0.5°"],
                ["Volume scan", "VCP-212"],
                ["Sweep rate", speed],
              ]}
            />
          </Panel>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Mode" value="VCP-212" sub="5-minute volume" />
        <StatCard label="Sweep rate" value={speed} sub="antenna rotation" />
        <StatCard label="Gate count" value="512" sub="radial samples" tone="info" />
        <StatCard label="Status" value="Online" sub="last sweep 10:42" tone="good" />
      </div>

      <Panel title="Instrumentation log">
        <LogList
          items={[
            "Doppler sweep complete at 0.5° elevation tilt",
            "Radial velocity data written to composite product",
            "Rain rate integration within configured limits",
            "All transceiver modules reporting nominal power",
          ]}
        />
      </Panel>
    </ViewShell>
  );
}
