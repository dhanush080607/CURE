const STORAGE_KEY = "cure.theme";

export const THEMES = ["light", "dark", "system"];

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(v) ? v : "system";
  } catch {
    return "system";
  }
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

export function persistTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable - theme still applies for this session */
  }
}

export function initTheme() {
  const theme = readStored();
  applyTheme(theme);

  if (theme === "system" && window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (readStored() === "system") applyTheme("system");
    });
  }

  return theme;
}

export function setTheme(theme) {
  persistTheme(theme);
  return applyTheme(theme);
}
