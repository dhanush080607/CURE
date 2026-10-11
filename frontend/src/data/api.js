const CONFIGURED_API_BASE = (import.meta.env.VITE_API_BASE || "").trim().replace(/\/$/, "");
const API_BASE = CONFIGURED_API_BASE || "/api";
const USE_BACKEND =
  import.meta.env.DEV || /^https?:\/\//i.test(CONFIGURED_API_BASE);
const LOCAL_HISTORY_KEY = "cure-water-risk-history";

// Only needed when the backend runs with CURE_API_KEY set. It is a public
// client-side value by design, exactly like the tile key.
const API_KEY = (import.meta.env.VITE_API_KEY || "").trim();

const REQUEST_TIMEOUT = 12000;

function readLocalHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveLocalHistory(history) {
  try {
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
  } catch {
    // Analysis still succeeds if the browser blocks local storage.
  }
}

function localWaterHistory(limit = 8) {
  const history = readLocalHistory().slice(0, limit);
  return { count: history.length, history };
}

function localWaterRisk(payload) {
  const capacity = Number(payload?.tank_capacity_liters);
  const level = Number(payload?.tank_level_percent);
  const latitude = Number(payload?.latitude);
  const longitude = Number(payload?.longitude);
  const history = Array.isArray(payload?.consumption_history)
    ? payload.consumption_history.map(Number)
    : [];

  if (!Number.isFinite(capacity) || capacity <= 0) {
    throw new Error("Tank capacity must be greater than zero.");
  }
  if (!Number.isFinite(level) || level < 0 || level > 100) {
    throw new Error("Tank level must be between 0 and 100 percent.");
  }
  if (!history.length || history.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new Error("Enter at least one valid, non-negative consumption value.");
  }
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be between -90 and 90.");
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be between -180 and 180.");
  }

  const average = history.reduce((sum, value) => sum + value, 0) / history.length;
  const recent = history.slice(-7);
  const weights = recent.map((_, index) => index + 1);
  const weightedDemand =
    recent.reduce((sum, value, index) => sum + value * weights[index], 0) /
    weights.reduce((sum, weight) => sum + weight, 0);
  const available = (capacity * level) / 100;
  const trendDifference = history.at(-1) - history[0];
  const trend =
    average === 0
      ? "STABLE"
      : trendDifference > average * 0.05
        ? "INCREASING"
        : trendDifference < -average * 0.05
          ? "DECREASING"
          : "STABLE";
  const heatAdjustment = 0;
  const dailyDemand = weightedDemand * (1 + heatAdjustment / 100);
  const runway = dailyDemand > 0 ? available / dailyDemand : null;
  const riskLevel =
    runway == null ? "WATCH" : runway < 2 ? "HIGH" : runway < 4 ? "WATCH" : "LOW";
  const riskReason =
    runway == null
      ? "Risk cannot be fully assessed because consumption data shows zero usage."
      : runway < 2
        ? `Water runway is only ${runway.toFixed(2)} days.`
        : runway < 4
          ? `Water runway is ${runway.toFixed(2)} days and requires closer monitoring.`
          : `Water runway is ${runway.toFixed(2)} days based on predicted consumption.`;
  const recommendation =
    runway == null
      ? "Consumption data shows zero usage. Verify consumption data before making a tanker decision."
      : runway < 2
        ? "Plan a tanker immediately."
        : runway < 4
          ? "Review tanker planning soon."
          : "Current water supply appears stable.";
  const result = {
    available_water_liters: Math.round(available * 100) / 100,
    average_daily_consumption_liters: Math.round(average * 100) / 100,
    consumption_trend: trend,
    projected_daily_consumption_liters: Math.round(dailyDemand * 100) / 100,
    predicted_daily_demand_liters: Math.round(weightedDemand * 100) / 100,
    demand_forecast: Array.from({ length: 7 }, (_, index) => ({
      day: index + 1,
      predicted_demand_liters: Math.round(weightedDemand * 100) / 100,
      temperature_c: null,
      heat_adjustment_percent: 0,
    })),
    demand_prediction_status: "SUCCESS",
    days_of_history: history.length,
    max_temperature_c: null,
    heat_warning: null,
    heat_adjustment_percent: heatAdjustment,
    water_runway_days: runway == null ? null : Math.round(runway * 100) / 100,
    risk_level: riskLevel,
    risk_reason: riskReason,
    recommendation,
    consumption_history: history,
    weather_source: "not-used-local-analysis",
    max_temperature_window_c: null,
    history_id: null,
    ai_advice: `Local calculation: ${riskReason}`,
    ai_backend: "deterministic",
    analysis_source: "browser",
  };

  const previous = readLocalHistory();
  saveLocalHistory([
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      created_at: new Date().toISOString(),
      available_water_liters: result.available_water_liters,
      tank_level_percent: level,
      water_runway_days: result.water_runway_days,
      risk_level: result.risk_level,
    },
    ...previous,
  ]);
  return result;
}

function canFallBackToLocal(error) {
  if (CONFIGURED_API_BASE) return false;
  if (error instanceof TypeError) return true;
  return error instanceof ApiError && [404, 500, 502, 503, 504].includes(error.status);
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, { timeout = REQUEST_TIMEOUT, signal, ...init } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  if (signal) signal.addEventListener("abort", () => controller.abort(), { once: true });

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { "X-API-Key": API_KEY } : {}),
        ...(init.headers || {}),
      },
    });

    if (!response.ok) {
      throw new ApiError(`Request failed with ${response.status}`, response.status);
    }
    if (response.status === 204) return null;
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  base: USE_BACKEND ? API_BASE : "local browser calculation",

  health() {
    return request("/health", { timeout: 2500 });
  },

  weather(latitude, longitude) {
    return request(
      `/weather/current?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`
    );
  },

  search(query, count = 8) {
    return request(
      `/weather/search?q=${encodeURIComponent(query)}&count=${count}`
    );
  },

  tanks() {
    return request("/tanks");
  },

  createTank(tank) {
    return request("/tanks", { method: "POST", body: JSON.stringify(tank) });
  },

  updateTank(id, patch) {
    return request(`/tanks/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
  },

  deleteTank(id) {
    return request(`/tanks/${id}`, { method: "DELETE" });
  },

  addReading(id, liters) {
    return request(`/tanks/${id}/readings`, {
      method: "POST",
      body: JSON.stringify({ liters }),
    });
  },

  waterRisk(payload) {
    if (!USE_BACKEND) return Promise.resolve(localWaterRisk(payload));
    return request("/water/risk", {
      method: "POST",
      body: JSON.stringify(payload),
      timeout: 20000,
    }).catch((error) => {
      if (!canFallBackToLocal(error)) throw error;
      return localWaterRisk(payload);
    });
  },

  waterHistory(limit = 8) {
    if (!USE_BACKEND) return Promise.resolve(localWaterHistory(limit));
    return request(`/water/history?limit=${encodeURIComponent(limit)}`).catch((error) => {
      if (!canFallBackToLocal(error)) throw error;
      return localWaterHistory(limit);
    });
  },
};
