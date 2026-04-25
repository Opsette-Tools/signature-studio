import { createContext, useContext, useState, type ReactNode } from "react";
import { allTemplates } from "@/data/templates";
import { useSignatureForm } from "@/hooks/useSignatureForm";
import type { SignatureData } from "@/types/signature";
import type { SignatureTemplate } from "@/types/template";

type Ctx = {
  data: SignatureData;
  update: <K extends keyof SignatureData>(key: K, value: SignatureData[K]) => void;
  replaceAll: (next: SignatureData) => void;
  reset: () => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  selectedTemplate: SignatureTemplate | undefined;
};

const SignatureCtx = createContext<Ctx | null>(null);

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

export function useSignatureContext(): Ctx {
  const ctx = useContext(SignatureCtx);
  if (!ctx) throw new Error("SignatureProvider missing");
  return ctx;
}
