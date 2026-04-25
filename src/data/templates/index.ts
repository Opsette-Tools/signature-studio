import type { SignatureTemplate } from "@/types/template";
import { boldTemplates } from "./bold";
import { compactTemplates } from "./compact";
import { corporateTemplates } from "./corporate";
import { creativeTemplates } from "./creative";
import { minimalTemplates } from "./minimal";
import { modernTemplates } from "./modern";
import { promotionalTemplates } from "./promotional";

export const allTemplates: SignatureTemplate[] = [
  ...minimalTemplates,
  ...modernTemplates,
  ...corporateTemplates,
  ...boldTemplates,
  ...creativeTemplates,
  ...compactTemplates,
  ...promotionalTemplates,
];

export function getTemplateById(id: string): SignatureTemplate | undefined {
  return allTemplates.find((t) => t.id === id);
}
