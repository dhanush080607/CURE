const API_BASE = (import.meta.env.VITE_API_BASE || "/api").replace(/\/$/, "");

const REQUEST_TIMEOUT = 12000;

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
      headers: { "Content-Type": "application/json", ...(init.headers || {}) },
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
  base: API_BASE,

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
    return request("/water/risk", {
      method: "POST",
      body: JSON.stringify(payload),
      timeout: 20000,
    });
  },
};
