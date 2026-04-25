import { useCallback, useEffect, useState } from "react";
import {
  MAX_SAVED_SIGNATURES,
  type SavedSignature,
  type SignatureData,
} from "@/types/signature";
import { readJSON, storageKeys, writeJSON } from "@/utils/storage";

function load(): SavedSignature[] {
  const arr = readJSON<unknown>(storageKeys.saved, []);
  return Array.isArray(arr) ? (arr as SavedSignature[]).slice(0, MAX_SAVED_SIGNATURES) : [];
}

function genId() {
  return `sig_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function useLocalSignatures() {
  const [items, setItems] = useState<SavedSignature[]>(() => load());

  useEffect(() => {
    writeJSON(storageKeys.saved, items);
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
