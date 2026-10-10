export default function InteractiveLayers({ layers, onToggleLayer, onUpdateOpacity }) {
  const activeCount = layers.filter((l) => l.active).length;

  return (
    <section className="card flex h-[300px] flex-col overflow-hidden">
      <header className="section-header shrink-0">
        <div>
          <h2 className="section-title">Map layers</h2>
          <p className="mt-0.5 text-[10px]" style={{ color: "var(--ink-3)" }}>
            Atmospheric overlays
          </p>
        </div>
        <span className="stat-chip chip-accent">{activeCount} on</span>
      </header>

      <ul className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {layers.map((layer) => (
          <li
            key={layer.id}
            className="rounded-lg px-2.5 py-2 transition-colors hover:bg-[var(--surface-2)]"
          >
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => onToggleLayer(layer.id)}
                className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                aria-pressed={layer.active}
              >
                <span
                  role="switch"
                  aria-checked={layer.active}
                  tabIndex={-1}
                  className="relative h-[18px] w-8 shrink-0 rounded-full transition-colors"
                  style={{ background: layer.active ? "var(--accent)" : "var(--surface-3)" }}
                >
                  <span
                    className="absolute top-[3px] h-3 w-3 rounded-full bg-white transition-all"
                    style={{ left: layer.active ? 17 : 3 }}
                  />
                </span>
                <span
                  className="truncate text-[12px] font-medium"
                  style={{ color: layer.active ? "var(--ink)" : "var(--ink-3)" }}
                >
                  {layer.name}
                </span>
              </button>

              <span
                className="dot shrink-0"
                style={{ background: layer.active ? layer.color : "var(--border-2)" }}
              />
            </div>

            {layer.active && (
              <div className="mt-2 flex items-center gap-2 pl-[42px]">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={layer.opacity}
                  onChange={(e) => onUpdateOpacity(layer.id, Number(e.target.value))}
                  aria-label={`${layer.name} opacity`}
                  className="h-[3px] flex-1 cursor-pointer appearance-none rounded-full"
                  style={{ background: "var(--surface-3)", accentColor: "var(--accent)" }}
                />
                <span className="num w-8 text-right text-[10px]" style={{ color: "var(--ink-3)" }}>
                  {layer.opacity}%
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
