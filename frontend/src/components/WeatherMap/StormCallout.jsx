import { useState } from "react";

export default function StormCallout({ storm, onSelectLocation, onOpenAiWithPrompt }) {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="absolute top-20 right-6 z-20 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-rose-500/50 shadow-xl backdrop-blur-md flex items-center gap-2 hover:border-rose-400 text-xs text-rose-300 font-semibold"
      >
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
        <span>{storm.name} ({storm.category})</span>
      </button>
    );
  }

  return (
    <div className="absolute top-16 md:top-20 right-4 md:right-8 z-20 w-72 rounded-2xl bg-[#090f1e]/90 border border-cyan-500/25 shadow-2xl backdrop-blur-xl p-4 text-xs font-sans animate-float">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wide text-white font-mono flex items-center gap-1.5">
              {storm.name}
            </h4>
            <span className="text-[10px] font-semibold text-rose-400 font-mono">
              {storm.category}
            </span>
          </div>
        </div>
        <button
          onClick={() => setMinimized(true)}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
          title="Minimize callout"
        >
          ✕
        </button>
      </div>

      {/* Storm telemetry parameters */}
      <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
        <div className="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60">
          <span className="text-[10px] text-slate-400 block font-mono">PRESSURE</span>
          <span className="font-bold font-mono text-cyan-300 text-sm">{storm.pressure} hPa</span>
        </div>
        <div className="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60">
          <span className="text-[10px] text-slate-400 block font-mono">WIND SPEED</span>
          <span className="font-bold font-mono text-cyan-300 text-sm">{storm.windSpeed} km/h</span>
        </div>
        <div className="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60">
          <span className="text-[10px] text-slate-400 block font-mono">MOVING</span>
          <span className="font-bold font-mono text-slate-200">{storm.moving}</span>
        </div>
        <div className="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60">
          <span className="text-[10px] text-slate-400 block font-mono">UPDATED</span>
          <span className="font-bold font-mono text-amber-300">{storm.updated}</span>
        </div>
      </div>

      {/* Trajectory mini path */}
      <div className="mb-3 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
          <span>PROJECTED CONE</span>
          <span className="text-rose-400">HIGH INTENSITY</span>
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono text-slate-300">
          {storm.trajectory.slice(0, 4).map((pt, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className={`w-2 h-2 rounded-full mb-0.5 ${pt.time === "Now" ? "bg-rose-500 ring-2 ring-rose-400/50" : "bg-cyan-500/60"}`}></span>
              <span>{pt.time}</span>
              <span className="text-slate-400">{pt.wind}k</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSelectLocation({ city: "New York", country: "USA", id: "nyc", temp: 22 })}
          className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-center font-medium transition-colors"
        >
          Focus NY Station
        </button>
        <button
          onClick={() => onOpenAiWithPrompt?.("What is the track for Storm Evelyn?")}
          className="flex-1 py-1.5 px-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-md shadow-cyan-500/20 text-center transition-all"
        >
          AI Assessment
        </button>
      </div>
    </div>
  );
}
