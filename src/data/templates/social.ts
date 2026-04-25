import type { SignatureTemplate } from "@/types/template";
import {
  ctaButton,
  emailLink,
  fontStack,
  join,
  link,
  socialIconsRow,
  socialTextLinks,
  table,
  td,
  telLink,
  tr,
} from "@/utils/renderSignatureHtml";
import { normalizeUrl } from "@/utils/sanitizeSignatureData";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

// helper for "big CTA" templates
function bigCta(label: string, url: string, color: string, icon = ""): string {
  if (!url) return "";
  return `<a href="${normalizeUrl(url)}" style="display:inline-block;background:${color};color:#fff;padding:10px 18px;border-radius:8px;font-family:${fontStack};font-size:14px;font-weight:700;text-decoration:none;">${icon ? `${icon} ` : ""}${label}</a>`;
}

// 1. Book a Call
const bookCall: SignatureTemplate = {
  id: "social-book-call",
  name: "Book a Call",
  category: "social",
  tags: ["cta", "booking", "call"],
  description: "Call-to-action centered on a booking link.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#10b981";
    return `<div style="font-family:${fontStack};">
      <div style="font-size:14px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
      ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      ${d.bookingLink ? `<div style="margin-top:10px;">${bigCta("📅 Book a 15-min call", d.bookingLink, accent)}</div>` : ""}
      <div style="color:#5b6478;font-size:12px;margin-top:8px;">${join([emailLink(d.email), telLink(d.phone)])}</div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Visit Website
const visitWebsite: SignatureTemplate = {
  id: "social-visit-website",
  name: "Visit Website",
  category: "social",
  tags: ["website", "cta"],
  description: "Promotes a website visit as the primary action.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    return `<div style="font-family:${fontStack};">
      <div style="font-size:14px;font-weight:700;color:#1a1f2e;">${d.fullName}${d.company ? ` · <span style="color:#5b6478;font-weight:400;">${d.company}</span>` : ""}</div>
      ${d.website ? `<div style="margin-top:10px;">${bigCta("🌐 Visit our site", d.website, accent)}</div>` : ""}
      <div style="color:#5b6478;font-size:12px;margin-top:8px;">${join([emailLink(d.email), telLink(d.phone)])}</div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 3. Follow Me
const followMe: SignatureTemplate = {
  id: "social-follow-me",
  name: "Follow Me",
  category: "social",
  tags: ["social", "follow"],
  description: "Social-first signature emphasising follow links.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: true,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#ec4899";
    return `<div style="font-family:${fontStack};">
      <div style="font-size:14px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
      ${d.tagline ? `<div style="color:#5b6478;font-size:12px;font-style:italic;">${d.tagline}</div>` : ""}
      ${socialIconsRow(d, { color: accent, size: 28 }) ? `<div style="margin-top:10px;">${socialIconsRow(d, { color: accent, size: 28 })}</div>` : ""}
      <div style="color:#5b6478;font-size:12px;margin-top:8px;">${emailLink(d.email)}</div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 4. Download Resource
const downloadResource: SignatureTemplate = {
  id: "social-download-resource",
  name: "Download Resource",
  category: "social",
  tags: ["download", "resource", "cta"],
  description: "Highlights a downloadable resource via the CTA field.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#06b6d4";
    return `<div style="font-family:${fontStack};">
      <div style="font-size:14px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
      ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      ${d.ctaUrl ? `<div style="margin-top:10px;">${bigCta(d.ctaLabel || "⬇ Download", d.ctaUrl, accent)}</div>` : ""}
      <div style="color:#5b6478;font-size:12px;margin-top:8px;">${join([emailLink(d.email), link(d.website, d.website)])}</div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 5. Newsletter CTA
const newsletter: SignatureTemplate = {
  id: "social-newsletter",
  name: "Newsletter CTA",
  category: "social",
  tags: ["newsletter", "subscribe"],
  description: "Subscribe-to-newsletter focused signature.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: true,
  layoutType: "card",
  renderHtml: (d) => {
    const accent = d.accentColor || "#f59e0b";
    return `<div style="font-family:${fontStack};">
      <div style="font-size:14px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
      ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      ${d.ctaUrl
        ? `<div style="margin-top:10px;background:#fffbeb;border:1px dashed ${accent};border-radius:8px;padding:10px 12px;display:inline-block;">
            <div style="font-size:12px;color:#5b6478;">📬 Don't miss my updates</div>
            <a href="${normalizeUrl(d.ctaUrl)}" style="color:${accent};font-weight:700;font-size:13px;text-decoration:none;">${d.ctaLabel || "Subscribe to my newsletter"} →</a>
           </div>`
        : ""}
      <div style="color:#5b6478;font-size:12px;margin-top:8px;">${join([emailLink(d.email), link(d.website, d.website)])}</div>
      ${socialTextLinks(d, accent) ? `<div style="font-size:12px;margin-top:4px;">${socialTextLinks(d, accent)}</div>` : ""}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

void ctaButton;
void table;
void td;
void tr;

export const socialTemplates: SignatureTemplate[] = [
  bookCall,
  visitWebsite,
  followMe,
  downloadResource,
  newsletter,
];
