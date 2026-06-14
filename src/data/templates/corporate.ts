import type { SignatureTemplate } from "@/types/template";
import {
  contactGrid,
  fontStack,
  hairline,
  join,
  logoImg,
  monogramTile,
  socialIconsRow,
  stackGroups,
  threeColZoned,
  twoColLeftRight,
} from "@/utils/renderSignatureHtml";
import { getResolvedLogo, normalizeUrl } from "@/utils/sanitizeSignatureData";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

// 1. Executive Formal — serif, with real rhythm: name group, a measured rule,
// then the contact group. Spacing carries the formality, not just the serif.
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
    const serif = "Georgia, 'Times New Roman', serif";
    // Logo leads as a small mark above the name — a formal letterhead lockup,
    // not an orphan dangling after the contact block.
    const logoBlock = logo
      ? `<div style="margin-bottom:10px;">${logoImg(logo, d.company || d.fullName, { height: 30 })}</div>`
      : "";
    const identity = `<div style="font-family:${serif};color:#1a1f2e;">
        ${logoBlock}
        <div style="font-size:22px;font-weight:700;letter-spacing:0.2px;line-height:1.2;">${d.fullName}</div>
        ${d.jobTitle ? `<div style="font-style:italic;color:#5b6478;font-size:14px;margin-top:4px;">${d.jobTitle}</div>` : ""}
        ${d.company ? `<div style="font-weight:700;font-size:12px;letter-spacing:0.4px;margin-top:6px;text-transform:uppercase;">${d.company}</div>` : ""}
      </div>`;
    const cta = d.ctaLabel && d.ctaUrl
      ? `<div style="font-family:${fontStack};font-size:12px;"><a href="${normalizeUrl(d.ctaUrl)}" style="color:${accent};font-weight:600;text-decoration:none;border-bottom:1px solid ${accent};padding-bottom:1px;">${d.ctaLabel}</a></div>`
      : "";
    return `<div style="font-family:${serif};color:#1a1f2e;">
      ${identity}
      ${hairline({ color: accent, width: 48, spaceAbove: 14, spaceBelow: 14 })}
      ${stackGroups([contactGrid(d, { iconColor: accent, fontSize: 12 }), cta], 12)}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Legal / Professional — clean grouped layout + a set-apart disclaimer footer.
const legal: SignatureTemplate = {
  id: "corporate-legal",
  name: "Legal / Professional",
  category: "corporate",
  tags: ["legal", "disclaimer", "professional"],
  description: "Grouped, well-spaced layout with a set-apart disclaimer footer.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#1a1f2e";
    const identity = `<div>
        <div style="font-size:15px;font-weight:700;color:#1a1f2e;">${d.fullName}${d.pronouns ? `, ${d.pronouns}` : ""}</div>
        ${d.jobTitle ? `<div style="color:#5b6478;font-size:12px;margin-top:2px;">${d.jobTitle}</div>` : ""}
        ${d.company ? `<div style="font-weight:600;font-size:12px;margin-top:1px;color:#1a1f2e;">${d.company}</div>` : ""}
      </div>`;
    const cta = d.ctaLabel && d.ctaUrl
      ? `<a href="${normalizeUrl(d.ctaUrl)}" style="color:${accent};font-weight:600;font-size:12px;text-decoration:none;">${d.ctaLabel} &rarr;</a>`
      : "";
    return `<div style="font-family:${fontStack};color:#1a1f2e;line-height:1.5;">
      ${stackGroups([identity, contactGrid(d, { iconColor: accent, fontSize: 12 }), cta], 12)}
      ${d.disclaimer ? `<div style="margin-top:14px;padding-top:10px;border-top:1px solid #e6e8ee;color:#8a93a6;font-size:10px;line-height:1.5;">${d.disclaimer}</div>` : ""}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 3. Consultant — balanced two-column, middle-aligned, with a booking CTA.
const consultant: SignatureTemplate = {
  id: "corporate-consultant",
  name: "Consultant Signature",
  category: "corporate",
  tags: ["consultant", "advisor", "professional"],
  description: "A balanced two-column layout that leads to a booking CTA.",
  supportsImage: true,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    const profile = d.profileImageDataUrl;
    const left = profile
      ? `<img src="${profile}" alt="${d.fullName}" width="72" height="72" style="border-radius:50%;display:block;" />`
      : monogramTile(d.fullName, { size: 72, color: accent, radius: 14 });
    const identity = `<div>
        <div style="font-size:16px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
        ${join([d.jobTitle, d.company], ", ") ? `<div style="color:#5b6478;font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], ", ")}</div>` : ""}
      </div>`;
    const bookingCta = d.bookingLink
      ? `<a href="${normalizeUrl(d.bookingLink)}" style="display:inline-block;background:${accent};color:#fff;font-weight:600;font-size:12px;text-decoration:none;padding:8px 16px;border-radius:6px;font-family:${fontStack};">${d.ctaLabel || "Book a meeting"} &rarr;</a>`
      : "";
    const right = `<div style="font-family:${fontStack};">${stackGroups([identity, contactGrid(d, { iconColor: accent, fontSize: 12 }), bookingCta], 12)}</div>`;
    return twoColLeftRight(left, right, { leftWidth: 72, gap: 18, valign: "middle" });
  },
  renderPlainText: renderDefaultPlainText,
};

// 4. Team Member Block — logo lockup beside a grouped identity, for company rollout.
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
        <div style="font-size:15px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
        ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      </div>`;
    const cta = d.ctaLabel && d.ctaUrl
      ? `<a href="${normalizeUrl(d.ctaUrl)}" style="color:${accent};font-weight:600;font-size:12px;text-decoration:none;">${d.ctaLabel} &rarr;</a>`
      : "";
    const right = `<div style="font-family:${fontStack};border-left:3px solid ${accent};padding-left:14px;">${stackGroups([identity, contactGrid(d, { iconColor: accent, fontSize: 12 }), cta], 12)}</div>`;
    return twoColLeftRight(left, right, { leftWidth: 64, gap: 14, valign: "middle" });
  },
  renderPlainText: renderDefaultPlainText,
};

// 5. Zoned Columns — identity | contact | social, each in its own zone with
// vertical rules. Ruthnie's benchmark for balance in this set.
const zonedColumns: SignatureTemplate = {
  id: "corporate-two-tone-header",
  name: "Zoned Columns",
  category: "corporate",
  tags: ["three-column", "zoned", "corporate"],
  description: "Identity, contact, and social each in their own zone, split by vertical rules.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    // Identity leads with the NAME (a stacked logo-on-top reads orphaned,
    // especially for a minimal mark). Name → role → company, tight as one group.
    const identity = `<div style="font-family:${fontStack};">
        <div style="font-size:16px;font-weight:700;color:#1a1f2e;line-height:1.25;">${d.fullName}</div>
        ${d.jobTitle ? `<div style="color:${accent};font-size:12px;font-weight:600;margin-top:3px;">${d.jobTitle}</div>` : ""}
        ${d.company ? `<div style="color:#5b6478;font-size:12px;margin-top:1px;">${d.company}</div>` : ""}
      </div>`;
    const contact = contactGrid(d, { iconColor: accent, fontSize: 12 });
    const socialRow = socialIconsRow(d, { color: accent, size: 18, variant: "chip", gap: 10 });
    const social = socialRow
      ? `<div style="font-family:${fontStack};">
          <div style="color:#8a93a6;font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:12px;">Connect</div>
          ${socialRow}
        </div>`
      : "";
    return threeColZoned(identity, contact, social, { gap: 22, valign: "middle" });
  },
  renderPlainText: renderDefaultPlainText,
};

export const corporateTemplates: SignatureTemplate[] = [
  executive,
  legal,
  consultant,
  teamMember,
  zonedColumns,
];
