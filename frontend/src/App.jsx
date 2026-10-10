import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import WorldMap from "./components/WeatherMap/WorldMap";
import CurrentConditions from "./components/CurrentConditions";
import HourlyForecast from "./components/HourlyForecast";
import MultiDayForecast from "./components/MultiDayForecast";
import AirQualityAndAlerts from "./components/AirQualityAndAlerts";
import InteractiveLayers from "./components/InteractiveLayers";
import TimelineControls from "./components/TimelineControls";
import OperationalAnalytics from "./components/OperationalAnalytics";
import MetricsStrip from "./components/MetricsStrip";
import CureWaterEngine from "./components/CureWaterEngine";

import RadarView from "./views/RadarView";
import WindView from "./views/WindView";
import TemperatureView from "./views/TemperatureView";
import AirQualityView from "./views/AirQualityView";
import ReportsView from "./views/ReportsView";
import ApiAccessView from "./views/ApiAccessView";
import SettingsView from "./views/SettingsView";
import LayerDetailView from "./views/LayerDetailView";

import { MITS_MADANAPALLE, WEATHER_LAYERS, TIMELINE_SLICES } from "./data/mockWeatherData";
import { setTheme } from "./theme";

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState(MITS_MADANAPALLE);
  const [layers, setLayers] = useState(WEATHER_LAYERS);
  const [activeSliceIndex, setActiveSliceIndex] = useState(2);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unit, setUnit] = useState("C");
  const [theme, setThemeState] = useState(
    () =>
      (typeof document !== "undefined" && document.documentElement.dataset.theme) ||
      "dark"
  );

  const handleThemeChange = (next) => {
    setThemeState(setTheme(next));
  };

  const toggleLayer = (id) =>
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l)));

  const updateOpacity = (id, opacity) =>
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, opacity } : l)));

  const toggleUnit = () => setUnit((p) => (p === "C" ? "F" : "C"));
  const currentTimeSlice = TIMELINE_SLICES[activeSliceIndex] ?? TIMELINE_SLICES[0];

  const toF = (c) => Math.round((c * 9) / 5 + 32);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <Header
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        unit={unit}
        onToggleUnit={toggleUnit}
        theme={theme}
        onThemeChange={handleThemeChange}
      />

      <div className="flex">
        <div className="hidden md:flex">
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
          />
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div style={{ width: 212, borderRight: "1px solid var(--border)", background: "var(--bg)" }}>
              <div
                className="flex items-center justify-between border-b px-4 py-3"
                style={{ borderColor: "var(--border)" }}
              >
                <span className="label">Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[var(--ink-3)] hover:text-[var(--ink)]"
                  aria-label="Close menu"
                >
                  &times;
                </button>
              </div>
              <Sidebar
                activeTab={activeTab}
                onSelectTab={(t) => {
                  setActiveTab(t);
                  setMobileMenuOpen(false);
                }}
                isCollapsed={false}
                onToggleCollapse={() => {}}
              />
            </div>
            <div
              className="flex-1 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
        )}

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-[1800px] px-4 py-5 sm:px-6 sm:py-6">
            <div className="mb-4 flex items-center justify-between gap-3 md:hidden">
              <button onClick={() => setMobileMenuOpen(true)} className="btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Menu
              </button>
              <span className="num text-[11px]" style={{ color: "var(--ink-2)" }}>
                {selectedLocation.city} &middot;{" "}
                {unit === "C" ? `${selectedLocation.temp}°` : `${toF(selectedLocation.temp)}°`}
              </span>
            </div>

            {activeTab === "dashboard" ? (
              <div className="animate-fadeIn space-y-4">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                  <div className="space-y-4 xl:col-span-8">
                    <WorldMap
                      selectedLocation={selectedLocation}
                      onSelectLocation={setSelectedLocation}
                      layers={layers}
                      unit={unit}
                      currentTimeSlice={currentTimeSlice}
                    />

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                      <TimelineControls
                        activeSliceIndex={activeSliceIndex}
                        onChangeSliceIndex={setActiveSliceIndex}
                      />
                      <OperationalAnalytics location={selectedLocation} unit={unit} />
                      <InteractiveLayers
                        layers={layers}
                        onToggleLayer={toggleLayer}
                        onUpdateOpacity={updateOpacity}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 xl:col-span-4">
                    <CurrentConditions location={selectedLocation} unit={unit} />
                    <HourlyForecast unit={unit} />
                    <MultiDayForecast unit={unit} />
                    <AirQualityAndAlerts location={selectedLocation} />
                  </div>
                </div>

                <MetricsStrip />
              </div>
            ) : activeTab === "climate_analytics" ? (
              <div className="animate-fadeIn space-y-4">
                <div className="card flex items-center justify-between px-4 py-3">
                  <div>
                    <h2 className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                      CURE &mdash; Climate &amp; Utility Risk Engine
                    </h2>
                    <p className="mt-0.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
                      Water reserve runway &amp; consumption model
                    </p>
                  </div>
                  <button onClick={() => setActiveTab("dashboard")} className="btn">
                    Back to dashboard
                  </button>
                </div>
                <CureWaterEngine />
              </div>
            ) : activeTab === "radar" ? (
              <RadarView location={selectedLocation} />
            ) : activeTab === "wind" ? (
              <WindView location={selectedLocation} />
            ) : activeTab === "temperature" ? (
              <TemperatureView location={selectedLocation} unit={unit} />
            ) : activeTab === "air_quality" ? (
              <AirQualityView location={selectedLocation} />
            ) : activeTab === "reports" ? (
              <ReportsView location={selectedLocation} />
            ) : activeTab === "api_access" ? (
              <ApiAccessView location={selectedLocation} />
            ) : activeTab === "settings" ? (
              <SettingsView unit={unit} onToggleUnit={toggleUnit} theme={theme} onThemeChange={handleThemeChange} />
            ) : (
              <LayerDetailView activeTab={activeTab} location={selectedLocation} />
            )}

            <footer
              className="mt-6 flex flex-col gap-1 border-t pt-4 text-[10px] sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: "var(--border)", color: "var(--ink-3)" }}
            >
              <span>METEO Intelligence &middot; Madanapalle regional command</span>
              <span>Weather: Open-Meteo &middot; Basemap: OpenFreeMap &middot; Radar: RainViewer</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
