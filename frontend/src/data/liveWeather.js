import { api } from "./api";

const FORECAST = "https://api.open-meteo.com/v1/forecast";
const AIR = "https://air-quality-api.open-meteo.com/v1/air-quality";
const GEOCODING = "https://geocoding-api.open-meteo.com/v1/search";
const REVERSE = "https://api.bigdatacloud.net/data/reverse-geocode-client";
const WTTR = "https://wttr.in";

export const CARDINALS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

export function degreesToCardinal(deg) {
  if (!Number.isFinite(deg)) return "";
  return CARDINALS[Math.round(deg / 45) % 8];
}

async function getJson(url, timeout = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ */
/*  Search                                                             */
/* ------------------------------------------------------------------ */

export async function searchPlaces(query) {
  const q = query.trim();
  if (q.length < 2) return [];

  try {
    const results = await api.search(q, 8);
    if (Array.isArray(results) && results.length) return results;
  } catch {
    /* backend offline - fall through to direct upstream call */
  }

  const data = await getJson(
    `${GEOCODING}?name=${encodeURIComponent(q)}&count=8&language=en&format=json`
  );
  return (data.results ?? []).map((r) => ({
    id: `${r.latitude},${r.longitude}`,
    name: r.name,
    lat: r.latitude,
    lon: r.longitude,
    country: r.country ?? "",
    countryCode: r.country_code ?? "",
    admin1: r.admin1 ?? "",
    timezone: r.timezone ?? "",
    elevation: r.elevation ?? null,
  }));
}

export async function reverseGeocode(lat, lon) {
  try {
    const data = await getJson(
      `${REVERSE}?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    return {
      name: data.city || data.locality || data.principalSubdivision || "Selected point",
      country: data.countryName ?? "",
      admin1: data.principalSubdivision ?? "",
    };
  } catch {
    return {
      name: `${Number(lat).toFixed(3)}, ${Number(lon).toFixed(3)}`,
      country: "",
      admin1: "",
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Weather                                                            */
/* ------------------------------------------------------------------ */

function normalise(raw, air, place) {
  const cur = raw?.current;
  if (!cur) throw new Error("No current conditions returned");

  const daily = raw?.daily ?? {};
  const hourly = raw?.hourly ?? {};

  const dailyDays = (daily.time ?? []).map((date, i) => ({
    date,
    max: daily.temperature_2m_max?.[i] ?? null,
    min: daily.temperature_2m_min?.[i] ?? null,
    code: daily.weather_code?.[i] ?? null,
    pop: daily.precipitation_probability_max?.[i] ?? 0,
    sunrise: daily.sunrise?.[i] ?? null,
    sunset: daily.sunset?.[i] ?? null,
  }));

  const nowIso = cur.time;
  const times = hourly.time ?? [];
  // `current.time` carries minutes while hourly stamps are on the hour, so
  // indexOf() would miss and silently restart the window at midnight.
  const startIdx = Math.max(
    0,
    times.findIndex((t) => String(t).slice(0, 13) >= String(nowIso).slice(0, 13))
  );
  const humiditySeries = hourly.relative_humidity_2m ?? [];

  const hourlySlots = times.slice(startIdx, startIdx + 24).map((t, k) => {
    const i = startIdx + k;
    const m = String(t).match(/T(\d{2}):(\d{2})/);
    return {
      time: m ? `${m[1]}:${m[2]}` : t,
      temp: hourly.temperature_2m?.[i] ?? null,
      humidity: humiditySeries[i] ?? null,
      code: hourly.weather_code?.[i] ?? null,
      pop: hourly.precipitation_probability?.[i] ?? 0,
      wind: hourly.wind_speed_10m?.[i] ?? null,
      pressure: hourly.pressure_msl?.[i] != null ? Math.round(hourly.pressure_msl[i]) : null,
      precip: hourly.precipitation?.[i] ?? 0,
      isDay: hourly.is_day?.[i] !== 0,
    };
  });

  return {
    live: true,
    source: "open-meteo",
    temp: cur.temperature_2m,
    feelsLike: cur.apparent_temperature,
    humidity: cur.relative_humidity_2m,
    pressure: Math.round(cur.pressure_msl ?? cur.surface_pressure ?? 0),
    windSpeed: cur.wind_speed_10m,
    windGust: cur.wind_gusts_10m,
    windDirection: degreesToCardinal(cur.wind_direction_10m),
    visibility: Number.isFinite(cur.visibility) ? Math.round(cur.visibility / 1000) : null,
    uvIndex: cur.uv_index ?? null,
    weatherCode: cur.weather_code ?? null,
    cloudCover: cur.cloud_cover ?? null,
    precipitation: cur.precipitation ?? null,
    rainRate: cur.precipitation ?? null,
    aqi: air?.current?.european_aqi ?? null,
    pm25: air?.current?.pm2_5 ?? null,
    pm10: air?.current?.pm10 ?? null,
    daily: dailyDays,
    hourly: hourlySlots,
    elevation: raw.elevation ?? place.elevation ?? null,
    timezone: raw.timezone_abbreviation ?? "",
  };
}

function fromWttr(lat, lon, place) {
  const label = place.name || `${lat},${lon}`;
  return getJson(`${WTTR}/${encodeURIComponent(label)}?format=j1`, 15000).then((d) => {
    const cur = d?.current_condition?.[0];
    if (!cur) throw new Error("Incomplete wttr.in response");

    return {
      live: true,
      source: "wttr",
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
      cloudCover: Number(cur.cloudcover) || null,
      precipitation: Number(cur.precipMM) || null,
      rainRate: Number(cur.precipMM) || null,
      aqi: null,
      pm25: null,
      pm10: null,
      daily: (d?.weather ?? []).slice(0, 7).map((x) => ({
        date: x.date,
        max: Number(x.maxtempC),
        min: Number(x.mintempC),
        code: null,
        pop: Number(x.hourly?.[0]?.chanceofrain ?? 0),
        sunrise: x.astronomy?.[0]?.sunrise ?? null,
        sunset: x.astronomy?.[0]?.sunset ?? null,
      })),
      hourly: [],
      elevation: null,
      timezone: "",
    };
  });
}

export async function fetchWeather({ lat, lon, place }) {
  try {
    const data = await api.weather(lat, lon);
    if (data && data.temp != null) return data;
  } catch {
    /* backend offline - fall through to direct upstream call */
  }
  return fetchWeatherDirect(lat, lon, place);
}

async function fetchWeatherDirect(lat, lon, place) {
  const base =
    `${FORECAST}?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code,cloud_cover,precipitation,visibility,uv_index` +
    `&hourly=temperature_2m,relative_humidity_2m,weather_code,precipitation_probability,precipitation,pressure_msl,wind_speed_10m,is_day` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max` +
    `&timezone=auto&forecast_days=7`;

  try {
    const [raw, air] = await Promise.all([
      getJson(base),
      getJson(`${AIR}?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,european_aqi&timezone=auto`).catch(
        () => null
      ),
    ]);
    return normalise(raw, air, place);
  } catch (err) {
    const fallback = await fromWttr(lat, lon, place);
    return { ...fallback, degraded: true, primaryError: err.message };
  }
}

/* ------------------------------------------------------------------ */
/*  Formatting                                                         */
/* ------------------------------------------------------------------ */

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

export function uvLabel(uv) {
  if (uv == null) return "Unknown";
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very high";
  return "Extreme";
}

export function uvTone(uv) {
  if (uv == null) return "chip-warn";
  if (uv < 3) return "chip-good";
  if (uv < 8) return "chip-warn";
  return "chip-bad";
}

export function convertTemp(c, unit) {
  if (c == null || Number.isNaN(c)) return null;
  return unit === "C" ? Math.round(c) : Math.round((c * 9) / 5 + 32);
}

export function dayLabel(dateStr, index) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "\u2014";
  return d.toLocaleDateString([], { weekday: "short" });
}

export function shortDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "\u2014";
  return d.toLocaleDateString([], { day: "2-digit", month: "short" });
}

export function timeOnly(iso) {
  if (!iso) return "\u2014";
  const m = String(iso).match(/T(\d{2}:\d{2})/);
  return m ? m[1] : String(iso).slice(0, 5);
}

