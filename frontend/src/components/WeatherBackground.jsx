
import { useEffect, useState } from "react";

export default function WeatherBackground({ mode = "storm" }) {
  const [lightning, setLightning] = useState(false);

  useEffect(() => {
    if (mode !== "storm") return;

    let timeout;
    let active = true;

    const flash = () => {
      if (!active) return;

      setLightning(true);
      setTimeout(() => {
        if (active) setLightning(false);
      }, 130);

      timeout = setTimeout(flash, 6500 + Math.random() * 9000);
    };

    timeout = setTimeout(flash, 3500);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [mode]);

  return (
    <div
      aria-hidden="true"
      className={`weather-scene weather-scene--${mode}`}
    >
      <div className="weather-scene__base" />

      <div className="weather-scene__glow weather-scene__glow--one" />
      <div className="weather-scene__glow weather-scene__glow--two" />

      <div className="weather-scene__horizon">
        <div className="weather-scene__sun" />
        <div className="weather-scene__haze" />
      </div>

      <div className="weather-scene__cloud weather-scene__cloud--one" />
      <div className="weather-scene__cloud weather-scene__cloud--two" />
      <div className="weather-scene__cloud weather-scene__cloud--three" />

      {mode === "storm" && (
        <>
          <div className="weather-scene__rain weather-scene__rain--one" />
          <div className="weather-scene__rain weather-scene__rain--two" />
          <div className="weather-scene__rain weather-scene__rain--three" />

          <div
            className={`weather-scene__lightning ${lightning ? "is-flashing" : ""}`}
          />
        </>
      )}

      <div className="weather-scene__particles">
        {Array.from({ length: 32 }, (_, index) => (
          <span
            key={index}
            style={{
              "--i": index,
              "--x": `${(index * 37 + 11) % 100}%`,
              "--delay": `${(index % 11) * -1.7}s`,
              "--duration": `${8 + (index % 9)}s`,
            }}
          />
        ))}
      </div>

      <div className="weather-scene__vignette" />
      <div className="weather-scene__grain" />
    </div>
  );
}