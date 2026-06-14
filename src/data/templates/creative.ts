import type { SignatureTemplate } from "@/types/template";
import {
  ctaButton,
  emailLink,
  fontStack,
  join,
  link,
  logoImg,
  monogramTile,
  socialIconsRow,
  socialTextLinks,
  table,
  td,
  telLink,
  tr,
} from "@/utils/renderSignatureHtml";
import { getResolvedLogo } from "@/utils/sanitizeSignatureData";
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
    const avatar = profile
      ? `<img src="${profile}" alt="${d.fullName}" width="60" height="60" style="border-radius:50%;display:block;border:2px solid ${accent};" />`
      : monogramTile(d.fullName, { size: 60, color: accent, radius: 30 });
    return table(
      tr(
        `${td(avatar, "padding-right:16px;vertical-align:middle;width:60px;")}
         ${td(
           `<div style="font-family:${fontStack};">
              <div style="font-size:16px;font-weight:700;color:#1a1f2e;">Hi, I'm ${d.fullName} 👋</div>
              ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;margin-top:2px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
              ${d.tagline ? `<div style="color:${accent};font-size:13px;font-weight:600;margin-top:6px;line-height:1.4;">${d.tagline}</div>` : ""}
              <div style="color:#8a93a6;font-size:12px;margin-top:8px;line-height:1.6;">${join([emailLink(d.email), link(d.website, d.website)])}</div>
              ${socialTextLinks(d, accent) ? `<div style="margin-top:6px;font-size:12px;">${socialTextLinks(d, accent)}</div>` : ""}
            </div>`,
           "vertical-align:middle;",
         )}`,
      ),
    );
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Personal Brand
const personalBrand: SignatureTemplate = {
  id: "creative-personal-brand",
  name: "Personal Brand",
  category: "creative",
  tags: ["personal", "brand", "creator"],
  description: "Personality-forward with tagline and pill CTA.",
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

// 3. Portfolio Style
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
      ${d.website ? `<div style="margin-top:8px;"><a href="${d.website.startsWith("http") ? d.website : "https://" + d.website}" style="display:inline-block;background:${accent};color:#1a1f2e;font-weight:700;font-size:12px;padding:6px 12px;border-radius:4px;text-decoration:none;">${d.ctaLabel || "View Portfolio →"}</a></div>` : ""}
      <div style="color:#5b6478;font-size:12px;margin-top:8px;">${join([emailLink(d.email), telLink(d.phone)])}</div>
      ${socialTextLinks(d, accent) ? `<div style="font-size:12px;margin-top:4px;">${socialTextLinks(d, accent)}</div>` : ""}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 4. Casual Service Provider
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
    const nameRow = logo
      ? `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;"><tr>
          <td style="padding-right:10px;vertical-align:middle;">${logoImg(logo, d.company || d.fullName, { height: 36, radius: 8 })}</td>
          <td style="vertical-align:middle;">
            <div style="font-size:15px;font-weight:700;color:#1a1f2e;line-height:1.2;">${d.fullName}</div>
            ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
          </td>
        </tr></table>`
      : `<div>
          <div style="font-size:15px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
          ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
        </div>`;
    return `<div style="font-family:${fontStack};">
      ${nameRow}
      ${d.tagline ? `<div style="color:${accent};font-size:12px;margin-top:6px;font-weight:600;">${d.tagline}</div>` : ""}
      <div style="color:#5b6478;font-size:12px;margin-top:6px;line-height:1.6;">${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}</div>
      ${d.bookingLink ? `<div style="margin-top:10px;"><a href="${d.bookingLink.startsWith("http") ? d.bookingLink : "https://" + d.bookingLink}" style="display:inline-block;border:1.5px solid ${accent};color:${accent};font-weight:600;font-size:12px;text-decoration:none;padding:6px 14px;border-radius:6px;">${d.ctaLabel || "Book a free chat"}</a></div>` : ""}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 5. Script Sign-Off — handwritten style closing
const scriptSignOff: SignatureTemplate = {
  id: "creative-script-sign-off",
  name: "Script Sign-Off",
  category: "creative",
  tags: ["script", "handwritten", "sign-off"],
  description: "Cursive sign-off above your details — feels personal and warm.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#a855f7";
    return `<div style="font-family:${fontStack};">
      <div style="font-family:'Brush Script MT','Lucida Handwriting',cursive;font-size:28px;color:${accent};line-height:1;">— ${d.fullName.split(" ")[0] || d.fullName}</div>
      <div style="height:1px;background:#e6e8ee;margin:8px 0;width:120px;"></div>
      <div style="font-size:13px;font-weight:600;color:#1a1f2e;">${d.fullName}</div>
      ${d.jobTitle || d.company ? `<div style="color:#5b6478;font-size:12px;">${join([d.jobTitle, d.company], ", ")}</div>` : ""}
      <div style="color:#5b6478;font-size:12px;margin-top:6px;">${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}</div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 6. Sticker Badge — circular badge with bordered "stamp" feel
const stickerBadge: SignatureTemplate = {
  id: "creative-sticker-badge",
  name: "Sticker Badge",
  category: "creative",
  tags: ["badge", "sticker", "playful"],
  description: "Playful circular badge stamp paired with contact details.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: true,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || "#f97316";
    const role = (d.jobTitle || "Hello").toUpperCase();
    return table(
      tr(
        `${td(
          `<div style="width:78px;height:78px;border-radius:50%;border:2px dashed ${accent};display:inline-block;text-align:center;line-height:1.1;padding:0;">
              <div style="display:inline-block;margin-top:18px;font-family:${fontStack};font-size:10px;font-weight:800;color:${accent};text-transform:uppercase;letter-spacing:1px;">${role.slice(0, 14)}</div>
              <div style="font-family:${fontStack};font-size:18px;font-weight:800;color:#1a1f2e;margin-top:2px;">★</div>
            </div>`,
          "padding-right:14px;vertical-align:middle;width:78px;",
        )}
         ${td(
           `<div style="font-family:${fontStack};">
              <div style="font-size:15px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
              ${d.company ? `<div style="color:#5b6478;font-size:12px;">${d.company}</div>` : ""}
              <div style="color:#5b6478;font-size:12px;margin-top:6px;">${join([emailLink(d.email), telLink(d.phone)])}</div>
              ${socialIconsRow(d, { color: accent }) ? `<div style="margin-top:6px;">${socialIconsRow(d, { color: accent })}</div>` : ""}
            </div>`,
           "vertical-align:middle;",
         )}`,
      ),
    );
  },
  renderPlainText: renderDefaultPlainText,
};

// 7. Polaroid Photo — bordered image with caption-style name
const polaroidPhoto: SignatureTemplate = {
  id: "creative-polaroid",
  name: "Polaroid Photo",
  category: "creative",
  tags: ["polaroid", "photo", "frame"],
  description: "Polaroid-framed photo with caption-style name underneath.",
  supportsImage: true,
  supportsLogo: false,
  supportsSocialLinks: true,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || "#ec4899";
    const profile = d.profileImageDataUrl;
    const polaroid = profile
      ? `<div style="background:#fff;border:1px solid #d8dce4;padding:7px 7px 24px;display:inline-block;">
          <img src="${profile}" alt="${d.fullName}" width="72" height="72" style="display:block;width:72px;height:72px;" />
          <div style="font-family:'Brush Script MT','Lucida Handwriting',cursive;font-size:15px;color:#5b6478;text-align:center;margin-top:6px;line-height:1;">${d.fullName.split(" ")[0] || ""}</div>
        </div>`
      : `<div style="background:#fff;border:1px solid #d8dce4;padding:7px 7px 24px;display:inline-block;width:72px;text-align:center;">
          <div style="width:72px;height:72px;line-height:72px;background:#f4f5f8;color:#cbd2dc;font-size:13px;font-weight:700;letter-spacing:1px;">PHOTO</div>
          <div style="font-family:'Brush Script MT','Lucida Handwriting',cursive;font-size:15px;color:#cbd2dc;margin-top:6px;line-height:1;">${d.fullName.split(" ")[0] || ""}</div>
        </div>`;
    return table(
      tr(
        `${td(polaroid, "padding-right:18px;vertical-align:middle;width:90px;")}
         ${td(
           `<div style="font-family:${fontStack};">
              <div style="font-size:15px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
              ${d.jobTitle || d.company ? `<div style="color:${accent};font-size:12px;font-weight:600;">${join([d.jobTitle, d.company], " · ")}</div>` : ""}
              <div style="color:#5b6478;font-size:12px;margin-top:6px;">${join([emailLink(d.email), link(d.website, d.website)])}</div>
              ${socialTextLinks(d, accent) ? `<div style="margin-top:4px;font-size:12px;">${socialTextLinks(d, accent)}</div>` : ""}
            </div>`,
           "vertical-align:middle;",
         )}`,
      ),
    );
  },
  renderPlainText: renderDefaultPlainText,
};

export const creativeTemplates: SignatureTemplate[] = [
  friendlyCreator,
  personalBrand,
  portfolio,
  casualService,
  scriptSignOff,
  stickerBadge,
  polaroidPhoto,
];
