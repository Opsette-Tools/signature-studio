import type { SignatureTemplate } from "@/types/template";
import {
  emailLink,
  fontStack,
  join,
  link,
  telLink,
} from "@/utils/renderSignatureHtml";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

// 1. One Line
const oneLine: SignatureTemplate = {
  id: "compact-one-line",
  name: "One Line",
  category: "compact",
  tags: ["one-line", "tiny"],
  description: "Everything on a single line — max efficiency.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "inline",
  renderHtml: (d) => {
    return `<div style="font-family:${fontStack};font-size:12px;color:#5b6478;">
      <strong style="color:#1a1f2e;">${d.fullName}</strong>${d.jobTitle ? ` · ${d.jobTitle}` : ""}${d.company ? ` · ${d.company}` : ""} · ${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Two Line
const twoLine: SignatureTemplate = {
  id: "compact-two-line",
  name: "Two Line",
  category: "compact",
  tags: ["two-line", "tiny"],
  description: "Identity on line 1, contact on line 2.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "inline",
  renderHtml: (d) => {
    return `<div style="font-family:${fontStack};font-size:12px;color:#5b6478;line-height:1.5;">
      <div><strong style="color:#1a1f2e;">${d.fullName}</strong>${d.jobTitle || d.company ? ` — ${join([d.jobTitle, d.company], ", ")}` : ""}</div>
      <div>${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}</div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 3. Mobile Friendly Tiny
const mobileTiny: SignatureTemplate = {
  id: "compact-mobile-tiny",
  name: "Mobile Friendly Tiny",
  category: "compact",
  tags: ["mobile", "tiny"],
  description: "Tiny signature optimized for mobile email replies.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "inline",
  renderHtml: (d) => {
    return `<div style="font-family:${fontStack};font-size:11px;color:#8a93a6;">
      Sent by ${d.fullName}${d.company ? `, ${d.company}` : ""}${d.phone ? ` · ${telLink(d.phone, "color:#8a93a6;")}` : ""}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 4. No Logo
const noLogo: SignatureTemplate = {
  id: "compact-no-logo",
  name: "No Logo",
  category: "compact",
  tags: ["no-logo", "text-only"],
  description: "Compact text block intentionally without imagery.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    return `<div style="font-family:${fontStack};font-size:12px;color:#1a1f2e;line-height:1.5;">
      <div style="font-weight:700;">${d.fullName}</div>
      <div style="color:#5b6478;">${join([d.jobTitle, d.company], " | ")}</div>
      <div style="color:#5b6478;">${join([emailLink(d.email), telLink(d.phone)], " | ")}</div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 5. Text-Only Professional
const textOnlyPro: SignatureTemplate = {
  id: "compact-text-only-professional",
  name: "Text-Only Professional",
  category: "compact",
  tags: ["text-only", "professional"],
  description: "Crisp text-only block suitable for professional contexts.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    return `<div style="font-family:${fontStack};font-size:13px;color:#1a1f2e;line-height:1.5;">
      <div style="font-weight:600;">${d.fullName}${d.pronouns ? ` (${d.pronouns})` : ""}</div>
      ${d.jobTitle ? `<div style="color:#5b6478;font-size:12px;">${d.jobTitle}${d.company ? ` | ${d.company}` : ""}</div>` : d.company ? `<div style="color:#5b6478;font-size:12px;">${d.company}</div>` : ""}
      <div style="color:#5b6478;font-size:12px;margin-top:4px;">
        ${d.email ? `e: ${emailLink(d.email)}` : ""}${d.email && d.phone ? "<br/>" : ""}${d.phone ? `t: ${telLink(d.phone)}` : ""}${d.website ? `<br/>w: ${link(d.website, d.website)}` : ""}
      </div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

export const compactTemplates: SignatureTemplate[] = [
  oneLine,
  twoLine,
  mobileTiny,
  noLogo,
  textOnlyPro,
];
