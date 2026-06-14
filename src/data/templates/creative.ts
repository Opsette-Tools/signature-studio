import type { SignatureTemplate } from "@/types/template";
import {
  contactGrid,
  ctaButton,
  fontStack,
  hairline,
  join,
  monogramTile,
  socialIconsRow,
  stackGroups,
  twoColLeftRight,
} from "@/utils/renderSignatureHtml";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

// 1. Friendly Creator — warm two-column, avatar + tagline, grouped contact.
const friendlyCreator: SignatureTemplate = {
  id: "creative-friendly-creator",
  name: "Friendly Creator",
  category: "creative",
  tags: ["friendly", "creator", "warm"],
  description: "A warm, balanced layout with a circular avatar, a tagline, and a clean contact block.",
  supportsImage: true,
  supportsLogo: false,
  supportsSocialLinks: true,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || "#ec4899";
    const profile = d.profileImageDataUrl;
    const left = profile
      ? `<img src="${profile}" alt="${d.fullName}" width="68" height="68" style="border-radius:50%;display:block;border:2px solid ${accent};" />`
      : monogramTile(d.fullName, { size: 68, color: accent, radius: 34 });
    const identity = `<div>
        <div style="font-size:16px;font-weight:700;color:#1a1f2e;">Hi, I'm ${d.fullName}</div>
        ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
        ${d.tagline ? `<div style="color:${accent};font-size:13px;font-weight:600;margin-top:6px;line-height:1.4;">${d.tagline}</div>` : ""}
      </div>`;
    const social = socialIconsRow(d, { color: accent, size: 16, variant: "chip" });
    const right = `<div style="font-family:${fontStack};">${stackGroups([identity, contactGrid(d, { iconColor: accent, fontSize: 12 }), social], 12)}</div>`;
    return twoColLeftRight(left, right, { leftWidth: 68, gap: 18, valign: "middle" });
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Personal Brand — personality-forward, tagline + pill CTA, grouped.
const personalBrand: SignatureTemplate = {
  id: "creative-personal-brand",
  name: "Personal Brand",
  category: "creative",
  tags: ["personal", "brand", "creator"],
  description: "Personality-forward two-column with a tagline and a pill CTA.",
  supportsImage: true,
  supportsLogo: false,
  supportsSocialLinks: true,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || "#a855f7";
    const profile = d.profileImageDataUrl;
    const left = profile
      ? `<img src="${profile}" alt="${d.fullName}" width="68" height="68" style="border-radius:50%;display:block;" />`
      : monogramTile(d.fullName, { size: 68, color: accent, radius: 34 });
    const identity = `<div>
        <div style="font-size:17px;font-weight:700;color:${accent};line-height:1.2;">${d.fullName}</div>
        ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
        ${d.tagline ? `<div style="font-style:italic;color:#1a1f2e;font-size:13px;margin-top:6px;line-height:1.4;">${d.tagline}</div>` : ""}
      </div>`;
    const social = socialIconsRow(d, { color: accent, size: 16, variant: "chip" });
    const cta = ctaButton(d, { color: accent, radius: 999 });
    const right = `<div style="font-family:${fontStack};">${stackGroups([identity, contactGrid(d, { iconColor: accent, fontSize: 12 }), social, cta], 12)}</div>`;
    return twoColLeftRight(left, right, { leftWidth: 68, gap: 18, valign: "top" });
  },
  renderPlainText: renderDefaultPlainText,
};

// 3. Portfolio Style — website/portfolio CTA leads, with rhythm.
const portfolio: SignatureTemplate = {
  id: "creative-portfolio",
  name: "Portfolio Style",
  category: "creative",
  tags: ["portfolio", "designer"],
  description: "Leads with a bold portfolio CTA, with a grouped contact block below.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#f59e0b";
    const identity = `<div>
        <div style="font-size:16px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
        ${d.jobTitle ? `<div style="color:#5b6478;font-size:12px;margin-top:2px;">${d.jobTitle}</div>` : ""}
      </div>`;
    const cta = d.website
      ? `<a href="${d.website.startsWith("http") ? d.website : "https://" + d.website}" style="display:inline-block;background:${accent};color:#ffffff;font-weight:700;font-size:12px;padding:8px 16px;border-radius:6px;text-decoration:none;">${d.ctaLabel || "View Portfolio"} &rarr;</a>`
      : "";
    const social = socialIconsRow(d, { color: accent, size: 16, variant: "chip" });
    return `<div style="font-family:${fontStack};">${stackGroups([identity, cta, contactGrid(d, { iconColor: accent, fontSize: 12, includeAddress: false }), social], 12)}</div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 4. Script Sign-Off — cursive sign-off, a measured rule, then grouped details.
const scriptSignOff: SignatureTemplate = {
  id: "creative-script-sign-off",
  name: "Script Sign-Off",
  category: "creative",
  tags: ["script", "handwritten", "sign-off"],
  description: "A cursive sign-off above a measured rule and your grouped details — personal and warm.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#a855f7";
    const signOff = `<div style="font-family:'Brush Script MT','Lucida Handwriting',cursive;font-size:30px;color:${accent};line-height:1;">— ${d.fullName.split(" ")[0] || d.fullName}</div>`;
    const identity = `<div>
        <div style="font-size:14px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
        ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], ", ")}</div>` : ""}
      </div>`;
    return `<div style="font-family:${fontStack};">
      ${signOff}
      ${hairline({ color: "#e6e8ee", width: 120, spaceAbove: 12, spaceBelow: 12 })}
      ${stackGroups([identity, contactGrid(d, { iconColor: accent, fontSize: 12 })], 12)}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

export const creativeTemplates: SignatureTemplate[] = [
  friendlyCreator,
  personalBrand,
  portfolio,
  scriptSignOff,
];
