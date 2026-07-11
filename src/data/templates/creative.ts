import type { SignatureTemplate } from "@/types/template";
import {
  contactGrid,
  contactRows,
  fontStack,
  hairline,
  initials,
  join,
  LIGHT_SURFACE,
  nameTwoTone,
  serifStack,
  socialIconsRow,
} from "@/utils/renderSignatureHtml";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

const T = LIGHT_SURFACE;

// 1. Giant Monogram — the initials blown up to 104px as a serif graphic block,
// not a tiny avatar. Works with zero photo — the monogram IS the logo. Replaces
// the weak modern-monogram-tile.
const giantMonogram: SignatureTemplate = {
  id: "creative-giant-monogram",
  name: "Giant Monogram",
  category: "creative",
  tags: ["monogram", "initials", "graphic", "image-free"],
  description: "Initials blown up to a serif graphic block — the monogram becomes the whole logo. No photo needed.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: true,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    const mono = `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:separate;width:104px;height:104px;background:${accent};border-radius:16px;"><tr><td style="width:104px;height:104px;text-align:center;vertical-align:middle;font-family:${serifStack};font-size:46px;font-weight:700;color:#fff;letter-spacing:1px;">${initials(d.fullName)}</td></tr></table>`;
    const social = socialIconsRow(d, { variant: "brand", size: 16, gap: 5 });
    const right = `<div style="font-family:${fontStack};">
        <div style="font-size:19px;font-weight:800;letter-spacing:-.3px;">${nameTwoTone(d.fullName, accent, T.ink, d.twoToneName)}</div>
        ${d.jobTitle || d.company ? `<div style="font-size:12px;color:${T.sub};font-weight:600;margin:3px 0 11px;">${join([d.jobTitle, d.company], " · ")}</div>` : '<div style="height:11px;"></div>'}
        ${contactRows(d, { color: T.sub, iconColor: accent, fontSize: 12, rowGap: 6 })}
        ${social ? `<div style="margin-top:11px;">${social}</div>` : ""}
      </div>`;
    return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
      <tr>
        <td style="vertical-align:middle;padding-right:20px;line-height:0;">${mono}</td>
        <td style="vertical-align:middle;">${right}</td>
      </tr>
    </table>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Script Sign-Off — KEEP. A cursive sign-off above a measured rule, then
// grouped details. Genuinely distinct — personal and warm.
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
    const firstName = d.fullName.split(" ")[0] || d.fullName;
    const signOff = `<div style="font-family:'Brush Script MT','Lucida Handwriting',cursive;font-size:30px;color:${accent};line-height:1;">— ${firstName}</div>`;
    const identity = `<div>
        <div style="font-size:14px;font-weight:800;letter-spacing:-.1px;">${nameTwoTone(d.fullName, accent, T.ink, d.twoToneName)}</div>
        ${d.jobTitle || d.company ? `<div style="color:${T.sub};font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], ", ")}</div>` : ""}
      </div>`;
    return `<div style="font-family:${fontStack};">
      ${signOff}
      ${hairline({ color: T.rule, width: 120, spaceAbove: 12, spaceBelow: 12 })}
      <div>${identity}</div>
      <div style="margin-top:12px;">${contactGrid(d, { iconColor: accent, fontSize: 12 })}</div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

export const creativeTemplates: SignatureTemplate[] = [giantMonogram, scriptSignOff];
