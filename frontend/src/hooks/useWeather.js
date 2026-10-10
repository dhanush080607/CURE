import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWeather, reverseGeocode } from "../data/liveWeather";

const EMPTY = {
  id: null,
  name: null,
  lat: null,
  lon: null,
  country: "",
  admin1: "",
  elevation: null,
};

export function useWeather() {
  const [place, setPlace] = useState(EMPTY);
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState("idle");
  const [source, setSource] = useState(null);
  const reqId = useRef(0);

  const select = useCallback(async (candidate) => {
    const id = ++reqId.current;
    const point = {
      id: candidate.id ?? `${candidate.lat},${candidate.lon}`,
      lat: Number(candidate.lat),
      lon: Number(candidate.lon),
      name: candidate.name ?? null,
      country: candidate.country ?? "",
      admin1: candidate.admin1 ?? "",
      elevation: candidate.elevation ?? null,
    };

    setPlace(point);
    setStatus("loading");
    setWeather(null);

    const resolvedName =
      point.name ?? (await reverseGeocode(point.lat, point.lon)).name;

    if (id !== reqId.current) return;

    if (!point.name) setPlace((p) => ({ ...p, name: resolvedName }));

    try {
      const data = await fetchWeather({ lat: point.lat, lon: point.lon, place: point });
      if (id !== reqId.current) return;
      setWeather(data);
      setSource(data.source);
      setStatus("ready");
    } catch {
      if (id !== reqId.current) return;
      setStatus("error");
    }
  }, []);

  return { place, weather, status, source, select };
}

export function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
