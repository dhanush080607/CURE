export function ViewShell({ title, badge, subtitle, children, action }) {
  return (
    <div className="animate-fadeIn space-y-4">
      <header className="card flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
              {title}
            </h2>
            {badge && <span className="stat-chip chip-accent">{badge}</span>}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </header>
      {children}
    </div>
  );
}

export function StatCard({ label, value, unit, sub, tone = "ink" }) {
  const color =
    tone === "accent" ? "var(--accent)" :
    tone === "good" ? "var(--good)" :
    tone === "warn" ? "var(--warn)" :
    tone === "bad" ? "var(--bad)" :
    tone === "info" ? "var(--info)" :
    "var(--ink)";

  return (
    <div className="card px-4 py-3.5">
      <p className="label">{label}</p>
      <p className="num mt-1.5 text-[22px] font-semibold leading-none tracking-tight" style={{ color }}>
        {value}
        {unit && (
          <span className="ml-1 text-[12px] font-normal" style={{ color: "var(--ink-3)" }}>
            {unit}
          </span>
        )}
      </p>
      {sub && (
        <p className="mt-2 text-[10px]" style={{ color: "var(--ink-3)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function Panel({ title, children, className = "" }) {
  return (
    <section className={`card overflow-hidden ${className}`}>
      {title && (
        <header className="section-header">
          <h3 className="section-title">{title}</h3>
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function LogList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-2 text-[12px]" style={{ color: "var(--ink-2)" }}>
          <span className="dot mt-1.5 shrink-0" style={{ background: "var(--accent)" }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function KeyValue({ rows }) {
  return (
    <dl className="space-y-1.5">
      {rows.map(([k, v]) => (
        <div
          key={k}
          className="flex items-center justify-between gap-3 rounded-lg px-3 py-2"
          style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
        >
          <dt className="text-[11px]" style={{ color: "var(--ink-3)" }}>{k}</dt>
          <dd className="num text-[12px] font-semibold" style={{ color: "var(--ink)" }}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
