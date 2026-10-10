const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";
const OPEN_METEO_AIR = "https://air-quality-api.open-meteo.com/v1/air-quality";
const WTTR = "https://wttr.in";

function joinCoords(values) {
  return values.map((v) => Number(v).toFixed(4)).join(",");
}

async function getJson(url, { timeout = 12000, signal } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  if (signal) {
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fromOpenMeteo(stations) {
  const lat = joinCoords(stations.map((s) => s.lat));
  const lon = joinCoords(stations.map((s) => s.lon));

  const [weather, air] = await Promise.all([
    getJson(
      `${OPEN_METEO}?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code,visibility,uv_index` +
        `&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max` +
        `&timezone=auto&forecast_days=7`
    ),
    getJson(
      `${OPEN_METEO_AIR}?latitude=${lat}&longitude=${lon}` +
        `&current=pm10,pm2_5,european_aqi&timezone=auto`
    ).catch(() => null),
  ]);

  const airArr = Array.isArray(air) ? air : [];

  return stations.map((station, i) => {
    const cur = weather[i]?.current;
    if (!cur) throw new Error("Incomplete Open-Meteo response");

    const deg = cur.wind_direction_10m;
    const card = Number.isFinite(deg)
      ? ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(deg / 45) % 8]
      : station.windDirection;

    return {
      ...station,
      live: true,
      source: "open-meteo",
      temp: cur.temperature_2m,
      feelsLike: cur.apparent_temperature,
      humidity: cur.relative_humidity_2m,
      pressure: Math.round(cur.pressure_msl ?? cur.surface_pressure ?? station.pressure),
      windSpeed: cur.wind_speed_10m,
      windGust: cur.wind_gusts_10m,
      windDirection: card,
      visibility: Number.isFinite(cur.visibility) ? Math.round(cur.visibility / 1000) : null,
      uvIndex: cur.uv_index ?? null,
      weatherCode: cur.weather_code ?? null,
      aqi: airArr[i]?.current?.european_aqi ?? null,
      pm25: airArr[i]?.current?.pm2_5 ?? null,
      pm10: airArr[i]?.current?.pm10 ?? null,
      daily: weather[i]?.daily ?? null,
    };
  });
}

async function fromWttr(stations) {
  const results = await Promise.all(
    stations.map(async (station) => {
      const data = await getJson(`${WTTR}/${encodeURIComponent(station.city)}?format=j1`, {
        timeout: 15000,
      });
      const cur = data?.current_condition?.[0];
      if (!cur) throw new Error("Incomplete wttr.in response");
      const day = data?.weather?.[0];
      return {
        ...station,
        live: true,
        source: "wttr.in",
        temp: Number(cur.temp_C),
        feelsLike: Number(cur.FeelsLikeC),
        humidity: Number(cur.humidity),
        pressure: Number(cur.pressure),
        windSpeed: Number(cur.windspeedKmph),
        windGust: null,
        windDirection: cur.winddir16Point,
        visibility: Number(cur.visibility) || null,
        uvIndex: Number(cur.uvIndex) || null,
        weatherCode: Number(cur.weatherCode),
        aqi: null,
        pm25: null,
        pm10: null,
        daily: day
          ? {
              temperature_2m_max: [Number(day.maxtempC)],
              temperature_2m_min: [Number(day.mintempC)],
              sunrise: [day.astronomy?.[0]?.sunrise ?? ""],
              sunset: [day.astronomy?.[0]?.sunset ?? ""],
            }
          : null,
      };
    })
  );
  return results;
}

export async function fetchLiveStations(stations) {
  try {
    return { stations: await fromOpenMeteo(stations), source: "open-meteo" };
  } catch (primaryError) {
    try {
      return { stations: await fromWttr(stations), source: "wttr.in" };
    } catch {
      throw primaryError;
    }
  }
}

export const WMO = {
  0: ["Clear", "\u2600\uFE0F"],
  1: ["Mainly clear", "\u2600\uFE0F"],
  2: ["Partly cloudy", "\u26C5"],
  3: ["Overcast", "\u2601\uFE0F"],
  45: ["Fog", "\u2601\uFE0F"],
  48: ["Freezing fog", "\u2601\uFE0F"],
  51: ["Light drizzle", "\uD83D\uDCDC\uFE0F"],
  53: ["Drizzle", "\uD83D\uDCDC\uFE0F"],
  55: ["Heavy drizzle", "\uD83D\uDCDC\uFE0F"],
  56: ["Freezing drizzle", "\uD83D\uDCDC\uFE0F"],
  57: ["Freezing drizzle", "\uD83D\uDCDC\uFE0F"],
  61: ["Light rain", "\uD83D\uDCA7"],
  63: ["Rain", "\uD83D\uDCA7"],
  65: ["Heavy rain", "\uD83D\uDCA7"],
  66: ["Freezing rain", "\uD83D\uDCA7"],
  67: ["Freezing rain", "\uD83D\uDCA7"],
  71: ["Light snow", "\u2744\uFE0F"],
  73: ["Snow", "\u2744\uFE0F"],
  75: ["Heavy snow", "\u2744\uFE0F"],
  77: ["Snow grains", "\u2744\uFE0F"],
  80: ["Rain showers", "\uD83D\uDCA7"],
  81: ["Rain showers", "\uD83D\uDCA7"],
  82: ["Violent showers", "\uD83D\uDCA7"],
  85: ["Snow showers", "\u2744\uFE0F"],
  86: ["Heavy snow showers", "\u2744\uFE0F"],
  95: ["Thunderstorm", "\u26A1"],
  96: ["Thunderstorm, hail", "\u26A1"],
  99: ["Severe thunderstorm", "\u26A1"],
};

export function conditionMeta(code) {
  return WMO[code] ?? ["Unknown", "\uD83C\uDF21"];
}

export function aqiTone(aqi) {
  if (aqi == null) return { label: "No data", tone: "chip-warn", bar: "var(--warn)" };
  if (aqi <= 20) return { label: "Good", tone: "chip-good", bar: "var(--good)" };
  if (aqi <= 40) return { label: "Fair", tone: "chip-good", bar: "var(--good)" };
  if (aqi <= 60) return { label: "Moderate", tone: "chip-warn", bar: "var(--warn)" };
  if (aqi <= 80) return { label: "Poor", tone: "chip-warn", bar: "var(--warn)" };
  if (aqi <= 100) return { label: "Very poor", tone: "chip-bad", bar: "var(--bad)" };
  return { label: "Extremely poor", tone: "chip-bad", bar: "var(--bad)" };
}

export function uvTone(uv) {
  if (uv == null) return "chip-warn";
  if (uv < 3) return "chip-good";
  if (uv < 6) return "chip-warn";
  if (uv < 8) return "chip-warn";
  if (uv < 11) return "chip-bad";
  return "chip-bad";
}

export function uvLabel(uv) {
  if (uv == null) return "Unknown";
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very high";
  return "Extreme";
}

export function fmtTemp(c, unit) {
  if (c == null || Number.isNaN(c)) return "--";
  return unit === "C" ? String(Math.round(c)) : String(Math.round((c * 9) / 5 + 32));
}
