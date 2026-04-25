import { useCallback, useEffect, useState } from "react";
import { readString, storageKeys, writeString } from "@/utils/storage";

export type ThemeMode = "light" | "dark";

function detectInitial(): ThemeMode {
  const stored = readString(storageKeys.theme);
  if (stored === "light" || stored === "dark") return stored;
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>(() => detectInitial());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    writeString(storageKeys.theme, mode);
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((m) => (m === "dark" ? "light" : "dark"));
  }, []);

  return { mode, setMode, toggle };
}
