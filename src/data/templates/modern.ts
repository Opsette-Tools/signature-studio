import type { SignatureTemplate } from "@/types/template";
import {
  contactGrid,
  contactRows,
  fontStack,
  LIGHT_SURFACE,
  logoImg,
  nameTwoTone,
  resolveAnchor,
  socialIconsRow,
  stackGroups,
  twoColLeftRight,
} from "@/utils/renderSignatureHtml";
import { getResolvedLogo } from "@/utils/sanitizeSignatureData";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

const accentDefault = "#4f46e5";
const T = LIGHT_SURFACE;

// 1. Symmetric Wings — THE default, and Ruthnie's favorite. Contact is split
// into two mirrored side columns that read INWARD toward a centered identity
// (anchor + two-tone name + brand social). Nothing sits where a normal
// signature puts it. Keeps the id `modern-card-style` so the saved-default
// never breaks (the old Card Style is retired into this stronger structure).
const symmetricWings: SignatureTemplate = {
  id: "modern-card-style",
  name: "Symmetric Wings",
  category: "modern",
  tags: ["wings", "symmetric", "centered", "flagship"],
  description:
    "Contact split into two mirrored side columns; identity centered between them — read inward from both edges.",
  supportsImage: true,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "card",
  renderHtml: (d) => {
    const accent = d.accentColor || accentDefault;
    // Left wing: phone + email, right-aligned toward center.
    const leftWing = contactRows(
      { ...d, website: "", address: "" },
      { color: T.sub, iconColor: accent, fontSize: 12, align: "right", rowGap: 8 },
    );
    // Right wing: web + address, left-aligned toward center.
    const rightWing = contactRows(
      { ...d, email: "", phone: "" },
      { color: T.sub, iconColor: accent, fontSize: 12, align: "left", rowGap: 8 },
    );
    const social = socialIconsRow(d, { variant: "brand", size: 20, gap: 7 });
    // The anchor from resolveAnchor is display:block, which left-aligns even
    // inside a text-align:center parent (text-align doesn't center block kids).
    // A one-cell auto-margin table centers it email-safely regardless of whether
    // it's a fixed photo/monogram or a variable-width logo.
    const anchorCentered = `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;margin:0 auto;"><tr><td style="line-height:0;">${resolveAnchor(d, accent, { size: 84, variant: "circle", ring: accent })}</td></tr></table>`;
    const core = `<div style="text-align:center;font-family:${fontStack};">
        ${anchorCentered}
        <div style="font-size:19px;font-weight:800;letter-spacing:-.2px;margin-top:11px;">${nameTwoTone(d.fullName, accent, T.ink, d.twoToneName)}</div>
        ${d.jobTitle ? `<div style="font-size:11px;color:${T.sub};font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-top:3px;">${d.jobTitle}</div>` : ""}
        ${social ? `<div style="margin-top:11px;">${social}</div>` : ""}
      </div>`;
    // Trimmed wing padding (20→14) so the bigger center + icons don't crowd or
    // wrap on a phone.
    const leftCell = leftWing
      ? `<td style="vertical-align:middle;padding-right:14px;border-right:1px solid ${T.rule};">${leftWing}</td>`
      : "";
    const rightCell = rightWing
      ? `<td style="vertical-align:middle;padding-left:14px;border-left:1px solid ${T.rule};">${rightWing}</td>`
      : "";
    return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
      <tr>${leftCell}<td style="vertical-align:middle;padding:0 16px;">${core}</td>${rightCell}</tr>
    </table>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Two Column Modern — KEEP+FIX. Identity panel and contact split by a
// vertical divider. Now with a two-tone name and brand-color social icons.
const twoColumnModern: SignatureTemplate = {
  id: "modern-two-column",
  name: "Two Column Modern",
  category: "modern",
  tags: ["two-column", "split", "divider"],
  description: "An identity panel and a contact block split by a clean vertical divider.",
  supportsImage: true,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || accentDefault;
    const avatar = resolveAnchor(d, accent, { size: 56, variant: "circle" });
    const left = `<div style="font-family:${fontStack};">
        ${stackGroups(
          [
            avatar ? `<div style="line-height:0;">${avatar}</div>` : "",
            `<div>
              <div style="font-size:16px;font-weight:800;letter-spacing:-.2px;line-height:1.25;">${nameTwoTone(d.fullName, accent, T.ink, d.twoToneName)}</div>
              ${d.jobTitle ? `<div style="color:${accent};font-size:12px;font-weight:600;margin-top:3px;">${d.jobTitle}</div>` : ""}
              ${d.company ? `<div style="color:${T.sub};font-size:12px;margin-top:1px;">${d.company}</div>` : ""}
            </div>`,
          ],
          12,
        )}
      </div>`;
    const social = socialIconsRow(d, { variant: "brand", size: 20, gap: 6 });
    const right = `<div style="font-family:${fontStack};">${contactGrid(d, { iconColor: accent, fontSize: 12 })}${social ? `<div style="margin-top:12px;">${social}</div>` : ""}</div>`;
    return twoColLeftRight(left, right, {
      leftWidth: 148,
      gap: 22,
      divider: true,
      valign: "middle",
    });
  },
  renderPlainText: renderDefaultPlainText,
};

// 3. The Spine — a bold accent bar down the MIDDLE is the design. Identity
// hangs off the left (right-aligned), contact off the right. The divider is the
// loudest element, not a faint hairline.
const spine: SignatureTemplate = {
  id: "modern-spine",
  name: "The Spine",
  category: "modern",
  tags: ["spine", "bar", "divider", "split"],
  description: "A bold color bar down the middle; identity hangs off the left, contact off the right.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: true,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || accentDefault;
    const social = socialIconsRow(d, { variant: "brand", size: 19, gap: 6 });
    const parts = (d.fullName || "").trim().split(/\s+/).filter(Boolean);
    const first = parts[0] || d.fullName;
    const rest = parts.slice(1).join(" ");
    // Spine stacks first/last on two lines; the surname takes the accent unless
    // the two-tone toggle is off (then both lines are ink).
    const restColor = d.twoToneName === false ? T.ink : accent;
    const left = `<div style="font-family:${fontStack};text-align:right;">
        <div style="font-size:19px;font-weight:800;color:${T.ink};letter-spacing:-.3px;line-height:1.05;">${first}</div>
        ${rest ? `<div style="font-size:19px;font-weight:800;color:${restColor};letter-spacing:-.3px;line-height:1.05;">${rest}</div>` : ""}
        ${d.jobTitle ? `<div style="font-size:11.5px;color:${T.sub};font-weight:600;margin-top:6px;">${d.jobTitle}</div>` : ""}
        ${d.company ? `<div style="font-size:11.5px;color:${T.faint};">${d.company}</div>` : ""}
        ${social ? `<div style="margin-top:11px;">${social}</div>` : ""}
      </div>`;
    const right = `<div style="font-family:${fontStack};">${contactRows(d, { color: T.sub, iconColor: accent, fontSize: 12, rowGap: 7 })}</div>`;
    return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
      <tr>
        <td style="vertical-align:middle;padding-right:20px;">${left}</td>
        <td style="width:4px;background:${accent};font-size:0;line-height:0;">&nbsp;</td>
        <td style="vertical-align:middle;padding-left:20px;">${right}</td>
      </tr>
    </table>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 4. Full-Bleed Photo — square photo flush to the card edge, full height; text
// vertically centered beside it. In logo mode the panel fills with the accent
// color and centers the white-padded logo.
const fullBleedPhoto: SignatureTemplate = {
  id: "modern-full-bleed-photo",
  name: "Full-Bleed Photo",
  category: "modern",
  tags: ["photo", "full-bleed", "panel"],
  description: "A square photo flush to the card edge, full height; text vertically centered beside it.",
  supportsImage: true,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "card",
  renderHtml: (d) => {
    const accent = d.accentColor || accentDefault;
    const logo = getResolvedLogo(d);
    const photo = d.profileImageDataUrl;
    const social = socialIconsRow(d, { variant: "brand", size: 19, gap: 6 });
    const right = `<div style="font-family:${fontStack};">
        <div style="font-size:19px;font-weight:800;letter-spacing:-.3px;">${nameTwoTone(d.fullName, accent, T.ink, d.twoToneName)}</div>
        ${d.jobTitle ? `<div style="font-size:11.5px;color:${accent};font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin-top:4px;">${d.jobTitle}</div>` : ""}
        ${d.company ? `<div style="font-size:12px;color:${T.faint};margin-top:1px;">${d.company}</div>` : ""}
        <div style="margin-top:13px;">${contactRows({ ...d, address: "" }, { color: T.sub, iconColor: accent, fontSize: 12, rowGap: 6 })}</div>
        ${social ? `<div style="margin-top:12px;">${social}</div>` : ""}
      </div>`;
    // Visual panel: a real square photo if present; else a colored panel with
    // the logo; else a colored panel with the monogram (never blank).
    const visual = photo
      ? `<td width="120" style="width:120px;vertical-align:top;line-height:0;font-size:0;"><img src="${photo}" alt="${d.fullName}" width="120" height="120" style="display:block;" /></td>`
      : `<td width="120" style="width:120px;background:${accent};vertical-align:middle;text-align:center;padding:24px 0;">${
          logo
            ? logoImg(logo, d.company || d.fullName, { height: 40, radius: 8 })
            : `<span style="font-family:Georgia,'Times New Roman',serif;font-size:42px;font-weight:700;color:#fff;letter-spacing:1px;">${(d.fullName || "").trim().split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "•"}</span>`
        }</td>`;
    return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:separate;border-spacing:0;border:1px solid ${T.rule};border-radius:12px;overflow:hidden;max-width:460px;">
      <tr>${visual}<td style="vertical-align:middle;padding:20px 22px;background:${T.surface};">${right}</td></tr>
    </table>`;
  },
  renderPlainText: renderDefaultPlainText,
};

export const modernTemplates: SignatureTemplate[] = [
  symmetricWings,
  twoColumnModern,
  spine,
  fullBleedPhoto,
];
