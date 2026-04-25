import { useState, type ReactNode } from "react";
import { allTemplates } from "@/data/templates";
import { useSignatureForm } from "@/hooks/useSignatureForm";
import { SignatureCtx } from "./signatureContextValue";

export { useSignatureContext } from "./signatureContextValue";

const DEFAULT_TEMPLATE_ID = "modern-card-style";
const STORAGE_KEY = "esg.selectedTemplate.v1";

function loadInitialId(): string {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && allTemplates.some((t) => t.id === v)) return v;
  } catch {
    /* ignore */
  }
  return DEFAULT_TEMPLATE_ID;
}

export function SignatureProvider({ children }: { children: ReactNode }) {
  const { data, update, replaceAll, reset } = useSignatureForm();
  const [selectedTemplateId, setSelectedTemplateIdState] = useState<string>(() => loadInitialId());

  const setSelectedTemplateId = (id: string) => {
    setSelectedTemplateIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  };

  const selectedTemplate = allTemplates.find((t) => t.id === selectedTemplateId);

  return (
    <SignatureCtx.Provider
      value={{
        data,
        update,
        replaceAll,
        reset,
        selectedTemplateId,
        setSelectedTemplateId,
        selectedTemplate,
      }}
    >
      {children}
    </SignatureCtx.Provider>
  );
}
