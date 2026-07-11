import type { SignatureTemplate } from "@/types/template";
import {
  contactGrid,
  fontStack,
  join,
  LIGHT_SURFACE,
  logoImg,
  nameTwoTone,
  resolveAnchor,
  socialIconsRow,
  stackGroups,
} from "@/utils/renderSignatureHtml";
import { getResolvedLogo, normalizeUrl } from "@/utils/sanitizeSignatureData";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

const T = LIGHT_SURFACE;

// 1. Newsletter CTA — KEEP. A subscribe card sits apart from the grouped contact.
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
        <div style="font-size:16px;font-weight:800;letter-spacing:-.2px;">${nameTwoTone(d.fullName, accent, T.ink, d.twoToneName)}</div>
        ${d.jobTitle || d.company ? `<div style="color:${T.sub};font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      </div>`;
    const card = d.ctaUrl
      ? `<div style="background:#fffbeb;border:1px dashed ${accent};border-radius:8px;padding:12px 14px;display:inline-block;">
          <div style="font-size:11px;color:${T.faint};text-transform:uppercase;letter-spacing:0.6px;font-weight:700;">Stay in the loop</div>
          <a href="${normalizeUrl(d.ctaUrl)}" style="color:${accent};font-weight:700;font-size:13px;text-decoration:none;display:inline-block;margin-top:4px;">${d.ctaLabel || "Subscribe to my newsletter"} &rarr;</a>
         </div>`
      : "";
    const social = socialIconsRow(d, { variant: "brand", size: 19, gap: 6 });
    return `<div style="font-family:${fontStack};">${stackGroups([identity, card, contactGrid(d, { iconColor: accent, fontSize: 12, includeAddress: false }), social], 14)}</div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Event Promo — KEEP. A badge-led event block with a reserve CTA, set apart
// from the contact details.
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
        <div style="font-size:16px;font-weight:800;letter-spacing:-.2px;">${nameTwoTone(d.fullName, accent, T.ink, d.twoToneName)}</div>
        ${d.jobTitle || d.company ? `<div style="color:${T.sub};font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      </div>`;
    const badge = d.ctaUrl
      ? `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
          <tr>
            <td style="background:${accent};color:#fff;padding:10px 12px;text-align:center;border-radius:6px 0 0 6px;width:54px;vertical-align:middle;">
              <div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;font-weight:700;opacity:0.9;">Live</div>
              <div style="font-size:18px;font-weight:800;line-height:1;margin-top:2px;">&#9733;</div>
            </td>
            <td style="background:#fff;border:1px solid ${T.rule};border-left:0;padding:10px 14px;border-radius:0 6px 6px 0;vertical-align:middle;">
              <div style="font-size:12px;color:${T.ink};font-weight:700;">${d.ctaLabel || "Join our next event"}</div>
              <a href="${normalizeUrl(d.ctaUrl)}" style="color:${accent};font-size:11px;font-weight:600;text-decoration:none;">Reserve your spot &rarr;</a>
            </td>
          </tr>
        </table>`
      : "";
    return `<div style="font-family:${fontStack};">${stackGroups([identity, badge, contactGrid(d, { iconColor: accent, fontSize: 12, includeAddress: false })], 14)}</div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 3. Ticket Stub — a main body plus a dashed-"perforation" tear-off stub that
// holds the logo + CTA. The stub is a distinct zone, like a real ticket.
const ticketStub: SignatureTemplate = {
  id: "promotional-ticket-stub",
  name: "Ticket Stub",
  category: "promotional",
  tags: ["ticket", "perforation", "cta", "tear-off"],
  description: "A dashed 'perforation' splits a main body from a tear-off stub holding the logo and CTA.",
  supportsImage: true,
  supportsLogo: true,
  supportsSocialLinks: false,
  layoutType: "card",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    const logo = getResolvedLogo(d);
    const anchor = resolveAnchor(d, accent, { size: 56, variant: "circle" });
    const contactLine = join([d.email, d.phone].filter(Boolean) as string[], " · ");
    const body = `<td style="padding:18px 20px;vertical-align:middle;background:${T.surface};">
        <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;"><tr>
          <td style="vertical-align:middle;padding-right:14px;line-height:0;">${anchor}</td>
          <td style="vertical-align:middle;"><div style="font-family:${fontStack};">
            <div style="font-size:17px;font-weight:800;letter-spacing:-.2px;">${nameTwoTone(d.fullName, accent, T.ink, d.twoToneName)}</div>
            ${d.jobTitle || d.company ? `<div style="font-size:11.5px;color:${T.sub};margin:2px 0 ${contactLine ? "9px" : "0"};">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
            ${contactLine ? `<span style="font-family:${fontStack};font-size:11.5px;color:${T.faint};">${contactLine}</span>` : ""}
          </div></td>
        </tr></table></td>`;
    const ctaLabel = d.ctaLabel || (d.bookingLink ? "Book me" : "");
    const ctaUrl = d.ctaUrl || d.bookingLink;
    const stubInner = `${logo ? `<div style="line-height:0;">${logoImg(logo, d.company || d.fullName, { height: 26, radius: 4 })}</div>` : `<div style="font-family:${fontStack};font-size:13px;font-weight:800;color:${accent};letter-spacing:.5px;">${d.company || d.fullName}</div>`}
        ${ctaLabel && ctaUrl ? `<a href="${normalizeUrl(ctaUrl)}" style="display:block;margin-top:12px;background:${accent};color:#fff;font-family:${fontStack};font-size:11.5px;font-weight:700;text-decoration:none;padding:8px 6px;border-radius:6px;text-transform:uppercase;letter-spacing:.03em;text-align:center;">${ctaLabel}</a>` : ""}`;
    const stub = `<td width="120" style="width:120px;border-left:2px dashed ${T.rule};padding:18px 14px;vertical-align:middle;text-align:center;background:${T.surface};">${stubInner}</td>`;
    return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:separate;border-spacing:0;border:1px solid ${T.rule};border-radius:10px;overflow:hidden;max-width:480px;">
      <tr>${body}${stub}</tr>
    </table>`;
  },
  renderPlainText: renderDefaultPlainText,
};

export const promotionalTemplates: SignatureTemplate[] = [newsletter, eventPromo, ticketStub];
