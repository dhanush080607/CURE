import { ViewShell, Panel } from "../components/ViewPrimitives";
import { THEMES } from "../theme";

const THEME_LABEL = { light: "Light", dark: "Dark", system: "System" };

export default function SettingsView({ unit, onToggleUnit, theme, onThemeChange }) {
  return (
    <ViewShell
      title="Station & display preferences"
      subtitle="Configuration for units, appearance and telemetry rendering"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Panel title="Appearance">
          <p className="label">Theme</p>
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => onThemeChange(t)}
                aria-pressed={theme === t}
                className="rounded-lg px-3 py-2.5 text-[12px] font-medium transition-colors"
                style={{
                  border: `1px solid ${
                    theme === t ? "var(--accent)" : "var(--border)"
                  }`,
                  background: theme === t ? "var(--accent-wash)" : "var(--surface-2)",
                  color: theme === t ? "var(--accent)" : "var(--ink-2)",
                }}
              >
                {THEME_LABEL[t]}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[11px]" style={{ color: "var(--ink-3)" }}>
            System follows your operating system preference and updates automatically.
          </p>
        </Panel>

        <Panel title="Measurement units">
          <div className="flex items-center justify-between">
            <span className="text-[12px]" style={{ color: "var(--ink-2)" }}>
              Temperature scale
            </span>
            <button onClick={onToggleUnit} className="btn">
              {unit === "C" ? "Celsius (°C)" : "Fahrenheit (°F)"}
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[12px]" style={{ color: "var(--ink-2)" }}>
              Barometric pressure
            </span>
            <span className="num text-[12px]" style={{ color: "var(--ink-3)" }}>
              hPa
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[12px]" style={{ color: "var(--ink-2)" }}>
              Wind velocity
            </span>
            <span className="num text-[12px]" style={{ color: "var(--ink-3)" }}>
              km/h
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[12px]" style={{ color: "var(--ink-2)" }}>
              Visibility
            </span>
            <span className="num text-[12px]" style={{ color: "var(--ink-3)" }}>
              km
            </span>
          </div>
        </Panel>
      </div>

      <Panel title="Data sources">
        <ul className="space-y-2">
          {[
            ["Open-Meteo", "Forecast + air quality, primary", "var(--good)"],
            ["wttr.in", "Fallback observation source", "var(--good)"],
            ["OpenFreeMap", "Vector basemap, no key required", "var(--good)"],
            ["RainViewer", "Radar composite, animated replay", "var(--good)"],
            ["OpenWeatherMap", "Temperature / wind / cloud tiles", "var(--warn)"],
          ].map(([name, desc, tone]) => (
            <li
              key={name}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5"
              style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
            >
              <div>
                <p className="text-[12px] font-medium" style={{ color: "var(--ink)" }}>
                  {name}
                </p>
                <p className="mt-0.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
                  {desc}
                </p>
              </div>
              <span className="dot shrink-0" style={{ background: tone }} />
            </li>
          ))}
        </ul>
      </Panel>
    </ViewShell>
  );
}
