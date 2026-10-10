import { ViewShell, Panel } from "../components/ViewPrimitives";

const ENDPOINTS = [
  {
    method: "GET",
    tone: "var(--good)",
    path: "/weather/current",
    desc: "Conditions, 24 hourly steps and a 7-day outlook",
  },
  {
    method: "GET",
    tone: "var(--good)",
    path: "/weather/search",
    desc: "Geocoding search for the location picker",
  },
  {
    method: "GET",
    tone: "var(--good)",
    path: "/tanks",
    desc: "List tanks with their consumption history",
  },
  {
    method: "POST",
    tone: "var(--good)",
    path: "/tanks",
    desc: "Create a tank",
  },
  {
    method: "PATCH",
    tone: "var(--warn)",
    path: "/tanks/{id}",
    desc: "Update capacity, level or coordinates",
  },
  {
    method: "POST",
    tone: "var(--good)",
    path: "/tanks/{id}/readings",
    desc: "Append a daily consumption reading",
  },
  {
    method: "POST",
    tone: "var(--info)",
    path: "/water/risk",
    desc: "Water runway, risk level and explanation",
  },
  {
    method: "POST",
    tone: "var(--info)",
    path: "/ai/ask",
    desc: "Grounded question against a risk payload",
  },
  {
    method: "GET",
    tone: "var(--accent)",
    path: "/health",
    desc: "Service and AI backend status",
  },
];

export default function ApiAccessView() {
  return (
    <ViewShell
      title="API access"
      subtitle="REST interface exposed by the CURE FastAPI service"
    >
      <Panel title="Endpoints">
        <ul className="space-y-1.5">
          {ENDPOINTS.map((e) => (
            <li
              key={e.path}
              className="flex flex-wrap items-center gap-3 rounded-lg px-3 py-2.5"
              style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
            >
              <span
                className="num w-12 shrink-0 rounded px-1.5 py-0.5 text-center text-[9px] font-semibold"
                style={{ color: e.tone, border: `1px solid ${e.tone}55` }}
              >
                {e.method}
              </span>
              <code className="num text-[12px]" style={{ color: "var(--ink)" }}>
                {e.path}
              </code>
              <span className="flex-1 text-[11px]" style={{ color: "var(--ink-3)" }}>
                {e.desc}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Panel title="Local base URL">
          <p className="num text-[13px]" style={{ color: "var(--accent)" }}>
            http://127.0.0.1:8000
          </p>
          <p className="mt-2 text-[11px]" style={{ color: "var(--ink-3)" }}>
            Interactive OpenAPI docs are served at <span className="num">/docs</span> while the
            backend is running.
          </p>
        </Panel>

        <Panel title="Dev proxy">
          <p className="num text-[13px]" style={{ color: "var(--accent)" }}>
            /api &rarr; 127.0.0.1:8000
          </p>
          <p className="mt-2 text-[11px]" style={{ color: "var(--ink-3)" }}>
            Requests from the app go through the Vite proxy, so no CORS configuration is needed
            during local development.
          </p>
        </Panel>
      </div>

      <Panel title="Note">
        <p className="text-[12px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
          No API keys are issued or stored by this application. The map overlays read the
          OpenWeatherMap key from <span className="num">VITE_OWM_KEY</span> in the frontend
          environment, which is public by design and only ever used for tile requests.
        </p>
      </Panel>
    </ViewShell>
  );
}
