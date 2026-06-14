import type { SignatureTemplate } from "@/types/template";
import {
  contactGrid,
  emailLink,
  fontStack,
  join,
  telLink,
} from "@/utils/renderSignatureHtml";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

// 1. Vertical Stripe — a colored bar anchors a tight identity + real-icon contact.
const verticalStripe: SignatureTemplate = {
  id: "compact-vertical-stripe",
  name: "Vertical Stripe",
  category: "compact",
  tags: ["stripe", "bar", "tiny"],
  description: "A colored vertical bar anchors a tight, clean two-line signature.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "two-column",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    return `<div style="font-family:${fontStack};display:inline-block;border-left:3px solid ${accent};padding:2px 0 2px 12px;">
      <div style="font-size:13px;color:#1a1f2e;line-height:1.35;"><strong>${d.fullName}</strong>${d.jobTitle || d.company ? ` <span style="color:#5b6478;font-weight:400;">— ${join([d.jobTitle, d.company], ", ")}</span>` : ""}</div>
      <div style="margin-top:6px;">${contactGrid(d, { iconColor: accent, fontSize: 12, includeAddress: false })}</div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

// 2. Bracket Frame — editorial mono framing; keeps its distinct typewriter-code vibe.
const bracketFrame: SignatureTemplate = {
  id: "compact-bracket-frame",
  name: "Bracket Frame",
  category: "compact",
  tags: ["bracket", "editorial", "tiny"],
  description: "Name flanked by typographic brackets, contact in a clean mono line.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: false,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#1a1f2e";
    const mono = "'SF Mono','Menlo','Consolas',monospace";
    return `<div style="font-family:${fontStack};">
      <div style="font-size:14px;color:#1a1f2e;font-weight:600;">
        <span style="color:${accent};font-weight:400;">[ </span>${d.fullName}<span style="color:${accent};font-weight:400;"> ]</span>
      </div>
      <div style="font-family:${mono};font-size:11px;color:#5b6478;line-height:1.7;margin-top:6px;">
        ${d.jobTitle || d.company ? `<div>${join([d.jobTitle, d.company], " / ")}</div>` : ""}
        ${join([emailLink(d.email), telLink(d.phone)], "  /  ") ? `<div style="margin-top:2px;">${join([emailLink(d.email), telLink(d.phone)], "  /  ")}</div>` : ""}
      </div>
    </div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

export const compactTemplates: SignatureTemplate[] = [verticalStripe, bracketFrame];
