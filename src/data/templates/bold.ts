import type { SignatureTemplate } from "@/types/template";
import {
  emailLink,
  fontStack,
  join,
  link,
  socialIconsRow,
  telLink,
} from "@/utils/renderSignatureHtml";
import { getResolvedLogo } from "@/utils/sanitizeSignatureData";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

// 1. Big Name
const bigName: SignatureTemplate = {
  id: "bold-big-name",
  name: "Big Name",
  category: "bold",
  tags: ["big", "name", "headline"],
  description: "Oversized name as the focal point.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: true,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    return `<div style="font-family:${fontStack};">
      <div style="font-size:24px;font-weight:800;color:#1a1f2e;line-height:1.1;letter-spacing:-0.5px;">${d.fullName}</div>
      ${d.jobTitle || d.company ? `<div style="color:${accent};font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-top:4px;">${join([d.jobTitle, d.company], " — ")}</div>` : ""}
      <div style="color:#5b6478;font-size:13px;margin-top:8px;">${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}</div>
      ${socialIconsRow(d, { color: accent, size: 22 }) ? `<div style="margin-top:10px;">${socialIconsRow(d, { color: accent, size: 22 })}</div>` : ""}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Color Stripe
const colorStripe: SignatureTemplate = {
  id: "bold-color-stripe",
  name: "Color Stripe",
  category: "bold",
  tags: ["color", "stripe", "banner"],
  description: "A wide accent stripe sits behind the name.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: false,
  layoutType: "banner",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    const logo = getResolvedLogo(d);
    return `<div style="font-family:${fontStack};max-width:480px;">
      <div style="background:${accent};color:#fff;padding:12px 16px;border-radius:6px 6px 0 0;display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:15px;font-weight:700;">${d.fullName}</span>
        ${logo ? `<img src="${logo}" alt="${d.company}" height="22" style="background:#fff;padding:2px;border-radius:3px;" />` : ""}
      </div>
      <div style="padding:10px 16px;border:1px solid #e6e8ee;border-top:0;border-radius:0 0 6px 6px;font-size:12px;color:#5b6478;line-height:1.6;">
        ${d.jobTitle || d.company ? `<div style="color:#1a1f2e;font-weight:600;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
        ${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}
      </div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 3. High Contrast (dark template)
const highContrast: SignatureTemplate = {
  id: "bold-high-contrast",
  name: "High Contrast",
  category: "bold",
  tags: ["dark", "high-contrast"],
  description: "Dark background, light text — bold and modern.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "card",
  renderHtml: (d) => {
    const accent = d.accentColor || "#22d3ee";
    return `<div style="font-family:${fontStack};background:#0f1218;color:#e6e9f0;padding:16px;border-radius:10px;max-width:480px;">
      <div style="font-size:16px;font-weight:700;color:#fff;">${d.fullName}</div>
      ${d.jobTitle || d.company ? `<div style="color:${accent};font-size:12px;margin-top:2px;font-weight:600;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      <div style="color:#9aa3b8;font-size:12px;margin-top:8px;line-height:1.6;">${join([emailLink(d.email, "color:#e6e9f0;"), telLink(d.phone, "color:#e6e9f0;"), link(d.website, d.website, "color:#e6e9f0;")])}</div>
      ${socialIconsRow(d, { color: accent }) ? `<div style="margin-top:10px;">${socialIconsRow(d, { color: accent })}</div>` : ""}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 4. Block Header
const blockHeader: SignatureTemplate = {
  id: "bold-block-header",
  name: "Block Header",
  category: "bold",
  tags: ["block", "header"],
  description: "Solid block header with details below.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    return `<div style="font-family:${fontStack};">
      <div style="display:inline-block;background:#1a1f2e;color:#fff;padding:6px 12px;border-radius:4px;font-size:13px;font-weight:700;letter-spacing:0.3px;">${(d.fullName || "").toUpperCase()}</div>
      ${d.jobTitle ? `<div style="color:${accent};font-size:13px;font-weight:600;margin-top:6px;">${d.jobTitle}${d.company ? ` @ ${d.company}` : ""}</div>` : d.company ? `<div style="color:${accent};font-size:13px;font-weight:600;margin-top:6px;">${d.company}</div>` : ""}
      <div style="color:#5b6478;font-size:12px;margin-top:6px;line-height:1.6;">${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}</div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 5. All Caps Spaced — typographic statement
const allCapsSpaced: SignatureTemplate = {
  id: "bold-all-caps-spaced",
  name: "All Caps Spaced",
  category: "bold",
  tags: ["all-caps", "typography", "spaced"],
  description: "Letterspaced uppercase name as the design statement.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#1a1f2e";
    return `<div style="font-family:${fontStack};">
      <div style="font-size:14px;font-weight:800;color:${accent};text-transform:uppercase;letter-spacing:6px;line-height:1.2;">${d.fullName}</div>
      <div style="height:1px;background:#1a1f2e;width:100%;max-width:280px;margin:8px 0;"></div>
      ${d.jobTitle || d.company ? `<div style="font-size:11px;color:#5b6478;text-transform:uppercase;letter-spacing:2px;">${join([d.jobTitle, d.company], " — ")}</div>` : ""}
      <div style="color:#5b6478;font-size:12px;margin-top:8px;line-height:1.7;">
        ${d.email ? `<div>${emailLink(d.email)}</div>` : ""}
        ${d.phone ? `<div>${telLink(d.phone)}</div>` : ""}
        ${d.website ? `<div>${link(d.website, d.website)}</div>` : ""}
      </div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

export const boldTemplates: SignatureTemplate[] = [
  bigName,
  colorStripe,
  highContrast,
  blockHeader,
  allCapsSpaced,
];
