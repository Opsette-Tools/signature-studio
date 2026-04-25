import { useCallback, useEffect, useState } from "react";
import { readJSON, storageKeys, writeJSON } from "@/utils/storage";

function load(): string[] {
  const arr = readJSON<unknown>(storageKeys.favorites, []);
  return Array.isArray(arr) ? (arr as string[]) : [];
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>(() => load());

  useEffect(() => {
    writeJSON(storageKeys.favorites, ids);
  }, [ids]);

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  return { favorites: ids, isFavorite, toggle };
}
