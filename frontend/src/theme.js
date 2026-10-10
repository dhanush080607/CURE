const STORAGE_KEY = "cure.theme";
const PREFS_KEY = "cure.themePref";

export const THEMES = ["light", "dark", "system"];

function readStored(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? v : fallback;
  } catch {
    return fallback;
  }
}

/** The user's *preference*, which may be "system" - not the resolved theme. */
export function readPreference() {
  const v = readStored(PREFS_KEY, null);
  if (THEMES.includes(v)) return v;
  return THEMES.includes(readStored(STORAGE_KEY, null)) ? readStored(STORAGE_KEY, null) : "system";
}

export function systemPrefersDark() {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveTheme(theme) {
  return theme === "system" ? (systemPrefersDark() ? "dark" : "light") : theme;
}

export function applyTheme(theme) {
  const resolved = resolveTheme(theme);
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
  return resolved;
}

export function initTheme() {
  const pref = readPreference();
  applyTheme(pref);

  if (pref === "system" && window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (readPreference() === "system") applyTheme("system");
    });
  }

  return pref;
}

export function setTheme(pref) {
  try {
    localStorage.setItem(PREFS_KEY, pref);
    localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    /* storage unavailable - theme still applies for this session */
  }
  return applyTheme(pref);
}
