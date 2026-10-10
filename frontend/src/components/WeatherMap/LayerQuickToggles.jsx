import { useState } from "react";

export default function LayerQuickToggles({ layers, onToggleLayer, onUpdateOpacity }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute top-4 left-4 z-20 max-w-[210px] w-full">
      <div className="rounded-2xl bg-[#080e1c]/88 border border-cyan-500/20 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Header */}
        <div className="px-3 py-2 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">🥞</span>
            <span className="text-[11px] font-bold font-mono tracking-wider text-slate-200 uppercase">
              LAYERS
            </span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[10px] text-slate-400 hover:text-cyan-300 font-mono px-1 py-0.5 rounded bg-slate-800/60"
          >
            {isOpen ? "HIDE" : "SHOW"}
          </button>
        </div>

        {/* Content list */}
        {isOpen && (
          <div className="p-2 space-y-1.5 max-h-72 overflow-y-auto">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className={`p-1.5 rounded-xl border transition-all ${
                  layer.active
                    ? "bg-slate-900/80 border-cyan-500/30 text-white"
                    : "bg-slate-950/40 border-transparent text-slate-500 hover:text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={layer.active}
                      onChange={() => onToggleLayer(layer.id)}
                      className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 accent-cyan-400 cursor-pointer"
                    />
                    <span className="font-medium">{layer.name}</span>
                  </label>
                  <span
                    className="text-[10px] font-mono font-bold"
                    style={{ color: layer.active ? layer.color : "#64748b" }}
                  >
                    {layer.opacity}%
                  </span>
                </div>

                {/* Opacity slider visible when active */}
                {layer.active && (
                  <div className="mt-1 flex items-center gap-2 px-1">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={layer.opacity}
                      onChange={(e) => onUpdateOpacity(layer.id, Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
