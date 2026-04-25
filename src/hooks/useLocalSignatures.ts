import { useCallback, useEffect, useState } from "react";
import {
  MAX_SAVED_SIGNATURES,
  type SavedSignature,
  type SignatureData,
} from "@/types/signature";

const STORAGE_KEY = "esg.saved.v1";

function load(): SavedSignature[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as SavedSignature[];
    return Array.isArray(arr) ? arr.slice(0, MAX_SAVED_SIGNATURES) : [];
  } catch {
    return [];
  }
}

function persist(items: SavedSignature[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

function genId() {
  return `sig_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function useLocalSignatures() {
  const [items, setItems] = useState<SavedSignature[]>(() => load());

  useEffect(() => {
    persist(items);
  }, [items]);

  const isFull = items.length >= MAX_SAVED_SIGNATURES;

  const save = useCallback(
    (input: { name: string; templateId: string; data: SignatureData; replaceId?: string }) => {
      const entry: SavedSignature = {
        id: input.replaceId ?? genId(),
        name: input.name.trim() || "Untitled signature",
        templateId: input.templateId,
        data: input.data,
        updatedAt: Date.now(),
      };
      setItems((prev) => {
        if (input.replaceId) {
          return prev.map((it) => (it.id === input.replaceId ? entry : it));
        }
        if (prev.length >= MAX_SAVED_SIGNATURES) return prev;
        return [entry, ...prev];
      });
      return entry.id;
    },
    [],
  );

  const rename = useCallback((id: string, name: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, name: name.trim() || it.name, updatedAt: Date.now() } : it)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  return { items, save, rename, remove, isFull, max: MAX_SAVED_SIGNATURES };
}
