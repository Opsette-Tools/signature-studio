import type { SignatureTemplate } from "@/types/template";
import {
  contactGrid,
  fontStack,
  hairline,
  join,
  stackGroups,
} from "@/utils/renderSignatureHtml";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

const accentDefault = "#4f46e5";

// 1. Simple Divider — refined serif name, a measured rule, then real-icon contact.
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
    const serif = "Georgia, 'Times New Roman', serif";
    const namePronouns = join([d.fullName, d.pronouns && `(${d.pronouns})`], " ");
    const titleCompany = join([d.jobTitle, d.company], ", ");
    const identity = `<div style="font-family:${serif};font-size:22px;font-weight:400;color:#1a1f2e;letter-spacing:0.2px;line-height:1.2;">${namePronouns}</div>`;
    const role = titleCompany
      ? `<div style="font-family:${fontStack};color:#5b6478;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">${titleCompany}</div>`
      : "";
    return `<div style="font-family:${fontStack};">
      ${identity}
      ${hairline({ color: accent, width: 40, spaceAbove: 12, spaceBelow: 12 })}
      ${stackGroups([role, contactGrid(d, { iconColor: accent, fontSize: 13 })], 10)}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Compact Contact Block — tightest real-icon minimal, name+role then contact.
const compactContact: SignatureTemplate = {
  id: "minimal-compact-contact",
  name: "Compact Contact Block",
  category: "minimal",
  tags: ["compact", "block"],
  description: "A tight, no-frills block — name, role, and a clean real-icon contact list.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || accentDefault;
    const namePronouns = join([d.fullName, d.pronouns && `(${d.pronouns})`], " ");
    const identity = `<div>
        <div style="font-size:15px;font-weight:700;color:#1a1f2e;">${namePronouns}</div>
        ${d.jobTitle || d.company ? `<div style="font-size:12px;color:${accent};font-weight:600;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      </div>`;
    return `<div style="font-family:${fontStack};">${stackGroups([identity, contactGrid(d, { iconColor: accent, fontSize: 13 })], 12)}</div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

export const minimalTemplates: SignatureTemplate[] = [simpleDivider, compactContact];
