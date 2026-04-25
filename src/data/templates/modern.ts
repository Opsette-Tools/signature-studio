import type { SignatureTemplate } from "@/types/template";
import {
  ctaButton,
  emailLink,
  fontStack,
  img,
  join,
  link,
  socialIconsRow,
  socialTextLinks,
  table,
  td,
  telLink,
  tr,
} from "@/utils/renderSignatureHtml";
import { getResolvedLogo } from "@/utils/sanitizeSignatureData";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

const accentDefault = "#4f46e5";

// 1. Card Style
const cardStyle: SignatureTemplate = {
  id: "modern-card-style",
  name: "Card Style",
  category: "modern",
  tags: ["card", "rounded", "boxed"],
  description: "Soft rounded card with subtle background.",
  supportsImage: true,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "card",
  renderHtml: (d) => {
    const accent = d.accentColor || accentDefault;
    const logo = getResolvedLogo(d);
    const profile = d.profileImageDataUrl;
    const left = profile
      ? `<img src="${profile}" alt="${d.fullName}" width="64" height="64" style="border-radius:50%;display:block;" />`
      : logo
        ? `<img src="${logo}" alt="${d.company}" width="64" height="64" style="border-radius:8px;display:block;" />`
        : "";
    return `<div style="font-family:${fontStack};background:#f7f8fb;border:1px solid #e6e8ee;border-radius:12px;padding:14px;max-width:480px;">
      ${table(
        tr(
          `${left ? td(left, "padding-right:14px;vertical-align:top;width:64px;") : ""}
           ${td(
             `<div style="font-size:15px;font-weight:700;color:#1a1f2e;">${d.fullName}${d.pronouns ? ` <span style="font-weight:400;color:#8a93a6;">(${d.pronouns})</span>` : ""}</div>
              ${join([d.jobTitle, d.company], " · ") ? `<div style="color:${accent};font-size:13px;font-weight:600;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
              ${d.tagline ? `<div style="color:#5b6478;font-size:12px;margin-top:4px;font-style:italic;">${d.tagline}</div>` : ""}
              <div style="color:#5b6478;font-size:12px;margin-top:8px;line-height:1.6;">
                ${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}
              </div>
              ${socialIconsRow(d, { color: accent }) ? `<div style="margin-top:10px;">${socialIconsRow(d, { color: accent })}</div>` : ""}`,
             "vertical-align:top;",
           )}`,
        ),
      )}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Left Accent Bar
const leftAccentBar: SignatureTemplate = {
  id: "modern-left-accent-bar",
  name: "Left Accent Bar",
  category: "modern",
  tags: ["accent", "bar", "color"],
  description: "Vertical color bar on the left edge.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || accentDefault;
    return table(
      tr(
        `${td("&nbsp;", `background:${accent};width:4px;border-radius:2px;`)}
         ${td(
           `<div style="font-family:${fontStack};padding-left:14px;">
              <div style="font-size:16px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
              ${d.jobTitle ? `<div style="color:#5b6478;font-size:13px;">${d.jobTitle}${d.company ? ` at <strong style="color:#1a1f2e;">${d.company}</strong>` : ""}</div>` : ""}
              <div style="color:#5b6478;font-size:13px;margin-top:6px;line-height:1.6;">
                ${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}
              </div>
              ${socialTextLinks(d, accent) ? `<div style="margin-top:6px;font-size:12px;">${socialTextLinks(d, accent)}</div>` : ""}
            </div>`,
         )}`,
      ),
    );
  },
  renderPlainText: renderDefaultPlainText,
};

// 3. Rounded Logo Block
const roundedLogo: SignatureTemplate = {
  id: "modern-rounded-logo",
  name: "Rounded Logo Block",
  category: "modern",
  tags: ["logo", "rounded", "branded"],
  description: "Logo on the left, contact details on the right.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "two-column",
  renderHtml: (d) => {
    const logo = getResolvedLogo(d);
    const accent = d.accentColor || accentDefault;
    return table(
      tr(
        `${
          logo
            ? td(
                `<img src="${logo}" alt="${d.company || d.fullName}" width="72" height="72" style="border-radius:14px;display:block;background:#fff;" />`,
                "padding-right:16px;vertical-align:middle;width:72px;",
              )
            : ""
        }
         ${td(
           `<div style="font-family:${fontStack};">
              <div style="font-size:15px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
              ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
              <div style="color:#5b6478;font-size:12px;margin-top:8px;line-height:1.6;">
                ${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)], "<br/>")}
              </div>
              ${ctaButton(d, { color: accent, radius: 12 }) ? `<div style="margin-top:10px;">${ctaButton(d, { color: accent, radius: 12 })}</div>` : ""}
            </div>`,
           "vertical-align:middle;",
         )}`,
      ),
    );
  },
  renderPlainText: renderDefaultPlainText,
};

// 4. Two Column Modern
const twoColumnModern: SignatureTemplate = {
  id: "modern-two-column",
  name: "Two Column Modern",
  category: "modern",
  tags: ["two-column", "split"],
  description: "Identity on the left, contact stack on the right.",
  supportsImage: true,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || accentDefault;
    const profile = d.profileImageDataUrl;
    return table(
      tr(
        `${td(
          `<div style="font-family:${fontStack};">
              ${profile ? `<img src="${profile}" alt="${d.fullName}" width="56" height="56" style="border-radius:50%;display:block;margin-bottom:8px;" />` : ""}
              <div style="font-size:15px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
              ${d.jobTitle ? `<div style="color:${accent};font-size:12px;font-weight:600;">${d.jobTitle}</div>` : ""}
              ${d.company ? `<div style="color:#5b6478;font-size:12px;">${d.company}</div>` : ""}
            </div>`,
          "vertical-align:top;padding-right:24px;border-right:1px solid #e6e8ee;",
        )}
         ${td(
           `<div style="font-family:${fontStack};color:#5b6478;font-size:12px;line-height:1.7;padding-left:24px;">
              ${d.email ? `<div>✉ ${emailLink(d.email)}</div>` : ""}
              ${d.phone ? `<div>☎ ${telLink(d.phone)}</div>` : ""}
              ${d.website ? `<div>🌐 ${link(d.website, d.website)}</div>` : ""}
              ${d.address ? `<div>📍 ${d.address}</div>` : ""}
              ${socialTextLinks(d, accent) ? `<div style="margin-top:6px;">${socialTextLinks(d, accent)}</div>` : ""}
            </div>`,
           "vertical-align:top;",
         )}`,
      ),
    );
  },
  renderPlainText: renderDefaultPlainText,
};

// 5. Social Row
const socialRow: SignatureTemplate = {
  id: "modern-social-row",
  name: "Social Row",
  category: "modern",
  tags: ["social", "icons"],
  description: "Identity above a prominent row of social icons.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || accentDefault;
    const logo = getResolvedLogo(d);
    return `<div style="font-family:${fontStack};">
      ${logo ? `<img src="${logo}" alt="${d.company || d.fullName}" height="36" style="display:block;margin-bottom:8px;" />` : ""}
      <div style="font-size:15px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
      ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      <div style="color:#5b6478;font-size:12px;margin-top:8px;">${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}</div>
      ${socialIconsRow(d, { color: accent, size: 24 }) ? `<div style="margin-top:12px;">${socialIconsRow(d, { color: accent, size: 24 })}</div>` : ""}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

void table;
void td;
void tr;
void img;

export const modernTemplates: SignatureTemplate[] = [
  cardStyle,
  leftAccentBar,
  roundedLogo,
  twoColumnModern,
  socialRow,
];
