import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import LocationSearch from "./components/LocationSearch";
import WorldMap from "./components/WeatherMap/WorldMap";
import CurrentConditions from "./components/CurrentConditions";
import HourlyForecast from "./components/HourlyForecast";
import MultiDayForecast from "./components/MultiDayForecast";
import AirQualityAndAlerts from "./components/AirQualityAndAlerts";
import OperationalAnalytics from "./components/OperationalAnalytics";
import TimelineControls from "./components/TimelineControls";
import InteractiveLayers from "./components/InteractiveLayers";
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

import { useWeather } from "./hooks/useWeather";
import { readPreference, setTheme } from "./theme";

export function Shell() {
  const [unit, setUnit] = useState("C");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [themePref, setThemePref] = useState(() => readPreference());

  const { place, weather, status, source, select } = useWeather();
  const { pathname } = useLocation();

  const onThemeChange = (next) => {
    setTheme(next);
    setThemePref(next);
  };

  const rightRail = (
    <div className="space-y-4">
      <CurrentConditions place={place} weather={weather} unit={unit} />
      <HourlyForecast weather={weather} unit={unit} />
      <MultiDayForecast weather={weather} unit={unit} />
      <AirQualityAndAlerts weather={weather} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <Header
        place={place}
        weather={weather}
        unit={unit}
        onToggleUnit={() => setUnit((p) => (p === "C" ? "F" : "C"))}
        theme={themePref}
        onThemeChange={onThemeChange}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <div className="flex">
        <div className="hidden md:flex">
          <Sidebar
            pathname={pathname}
            isCollapsed={collapsed}
            onToggleCollapse={() => setCollapsed((p) => !p)}
          />
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div style={{ width: 212, background: "var(--bg)", borderRight: "1px solid var(--border)" }}>
              <div
                className="flex items-center justify-between border-b px-4 py-3"
                style={{ borderColor: "var(--border)" }}
              >
                <span className="label">Navigation</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-[var(--ink-3)] hover:text-[var(--ink)]"
                  aria-label="Close menu"
                >
                  &times;
                </button>
              </div>
              <Sidebar
                pathname={pathname}
                isCollapsed={false}
                onToggleCollapse={() => {}}
              />
            </div>
            <div className="flex-1" style={{ background: "rgba(0,0,0,0.55)" }} onClick={() => setMobileOpen(false)} />
          </div>
        )}

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-[1800px] px-4 py-5 sm:px-6 sm:py-6">
            <div className="mb-4 flex items-center justify-between gap-3 md:hidden">
              <button onClick={() => setMobileOpen(true)} className="btn">
                Menu
              </button>
              <button onClick={() => setSearchOpen(true)} className="btn">
                {place?.name ?? "Choose location"}
              </button>
            </div>

            <Routes>
              <Route
                path="/dashboard"
                element={
                  <div className="animate-fadeIn space-y-4">
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                      <div className="space-y-4 xl:col-span-8">
                        <WorldMap
                          place={place}
                          status={status}
                          source={source}
                          onSelectPoint={select}
                          onOpenLocationSearch={() => setSearchOpen(true)}
                        />
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                          <TimelineControls weather={weather} />
                          <OperationalAnalytics weather={weather} />
                          <InteractiveLayers place={place} weather={weather} />
                        </div>
                      </div>
                      <div className="xl:col-span-4">{rightRail}</div>
                    </div>
                    <MetricsStrip weather={weather} unit={unit} />
                  </div>
                }
              />

              <Route path="/live-weather" element={<LayerDetailView kind="live_weather" place={place} weather={weather} unit={unit} />} />
              <Route path="/radar" element={<RadarView place={place} weather={weather} />} />
              <Route path="/wind" element={<WindView place={place} weather={weather} />} />
              <Route path="/rainfall" element={<LayerDetailView kind="rainfall" place={place} weather={weather} unit={unit} />} />
              <Route path="/temperature" element={<TemperatureView place={place} weather={weather} unit={unit} />} />
              <Route path="/clouds" element={<LayerDetailView kind="clouds" place={place} weather={weather} unit={unit} />} />
              <Route path="/pressure" element={<LayerDetailView kind="pressure" place={place} weather={weather} unit={unit} />} />
              <Route path="/satellite" element={<LayerDetailView kind="satellite" place={place} weather={weather} unit={unit} />} />
              <Route path="/lightning" element={<LayerDetailView kind="lightning" place={place} weather={weather} unit={unit} />} />
              <Route path="/air-quality" element={<AirQualityView place={place} weather={weather} />} />
              <Route path="/reports" element={<ReportsView place={place} weather={weather} unit={unit} />} />
              <Route path="/api-access" element={<ApiAccessView />} />
              <Route
                path="/settings"
                element={
                  <SettingsView
                    unit={unit}
                    onToggleUnit={() => setUnit((p) => (p === "C" ? "F" : "C"))}
                    theme={themePref}
                    onThemeChange={onThemeChange}
                  />
                }
              />
              <Route path="/climate-analytics" element={<CureWaterEngine />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>

            <footer
              className="mt-8 flex flex-col gap-1 border-t pt-5 text-[10px] sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: "var(--border)", color: "var(--ink-3)" }}
            >
              <span>METEO Intelligence</span>
              <span>Weather: Open-Meteo &middot; Geocoding: Open-Meteo &middot; Basemap: OpenFreeMap &middot; Radar: RainViewer</span>
            </footer>
          </div>
        </main>
      </div>{searchOpen && <LocationSearch onClose={() => setSearchOpen(false)} onPick={select} />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
