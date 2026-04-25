import { useState, type ReactNode } from "react";
import { allTemplates } from "@/data/templates";
import { useSignatureForm } from "@/hooks/useSignatureForm";
import { readString, storageKeys, writeString } from "@/utils/storage";
import { SignatureCtx } from "./signatureContextValue";

export { useSignatureContext } from "./signatureContextValue";

const DEFAULT_TEMPLATE_ID = "modern-card-style";

function loadInitialId(): string {
  const v = readString(storageKeys.selectedTemplate);
  if (v && allTemplates.some((t) => t.id === v)) return v;
  return DEFAULT_TEMPLATE_ID;
}

export function SignatureProvider({ children }: { children: ReactNode }) {
  const { data, update, replaceAll, reset } = useSignatureForm();
  const [selectedTemplateId, setSelectedTemplateIdState] = useState<string>(() => loadInitialId());

  const setSelectedTemplateId = (id: string) => {
    setSelectedTemplateIdState(id);
    writeString(storageKeys.selectedTemplate, id);
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
