export default function MapGauges({ location, unit }) {
  const tempUnit = unit === "C" ? "°C" : "°F";

  return (
    <div className="absolute bottom-3 left-4 right-4 z-20 hidden md:block">
      <div className="rounded-2xl bg-[#080e1c]/85 border border-cyan-500/20 shadow-2xl backdrop-blur-xl p-2.5 px-4">
        <div className="grid grid-cols-7 gap-2 divide-x divide-slate-800/80 text-center">
          {/* 1. WIND */}
          <div className="px-2 flex flex-col items-center">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              WIND
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-sm font-black font-mono text-cyan-300">
                {location.windSpeed}
              </span>
              <span className="text-[10px] text-slate-400">kph</span>
            </div>
            <div className="text-[9px] text-slate-400 flex items-center gap-1 font-mono">
              <span className="text-cyan-400">{location.windDirection}</span>
              <span>· Gust {location.windGust}</span>
            </div>
          </div>

          {/* 2. RAIN */}
          <div className="px-2 flex flex-col items-center">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              RAIN
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-sm font-black font-mono text-teal-300">
                18
              </span>
              <span className="text-[10px] text-slate-400">kph</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">
              Last 2 hours
            </span>
          </div>

          {/* 3. RAINFALL */}
          <div className="px-2 flex flex-col items-center">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              RAINFALL
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-sm font-black font-mono text-emerald-300">
                {location.rainfallLast2h}
              </span>
              <span className="text-[10px] text-slate-400">mm</span>
            </div>
            <span className="text-[9px] text-emerald-400 font-mono">
              +{location.rainRate} mm/h
            </span>
          </div>

          {/* 4. PRESSURE */}
          <div className="px-2 flex flex-col items-center">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              PRESSURE
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-sm font-black font-mono text-violet-300">
                {location.pressure}
              </span>
              <span className="text-[10px] text-slate-400">mb</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono capitalize">
              {location.pressureTrend}
            </span>
          </div>

          {/* 5. HUMIDITY */}
          <div className="px-2 flex flex-col items-center">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              HUMIDITY
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-sm font-black font-mono text-blue-300">
                {location.humidity}%
              </span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">
              Dew Point 18{tempUnit}
            </span>
          </div>

          {/* 6. UV INDEX */}
          <div className="px-2 flex flex-col items-center">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              UV INDEX
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-sm font-black font-mono text-amber-300">
                {location.uvIndex}
              </span>
            </div>
            <span className="text-[9px] text-amber-400 font-mono">
              {location.uvCategory}
            </span>
          </div>

          {/* 7. VISIBILITY */}
          <div className="px-2 flex flex-col items-center">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              VISIBILITY
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-sm font-black font-mono text-white">
                {location.visibility}
              </span>
              <span className="text-[10px] text-slate-400">km</span>
            </div>
            <span className="text-[9px] text-emerald-400 font-mono">
              Optimal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
