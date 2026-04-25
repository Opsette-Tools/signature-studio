import type { SignatureTemplate } from "@/types/template";
import {
  emailLink,
  fontStack,
  join,
  link,
  socialTextLinks,
  telLink,
} from "@/utils/renderSignatureHtml";
import { getResolvedLogo, normalizeUrl } from "@/utils/sanitizeSignatureData";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

function bigCta(label: string, url: string, color: string, icon = ""): string {
  if (!url) return "";
  return `<a href="${normalizeUrl(url)}" style="display:inline-block;background:${color};color:#fff;padding:10px 18px;border-radius:8px;font-family:${fontStack};font-size:14px;font-weight:700;text-decoration:none;">${icon ? `${icon} ` : ""}${label}</a>`;
}

// 1. Book a Call
const bookCall: SignatureTemplate = {
  id: "promotional-book-call",
  name: "Book a Call",
  category: "promotional",
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
  id: "promotional-visit-website",
  name: "Visit Website",
  category: "promotional",
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

// 3. Download Resource
const downloadResource: SignatureTemplate = {
  id: "promotional-download-resource",
  name: "Download Resource",
  category: "promotional",
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

// 4. Newsletter CTA
const newsletter: SignatureTemplate = {
  id: "promotional-newsletter",
  name: "Newsletter CTA",
  category: "promotional",
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

// 5. Banner Image — full-width banner using logo or CTA artwork
const bannerImage: SignatureTemplate = {
  id: "promotional-banner-image",
  name: "Banner Image",
  category: "promotional",
  tags: ["banner", "image", "cta"],
  description: "Full-width promotional banner above contact info. Uses your logo as the banner artwork.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: false,
  layoutType: "banner",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    const logo = getResolvedLogo(d);
    return `<div style="font-family:${fontStack};max-width:480px;">
      <div style="background:linear-gradient(90deg, ${accent}, #1a1f2e);color:#fff;padding:16px 18px;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;opacity:0.85;">${d.tagline || "Latest from us"}</div>
          <div style="font-size:16px;font-weight:700;margin-top:2px;">${d.ctaLabel || d.company || d.fullName}</div>
        </div>
        ${logo ? `<img src="${logo}" alt="${d.company}" height="36" style="background:#fff;padding:3px;border-radius:4px;" />` : ""}
      </div>
      <div style="padding:10px 14px;border:1px solid #e6e8ee;border-top:0;border-radius:0 0 8px 8px;font-size:12px;color:#5b6478;line-height:1.6;">
        <div style="color:#1a1f2e;font-weight:600;">${d.fullName}${d.jobTitle ? ` — <span style="color:#5b6478;font-weight:400;">${d.jobTitle}</span>` : ""}</div>
        ${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}
        ${d.ctaUrl ? `<div style="margin-top:6px;"><a href="${normalizeUrl(d.ctaUrl)}" style="color:${accent};font-weight:700;text-decoration:none;">${d.ctaLabel || "Learn more"} →</a></div>` : ""}
      </div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 6. Event Promo — date-led promo block
const eventPromo: SignatureTemplate = {
  id: "promotional-event-promo",
  name: "Event Promo",
  category: "promotional",
  tags: ["event", "promo", "cta"],
  description: "Event-style promo block with a date badge and CTA link.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || "#ef4444";
    return `<div style="font-family:${fontStack};">
      <div style="font-size:14px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
      ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      ${d.ctaUrl
        ? `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:10px;">
            <tr>
              <td style="background:${accent};color:#fff;padding:8px 10px;text-align:center;border-radius:6px 0 0 6px;width:54px;">
                <div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;font-weight:700;opacity:0.9;">Live</div>
                <div style="font-size:18px;font-weight:800;line-height:1;margin-top:2px;">★</div>
              </td>
              <td style="background:#fff;border:1px solid #e6e8ee;border-left:0;padding:8px 12px;border-radius:0 6px 6px 0;">
                <div style="font-size:12px;color:#1a1f2e;font-weight:700;">${d.ctaLabel || "Join our next event"}</div>
                <a href="${normalizeUrl(d.ctaUrl)}" style="color:${accent};font-size:11px;font-weight:600;text-decoration:none;">Reserve your spot →</a>
              </td>
            </tr>
          </table>`
        : ""}
      <div style="color:#5b6478;font-size:12px;margin-top:8px;">${join([emailLink(d.email), link(d.website, d.website)])}</div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

export const promotionalTemplates: SignatureTemplate[] = [
  bookCall,
  visitWebsite,
  downloadResource,
  newsletter,
  bannerImage,
  eventPromo,
];
