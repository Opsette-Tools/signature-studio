import type { SignatureTemplate } from "@/types/template";
import {
  contactGrid,
  contactRows,
  fontStack,
  headshotOrLogoBadge,
  join,
  LIGHT_SURFACE,
  logoImg,
  nameTwoTone,
  resolveAnchor,
  serifStack,
  socialIconsRow,
  stackGroups,
} from "@/utils/renderSignatureHtml";
import { normalizeUrl } from "@/utils/sanitizeSignatureData";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

const T = LIGHT_SURFACE;

// 1. Big Name — KEEP. A confident name headline with deliberate spacing.
const bigName: SignatureTemplate = {
  id: "bold-big-name",
  name: "Big Name",
  category: "bold",
  tags: ["big", "name", "headline"],
  description: "A confident name headline with deliberate spacing between each group.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: true,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    const identity = `<div style="font-size:26px;font-weight:800;line-height:1.08;letter-spacing:-0.8px;">${nameTwoTone(d.fullName, accent, T.ink, d.twoToneName)}</div>
      <div style="border-top:3px solid ${accent};width:40px;height:3px;line-height:3px;font-size:0;margin-top:12px;">&nbsp;</div>`;
    const role = d.jobTitle || d.company
      ? `<div style="color:${accent};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.6px;">${join([d.jobTitle, d.company], "  /  ")}</div>`
      : "";
    const contact = contactGrid(d, { iconColor: accent, fontSize: 13 });
    const social = socialIconsRow(d, { variant: "brand", size: 20, gap: 6 });
    return `<div style="font-family:${fontStack};">${stackGroups([identity, role, contact, social], 16)}</div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. The Masthead — the name set huge and full-width like a magazine nameplate;
// title, company, social shrink to a quiet credits strip beneath an editorial
// rule; contact runs as a single ribbon. The name IS the design.
const masthead: SignatureTemplate = {
  id: "bold-masthead",
  name: "The Masthead",
  category: "bold",
  tags: ["masthead", "editorial", "nameplate", "serif"],
  description: "Name set huge and full-width like a magazine nameplate; everything else small beneath a rule.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: true,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    const social = socialIconsRow(d, { variant: "brand", size: 19, gap: 6 });
    const credits = join([d.jobTitle && d.jobTitle.toUpperCase(), d.company], "  ·  ");
    const meta = `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;width:100%;"><tr>
        <td style="font-family:${fontStack};font-size:11.5px;color:${T.sub};font-weight:600;letter-spacing:.02em;vertical-align:middle;">${credits}</td>
        ${social ? `<td style="text-align:right;vertical-align:middle;white-space:nowrap;">${social}</td>` : ""}
      </tr></table>`;
    const ribbonParts = [
      d.email && `<a href="mailto:${d.email}" style="color:${T.sub};text-decoration:none;">${d.email}</a>`,
      d.phone && `<span style="color:${T.sub};">${d.phone}</span>`,
      d.website && `<a href="${normalizeUrl(d.website)}" style="color:${accent};font-weight:700;text-decoration:none;">${d.website}</a>`,
    ].filter(Boolean);
    const ribbon = ribbonParts.length
      ? `<div style="margin-top:11px;font-family:${fontStack};font-size:12px;">${ribbonParts.join(' <span style="color:' + T.faint + ';">&nbsp;·&nbsp;</span> ')}</div>`
      : "";
    return `<div style="font-family:${fontStack};max-width:520px;">
      <div style="font-family:${serifStack};font-size:38px;font-weight:700;letter-spacing:-1px;line-height:1;">${nameTwoTone(d.fullName, accent, T.ink, d.twoToneName)}</div>
      <div style="border-top:2px solid ${T.ink};border-bottom:1px solid ${T.rule};padding:9px 0;margin-top:12px;">${meta}</div>
      ${ribbon}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 3. Off-Center — deliberate asymmetry. The anchor is pinned far right; all text
// is weighted left. The imbalance creates tension and moves the eye.
const offCenter: SignatureTemplate = {
  id: "bold-off-center",
  name: "Off-Center",
  category: "bold",
  tags: ["asymmetric", "off-center", "modern"],
  description: "Deliberate asymmetry — the anchor pinned far right, all text weighted left.",
  supportsImage: true,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    const social = socialIconsRow(d, { variant: "brand", size: 20, gap: 6 });
    const inlineContact = join(
      [
        d.email && `<a href="mailto:${d.email}" style="color:${T.sub};text-decoration:none;">${d.email}</a>`,
        d.phone && `<span style="color:${T.sub};">${d.phone}</span>`,
        d.website && `<a href="${normalizeUrl(d.website)}" style="color:${T.sub};text-decoration:none;">${d.website}</a>`,
      ].filter(Boolean) as string[],
      ' <span style="color:#c8ccd4;">·</span> ',
    );
    const left = `<div style="font-family:${fontStack};">
        <div style="font-size:20px;font-weight:800;letter-spacing:-.3px;">${nameTwoTone(d.fullName, accent, T.ink, d.twoToneName)}</div>
        ${d.jobTitle || d.company ? `<div style="font-size:11.5px;color:${accent};font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin:4px 0 12px;">${join([d.jobTitle, d.company], " · ")}</div>` : '<div style="height:12px;"></div>'}
        ${inlineContact ? `<div style="font-size:12px;">${inlineContact}</div>` : ""}
        ${social ? `<div style="margin-top:12px;">${social}</div>` : ""}
      </div>`;
    const anchor = resolveAnchor(d, accent, { size: 80, variant: "circle", ring: accent });
    return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;max-width:500px;">
      <tr>
        <td style="vertical-align:top;padding-right:24px;">${left}</td>
        <td style="vertical-align:top;text-align:right;width:80px;line-height:0;">${anchor}</td>
      </tr>
    </table>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 4. Stacked Bands — three full-width horizontal color bands (identity / contact
// ribbon / CTA strip), separated by color, not spacing. The saturated top band
// carries the name in reverse.
const stackedBands: SignatureTemplate = {
  id: "bold-stacked-bands",
  name: "Stacked Bands",
  category: "bold",
  tags: ["bands", "blocks", "color", "cta"],
  description: "Three full-width color bands — identity, contact ribbon, CTA — separated by color, not spacing.",
  supportsImage: true,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "banner",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    const social = socialIconsRow(d, { variant: "brand", size: 20, gap: 6 });
    // Top-band badge: logo → photo → white-outline monogram, all on the accent.
    const badge = headshotOrLogoBadge(d, accent, 56);
    const b1 = `<td style="padding:16px 20px;background:${accent};border-radius:11px 11px 0 0;vertical-align:middle;">
        <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;width:100%;"><tr>
          <td style="vertical-align:middle;">
            <div style="font-family:${fontStack};font-size:19px;font-weight:800;color:#fff;letter-spacing:-.2px;">${d.fullName}</div>
            ${d.jobTitle ? `<div style="font-family:${fontStack};font-size:11.5px;color:rgba(255,255,255,.88);margin-top:2px;text-transform:uppercase;letter-spacing:.04em;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
          </td>
          ${badge ? `<td style="text-align:right;vertical-align:middle;width:60px;line-height:0;">${badge}</td>` : ""}
        </tr></table></td>`;
    const contactCells = [
      d.email && `<a href="mailto:${d.email}" style="color:${T.sub};text-decoration:none;">${d.email}</a>`,
      d.phone && `<span style="color:${T.sub};">${d.phone}</span>`,
      d.website && `<a href="${normalizeUrl(d.website)}" style="color:${T.sub};text-decoration:none;">${d.website}</a>`,
    ].filter(Boolean) as string[];
    const b2 = contactCells.length
      ? `<td style="padding:12px 20px;background:${T.surface};vertical-align:middle;font-family:${fontStack};font-size:12px;text-align:center;">${contactCells.join(' <span style="color:' + T.rule + ';">&nbsp;|&nbsp;</span> ')}</td>`
      : "";
    const ctaRight = d.ctaLabel && (d.ctaUrl || d.bookingLink)
      ? `<a href="${normalizeUrl(d.ctaUrl || d.bookingLink)}" style="font-family:${fontStack};font-size:12px;font-weight:700;color:${accent};text-decoration:none;">${d.ctaLabel} &rarr;</a>`
      : "";
    const b3 = (social || ctaRight)
      ? `<td style="padding:11px 20px;background:${T.band};border-radius:0 0 11px 11px;vertical-align:middle;">
          <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;width:100%;"><tr>
            <td style="vertical-align:middle;">${social}</td>
            ${ctaRight ? `<td style="text-align:right;vertical-align:middle;">${ctaRight}</td>` : ""}
          </tr></table></td>`
      : "";
    return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:separate;border-spacing:0;border:1px solid ${T.rule};border-radius:11px;overflow:hidden;max-width:480px;">
      <tr>${b1}</tr>${b2 ? `<tr>${b2}</tr>` : ""}${b3 ? `<tr>${b3}</tr>` : ""}
    </table>`;
  },
  renderPlainText: renderDefaultPlainText,
};

export const boldTemplates: SignatureTemplate[] = [bigName, masthead, offCenter, stackedBands];
