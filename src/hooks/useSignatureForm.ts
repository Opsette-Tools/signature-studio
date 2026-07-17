import { useCallback, useEffect, useState } from "react";
import { emptySignatureData, type SignatureData } from "@/types/signature";
import { sanitizeSignatureData } from "@/utils/sanitizeSignatureData";
import { readJSON, storageKeys, writeJSON } from "@/utils/storage";
import { readSeedFromUrl, clearLinkParams } from "@/utils/opsette-kit-link";
import { seedToSignature } from "@/utils/seed";

function loadDraft(): SignatureData {
  // A ?seed= brand core (Mechanism 1) wins over the saved draft: arriving from
  // the "New client kit" starter should open on THIS client's company + accent,
  // not the last signature edited. No seed → restore the draft, unchanged.
  const core = readSeedFromUrl();
  const seedPatch = core ? seedToSignature(core) : null;
  if (seedPatch) {
    return sanitizeSignatureData({ ...emptySignatureData, ...seedPatch });
  }
  const partial = readJSON<Partial<SignatureData>>(storageKeys.draft, {});
  return sanitizeSignatureData({ ...emptySignatureData, ...partial });
}

export function useSignatureForm() {
  const [data, setData] = useState<SignatureData>(() => loadDraft());

  // Strip the seed param from the address bar once consumed, so a refresh
  // doesn't re-seed over edits.
  useEffect(() => {
    clearLinkParams();
  }, []);

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
