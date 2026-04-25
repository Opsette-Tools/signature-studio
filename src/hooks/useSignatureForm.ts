import { useCallback, useEffect, useState } from "react";
import { emptySignatureData, type SignatureData } from "@/types/signature";
import { sanitizeSignatureData } from "@/utils/sanitizeSignatureData";
import { readJSON, storageKeys, writeJSON } from "@/utils/storage";

function loadDraft(): SignatureData {
  const partial = readJSON<Partial<SignatureData>>(storageKeys.draft, {});
  return sanitizeSignatureData({ ...emptySignatureData, ...partial });
}

export function useSignatureForm() {
  const [data, setData] = useState<SignatureData>(() => loadDraft());

  useEffect(() => {
    const id = window.setTimeout(() => writeJSON(storageKeys.draft, data), 250);
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
