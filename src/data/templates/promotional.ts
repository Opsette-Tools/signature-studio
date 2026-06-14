import type { SignatureTemplate } from "@/types/template";
import {
  contactGrid,
  fontStack,
  join,
  socialIconsRow,
  stackGroups,
} from "@/utils/renderSignatureHtml";
import { normalizeUrl } from "@/utils/sanitizeSignatureData";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

function bigCta(label: string, url: string, color: string): string {
  if (!url) return "";
  return `<a href="${normalizeUrl(url)}" style="display:inline-block;background:${color};color:#fff;padding:10px 20px;border-radius:8px;font-family:${fontStack};font-size:14px;font-weight:700;text-decoration:none;">${label}</a>`;
}

// 1. Book a Call — a strong booking CTA as the hero, grouped contact below.
const bookCall: SignatureTemplate = {
  id: "promotional-book-call",
  name: "Book a Call",
  category: "promotional",
  tags: ["cta", "booking", "call"],
  description: "A strong booking-link CTA as the hero, with a grouped contact block below.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#10b981";
    const identity = `<div>
        <div style="font-size:16px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
        ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      </div>`;
    const cta = d.bookingLink ? bigCta(d.ctaLabel || "Book a 15-min call", d.bookingLink, accent) : "";
    return `<div style="font-family:${fontStack};">${stackGroups([identity, cta, contactGrid(d, { iconColor: accent, fontSize: 12, includeAddress: false })], 14)}</div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Newsletter CTA — a distinct dashed subscribe card, grouped contact below.
const newsletter: SignatureTemplate = {
  id: "promotional-newsletter",
  name: "Newsletter CTA",
  category: "promotional",
  tags: ["newsletter", "subscribe"],
  description: "A subscribe card sits apart from your grouped contact details.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: true,
  layoutType: "card",
  renderHtml: (d) => {
    const accent = d.accentColor || "#f59e0b";
    const identity = `<div>
        <div style="font-size:16px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
        ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      </div>`;
    const card = d.ctaUrl
      ? `<div style="background:#fffbeb;border:1px dashed ${accent};border-radius:8px;padding:12px 14px;display:inline-block;">
          <div style="font-size:11px;color:#8a93a6;text-transform:uppercase;letter-spacing:0.6px;font-weight:600;">Stay in the loop</div>
          <a href="${normalizeUrl(d.ctaUrl)}" style="color:${accent};font-weight:700;font-size:13px;text-decoration:none;display:inline-block;margin-top:4px;">${d.ctaLabel || "Subscribe to my newsletter"} &rarr;</a>
         </div>`
      : "";
    const social = socialIconsRow(d, { color: accent, size: 16, variant: "chip" });
    return `<div style="font-family:${fontStack};">${stackGroups([identity, card, contactGrid(d, { iconColor: accent, fontSize: 12, includeAddress: false }), social], 14)}</div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 3. Event Promo — a date/live badge block leads, grouped contact below.
const eventPromo: SignatureTemplate = {
  id: "promotional-event-promo",
  name: "Event Promo",
  category: "promotional",
  tags: ["event", "promo", "cta"],
  description: "A badge-led event block with a reserve CTA, set apart from your contact details.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || "#ef4444";
    const identity = `<div>
        <div style="font-size:16px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
        ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      </div>`;
    const badge = d.ctaUrl
      ? `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
          <tr>
            <td style="background:${accent};color:#fff;padding:10px 12px;text-align:center;border-radius:6px 0 0 6px;width:54px;vertical-align:middle;">
              <div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;font-weight:700;opacity:0.9;">Live</div>
              <div style="font-size:18px;font-weight:800;line-height:1;margin-top:2px;">★</div>
            </td>
            <td style="background:#fff;border:1px solid #e6e8ee;border-left:0;padding:10px 14px;border-radius:0 6px 6px 0;vertical-align:middle;">
              <div style="font-size:12px;color:#1a1f2e;font-weight:700;">${d.ctaLabel || "Join our next event"}</div>
              <a href="${normalizeUrl(d.ctaUrl)}" style="color:${accent};font-size:11px;font-weight:600;text-decoration:none;">Reserve your spot &rarr;</a>
            </td>
          </tr>
        </table>`
      : "";
    return `<div style="font-family:${fontStack};">${stackGroups([identity, badge, contactGrid(d, { iconColor: accent, fontSize: 12, includeAddress: false })], 14)}</div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

export const promotionalTemplates: SignatureTemplate[] = [bookCall, newsletter, eventPromo];
