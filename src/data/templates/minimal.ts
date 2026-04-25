import type { SignatureTemplate } from "@/types/template";
import {
  emailLink,
  fontStack,
  join,
  link,
  table,
  td,
  telLink,
  tr,
} from "@/utils/renderSignatureHtml";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

const accentDefault = "#4f46e5";

// 1. Clean Name + Title
const cleanNameTitle: SignatureTemplate = {
  id: "minimal-clean-name-title",
  name: "Clean Name + Title",
  category: "minimal",
  tags: ["clean", "simple", "stacked"],
  description: "Just the essentials — name, title, contact line.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || accentDefault;
    const namePronouns = join([d.fullName, d.pronouns && `(${d.pronouns})`], " ");
    const titleCompany = join([d.jobTitle, d.company], " · ");
    const contact = join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)]);
    return table(
      tr(
        td(
          `<div style="font-family:${fontStack};color:#1a1f2e;font-size:14px;line-height:1.5;">
            ${namePronouns ? `<div style="font-size:16px;font-weight:600;color:${accent};">${namePronouns}</div>` : ""}
            ${titleCompany ? `<div style="color:#5b6478;margin-top:2px;">${titleCompany}</div>` : ""}
            ${contact ? `<div style="margin-top:6px;color:#5b6478;">${contact}</div>` : ""}
          </div>`,
        ),
      ),
    );
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Simple Divider
const simpleDivider: SignatureTemplate = {
  id: "minimal-simple-divider",
  name: "Simple Divider",
  category: "minimal",
  tags: ["divider", "line", "elegant"],
  description: "Name above a thin divider with contact details below.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || accentDefault;
    return table(
      `${tr(
        td(
          `<div style="font-family:${fontStack};font-size:15px;font-weight:600;color:#1a1f2e;padding-bottom:6px;">${join([d.fullName, d.pronouns && `(${d.pronouns})`], " ")}</div>`,
        ),
      )}
       ${tr(td(`<div style="border-top:1px solid ${accent};width:48px;height:1px;line-height:1px;"></div>`))}
       ${tr(
         td(
           `<div style="font-family:${fontStack};color:#5b6478;font-size:13px;line-height:1.6;padding-top:6px;">
             ${d.jobTitle ? `<div>${d.jobTitle}${d.company ? `, ${d.company}` : ""}</div>` : d.company ? `<div>${d.company}</div>` : ""}
             ${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)]) ? `<div>${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}</div>` : ""}
           </div>`,
         ),
       )}`,
    );
  },
  renderPlainText: renderDefaultPlainText,
};

// 3. Compact Contact Block
const compactContact: SignatureTemplate = {
  id: "minimal-compact-contact",
  name: "Compact Contact Block",
  category: "minimal",
  tags: ["compact", "block"],
  description: "Tight contact block with subtle labels.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const labelStyle = "color:#8a93a6;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;padding-right:8px;vertical-align:top;";
    const valStyle = "color:#1a1f2e;font-size:13px;padding-bottom:4px;";
    const row = (label: string, val: string) => (val ? tr(`${td(label, labelStyle)}${td(val, valStyle)}`) : "");
    return `<div style="font-family:${fontStack};">
      <div style="font-size:14px;font-weight:600;color:#1a1f2e;margin-bottom:6px;">${d.fullName}${d.jobTitle ? ` — <span style="font-weight:400;color:#5b6478;">${d.jobTitle}</span>` : ""}</div>
      ${table(
        `${row("E", emailLink(d.email))}${row("P", telLink(d.phone))}${row("W", link(d.website, d.website))}`,
      )}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

export const minimalTemplates: SignatureTemplate[] = [
  cleanNameTitle,
  simpleDivider,
  compactContact,
];
