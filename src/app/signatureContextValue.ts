import { createContext, useContext } from "react";
import type { SignatureData } from "@/types/signature";
import type { SignatureTemplate } from "@/types/template";

export type SignatureCtxValue = {
  data: SignatureData;
  update: <K extends keyof SignatureData>(key: K, value: SignatureData[K]) => void;
  replaceAll: (next: SignatureData) => void;
  reset: () => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  selectedTemplate: SignatureTemplate | undefined;
};

export const SignatureCtx = createContext<SignatureCtxValue | null>(null);

export function useSignatureContext(): SignatureCtxValue {
  const ctx = useContext(SignatureCtx);
  if (!ctx) throw new Error("SignatureProvider missing");
  return ctx;
}
