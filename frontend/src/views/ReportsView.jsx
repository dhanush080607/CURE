import { ViewShell, Panel } from "../components/ViewPrimitives";

export default function ReportsView({ location }) {
  return (
    <ViewShell
      title="Operational reports"
      subtitle={`Archive &amp; briefings for ${location.city}`}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            tag: "Daily summary",
            tone: "var(--accent)",
            title: "Regional diurnal report",
            body: "Composite of surface temperature, humidity minimum, and mean wind across the monitoring network for the reporting day.",
            fields: ["Tmax / Tmin", "Min humidity", "Mean wind"],
          },
          {
            tag: "Agricultural",
            tone: "var(--good)",
            title: "Crop & soil briefing",
            body: "Evapotranspiration estimate and soil moisture outlook for irrigated plots, derived from temperature, radiation and wind.",
            fields: ["ET₀ estimate", "Soil moisture", "Irrigation window"],
          },
          {
            tag: "Air quality",
            tone: "var(--info)",
            title: "Particulate compliance log",
            body: "Rolling particulate averages with comparison against national ambient thresholds for the reporting period.",
            fields: ["24 h PM2.5", "24 h PM10", "Compliance"],
          },
        ].map((r) => (
          <section key={r.tag} className="card flex flex-col overflow-hidden">
            <div className="h-[2px]" style={{ background: r.tone }} />
            <div className="flex flex-1 flex-col p-4">
              <span className="label" style={{ color: r.tone }}>
                {r.tag}
              </span>
              <h3 className="mt-1.5 text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                {r.title}
              </h3>
              <p className="mt-2 flex-1 text-[11px] leading-relaxed" style={{ color: "var(--ink-3)" }}>
                {r.body}
              </p>
              <dl className="mt-4 space-y-1.5 border-t pt-3" style={{ borderColor: "var(--border)" }}>
                {r.fields.map((f) => (
                  <div key={f} className="flex justify-between text-[11px]">
                    <dt style={{ color: "var(--ink-3)" }}>{f}</dt>
                    <dd className="num" style={{ color: "var(--ink-2)" }}>
                      &mdash;
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        ))}
      </div>

      <Panel title="Availability">
        <p className="text-[12px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
          Report figures populate automatically once the FastAPI backend is connected. Until
          then the layout above is rendered with empty values rather than invented numbers.
        </p>
      </Panel>
    </ViewShell>
  );
}
