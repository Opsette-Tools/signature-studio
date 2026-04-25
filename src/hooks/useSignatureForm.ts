import { useCallback, useEffect, useState } from "react";
import { emptySignatureData, type SignatureData } from "@/types/signature";
import { sanitizeSignatureData } from "@/utils/sanitizeSignatureData";

const STORAGE_KEY = "esg.draft.v1";

function loadDraft(): SignatureData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySignatureData;
    const parsed = JSON.parse(raw) as Partial<SignatureData>;
    return sanitizeSignatureData({ ...emptySignatureData, ...parsed });
  } catch {
    return emptySignatureData;
  }
}

export function useSignatureForm() {
  const [data, setData] = useState<SignatureData>(() => loadDraft());

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        /* ignore quota */
      }
    }, 250);
    return () => window.clearTimeout(id);
  }, [data]);

  const update = useCallback(<K extends keyof SignatureData>(key: K, value: SignatureData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateMany = useCallback((patch: Partial<SignatureData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => setData(emptySignatureData), []);

  const replaceAll = useCallback((next: SignatureData) => {
    setData(sanitizeSignatureData(next));
  }, []);

  return { data, update, updateMany, reset, replaceAll };
}
