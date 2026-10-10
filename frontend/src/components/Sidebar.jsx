import { NavLink as RouterNavLink } from "react-router-dom";

const Icon = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </svg>
  ),
  live_weather: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 3v1.6M12 19.4V21M4.2 4.2l1.2 1.2M18.6 18.6l1.2 1.2M3 12h1.6M19.4 12H21" />
    </svg>
  ),
  radar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 12 18 6" />
    </svg>
  ),
  wind: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path strokeLinecap="round" d="M3 8h11a3 3 0 1 0-3-3M3 16h13a3 3 0 1 1-3 3M3 12h16" />
    </svg>
  ),
  rainfall: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 15a4.5 4.5 0 0 0-1.4-8.8A6 6 0 0 0 4.3 9.5 3.8 3.8 0 0 0 5 17h12a4 4 0 0 0 0-8" transform="translate(0,-1)" />
      <path strokeLinecap="round" d="M8 18v2.5M12 17.5V21M16 18v2.5" />
    </svg>
  ),
  temperature: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 14.5V5a2 2 0 1 0-4 0v9.5a4 4 0 1 0 4 0Z" />
    </svg>
  ),
  clouds: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 18a4 4 0 0 1-.4-8A6 6 0 0 1 18 9.5a4.25 4.25 0 0 1 .6 8.5 4 4 0 0 1-1 7.9" transform="translate(0,-1)" />
    </svg>
  ),
  pressure: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path strokeLinecap="round" d="M12 7.5V12l3 2" />
    </svg>
  ),
  satellite: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m13 3-8 10h6l-1 8 9-11h-6V3Z" />
    </svg>
  ),
  lightning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z" />
    </svg>
  ),
  air_quality: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path strokeLinecap="round" d="M3 8h11a3 3 0 1 0-3-3M3 16h13a3 3 0 1 1-3 3" />
    </svg>
  ),
  climate_analytics: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 20h18M4 16l5-5 4 4 7-8" />
    </svg>
  ),
  reports: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path strokeLinecap="round" d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  ),
  api_access: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" />
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7 5.3 5.3" />
    </svg>
  ),
};

const NAV_SECTIONS = [
  {
    section: "Overview",
    items: [
      { path: "/dashboard", icon: "dashboard", label: "Dashboard" },
      { path: "/live-weather", icon: "live_weather", label: "Live weather" },
    ],
  },
  {
    section: "Layers",
    items: [
      { path: "/radar", icon: "radar", label: "Radar" },
      { path: "/wind", icon: "wind", label: "Wind" },
      { path: "/rainfall", icon: "rainfall", label: "Rainfall" },
      { path: "/temperature", icon: "temperature", label: "Temperature" },
      { path: "/clouds", icon: "clouds", label: "Clouds" },
      { path: "/pressure", icon: "pressure", label: "Pressure" },
      { path: "/satellite", icon: "satellite", label: "Satellite" },
      { path: "/lightning", icon: "lightning", label: "Lightning" },
    ],
  },
  {
    section: "Analysis",
    items: [
      { path: "/air-quality", icon: "air_quality", label: "Air quality", accent: true },
      { path: "/climate-analytics", icon: "climate_analytics", label: "CURE engine", accent: true },
      { path: "/reports", icon: "reports", label: "Reports" },
    ],
  },
  {
    section: "System",
    items: [
      { path: "/api-access", icon: "api_access", label: "API access" },
      { path: "/settings", icon: "settings", label: "Settings" },
    ],
  },
];

export default function Sidebar({ pathname, isCollapsed, onToggleCollapse }) {
  const active = (p) => pathname === p;

  return (
    <aside
      className="sidebar-transition sticky top-14 z-30 flex h-[calc(100vh-3.5rem)] shrink-0 flex-col"
      style={{
        width: isCollapsed ? 56 : 212,
        borderRight: "1px solid var(--border)",
        background: "var(--bg)",
      }}
    >
      <nav className="scroll-thin flex-1 overflow-y-auto px-2 py-4">
        {NAV_SECTIONS.map((sec) => (
          <div key={sec.section} className="mb-5 last:mb-0">
            {!isCollapsed && <p className="label px-2.5 pb-1.5">{sec.section}</p>}
            <ul className="space-y-0.5">
              {sec.items.map((item) => {
                const isActive = active(item.path);
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      ariaLabel={item.label}
                      collapsed={isCollapsed}
                      active={isActive}
                    >
                      <span className="shrink-0">{Icon[item.icon]}</span>
                      {!isCollapsed && (
                        <span className="flex-1 truncate text-[12px] font-medium">
                          {item.label}
                          {item.accent && (
                            <span
                              className="ml-1.5 align-middle text-[9px] font-semibold uppercase tracking-wide"
                              style={{ color: "var(--accent)" }}
                            >
                              new
                            </span>
                          )}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {!isCollapsed && (
        <div
          className="m-2 rounded-xl p-3"
          style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
        >
          <div className="flex items-center justify-between">
            <span className="label">Data sources</span>
            <span className="stat-chip chip-good">Live</span>
          </div>
          <ul className="mt-2 space-y-1">
            {["Open-Meteo", "wttr.in", "OpenFreeMap", "RainViewer"].map((s) => (
              <li key={s} className="flex items-center gap-2 text-[11px]" style={{ color: "var(--ink-2)" }}>
                <span className="dot bg-[var(--good)]" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onToggleCollapse}
        className="mx-2 mb-2 flex shrink-0 items-center justify-center rounded-lg py-2 transition-colors hover:bg-[var(--surface-2)]"
        style={{ border: "1px solid var(--border)", color: "var(--ink-3)" }}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${isCollapsed ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m15 6-6 6 6 6" />
        </svg>
      </button>
    </aside>
  );
}

function NavLink({ to, active, collapsed, ariaLabel, children }) {
  return (
    <RouterNavLink
      to={to}
      aria-label={ariaLabel}
      title={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] transition-colors ${
        collapsed ? "justify-center" : ""
      }`}
      style={{
        background: active ? "var(--accent-wash)" : "transparent",
        color: active ? "var(--accent)" : "var(--ink-3)",
        border: active
          ? "1px solid color-mix(in srgb, var(--accent) 26%, transparent)"
          : "1px solid transparent",
      }}
    >
      {children}
    </RouterNavLink>
  );
}
