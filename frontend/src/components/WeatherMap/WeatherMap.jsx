import { useState } from "react";
import LayerQuickToggles from "./LayerQuickToggles";
import StormCallout from "./StormCallout";
import MapGauges from "./MapGauges";
import { ACTIVE_STORM, SAMPLE_LOCATIONS } from "../../data/mockWeatherData";

export default function WeatherMap({
  selectedLocation,
  onSelectLocation,
  layers,
  onToggleLayer,
  onUpdateOpacity,
  currentTimeSlice,
  onOpenAiWithPrompt,
  unit,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [radarSweepActive, setRadarSweepActive] = useState(true);

  // Storm offset influenced by timeline scrubbing
  const stormOffsetX = currentTimeSlice?.stormOffset || 0;
  const rainIntensity = currentTimeSlice?.rainIntensity || 1.0;

  // Layer visibility states
  const windActive = layers.find((l) => l.id === "wind")?.active ?? true;
  const windOpacity = (layers.find((l) => l.id === "wind")?.opacity ?? 90) / 100;
  
  const rainfallActive = layers.find((l) => l.id === "rainfall")?.active ?? true;
  const rainfallOpacity = (layers.find((l) => l.id === "rainfall")?.opacity ?? 92) / 100;
  
  const cloudsActive = layers.find((l) => l.id === "clouds")?.active ?? true;
  const cloudsOpacity = (layers.find((l) => l.id === "clouds")?.opacity ?? 88) / 100;

  const lightningActive = layers.find((l) => l.id === "lightning")?.active ?? true;
  const satelliteActive = layers.find((l) => l.id === "satellite")?.active ?? true;

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Drag pan handlers
  const handleMouseDown = (e) => {
    // Only drag if not clicking interactive UI controls
    if (e.target.closest("button") || e.target.closest("input")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // City station coordinates on SVG canvas (scaled approx to US map)
  const STATION_COORDINATES = [
    { id: "nyc", name: "New York", x: 740, y: 220, temp: 22, condition: "22°C Light Rain" },
    { id: "chi", name: "Chicago", x: 570, y: 235, temp: 18, condition: "18°C Overcast" },
    { id: "lax", name: "Los Angeles", x: 190, y: 340, temp: 26, condition: "26°C Sunny" },
    { id: "mia", name: "Miami", x: 710, y: 460, temp: 29, condition: "29°C Storm Risk" },
    { id: "dal", name: "Dallas", x: 470, y: 370, temp: 28, condition: "28°C Clear" },
    { id: "atl", name: "Atlanta", x: 630, y: 340, temp: 24, condition: "24°C Showers" },
    { id: "hou", name: "Houston", x: 485, y: 410, temp: 27, condition: "27°C Humid" },
    { id: "sea", name: "Seattle", x: 180, y: 110, temp: 16, condition: "16°C Drizzle" },
    { id: "den", name: "Denver", x: 380, y: 260, temp: 21, condition: "21°C Wind 25k" },
  ];

  return (
    <div
      className="relative w-full h-[520px] lg:h-[580px] rounded-3xl overflow-hidden border border-cyan-500/20 bg-[#060a14] shadow-2xl select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Dynamic Background Atmospheric Canvas */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-100 ease-out cursor-grab active:cursor-grabbing"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: "center center",
        }}
      >
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Deep ocean background gradient */}
            <radialGradient id="oceanGrad" cx="55%" cy="45%" r="70%">
              <stop offset="0%" stopColor="#0b172d" />
              <stop offset="40%" stopColor="#081022" />
              <stop offset="100%" stopColor="#040711" />
            </radialGradient>

            {/* Landmass fill gradient */}
            <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0e1a2f" />
              <stop offset="50%" stopColor="#122038" />
              <stop offset="100%" stopColor="#0d182b" />
            </linearGradient>

            {/* Hurricane spiral core gradient */}
            <radialGradient id="hurricaneCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="15%" stopColor="#ec4899" />
              <stop offset="35%" stopColor="#a855f7" />
              <stop offset="60%" stopColor="#eab308" />
              <stop offset="85%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Radar precipitation plume gradient */}
            <linearGradient id="radarPrecipGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#eab308" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#f97316" stopOpacity="0.9" />
              <stop offset="90%" stopColor="#ef4444" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.9" />
            </linearGradient>

            {/* Radar sweep conical gradient */}
            <linearGradient id="radarSweep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>

            {/* Glow filters */}
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="hurricaneBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Deep Ocean Base */}
          <rect width="1000" height="600" fill="url(#oceanGrad)" />

          {/* Latitude / Longitude Grid lines */}
          <g stroke="rgba(56, 189, 248, 0.08)" strokeWidth="0.8" strokeDasharray="3 4">
            <line x1="100" y1="0" x2="100" y2="600" />
            <line x1="250" y1="0" x2="250" y2="600" />
            <line x1="400" y1="0" x2="400" y2="600" />
            <line x1="550" y1="0" x2="550" y2="600" />
            <line x1="700" y1="0" x2="700" y2="600" />
            <line x1="850" y1="0" x2="850" y2="600" />
            <line x1="0" y1="120" x2="1000" y2="120" />
            <line x1="0" y1="240" x2="1000" y2="240" />
            <line x1="0" y1="360" x2="1000" y2="360" />
            <line x1="0" y1="480" x2="1000" y2="480" />
          </g>

          {/* Realistic Continental North America Landmass Silhouette */}
          <path
            d="M 120 70 
               Q 160 80, 220 90 
               Q 320 80, 420 110 
               Q 520 120, 620 90 
               Q 720 70, 820 110 
               Q 860 140, 800 180 
               Q 760 210, 750 250 
               Q 720 310, 710 380 
               Q 720 440, 725 470 
               Q 695 480, 680 430 
               Q 640 400, 580 420 
               Q 510 430, 460 410 
               Q 430 450, 400 480 
               Q 360 440, 310 380 
               Q 240 370, 200 360 
               Q 170 300, 160 230 
               Q 140 160, 120 70 Z"
            fill="url(#landGrad)"
            stroke="rgba(56, 189, 248, 0.28)"
            strokeWidth="1.2"
          />

          {/* Mexico & Central America Extension */}
          <path
            d="M 400 480 
               Q 430 520, 480 540 
               Q 460 560, 420 550 
               Q 370 510, 350 460 
               Q 380 470, 400 480 Z"
            fill="#0c172a"
            stroke="rgba(56, 189, 248, 0.2)"
            strokeWidth="0.8"
          />

          {/* Great Lakes outline detail */}
          <path
            d="M 580 180 Q 610 170, 640 190 Q 620 220, 590 200 Z 
               M 630 200 Q 660 190, 680 215 Q 650 230, 630 200 Z"
            fill="#060e1d"
            stroke="rgba(56, 189, 248, 0.3)"
            strokeWidth="0.8"
          />

          {/* State / Regional Boundary subtle line accents */}
          <path
            d="M 280 120 L 290 360 
               M 420 110 L 430 410 
               M 550 130 L 560 415 
               M 680 140 L 685 360 
               M 290 240 L 730 250"
            stroke="rgba(148, 163, 184, 0.12)"
            strokeWidth="0.75"
            strokeDasharray="2 3"
          />

          {/* CLOUDS LAYER (Atmospheric swirling masses) */}
          {cloudsActive && (
            <g opacity={cloudsOpacity} filter="url(#hurricaneBlur)">
              {/* Midwest / Northeast cloud band */}
              <path
                d="M 440 170 Q 560 150, 660 190 Q 750 230, 710 290 Q 600 270, 500 240 Q 430 200, 440 170 Z"
                fill="rgba(148, 163, 184, 0.22)"
              />
              <path
                d="M 280 260 Q 380 240, 450 310 Q 380 340, 270 300 Z"
                fill="rgba(148, 163, 184, 0.16)"
              />
              <path
                d="M 680 310 Q 790 350, 830 430 Q 760 460, 690 390 Z"
                fill="rgba(148, 163, 184, 0.25)"
              />
            </g>
          )}

          {/* SATELLITE IR IMAGERY LAYER */}
          {satelliteActive && (
            <g opacity={0.35} filter="url(#glowFilter)">
              <ellipse cx="760" cy="280" rx="140" ry="90" fill="#3b82f6" opacity="0.15" />
              <ellipse cx="620" cy="220" rx="90" ry="60" fill="#06b6d4" opacity="0.12" />
            </g>
          )}

          {/* RADAR PRECIPITATION LAYER (Green -> Yellow -> Orange -> Purple Doppler echoes) */}
          {rainfallActive && (
            <g opacity={rainfallOpacity * rainIntensity} filter="url(#glowFilter)">
              {/* Outer precipitation field across Ohio valley and Mid-Atlantic */}
              <path
                d="M 540 210 Q 640 180, 710 220 Q 730 290, 650 330 Q 580 310, 540 260 Z"
                fill="url(#radarPrecipGrad)"
                opacity="0.65"
              />
              {/* Convective storm core near coastline */}
              <path
                d="M 630 250 Q 690 230, 740 260 Q 750 310, 680 320 Q 630 300, 630 250 Z"
                fill="#eab308"
                opacity="0.75"
              />
              <path
                d="M 670 265 Q 710 250, 735 275 Q 725 310, 685 305 Z"
                fill="#ef4444"
                opacity="0.85"
              />
            </g>
          )}

          {/* TROPICAL CYCLONE "EVELYN" (Prominent centerpiece hurricane vortex off East Coast) */}
          <g
            transform={`translate(${790 + stormOffsetX}, 310)`}
            className="cursor-pointer"
            onClick={() => onOpenAiWithPrompt?.("What is the track for Storm Evelyn?")}
          >
            {/* Outer radar spiral arms */}
            <g className="animate-hurricane" style={{ transformOrigin: "0px 0px" }}>
              {/* Spiral Arm 1 */}
              <path
                d="M 0 0 Q 30 -50, 80 -40 Q 120 -10, 110 50 Q 80 110, 0 120 Q -90 100, -110 30 Q -110 -60, -40 -100 Q 40 -120, 110 -80"
                fill="none"
                stroke="url(#radarPrecipGrad)"
                strokeWidth="14"
                strokeLinecap="round"
                opacity="0.85"
                filter="url(#glowFilter)"
              />
              {/* Spiral Arm 2 */}
              <path
                d="M 0 0 Q -40 30, -70 80 Q -60 130, 20 140 Q 90 120, 130 50 Q 140 -30, 80 -90"
                fill="none"
                stroke="#22c55e"
                strokeWidth="9"
                strokeLinecap="round"
                opacity="0.8"
              />
              {/* High-intensity Eyewall ring */}
              <circle
                r="36"
                fill="url(#hurricaneCore)"
                filter="url(#glowFilter)"
              />
              <circle
                r="18"
                fill="#f43f5e"
                opacity="0.9"
                className="animate-pulse"
              />
              {/* The Eye of the Hurricane */}
              <circle
                r="8"
                fill="#070b14"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>

            {/* Storm label badge */}
            <g transform="translate(45, -45)">
              <rect
                x="-10"
                y="-14"
                width="145"
                height="28"
                rx="8"
                fill="rgba(9, 15, 30, 0.9)"
                stroke="#f43f5e"
                strokeWidth="1.2"
              />
              <circle cx="2" cy="0" r="3" fill="#f43f5e" className="animate-ping" />
              <text
                x="12"
                y="4"
                fill="#ffffff"
                fontSize="11"
                fontWeight="bold"
                fontFamily="JetBrains Mono, monospace"
              >
                TS EVELYN · 110k
              </text>
            </g>

            {/* Lightning Strike Sparkles */}
            {lightningActive && (
              <g className="animate-bounce" opacity="0.9">
                <path
                  d="M -30 -25 L -22 -15 L -26 -15 L -18 -5"
                  stroke="#facc15"
                  strokeWidth="2.5"
                  fill="none"
                  filter="url(#glowFilter)"
                />
                <path
                  d="M 35 30 L 42 42 L 37 42 L 44 54"
                  stroke="#facc15"
                  strokeWidth="2.5"
                  fill="none"
                  filter="url(#glowFilter)"
                />
              </g>
            )}
          </g>

          {/* WIND STREAMLINES / PARTICLES LAYER */}
          {windActive && (
            <g opacity={windOpacity} stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 8">
              <path d="M 680 450 Q 730 400, 770 340" fill="none" opacity="0.6" />
              <path d="M 720 480 Q 770 430, 810 360" fill="none" opacity="0.7" />
              <path d="M 800 240 Q 820 180, 850 140" fill="none" opacity="0.8" />
              <path d="M 750 200 Q 780 150, 820 110" fill="none" opacity="0.65" />
              <path d="M 500 280 Q 560 270, 620 250" fill="none" opacity="0.5" />
              <path d="M 320 330 Q 380 320, 440 340" fill="none" opacity="0.4" />
            </g>
          )}

          {/* RADAR ROTATING SWEEP LINE (Optional radar scanner effect) */}
          {radarSweepActive && (
            <g transform="translate(680, 290)">
              <circle r="220" fill="none" stroke="rgba(0, 240, 255, 0.12)" strokeWidth="1" strokeDasharray="4 6" />
              <circle r="140" fill="none" stroke="rgba(0, 240, 255, 0.12)" strokeWidth="1" strokeDasharray="4 6" />
              <circle r="60" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1" />
              <g className="animate-radar" style={{ transformOrigin: "0px 0px" }}>
                <path
                  d="M 0 0 L 220 0 A 220 220 0 0 1 180 120 Z"
                  fill="url(#radarSweep)"
                />
                <line x1="0" y1="0" x2="220" y2="0" stroke="#00f0ff" strokeWidth="1.5" opacity="0.75" />
              </g>
            </g>
          )}

          {/* CITY WEATHER STATIONS & LABELS */}
          {STATION_COORDINATES.map((stn) => {
            const isSelected = selectedLocation.id === stn.id;
            return (
              <g
                key={stn.id}
                transform={`translate(${stn.x}, ${stn.y})`}
                className="cursor-pointer group"
                onClick={() => {
                  const fullMatch = SAMPLE_LOCATIONS.find((l) => l.id === stn.id) || {
                    id: stn.id,
                    city: stn.name,
                    country: "USA",
                    region: `${stn.name}, USA`,
                    temp: stn.temp,
                    condition: stn.condition,
                    windSpeed: 20,
                    humidity: 70,
                    pressure: 1012,
                    visibility: 16,
                  };
                  onSelectLocation(fullMatch);
                }}
              >
                {/* Outer halo / pulse for selected or active */}
                {isSelected && (
                  <circle
                    r="14"
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="1.5"
                    className="animate-ping"
                    opacity="0.6"
                  />
                )}
                {/* Station Node Marker */}
                <circle
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? "#00f0ff" : "#38bdf8"}
                  stroke="#070b14"
                  strokeWidth="2"
                  filter="url(#glowFilter)"
                />

                {/* City name & Temp Badge */}
                <g transform="translate(10, -8)">
                  <rect
                    x="-4"
                    y="-10"
                    width={isSelected ? "92" : "64"}
                    height="18"
                    rx="6"
                    fill={isSelected ? "rgba(0, 240, 255, 0.25)" : "rgba(11, 19, 37, 0.85)"}
                    stroke={isSelected ? "#00f0ff" : "rgba(56, 189, 248, 0.25)"}
                    strokeWidth="0.9"
                  />
                  <text
                    x="2"
                    y="3"
                    fill={isSelected ? "#ffffff" : "#e2e8f0"}
                    fontSize="10"
                    fontWeight={isSelected ? "bold" : "600"}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {stn.name}
                  </text>
                  <text
                    x={isSelected ? "64" : "44"}
                    y="3"
                    fill={isSelected ? "#00f0ff" : "#38bdf8"}
                    fontSize="9.5"
                    fontWeight="bold"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {unit === "C" ? `${stn.temp}°` : `${Math.round((stn.temp * 9) / 5 + 32)}°`}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Top Left: Layer Quick Toggles */}
      <LayerQuickToggles
        layers={layers}
        onToggleLayer={onToggleLayer}
        onUpdateOpacity={onUpdateOpacity}
      />

      {/* Floating Top Right: Storm Callout */}
      <StormCallout
        storm={ACTIVE_STORM}
        onSelectLocation={onSelectLocation}
        onOpenAiWithPrompt={onOpenAiWithPrompt}
      />

      {/* Map Control Toolbar (Bottom-Right Floating) */}
      <div className="absolute right-4 bottom-24 md:bottom-20 z-20 flex flex-col gap-1.5 bg-[#080e1c]/90 p-1.5 rounded-2xl border border-cyan-500/20 backdrop-blur-xl shadow-xl">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-8 h-8 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 flex items-center justify-center font-bold text-base transition-colors"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-8 h-8 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 flex items-center justify-center font-bold text-base transition-colors"
        >
          −
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset View"
          className="w-8 h-8 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 flex items-center justify-center text-xs transition-colors"
        >
          ⟲
        </button>
        <button
          onClick={() => setRadarSweepActive(!radarSweepActive)}
          title="Toggle Doppler Radar Sweep"
          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-colors ${
            radarSweepActive ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "bg-slate-900 text-slate-400"
          }`}
        >
          📡
        </button>
      </div>

      {/* Floating Bottom: Gauges Bar */}
      <MapGauges location={selectedLocation} unit={unit} />
    </div>
  );
}
