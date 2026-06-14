import type { SignatureTemplate } from "@/types/template";
import {
  avatarOrMonogram,
  balancedSplit,
  contactGrid,
  ctaButton,
  fontStack,
  hairline,
  join,
  logoImg,
  monogramTile,
  socialIconsRow,
  stackGroups,
  twoColLeftRight,
} from "@/utils/renderSignatureHtml";
import { getResolvedLogo } from "@/utils/sanitizeSignatureData";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

const accentDefault = "#4f46e5";

// 1. Card Style — THE flagship. A balanced split: a full-height accent panel on
// the left carrying the visual anchor (photo/logo/monogram), content on the
// right with real vertical rhythm — name+role group, a hairline, then the
// contact group, then social. Both columns weigh the same. This is the
// Marie-Rawlins/Isabelle balance, not a tiny avatar beside a tall stack.
const cardStyle: SignatureTemplate = {
  id: "modern-card-style",
  name: "Card Style",
  category: "modern",
  tags: ["card", "balanced", "panel"],
  description: "A balanced card: a full-height accent panel beside a grouped, well-spaced contact block.",
  supportsImage: true,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "card",
  renderHtml: (d) => {
    const accent = d.accentColor || accentDefault;
    const logo = getResolvedLogo(d);
    const profile = d.profileImageDataUrl;
    // Centered bubble anchor on a clean surface — no background fill.
    const panelVisual = profile
      ? `<img src="${profile}" alt="${d.fullName}" width="84" height="84" style="border-radius:50%;display:block;margin:0 auto;" />`
      : logo
        ? logoImg(logo, d.company || d.fullName, { height: 64, radius: 12 })
        : monogramTile(d.fullName, { size: 84, color: accent, radius: 42 });
    const panel = `<div style="text-align:center;">${panelVisual}</div>`;

    const identity = `<div style="font-family:${fontStack};">
        <div style="font-size:17px;font-weight:700;color:#1a1f2e;letter-spacing:-0.2px;">${d.fullName}${d.pronouns ? ` <span style="font-weight:400;color:#8a93a6;font-size:12px;">(${d.pronouns})</span>` : ""}</div>
        ${d.jobTitle || d.company ? `<div style="color:${accent};font-size:12px;font-weight:600;margin-top:3px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
        ${d.tagline ? `<div style="color:#8a93a6;font-size:11px;margin-top:4px;font-style:italic;">${d.tagline}</div>` : ""}
      </div>`;
    const contact = contactGrid(d, { iconColor: accent, fontSize: 12 });
    const social = socialIconsRow(d, { color: accent, size: 16, variant: "chip" });
    const content = `${identity}${hairline({ width: 40, color: "#e6e8ee", spaceAbove: 12, spaceBelow: 12 })}${contact}${social ? `<div style="margin-top:12px;">${social}</div>` : ""}`;

    return balancedSplit(panel, content, {
      panelWidth: 116,
      panelBg: "#ffffff",
      radius: 10,
      pad: 18,
      maxWidth: 460,
    });
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Two Column Modern — identity panel and contact split by a vertical divider,
// each side with its own rhythm. No frame (distinct from Card Style's framed object).
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
    const avatar = avatarOrMonogram(d, { size: 56, color: accent, circle: true });
    const left = `<div style="font-family:${fontStack};">
        ${stackGroups(
          [
            avatar ? `<div>${avatar}</div>` : "",
            `<div>
              <div style="font-size:16px;font-weight:700;color:#1a1f2e;line-height:1.25;">${d.fullName}</div>
              ${d.jobTitle ? `<div style="color:${accent};font-size:12px;font-weight:600;margin-top:3px;">${d.jobTitle}</div>` : ""}
              ${d.company ? `<div style="color:#5b6478;font-size:12px;margin-top:1px;">${d.company}</div>` : ""}
            </div>`,
          ],
          12,
        )}
      </div>`;
    const social = socialIconsRow(d, { color: accent, size: 16, variant: "chip" });
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

// 3. Rounded Logo Block — logo/monogram forward, middle-aligned, with rhythm.
const roundedLogo: SignatureTemplate = {
  id: "modern-rounded-logo",
  name: "Rounded Logo Block",
  category: "modern",
  tags: ["logo", "rounded", "branded"],
  description: "A bold logo or monogram leads, with a grouped, well-spaced contact block beside it.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "two-column",
  renderHtml: (d) => {
    const logo = getResolvedLogo(d);
    const accent = d.accentColor || accentDefault;
    const left = logo
      ? logoImg(logo, d.company || d.fullName, { height: 76, radius: 16 })
      : monogramTile(d.fullName, { size: 76, color: accent, radius: 16 });
    const identity = `<div>
        <div style="font-size:16px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
        ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      </div>`;
    const cta = ctaButton(d, { color: accent, radius: 8 });
    const right = `<div style="font-family:${fontStack};">${stackGroups([identity, contactGrid(d, { iconColor: accent, fontSize: 12 }), cta], 12)}</div>`;
    return twoColLeftRight(left, right, { leftWidth: 76, gap: 18, valign: "middle" });
  },
  renderPlainText: renderDefaultPlainText,
};

// 4. Monogram Tile — image-free branded anchor with rhythm.
const monogramTileTpl: SignatureTemplate = {
  id: "modern-monogram-tile",
  name: "Monogram Tile",
  category: "modern",
  tags: ["monogram", "initials", "branded"],
  description: "A branded monogram tile from your initials — looks designed with no photo at all.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: true,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || accentDefault;
    const left = monogramTile(d.fullName, { size: 68, color: accent, radius: 14 });
    const identity = `<div>
        <div style="font-size:16px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
        ${d.jobTitle || d.company ? `<div style="color:${accent};font-size:12px;font-weight:600;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      </div>`;
    const social = socialIconsRow(d, { color: accent, size: 16, variant: "chip" });
    const right = `<div style="font-family:${fontStack};">${stackGroups([identity, contactGrid(d, { iconColor: accent, fontSize: 12 }), social], 12)}</div>`;
    return twoColLeftRight(left, right, { leftWidth: 68, gap: 16, valign: "middle" });
  },
  renderPlainText: renderDefaultPlainText,
};

export const modernTemplates: SignatureTemplate[] = [
  cardStyle,
  twoColumnModern,
  roundedLogo,
  monogramTileTpl,
];
