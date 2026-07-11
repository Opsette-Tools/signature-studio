import type { SignatureTemplate } from "@/types/template";
import {
  contactGrid,
  fontStack,
  hairline,
  join,
  LIGHT_SURFACE,
  logoImg,
  monogramTile,
  nameTwoTone,
  resolveAnchor,
  serifStack,
  socialIconsRow,
  stackGroups,
} from "@/utils/renderSignatureHtml";
import { getResolvedLogo, normalizeUrl } from "@/utils/sanitizeSignatureData";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

const T = LIGHT_SURFACE;

// 1. Executive Formal — KEEP+FIX. Serif, measured rhythm. Now with a two-tone
// name so the surname carries the brand color, and an accent-tinted contact set.
const executive: SignatureTemplate = {
  id: "corporate-executive",
  name: "Executive Formal",
  category: "corporate",
  tags: ["executive", "formal", "serif"],
  description: "Serif typography with measured spacing for senior roles.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const logo = getResolvedLogo(d);
    const accent = d.accentColor || "#1a1f2e";
    const logoBlock = logo
      ? `<div style="margin-bottom:10px;">${logoImg(logo, d.company || d.fullName, { height: 30 })}</div>`
      : "";
    const identity = `<div style="font-family:${serifStack};">
        ${logoBlock}
        <div style="font-size:22px;font-weight:700;letter-spacing:0.2px;line-height:1.2;">${nameTwoTone(d.fullName, accent, T.ink, d.twoToneName)}</div>
        ${d.jobTitle ? `<div style="font-style:italic;color:${T.sub};font-size:14px;margin-top:4px;">${d.jobTitle}</div>` : ""}
        ${d.company ? `<div style="font-weight:700;font-size:12px;letter-spacing:0.4px;margin-top:6px;text-transform:uppercase;color:${T.ink};">${d.company}</div>` : ""}
      </div>`;
    const cta = d.ctaLabel && d.ctaUrl
      ? `<div style="font-family:${fontStack};font-size:12px;"><a href="${normalizeUrl(d.ctaUrl)}" style="color:${accent};font-weight:600;text-decoration:none;border-bottom:1px solid ${accent};padding-bottom:1px;">${d.ctaLabel}</a></div>`
      : "";
    return `<div style="font-family:${serifStack};color:${T.ink};">
      ${identity}
      ${hairline({ color: accent, width: 48, spaceAbove: 14, spaceBelow: 14 })}
      ${stackGroups([contactGrid(d, { iconColor: accent, fontSize: 12 }), cta], 12)}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Team Member Block — KEEP. A logo lockup beside a grouped identity, for a
// company-wide rollout. Two-tone name added for a touch of brand.
const teamMember: SignatureTemplate = {
  id: "corporate-team-member",
  name: "Team Member Block",
  category: "corporate",
  tags: ["team", "department"],
  description: "A logo lockup beside a grouped identity — standardized for company-wide rollout.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: false,
  layoutType: "two-column",
  renderHtml: (d) => {
    const logo = getResolvedLogo(d);
    const accent = d.accentColor || "#1a1f2e";
    const left = logo
      ? logoImg(logo, d.company || d.fullName, { height: 48, radius: 8 })
      : monogramTile(d.fullName, { size: 64, color: accent, radius: 12 });
    const identity = `<div>
        <div style="font-size:15px;font-weight:800;letter-spacing:-.2px;">${nameTwoTone(d.fullName, accent, T.ink, d.twoToneName)}</div>
        ${d.jobTitle || d.company ? `<div style="color:${T.sub};font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      </div>`;
    const cta = d.ctaLabel && d.ctaUrl
      ? `<a href="${normalizeUrl(d.ctaUrl)}" style="color:${accent};font-weight:600;font-size:12px;text-decoration:none;">${d.ctaLabel} &rarr;</a>`
      : "";
    const right = `<div style="font-family:${fontStack};border-left:3px solid ${accent};padding-left:14px;">${stackGroups([identity, contactGrid(d, { iconColor: accent, fontSize: 12 }), cta], 12)}</div>`;
    // twoColLeftRight imported lazily via re-export not needed; use a table here.
    return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
      <tr>
        <td style="vertical-align:middle;width:64px;padding-right:14px;line-height:0;">${left}</td>
        <td style="vertical-align:middle;">${right}</td>
      </tr>
    </table>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 3. The Index — contact info formatted as a numbered spec-sheet (01 EMAIL,
// 02 PHONE), aligned like a product label / directory entry.
const index: SignatureTemplate = {
  id: "corporate-index",
  name: "The Index",
  category: "corporate",
  tags: ["index", "spec-sheet", "numbered", "directory"],
  description: "Contact as a numbered spec-sheet — 01 EMAIL, 02 PHONE — aligned like a product label.",
  supportsImage: true,
  supportsLogo: true,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    const anchor = resolveAnchor(d, accent, { size: 56, variant: "circle" });
    const head = `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
        <tr>
          <td style="vertical-align:middle;padding-right:14px;line-height:0;">${anchor}</td>
          <td style="vertical-align:middle;">
            <div style="font-family:${fontStack};font-size:17px;font-weight:800;letter-spacing:-.2px;">${nameTwoTone(d.fullName, accent, T.ink, d.twoToneName)}</div>
            ${d.jobTitle || d.company ? `<div style="font-family:${fontStack};font-size:12px;color:${T.sub};margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
          </td>
        </tr>
      </table>`;
    const row = (n: string, label: string, val: string) =>
      val
        ? `<tr>
            <td style="font-family:${fontStack};font-size:10px;font-weight:800;color:${accent};padding:0 12px 8px 0;vertical-align:top;letter-spacing:.05em;">${n}</td>
            <td style="font-family:${fontStack};font-size:9.5px;font-weight:700;color:${T.faint};text-transform:uppercase;letter-spacing:.08em;padding:2px 14px 8px 0;vertical-align:top;white-space:nowrap;">${label}</td>
            <td style="font-family:${fontStack};font-size:12.5px;color:${T.sub};padding-bottom:8px;vertical-align:top;white-space:nowrap;">${val}</td>
          </tr>`
        : "";
    let n = 0;
    const num = () => String(++n).padStart(2, "0");
    const rows = [
      d.email && row(num(), "Email", `<a href="mailto:${d.email}" style="color:${T.sub};text-decoration:none;">${d.email}</a>`),
      d.phone && row(num(), "Phone", `<a href="tel:${d.phone.replace(/[^+\d]/g, "")}" style="color:${T.sub};text-decoration:none;">${d.phone}</a>`),
      d.website && row(num(), "Web", `<a href="${normalizeUrl(d.website)}" style="color:${T.sub};text-decoration:none;">${d.website}</a>`),
      d.address && row(num(), "Studio", d.address),
    ]
      .filter(Boolean)
      .join("");
    const grid = rows
      ? `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">${rows}</table>`
      : "";
    return `<div style="font-family:${fontStack};max-width:440px;">${head}<div style="border-top:1px solid ${T.rule};margin:14px 0;"></div>${grid}</div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 4. Contact Rail — email/phone/social live in a colored rail across the TOP;
// identity reads below it (inverted order).
const contactRail: SignatureTemplate = {
  id: "corporate-contact-rail",
  name: "Contact Rail",
  category: "corporate",
  tags: ["rail", "top-bar", "inverted"],
  description: "Email, phone and socials in a colored rail across the top; identity sits below it.",
  supportsImage: true,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "card",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    const anchor = resolveAnchor(d, accent, { size: 62, variant: "circle" });
    const social = socialIconsRow(d, { variant: "plain", color: "#ffffff", size: 16, gap: 5 });
    const railLeft = join(
      [d.email, d.phone].filter(Boolean) as string[],
      "&nbsp;&nbsp;|&nbsp;&nbsp;",
    );
    const rail = `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;width:100%;background:${accent};"><tr>
        <td style="padding:9px 18px;vertical-align:middle;font-family:${fontStack};font-size:11.5px;color:#fff;font-weight:600;letter-spacing:.03em;">${railLeft}</td>
        ${social ? `<td style="padding:9px 18px;vertical-align:middle;text-align:right;white-space:nowrap;">${social}</td>` : ""}
      </tr></table>`;
    const bodyDetails = join([d.website, d.address].filter(Boolean) as string[], " · ");
    const body = `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;"><tr>
        <td style="vertical-align:middle;padding-right:16px;line-height:0;">${anchor}</td>
        <td style="vertical-align:middle;"><div style="font-family:${fontStack};">
          <div style="font-size:18px;font-weight:800;letter-spacing:-.2px;">${nameTwoTone(d.fullName, accent, T.ink, d.twoToneName)}</div>
          ${d.jobTitle || d.company ? `<div style="font-size:12px;color:${T.sub};margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
          ${bodyDetails ? `<div style="font-size:12px;color:${T.faint};margin-top:6px;">${bodyDetails}</div>` : ""}
        </div></td>
      </tr></table>`;
    return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:separate;border-spacing:0;border:1px solid ${T.rule};border-radius:10px;overflow:hidden;max-width:470px;">
      <tr><td style="padding:0;">${rail}</td></tr>
      <tr><td style="padding:18px 20px;background:${T.surface};">${body}</td></tr>
    </table>`;
  },
  renderPlainText: renderDefaultPlainText,
};

export const corporateTemplates: SignatureTemplate[] = [
  executive,
  teamMember,
  index,
  contactRail,
];
