import type { SignatureTemplate } from "@/types/template";
import {
  contactGrid,
  fontStack,
  join,
  socialIconsRow,
  stackGroups,
} from "@/utils/renderSignatureHtml";
import { renderDefaultPlainText } from "@/utils/renderPlainText";

// Big Name — a confident name headline with real vertical rhythm: the name,
// a gap, an accent rule, a gap, the role, a gap, then the contact group. The
// spacing IS the design; the scale is restrained.
const bigName: SignatureTemplate = {
  id: "bold-big-name",
  name: "Big Name",
  category: "bold",
  tags: ["big", "name", "headline"],
  description: "A confident name headline with deliberate spacing between each group.",
  supportsImage: false,
  supportsLogo: false,
  supportsSocialLinks: true,
  layoutType: "stacked",
  renderHtml: (d) => {
    const accent = d.accentColor || "#4f46e5";
    const identity = `<div style="font-size:26px;font-weight:800;color:#1a1f2e;line-height:1.08;letter-spacing:-0.8px;">${d.fullName}</div>
      <div style="border-top:3px solid ${accent};width:40px;height:3px;line-height:3px;font-size:0;margin-top:12px;">&nbsp;</div>`;
    const role = d.jobTitle || d.company
      ? `<div style="color:${accent};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.6px;">${join([d.jobTitle, d.company], "  /  ")}</div>`
      : "";
    const contact = contactGrid(d, { iconColor: accent, fontSize: 13 });
    const social = socialIconsRow(d, { color: accent, size: 18, variant: "chip" });
    return `<div style="font-family:${fontStack};">${stackGroups([identity, role, contact, social], 16)}</div>`;
  },
  renderPlainText: renderDefaultPlainText,
};

export const boldTemplates: SignatureTemplate[] = [bigName];
