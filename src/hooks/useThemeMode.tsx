import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { readString, storageKeys, writeString } from "@/utils/storage";
import { isEmbedded } from "@/utils/opsette-kit-link";

export type ThemeMode = "light" | "dark";

function detectInitial(): ThemeMode {
  // Inside a Brand Board iframe (?embed=1) the app's header — and with it the
  // light/dark toggle — is hidden, so a dark boot would be un-escapable. A
  // signature also always renders onto a light Brand Board surface. Force light
  // when embedded, ignoring both the stored preference and the OS setting.
  if (isEmbedded()) return "light";
  const stored = readString(storageKeys.theme);
  if (stored === "light" || stored === "dark") return stored;
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Single source of truth for theme.
 *
 * IMPORTANT: theme MUST live in one shared state, not per-component `useState`.
 * Two things depend on the same `mode`:
 *   1. Ant Design's ConfigProvider algorithm (drives inputs, buttons, selects).
 *   2. The `data-theme` attribute on <html> (drives our CSS-variable surfaces).
 * If each consumer calls its own `useState`, the toggle flips only one copy and
 * the two halves invert against each other (light page + dark Ant inputs, or the
 * reverse). This provider guarantees both read the same value.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => detectInitial());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    // Don't persist the forced-light embed value — it would overwrite the user's
    // own preference the next time they open the tool standalone.
    if (!isEmbedded()) writeString(storageKeys.theme, mode);
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((m) => (m === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({ mode, setMode, toggle }), [mode, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within a <ThemeProvider>");
  }
  return ctx;
}
