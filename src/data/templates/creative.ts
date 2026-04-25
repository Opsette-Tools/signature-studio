import type { SignatureTemplate } from "@/types/template";
import {
  ctaButton,
  emailLink,
  fontStack,
  getResolvedLogo,
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

// 1. Friendly Creator
const friendlyCreator: SignatureTemplate = {
  id: "creative-friendly-creator",
  name: "Friendly Creator",
  category: "creative",
  tags: ["friendly", "creator", "warm"],
  description: "Warm, casual layout with profile image and tagline.",
  supportsImage: true,
  supportsLogo: false,
  supportsSocialLinks: true,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || "#ec4899";
    const profile = d.profileImageDataUrl;
    return table(
      tr(
        `${profile ? td(`<img src="${profile}" alt="${d.fullName}" width="64" height="64" style="border-radius:50%;display:block;border:2px solid ${accent};" />`, "padding-right:14px;vertical-align:middle;") : ""}
         ${td(
           `<div style="font-family:${fontStack};">
              <div style="font-size:15px;font-weight:700;color:#1a1f2e;">Hi, I'm ${d.fullName} 👋</div>
              ${d.tagline ? `<div style="color:${accent};font-size:13px;font-style:italic;margin-top:2px;">"${d.tagline}"</div>` : d.jobTitle ? `<div style="color:#5b6478;font-size:12px;margin-top:2px;">${d.jobTitle}</div>` : ""}
              <div style="color:#5b6478;font-size:12px;margin-top:6px;">${join([emailLink(d.email), link(d.website, d.website)])}</div>
              ${socialTextLinks(d, accent) ? `<div style="margin-top:6px;font-size:12px;">${socialTextLinks(d, accent)}</div>` : ""}
            </div>`,
           "vertical-align:middle;",
         )}`,
      ),
    );
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Soft Rounded
const softRounded: SignatureTemplate = {
  id: "creative-soft-rounded",
  name: "Soft Rounded",
  category: "creative",
  tags: ["soft", "rounded", "pastel"],
  description: "Pastel background with rounded edges.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "card",
  renderHtml: (d) => {
    const accent = d.accentColor || "#06b6d4";
    return `<div style="font-family:${fontStack};background:#f0f9ff;border-radius:18px;padding:14px 18px;max-width:460px;border:1px solid #bae6fd;">
      <div style="font-size:15px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
      ${d.jobTitle || d.company ? `<div style="color:${accent};font-size:12px;font-weight:600;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
      <div style="color:#5b6478;font-size:12px;margin-top:6px;line-height:1.6;">${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}</div>
      ${socialIconsRow(d, { color: accent }) ? `<div style="margin-top:8px;">${socialIconsRow(d, { color: accent })}</div>` : ""}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 3. Personal Brand
const personalBrand: SignatureTemplate = {
  id: "creative-personal-brand",
  name: "Personal Brand",
  category: "creative",
  tags: ["personal", "brand", "creator"],
  description: "Personality-forward with tagline and CTA.",
  supportsImage: true,
  supportsLogo: false,
  supportsSocialLinks: true,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#a855f7";
    const profile = d.profileImageDataUrl;
    return `<div style="font-family:${fontStack};">
      ${profile ? `<img src="${profile}" alt="${d.fullName}" width="48" height="48" style="border-radius:50%;display:inline-block;vertical-align:middle;margin-right:10px;" />` : ""}
      <span style="font-size:16px;font-weight:700;color:${accent};vertical-align:middle;">${d.fullName}</span>
      <div style="margin-top:8px;color:#5b6478;font-size:12px;line-height:1.6;">
        ${d.tagline ? `<div style="font-style:italic;color:#1a1f2e;">${d.tagline}</div>` : ""}
        ${join([emailLink(d.email), link(d.website, d.website)])}
        ${socialTextLinks(d, accent) ? `<div>${socialTextLinks(d, accent)}</div>` : ""}
      </div>
      ${ctaButton(d, { color: accent, radius: 999 }) ? `<div style="margin-top:10px;">${ctaButton(d, { color: accent, radius: 999 })}</div>` : ""}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 4. Portfolio Style
const portfolio: SignatureTemplate = {
  id: "creative-portfolio",
  name: "Portfolio Style",
  category: "creative",
  tags: ["portfolio", "designer"],
  description: "Highlights website/portfolio prominently.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#f59e0b";
    return `<div style="font-family:${fontStack};">
      <div style="font-size:14px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
      ${d.jobTitle ? `<div style="color:#5b6478;font-size:12px;">${d.jobTitle}</div>` : ""}
      ${d.website ? `<div style="margin-top:8px;"><a href="${d.website.startsWith("http") ? d.website : "https://" + d.website}" style="display:inline-block;background:${accent};color:#1a1f2e;font-weight:700;font-size:12px;padding:6px 12px;border-radius:4px;text-decoration:none;">View Portfolio →</a></div>` : ""}
      <div style="color:#5b6478;font-size:12px;margin-top:8px;">${join([emailLink(d.email), telLink(d.phone)])}</div>
      ${socialTextLinks(d, accent) ? `<div style="font-size:12px;margin-top:4px;">${socialTextLinks(d, accent)}</div>` : ""}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 5. Casual Service Provider
const casualService: SignatureTemplate = {
  id: "creative-casual-service",
  name: "Casual Service Provider",
  category: "creative",
  tags: ["casual", "service", "freelance"],
  description: "Relaxed layout for freelancers and service providers.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: true,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#10b981";
    const logo = getResolvedLogo(d);
    return `<div style="font-family:${fontStack};">
      <div style="display:flex;align-items:center;gap:8px;">
        ${logo ? `<img src="${logo}" alt="${d.company || d.fullName}" height="32" style="display:inline-block;vertical-align:middle;border-radius:6px;" />` : ""}
        <span style="font-size:14px;font-weight:700;color:#1a1f2e;vertical-align:middle;">${d.fullName}</span>
      </div>
      ${d.tagline ? `<div style="color:${accent};font-size:12px;margin-top:4px;font-weight:500;">${d.tagline}</div>` : ""}
      <div style="color:#5b6478;font-size:12px;margin-top:6px;line-height:1.6;">${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}</div>
      ${d.bookingLink ? `<div style="margin-top:8px;font-size:12px;">→ <a href="${d.bookingLink.startsWith("http") ? d.bookingLink : "https://" + d.bookingLink}" style="color:${accent};font-weight:600;">Book a free chat</a></div>` : ""}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

void table;
void td;
void tr;

export const creativeTemplates: SignatureTemplate[] = [
  friendlyCreator,
  softRounded,
  personalBrand,
  portfolio,
  casualService,
];
