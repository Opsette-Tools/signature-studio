import type { SignatureData } from "./signature";

export type TemplateCategory =
  | "minimal"
  | "modern"
  | "corporate"
  | "bold"
  | "creative"
  | "compact"
  | "social";

export type LayoutType =
  | "stacked"
  | "two-column"
  | "card"
  | "inline"
  | "banner"
  | "footer";

export type SignatureTemplate = {
  id: string;
  name: string;
  category: TemplateCategory;
  tags: string[];
  description: string;
  supportsImage: boolean;
  supportsLogo: boolean;
  supportsSocialLinks: boolean;
  layoutType: LayoutType;
  renderHtml: (data: SignatureData) => string;
  renderPlainText: (data: SignatureData) => string;
};

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  minimal: "Minimal",
  modern: "Modern",
  corporate: "Corporate",
  bold: "Bold",
  creative: "Creative",
  compact: "Compact",
  social: "Social / CTA",
};
