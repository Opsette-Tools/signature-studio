import type { SignatureTemplate } from "@/types/template";
import {
  emailLink,
  fontStack,
  initials,
  join,
  link,
  telLink,
} from "@/utils/renderSignatureHtml";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

// 1. Inline Pill — name + role in a rounded pill
const inlinePill: SignatureTemplate = {
  id: "compact-inline-pill",
  name: "Inline Pill",
  category: "compact",
  tags: ["pill", "inline", "tiny"],
  description: "Name + role inside a rounded pill, contact in one tight line below.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "inline",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    return `<div style="font-family:${fontStack};">
      <span style="display:inline-block;background:${accent};color:#fff;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;">
        ${d.fullName}${d.jobTitle ? ` · ${d.jobTitle}` : ""}
      </span>
      <div style="font-size:11px;color:#5b6478;margin-top:4px;">${join([d.company, emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}</div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Vertical Stripe — colored vertical bar anchors a 2-line block
const verticalStripe: SignatureTemplate = {
  id: "compact-vertical-stripe",
  name: "Vertical Stripe",
  category: "compact",
  tags: ["stripe", "bar", "tiny"],
  description: "A colored vertical bar anchors a tiny 2-line signature.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    return `<div style="font-family:${fontStack};display:inline-block;border-left:3px solid ${accent};padding:2px 0 2px 10px;">
      <div style="font-size:12px;color:#1a1f2e;line-height:1.4;"><strong>${d.fullName}</strong>${d.jobTitle || d.company ? ` — <span style="color:#5b6478;font-weight:400;">${join([d.jobTitle, d.company], ", ")}</span>` : ""}</div>
      <div style="font-size:11px;color:#5b6478;line-height:1.4;">${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}</div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 3. Bracket Frame — editorial bracket framing
const bracketFrame: SignatureTemplate = {
  id: "compact-bracket-frame",
  name: "Bracket Frame",
  category: "compact",
  tags: ["bracket", "editorial", "tiny"],
  description: "Name flanked by typographic brackets, contact in mono below.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#1a1f2e";
    return `<div style="font-family:${fontStack};">
      <div style="font-size:13px;color:#1a1f2e;font-weight:600;">
        <span style="color:${accent};font-weight:400;">[ </span>${d.fullName}<span style="color:${accent};font-weight:400;"> ]</span>
      </div>
      <div style="font-family:'SF Mono','Menlo','Consolas',monospace;font-size:11px;color:#5b6478;line-height:1.6;margin-top:4px;">
        ${d.jobTitle || d.company ? `<div>${join([d.jobTitle, d.company], " / ")}</div>` : ""}
        ${join([emailLink(d.email), telLink(d.phone)], " / ") ? `<div>${join([emailLink(d.email), telLink(d.phone)], " / ")}</div>` : ""}
      </div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 4. Boxed Initials + Line — small colored square w/ initials, tiny single-line contact
const boxedInitials: SignatureTemplate = {
  id: "compact-boxed-initials",
  name: "Boxed Initials",
  category: "compact",
  tags: ["initials", "box", "tiny"],
  description: "Tiny colored initials box next to a single-line signature.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "inline",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    return `<div style="font-family:${fontStack};display:inline-block;">
      <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;background:${accent};color:#fff;font-size:11px;font-weight:700;border-radius:4px;vertical-align:middle;margin-right:8px;">${initials(d.fullName)}</span>
      <span style="font-size:12px;color:#1a1f2e;vertical-align:middle;"><strong>${d.fullName}</strong>${d.jobTitle ? ` · ${d.jobTitle}` : ""}${d.company ? ` · ${d.company}` : ""}</span>
      <div style="font-size:11px;color:#5b6478;margin-top:3px;margin-left:32px;">${join([emailLink(d.email), telLink(d.phone), link(d.website, d.website)])}</div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 5. Mobile Tap — compact, thumb-friendly signature for phone sending
const mobileTap: SignatureTemplate = {
  id: "compact-mobile-reply",
  name: "Mobile Tap",
  category: "compact",
  tags: ["mobile", "compact", "tap"],
  description: "Tiny thumb-friendly signature — bold name, role, and one-tap phone/email. Built for sending from your phone.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    const tap = (label: string, href: string) =>
      `<a href="${href}" style="display:inline-block;color:${accent};font-size:12px;font-weight:600;text-decoration:none;padding:2px 0;margin-right:14px;">${label}</a>`;
    const digits = d.phone.replace(/[^+\d]/g, "");
    return `<div style="font-family:${fontStack};line-height:1.4;">
      <div style="font-size:13px;font-weight:700;color:#1a1f2e;">${d.fullName}${d.jobTitle ? ` <span style="color:#8a93a6;font-weight:400;">· ${d.jobTitle}</span>` : ""}</div>
      ${d.company ? `<div style="font-size:11px;color:#5b6478;margin-top:1px;">${d.company}</div>` : ""}
      <div style="margin-top:4px;">
        ${d.phone ? tap("Call", `tel:${digits}`) : ""}
        ${d.email ? tap("Email", `mailto:${d.email}`) : ""}
      </div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

export const compactTemplates: SignatureTemplate[] = [
  inlinePill,
  verticalStripe,
  bracketFrame,
  boxedInitials,
  mobileTap,
];
