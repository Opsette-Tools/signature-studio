import type { SignatureTemplate } from "@/types/template";
import {
  emailLink,
  fontStack,
  join,
  link,
  socialTextLinks,
  table,
  td,
  telLink,
  tr,
} from "@/utils/renderSignatureHtml";
import { getResolvedLogo } from "@/utils/sanitizeSignatureData";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

// 1. Executive Formal
const executive: SignatureTemplate = {
  id: "corporate-executive",
  name: "Executive Formal",
  category: "corporate",
  tags: ["executive", "formal", "serious"],
  description: "Serif-friendly, formal layout for senior roles.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const logo = getResolvedLogo(d);
    return `<div style="font-family:Georgia, 'Times New Roman', serif;color:#1a1f2e;">
      <div style="font-size:16px;font-weight:700;letter-spacing:0.3px;">${d.fullName}</div>
      ${d.jobTitle ? `<div style="font-style:italic;color:#5b6478;font-size:13px;">${d.jobTitle}</div>` : ""}
      ${d.company ? `<div style="font-weight:600;font-size:13px;margin-top:4px;">${d.company}</div>` : ""}
      <div style="border-top:1px solid #1a1f2e;width:80px;margin:8px 0;"></div>
      <div style="font-family:${fontStack};font-size:12px;color:#5b6478;line-height:1.6;">
        ${d.address ? `<div>${d.address}</div>` : ""}
        ${join([emailLink(d.email), telLink(d.phone)]) ? `<div>${join([emailLink(d.email), telLink(d.phone)])}</div>` : ""}
        ${d.website ? `<div>${link(d.website, d.website)}</div>` : ""}
      </div>
      ${logo ? `<img src="${logo}" alt="${d.company}" height="32" style="margin-top:10px;display:block;" />` : ""}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Legal / Professional
const legal: SignatureTemplate = {
  id: "corporate-legal",
  name: "Legal / Professional",
  category: "corporate",
  tags: ["legal", "disclaimer", "professional"],
  description: "Designed for legal/professional services with disclaimer footer.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    return `<div style="font-family:${fontStack};color:#1a1f2e;font-size:12px;line-height:1.5;">
      <div style="font-size:14px;font-weight:700;">${d.fullName}${d.pronouns ? `, ${d.pronouns}` : ""}</div>
      ${d.jobTitle ? `<div style="color:#5b6478;">${d.jobTitle}</div>` : ""}
      ${d.company ? `<div style="font-weight:600;margin-top:2px;">${d.company}</div>` : ""}
      <div style="margin-top:6px;color:#5b6478;">
        ${d.address ? `${d.address}<br/>` : ""}
        ${join([telLink(d.phone), emailLink(d.email)], " | ")}<br/>
        ${link(d.website, d.website)}
      </div>
      ${d.disclaimer ? `<div style="margin-top:10px;padding-top:8px;border-top:1px solid #e6e8ee;color:#8a93a6;font-size:10px;line-height:1.4;">${d.disclaimer}</div>` : ""}
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 3. Consultant
const consultant: SignatureTemplate = {
  id: "corporate-consultant",
  name: "Consultant Signature",
  category: "corporate",
  tags: ["consultant", "advisor", "professional"],
  description: "Balanced layout with booking link emphasis.",
  supportsImage: true,
  supportsLogo: true,
  supportsSocialLinks: false,
  layoutType: "two-column",
  renderHtml: (d) => {
    const profile = d.profileImageDataUrl;
    const accent = d.accentColor || "#4f46e5";
    return table(
      tr(
        `${profile ? td(`<img src="${profile}" alt="${d.fullName}" width="60" height="60" style="border-radius:50%;display:block;" />`, "padding-right:14px;vertical-align:top;") : ""}
         ${td(
           `<div style="font-family:${fontStack};">
             <div style="font-size:14px;font-weight:700;color:#1a1f2e;">${d.fullName}</div>
             <div style="color:#5b6478;font-size:12px;">${join([d.jobTitle, d.company], ", ")}</div>
             <div style="color:#5b6478;font-size:12px;margin-top:6px;line-height:1.6;">
               ${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)], "<br/>")}
             </div>
             ${d.bookingLink ? `<div style="margin-top:8px;"><a href="${d.bookingLink.startsWith("http") ? d.bookingLink : "https://" + d.bookingLink}" style="color:${accent};font-weight:600;font-size:12px;text-decoration:none;border:1px solid ${accent};padding:5px 10px;border-radius:4px;display:inline-block;">📅 Book a meeting</a></div>` : ""}
           </div>`,
           "vertical-align:top;",
         )}`,
      ),
    );
  },
  renderPlainText: renderDefaultPlainText,
};

// 4. Team Member Block
const teamMember: SignatureTemplate = {
  id: "corporate-team-member",
  name: "Team Member Block",
  category: "corporate",
  tags: ["team", "department"],
  description: "Standardized block ideal for company-wide rollout.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const logo = getResolvedLogo(d);
    return `<div style="font-family:${fontStack};font-size:12px;color:#1a1f2e;line-height:1.5;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding-right:12px;border-right:3px solid #1a1f2e;">
            ${logo ? `<img src="${logo}" alt="${d.company}" height="40" style="display:block;" />` : `<div style="font-size:14px;font-weight:700;">${d.company || ""}</div>`}
          </td>
          <td style="padding-left:12px;">
            <div style="font-size:13px;font-weight:700;">${d.fullName}</div>
            <div style="color:#5b6478;">${d.jobTitle}</div>
            <div style="color:#5b6478;margin-top:4px;">${join([emailLink(d.email), telLink(d.phone)], " · ")}</div>
            ${d.website ? `<div style="color:#5b6478;">${link(d.website, d.website)}</div>` : ""}
          </td>
        </tr>
      </table>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 5. Company Footer
const companyFooter: SignatureTemplate = {
  id: "corporate-company-footer",
  name: "Company Footer",
  category: "corporate",
  tags: ["company", "footer", "branded"],
  description: "Strong company-led footer with personal contact below.",
  supportsImage: false,
  supportsLogo: true,
  supportsSocialLinks: false,
  layoutType: "footer",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    const logo = getResolvedLogo(d);
    return `<div style="font-family:${fontStack};">
      <div style="background:#1a1f2e;color:#fff;padding:10px 14px;border-radius:6px 6px 0 0;display:flex;align-items:center;">
        ${logo ? `<img src="${logo}" alt="${d.company}" height="22" style="display:inline-block;vertical-align:middle;margin-right:10px;background:#fff;padding:2px;border-radius:3px;" />` : ""}
        <span style="font-size:14px;font-weight:700;vertical-align:middle;">${d.company}</span>
      </div>
      <div style="padding:10px 14px;border:1px solid #e6e8ee;border-top:0;border-radius:0 0 6px 6px;font-size:12px;color:#5b6478;line-height:1.6;">
        <div style="color:#1a1f2e;font-weight:600;font-size:13px;">${d.fullName} ${d.jobTitle ? `<span style="color:${accent};font-weight:500;">— ${d.jobTitle}</span>` : ""}</div>
        ${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}
        ${d.address ? `<div>${d.address}</div>` : ""}
      </div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

void socialTextLinks;

export const corporateTemplates: SignatureTemplate[] = [
  executive,
  legal,
  consultant,
  teamMember,
  companyFooter,
];
