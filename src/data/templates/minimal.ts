import type { SignatureTemplate } from "@/types/template";
import {
  contactGrid,
  fontStack,
  hairline,
  join,
  LIGHT_SURFACE,
  serifStack,
  stackGroups,
} from "@/utils/renderSignatureHtml";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

const accentDefault = "#4f46e5";
const T = LIGHT_SURFACE;

// Simple Divider — KEEP. A refined serif name above a measured rule, with a
// clean real-icon contact block below.
const simpleDivider: SignatureTemplate = {
  id: "minimal-simple-divider",
  name: "Simple Divider",
  category: "minimal",
  tags: ["divider", "line", "elegant"],
  description: "A refined serif name above a measured rule, with a clean contact block below.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || accentDefault;
    const namePronouns = join([d.fullName, d.pronouns && `(${d.pronouns})`], " ");
    const titleCompany = join([d.jobTitle, d.company], ", ");
    const identity = `<div style="font-family:${serifStack};font-size:22px;font-weight:400;color:${T.ink};letter-spacing:0.2px;line-height:1.2;">${namePronouns}</div>`;
    const role = titleCompany
      ? `<div style="font-family:${fontStack};color:${T.sub};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">${titleCompany}</div>`
      : "";
    return `<div style="font-family:${fontStack};">
      ${identity}
      ${hairline({ color: accent, width: 40, spaceAbove: 12, spaceBelow: 12 })}
      ${stackGroups([role, contactGrid(d, { iconColor: accent, fontSize: 13 })], 10)}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

export const minimalTemplates: SignatureTemplate[] = [simpleDivider];
