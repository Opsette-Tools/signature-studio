import type { SignatureTemplate } from "@/types/template";
import {
  ctaButton,
  emailLink,
  fontStack,
  getResolvedLogo,
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
import { renderDefaultPlainText } from "@/utils/renderPlainText";

const accentDefault = "#4f46e5";

// 1. Clean Name + Title
const cleanNameTitle: SignatureTemplate = {
  id: "minimal-clean-name-title",
  name: "Clean Name + Title",
  category: "minimal",
  tags: ["clean", "simple", "stacked"],
  description: "Just the essentials — name, title, contact line.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || accentDefault;
    const namePronouns = join([d.fullName, d.pronouns && `(${d.pronouns})`], " ");
    const titleCompany = join([d.jobTitle, d.company], " · ");
    const contact = join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)]);
    return table(
      tr(
        td(
          `<div style="font-family:${fontStack};color:#1a1f2e;font-size:14px;line-height:1.5;">
            ${namePronouns ? `<div style="font-size:16px;font-weight:600;color:${accent};">${namePronouns}</div>` : ""}
            ${titleCompany ? `<div style="color:#5b6478;margin-top:2px;">${titleCompany}</div>` : ""}
            ${contact ? `<div style="margin-top:6px;color:#5b6478;">${contact}</div>` : ""}
          </div>`,
        ),
      ),
    );
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Simple Divider
const simpleDivider: SignatureTemplate = {
  id: "minimal-simple-divider",
  name: "Simple Divider",
  category: "minimal",
  tags: ["divider", "line", "elegant"],
  description: "Name above a thin divider with contact details below.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || accentDefault;
    return table(
      `${tr(
        td(
          `<div style="font-family:${fontStack};font-size:15px;font-weight:600;color:#1a1f2e;padding-bottom:6px;">${join([d.fullName, d.pronouns && `(${d.pronouns})`], " ")}</div>`,
        ),
      )}
       ${tr(td(`<div style="border-top:1px solid ${accent};width:48px;height:1px;line-height:1px;"></div>`))}
       ${tr(
         td(
           `<div style="font-family:${fontStack};color:#5b6478;font-size:13px;line-height:1.6;padding-top:6px;">
             ${d.jobTitle ? `<div>${d.jobTitle}${d.company ? `, ${d.company}` : ""}</div>` : d.company ? `<div>${d.company}</div>` : ""}
             ${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)]) ? `<div>${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}</div>` : ""}
           </div>`,
         ),
       )}`,
    );
  },
  renderPlainText: renderDefaultPlainText,
};

// 3. Text Only
const textOnly: SignatureTemplate = {
  id: "minimal-text-only",
  name: "Text Only",
  category: "minimal",
  tags: ["text", "plain", "no-image"],
  description: "Pure text signature with no styling flourish.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    return `<div style="font-family:${fontStack};font-size:13px;color:#1a1f2e;line-height:1.5;">
      ${d.fullName ? `${d.fullName}<br/>` : ""}
      ${join([d.jobTitle, d.company], ", ")}${d.jobTitle || d.company ? "<br/>" : ""}
      ${d.email ? `${emailLink(d.email)}` : ""}${d.email && d.phone ? " | " : ""}${telLink(d.phone)}
      ${d.website ? `<br/>${link(d.website, d.website)}` : ""}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 4. Compact Contact Block
const compactContact: SignatureTemplate = {
  id: "minimal-compact-contact",
  name: "Compact Contact Block",
  category: "minimal",
  tags: ["compact", "block"],
  description: "Tight contact block with subtle labels.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const labelStyle = "color:#8a93a6;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;padding-right:8px;vertical-align:top;";
    const valStyle = "color:#1a1f2e;font-size:13px;padding-bottom:4px;";
    const row = (label: string, val: string) => (val ? tr(`${td(label, labelStyle)}${td(val, valStyle)}`) : "");
    return `<div style="font-family:${fontStack};">
      <div style="font-size:14px;font-weight:600;color:#1a1f2e;margin-bottom:6px;">${d.fullName}${d.jobTitle ? ` — <span style="font-weight:400;color:#5b6478;">${d.jobTitle}</span>` : ""}</div>
      ${table(
        `${row("E", emailLink(d.email))}${row("P", telLink(d.phone))}${row("W", link(d.website, d.website))}`,
      )}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 5. Tiny Footer
const tinyFooter: SignatureTemplate = {
  id: "minimal-tiny-footer",
  name: "Tiny Footer",
  category: "minimal",
  tags: ["tiny", "footer", "small"],
  description: "Small grey footer-style signature for short emails.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "footer",
  renderHtml: (d) => {
    return `<div style="font-family:${fontStack};font-size:11px;color:#8a93a6;line-height:1.5;border-top:1px solid #e6e8ee;padding-top:8px;">
      ${join([d.fullName, d.jobTitle, d.company], " · ")}<br/>
      ${join([emailLink(d.email, "color:#8a93a6;"), telLink(d.phone, "color:#8a93a6;"), link(d.website, d.website, "color:#8a93a6;")])}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// helper: pulls in optional CTA/social/disclaimer block to enrich some minimal templates if filled in
void ctaButton;
void socialIconsRow;
void socialTextLinks;
void getResolvedLogo;
void img;

export const minimalTemplates: SignatureTemplate[] = [
  cleanNameTitle,
  simpleDivider,
  textOnly,
  compactContact,
  tinyFooter,
];
