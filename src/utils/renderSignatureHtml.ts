import type { SignatureData } from "@/types/signature";
import { getResolvedLogo, normalizeUrl } from "./sanitizeSignatureData";

/**
 * Helpers for building email-safe signature HTML.
 * All template renderers in src/data/templates use these.
 *
 * INLINE STYLES are intentional here — email clients require them.
 * Do NOT use inline styles in app UI components.
 */

export const fontStack =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** Serif stack used by editorial / masthead / monogram templates. */
export const serifStack = "Georgia, 'Times New Roman', serif";

export function td(content: string, style = ""): string {
  return `<td style="${style}">${content}</td>`;
}

export function tr(content: string): string {
  return `<tr>${content}</tr>`;
}

export function table(content: string, style = ""): string {
  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;${style}">${content}</table>`;
}

export function link(href: string, label: string, style = ""): string {
  if (!href || !label) return "";
  return `<a href="${normalizeUrl(href)}" style="color:inherit;text-decoration:none;${style}">${label}</a>`;
}

export function emailLink(email: string, style = ""): string {
  if (!email) return "";
  return `<a href="mailto:${email}" style="color:inherit;text-decoration:none;${style}">${email}</a>`;
}

export function telLink(phone: string, style = ""): string {
  if (!phone) return "";
  const digits = phone.replace(/[^+\d]/g, "");
  return `<a href="tel:${digits}" style="color:inherit;text-decoration:none;${style}">${phone}</a>`;
}

export function img(src: string, alt: string, attrs = ""): string {
  if (!src) return "";
  return `<img src="${src}" alt="${alt}" ${attrs} />`;
}

/**
 * Logo image wrapped in a small white-padded inline-block.
 * A dark-ink logo on a transparent background would otherwise vanish on dark surfaces
 * and look glued-on on tinted ones. The white pad gives every logo a safe surface
 * regardless of where it lands in the signature.
 *
 * `surface` controls the wrapper background. Use "auto" (default) for a white pad
 * that works for any client; "transparent" if the parent surface is already white.
 */
export function logoImg(
  src: string,
  alt: string,
  opts: { height?: number; surface?: "auto" | "transparent"; radius?: number } = {},
): string {
  if (!src) return "";
  const height = opts.height ?? 32;
  const radius = opts.radius ?? 3;
  const surface = opts.surface ?? "auto";
  const bg = surface === "transparent" ? "transparent" : "#ffffff";
  const pad = surface === "transparent" ? 0 : 3;
  return `<span style="display:inline-block;background:${bg};padding:${pad}px;border-radius:${radius}px;line-height:0;"><img src="${src}" alt="${alt}" height="${height}" style="display:block;height:${height}px;width:auto;" /></span>`;
}

/** Joins parts with separator, dropping empty values */
export function join(parts: (string | false | null | undefined)[], sep = " · "): string {
  return parts.filter((v): v is string => Boolean(v && v.trim())).join(sep);
}

/**
 * A horizontal header bar with content on the left and an optional accessory
 * (logo, role chip, etc.) pinned to the right, vertically centered.
 *
 * Built as a 100%-width table — NOT flexbox. Gmail strips flex sub-properties
 * (align-items/justify-content), which silently collapses any flex header into a
 * broken left stack. A two-cell table with `text-align:right` on the accessory is
 * the only layout that survives every major client. Use this anywhere you'd reach
 * for `display:flex;justify-content:space-between`.
 */
export function headerBar(
  leftHtml: string,
  rightHtml: string,
  opts: { background?: string; padding?: string; radius?: string; border?: string } = {},
): string {
  const bg = opts.background ? `background:${opts.background};` : "";
  const pad = opts.padding ?? "12px 16px";
  const radius = opts.radius ? `border-radius:${opts.radius};` : "";
  const border = opts.border ? `border:${opts.border};` : "";
  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;width:100%;${bg}${radius}${border}">
    <tr>
      <td style="padding:${pad};vertical-align:middle;text-align:left;">${leftHtml}</td>
      ${rightHtml ? `<td style="padding:${pad};vertical-align:middle;text-align:right;white-space:nowrap;">${rightHtml}</td>` : ""}
    </tr>
  </table>`;
}

/* ---- Brand social icons --------------------------------------------- *
 *
 *  Real brand glyphs (LinkedIn, X, Instagram, Facebook, YouTube, TikTok)
 *  drawn as data-URI SVG <img> — the actual marks, not "in"/"X"/"fb" text
 *  in a box, which is the #1 amateur tell. Each glyph is a single fill path
 *  on a 24x24 viewBox, tinted to whatever color the chip needs (white on a
 *  colored chip; the brand/accent color when chip-less).
 */
type SocialKey =
  | "linkedin"
  | "twitter"
  | "instagram"
  | "facebook"
  | "youtube"
  | "tiktok";

/**
 * Real brand colors — the "pop." Instagram pink, LinkedIn blue, etc. Used by
 * the `brand` variant of the social row so the icons read as the actual marks,
 * not a flat monochrome wash. (Lesson #2 of the v2 rebuild.)
 */
export const BRAND_COLOR: Record<SocialKey, string> = {
  linkedin: "#0A66C2",
  twitter: "#000000",
  instagram: "#E4405F",
  facebook: "#1877F2",
  youtube: "#FF0000",
  tiktok: "#000000",
};

const SOCIAL_PATHS: Record<SocialKey, string> = {
  linkedin:
    "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.74v20.51C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.74C24 .78 23.2 0 22.22 0z",
  twitter:
    "M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z",
  instagram:
    "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56-.79.31-1.46.72-2.13 1.38A5.9 5.9 0 0 0 .63 4.14c-.3.76-.5 1.63-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.41a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z",
  facebook:
    "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z",
  youtube:
    "M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z",
  tiktok:
    "M19.32 5.56a5.07 5.07 0 0 1-1.06-.11 5.18 5.18 0 0 1-3.16-2.4 5.05 5.05 0 0 1-.77-2.45V.5h-3.4v13.6a3.06 3.06 0 0 1-5.5 1.84 3.06 3.06 0 0 1 3.06-4.78V7.7a6.46 6.46 0 0 0-6.46 6.46A6.46 6.46 0 0 0 8.5 20.62a6.46 6.46 0 0 0 6.46-6.46V7.06a8.55 8.55 0 0 0 4.86 1.5V5.56z",
};

export function socialIconsRow(
  data: SignatureData,
  opts: {
    color?: string;
    size?: number;
    variant?: "chip" | "plain" | "brand";
    gap?: number;
    /** For the "chip" variant: fill each chip with the real brand color
     *  instead of a single accent. The v2 "pop." */
    brandChips?: boolean;
  } = {},
): string {
  const color = opts.color || "#5b6478";
  const size = opts.size || 22;
  const variant = opts.variant ?? "chip";
  const gap = opts.gap ?? 6;
  const items: { url: string; key: SocialKey }[] = [];
  if (data.linkedin) items.push({ url: data.linkedin, key: "linkedin" });
  if (data.twitter) items.push({ url: data.twitter, key: "twitter" });
  if (data.instagram) items.push({ url: data.instagram, key: "instagram" });
  if (data.facebook) items.push({ url: data.facebook, key: "facebook" });
  if (data.youtube) items.push({ url: data.youtube, key: "youtube" });
  if (data.tiktok) items.push({ url: data.tiktok, key: "tiktok" });
  if (!items.length) return "";
  const glyph = (key: SocialKey, fill: string, glyphSize: number) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${glyphSize}" height="${glyphSize}" viewBox="0 0 24 24" fill="${fill}"><path d="${SOCIAL_PATHS[key]}"/></svg>`;
    return `<img src="data:image/svg+xml;utf8,${encodeURIComponent(svg)}" alt="${key}" width="${glyphSize}" height="${glyphSize}" style="display:block;width:${glyphSize}px;height:${glyphSize}px;" />`;
  };
  return items
    .map((i) => {
      // "brand": no chip — the naked glyph tinted its real brand color.
      if (variant === "brand") {
        return `<a href="${normalizeUrl(i.url)}" style="display:inline-block;margin-right:${gap + 2}px;text-decoration:none;line-height:0;vertical-align:middle;">${glyph(i.key, BRAND_COLOR[i.key], size)}</a>`;
      }
      if (variant === "plain") {
        return `<a href="${normalizeUrl(i.url)}" style="display:inline-block;margin-right:${gap + 2}px;text-decoration:none;line-height:0;vertical-align:middle;">${glyph(i.key, color, size)}</a>`;
      }
      const chipBg = opts.brandChips ? BRAND_COLOR[i.key] : color;
      const chip = Math.round(size * 1.55);
      const pad = Math.round((chip - size) / 2);
      return `<a href="${normalizeUrl(i.url)}" style="display:inline-block;margin-right:${gap}px;width:${chip}px;height:${chip}px;border-radius:${Math.round(chip / 4)}px;background:${chipBg};text-decoration:none;line-height:0;vertical-align:middle;"><span style="display:inline-block;padding:${pad}px;line-height:0;">${glyph(i.key, "#ffffff", size)}</span></a>`;
    })
    .join("");
}

export function socialTextLinks(data: SignatureData, color = "#4f46e5"): string {
  const items: { url: string; label: string }[] = [];
  if (data.linkedin) items.push({ url: data.linkedin, label: "LinkedIn" });
  if (data.twitter) items.push({ url: data.twitter, label: "X" });
  if (data.instagram) items.push({ url: data.instagram, label: "Instagram" });
  if (data.facebook) items.push({ url: data.facebook, label: "Facebook" });
  if (data.youtube) items.push({ url: data.youtube, label: "YouTube" });
  if (data.tiktok) items.push({ url: data.tiktok, label: "TikTok" });
  return items
    .map(
      (i) =>
        `<a href="${normalizeUrl(i.url)}" style="color:${color};text-decoration:none;font-weight:500;">${i.label}</a>`,
    )
    .join(' <span style="color:#cbd2dc;">·</span> ');
}

export function ctaButton(
  data: SignatureData,
  opts: { color?: string; textColor?: string; radius?: number } = {},
): string {
  if (!data.ctaLabel || !data.ctaUrl) return "";
  const color = opts.color || "#4f46e5";
  const textColor = opts.textColor || "#ffffff";
  const radius = opts.radius ?? 6;
  return `<a href="${normalizeUrl(data.ctaUrl)}" style="display:inline-block;background:${color};color:${textColor};padding:8px 14px;border-radius:${radius}px;font-family:${fontStack};font-size:13px;font-weight:600;text-decoration:none;">${data.ctaLabel}</a>`;
}

/** Returns up to 2 initials from a name. Falls back to "•" if empty. */
export function initials(name: string): string {
  if (!name) return "•";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "•";
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

/** Renders a square monogram tile with initials in the chosen color. */
export function monogramTile(
  name: string,
  opts: { size?: number; color?: string; textColor?: string; radius?: number } = {},
): string {
  const size = opts.size || 56;
  const color = opts.color || "#4f46e5";
  const textColor = opts.textColor || "#ffffff";
  const radius = opts.radius ?? 10;
  return `<div style="display:inline-block;width:${size}px;height:${size}px;line-height:${size}px;text-align:center;background:${color};color:${textColor};font-family:${fontStack};font-size:${Math.round(size * 0.4)}px;font-weight:700;border-radius:${radius}px;letter-spacing:0.5px;">${initials(name)}</div>`;
}

/** Profile image with circular crop, falls back to monogram tile. */
export function avatarOrMonogram(
  data: SignatureData,
  opts: { size?: number; color?: string; circle?: boolean } = {},
): string {
  const size = opts.size || 56;
  const color = opts.color || "#4f46e5";
  const radius = opts.circle === false ? 10 : Math.round(size / 2);
  if (data.profileImageDataUrl) {
    return `<img src="${data.profileImageDataUrl}" alt="${data.fullName}" width="${size}" height="${size}" style="display:block;border-radius:${radius}px;object-fit:cover;" />`;
  }
  return monogramTile(data.fullName, { size, color, radius });
}

/* ------------------------------------------------------------------ *
 *  VERTICAL RHYTHM
 *
 *  The single thing that separates a designed signature from one typed
 *  in Gmail: deliberate spacing that GROUPS content. Lines WITHIN a group
 *  sit tight (2px); GROUPS are separated by a real gap (and sometimes a
 *  hairline). Identity / role / contact / social read as distinct blocks,
 *  not one undifferentiated column. Templates must compose with these
 *  instead of sprinkling ad-hoc margin-top values.
 * ------------------------------------------------------------------ */

/** Stack of groups with a deliberate gap between each. The gap is what makes
 *  the signature read as structured blocks rather than a typewritten column. */
export function stackGroups(groups: (string | false | null | undefined)[], gap = 14): string {
  const blocks = groups.filter((g): g is string => Boolean(g && g.trim()));
  if (!blocks.length) return "";
  return blocks
    .map((b, i) => `<div style="${i === 0 ? "" : `margin-top:${gap}px;`}">${b}</div>`)
    .join("");
}

/** A horizontal hairline with breathing room above and below — a real divider
 *  between groups (like the rule under Marie Rawlins's title), not a line
 *  jammed against the next line of text. */
export function hairline(
  opts: { color?: string; width?: number | "full"; spaceAbove?: number; spaceBelow?: number } = {},
): string {
  const color = opts.color || "#e6e8ee";
  const width = opts.width ?? "full";
  const above = opts.spaceAbove ?? 12;
  const below = opts.spaceBelow ?? 12;
  const w = width === "full" ? "100%" : `${width}px`;
  return `<div style="margin:${above}px 0 ${below}px;"><div style="border-top:1px solid ${color};width:${w};height:1px;line-height:1px;font-size:0;">&nbsp;</div></div>`;
}

/* ------------------------------------------------------------------ *
 *  LAYOUT PRIMITIVES
 *
 *  These are the reusable architecture helpers that templates compose.
 *  They exist so the library has real STRUCTURAL variety (two-column,
 *  three-column-zoned, card-zoned) instead of N variations of one
 *  vertical stack. Every primitive is built on email-safe tables — NO
 *  flexbox, NO gradients, NO box-shadow (all stripped by Gmail) — and
 *  every primitive drops empty zones rather than leaving a gap.
 * ------------------------------------------------------------------ */

/**
 * A height-BALANCED two-column: a full-height visual panel on the left whose
 * surface fills the entire height of the content beside it, so the two columns
 * weigh the same (the balance Ruthnie flagged in Isabelle/Marie — image height
 * matches content height, not a tiny avatar beside a tall stack).
 *
 * The left panel is a colored/tinted cell that vertically centers its visual
 * (monogram/photo/logo); `vertical-align` + a min-height on the content keep
 * both sides level. Use this for the flagship "card with a side panel" look.
 */
export function balancedSplit(
  panelHtml: string,
  contentHtml: string,
  opts: {
    panelWidth?: number;
    panelBg?: string;
    contentBg?: string;
    border?: string;
    radius?: number;
    pad?: number;
    maxWidth?: number;
  } = {},
): string {
  const panelWidth = opts.panelWidth ?? 132;
  const panelBg = opts.panelBg || "#1a1f2e";
  const contentBg = opts.contentBg || "#ffffff";
  const border = opts.border || "#e6e8ee";
  const radius = opts.radius ?? 10;
  const pad = opts.pad ?? 18;
  const maxWidth = opts.maxWidth ?? 460;
  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:separate;border-spacing:0;max-width:${maxWidth}px;border:1px solid ${border};border-radius:${radius}px;overflow:hidden;">
    <tr>
      <td width="${panelWidth}" style="width:${panelWidth}px;background:${panelBg};vertical-align:middle;text-align:center;padding:${pad}px;border-radius:${radius}px 0 0 ${radius}px;">${panelHtml}</td>
      <td style="background:${contentBg};vertical-align:middle;padding:${pad}px;border-radius:0 ${radius}px ${radius}px 0;">${contentHtml}</td>
    </tr>
  </table>`;
}

/**
 * The workhorse two-column layout: a visual anchor on the left (monogram /
 * photo-URL / logo) and content on the right, with an optional thin vertical
 * divider rule between them. This is the dominant professional signature
 * structure. If `leftHtml` is empty, the right cell renders full-width (no
 * orphaned divider).
 */
export function twoColLeftRight(
  leftHtml: string,
  rightHtml: string,
  opts: {
    leftWidth?: number;
    gap?: number;
    divider?: boolean;
    dividerColor?: string;
    valign?: "top" | "middle";
  } = {},
): string {
  const leftWidth = opts.leftWidth ?? 64;
  const gap = opts.gap ?? 18;
  const valign = opts.valign ?? "top";
  const dividerColor = opts.dividerColor || "#e6e8ee";
  if (!leftHtml || !leftHtml.trim()) {
    return table(tr(td(rightHtml, `vertical-align:${valign};`)));
  }
  const rightStyle = opts.divider
    ? `vertical-align:${valign};border-left:1px solid ${dividerColor};padding-left:${gap}px;`
    : `vertical-align:${valign};padding-left:${gap}px;`;
  const leftStyle = `vertical-align:${valign};width:${leftWidth}px;padding-right:${opts.divider ? gap : 0}px;`;
  return table(tr(`${td(leftHtml, leftStyle)}${td(rightHtml, rightStyle)}`));
}

/* ---- Contact icons -------------------------------------------------- *
 *
 *  Real glyph icons (envelope / phone / globe / pin) drawn as crisp SVG
 *  embedded as a data-URI <img>. This is the look every premium signature
 *  tool uses (WiseStamp, Mail-Signatures, Exclaimer) — NOT naked "E/P/W"
 *  letters, which read as a spreadsheet.
 *
 *  Why data-URI SVG in an <img> (not inline <svg>, not a hosted PNG):
 *   - Inline <svg> is stripped by Gmail.
 *   - A hosted PNG needs image hosting, which this standalone tool has not.
 *   - A data-URI in <img src> renders in Gmail/Apple Mail/Outlook web and
 *     scales crisply. It needs no host and survives copy-paste.
 *  The glyph color is baked into the SVG, so each icon is tinted to the
 *  template's accent at render time.
 */
type ContactIconKey = "email" | "phone" | "web" | "address";

const ICON_PATHS: Record<ContactIconKey, string> = {
  // 24x24 viewBox, single-path glyphs (stroke-free, fill).
  email:
    "M3 5.5h18c.55 0 1 .45 1 1v11c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1v-11c0-.55.45-1 1-1zm1.6 1.5L12 12.2 19.4 7H4.6zM20 9.1l-7.4 5.2c-.36.25-.84.25-1.2 0L4 9.1V17h16V9.1z",
  phone:
    "M6.6 2.5c.5 0 .95.3 1.13.78l1.2 3.1c.16.42.06.9-.27 1.2L7.2 9.1c1.02 2 2.7 3.68 4.7 4.7l1.5-1.46c.3-.33.78-.43 1.2-.27l3.1 1.2c.48.18.78.63.78 1.13V19c0 1.1-.9 2-2 2-8.28 0-15-6.72-15-15 0-1.1.9-2 2-2h2.62z",
  web:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.9 6h-2.95a15.6 15.6 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.9 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82A13.7 13.7 0 0 1 12 4.04zM4.26 14a8 8 0 0 1 0-4h3.38a16.5 16.5 0 0 0 0 4H4.26zm.84 2h2.95c.34 1.27.8 2.46 1.38 3.56A8.03 8.03 0 0 1 5.1 16zm2.95-8H5.1a8.03 8.03 0 0 1 4.33-3.56A15.6 15.6 0 0 0 8.05 8zM12 19.96A13.7 13.7 0 0 1 10.09 16h3.82A13.7 13.7 0 0 1 12 19.96zM14.34 14H9.66a14.7 14.7 0 0 1 0-4h4.68a14.7 14.7 0 0 1 0 4zm.27 5.56c.58-1.1 1.04-2.29 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14a16.5 16.5 0 0 0 0-4h3.38a8 8 0 0 1 0 4h-3.38z",
  address:
    "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z",
};

/** A single contact glyph (envelope / phone / globe / pin) as a data-URI <img>,
 *  tinted to `color`. Exported so the v2 structural templates (Spine, Index,
 *  Wings, …) can lay their own contact rows instead of the stacked contactGrid. */
export function contactIcon(key: ContactIconKey, color: string, size: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="${ICON_PATHS[key]}"/></svg>`;
  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return `<img src="${dataUri}" alt="" width="${size}" height="${size}" style="display:block;width:${size}px;height:${size}px;" />`;
}

type ContactGridRow = { icon: ContactIconKey; value: string };

/**
 * Aligned contact rows with a real icon (envelope / phone / globe / pin) in a
 * fixed-width cell and the value beside it. Replaces both the naked-letter
 * labels and the single `email · phone · web` line. Returns a <table>; empty
 * fields are dropped. Pass `iconColor`/`color`/`linkColor` so it reads on a
 * dark surface as well as light.
 */
export function contactGrid(
  data: SignatureData,
  opts: {
    color?: string;
    iconColor?: string;
    linkColor?: string;
    fontSize?: number;
    includeAddress?: boolean;
  } = {},
): string {
  const color = opts.color || "#5b6478";
  const iconColor = opts.iconColor || "#9aa3b8";
  const linkColor = opts.linkColor || color;
  const fontSize = opts.fontSize ?? 12;
  const iconSize = Math.max(13, Math.round(fontSize * 1.15));
  const includeAddress = opts.includeAddress ?? true;
  const linkStyle = `color:${linkColor};`;
  const rows: ContactGridRow[] = [];
  if (data.email) rows.push({ icon: "email", value: emailLink(data.email, linkStyle) });
  if (data.phone) rows.push({ icon: "phone", value: telLink(data.phone, linkStyle) });
  if (data.website) rows.push({ icon: "web", value: link(data.website, data.website, linkStyle) });
  if (includeAddress && data.address) rows.push({ icon: "address", value: data.address });
  if (!rows.length) return "";
  const iconCellStyle = `padding:0 8px 5px 0;vertical-align:middle;width:${iconSize}px;line-height:0;`;
  const valueStyle = `color:${color};font-family:${fontStack};font-size:${fontSize}px;padding:0 0 5px;vertical-align:middle;line-height:1.4;`;
  const body = rows
    .map((r) => tr(`${td(contactIcon(r.icon, iconColor, iconSize), iconCellStyle)}${td(r.value, valueStyle)}`))
    .join("");
  return table(body);
}

/**
 * Three zoned columns — identity | contact | social — each in its own cell with
 * a thin divider rule between. Handles dense data without clutter. Empty zones
 * (and their leading divider) are dropped so a 2-zone or 1-zone render stays
 * clean.
 */
export function threeColZoned(
  identityHtml: string,
  contactHtml: string,
  socialHtml: string,
  opts: { gap?: number; dividerColor?: string; valign?: "top" | "middle" } = {},
): string {
  const gap = opts.gap ?? 18;
  const valign = opts.valign ?? "top";
  const dividerColor = opts.dividerColor || "#e6e8ee";
  const zones = [identityHtml, contactHtml, socialHtml].filter((z) => z && z.trim());
  if (!zones.length) return "";
  const cells = zones
    .map((zone, i) => {
      const first = i === 0;
      const style = first
        ? `vertical-align:${valign};padding-right:${gap}px;`
        : `vertical-align:${valign};border-left:1px solid ${dividerColor};padding:0 ${gap}px;`;
      return td(zone, style);
    })
    .join("");
  return table(tr(cells));
}

/**
 * A bordered container with internal padded zones: an optional accent header,
 * a body, and an optional footer (e.g. a CTA strip). Each zone is dropped when
 * empty. The container owns an explicit light surface so it reads intentionally
 * on a dark inbox canvas rather than floating dark-on-dark.
 */
export function zonedCard(
  zones: { header?: string; body: string; footer?: string },
  opts: {
    accent?: string;
    headerBg?: string;
    headerColor?: string;
    bodyBg?: string;
    footerBg?: string;
    border?: string;
    radius?: number;
    maxWidth?: number;
  } = {},
): string {
  const radius = opts.radius ?? 8;
  const border = opts.border || "#e6e8ee";
  const bodyBg = opts.bodyBg || "#ffffff";
  const footerBg = opts.footerBg || "#f7f8fb";
  const maxWidth = opts.maxWidth ?? 480;
  const headerBg = opts.headerBg || opts.accent || "#1a1f2e";
  const headerColor = opts.headerColor || "#ffffff";
  const hasHeader = Boolean(zones.header && zones.header.trim());
  const hasFooter = Boolean(zones.footer && zones.footer.trim());
  const header = hasHeader
    ? `<div style="background:${headerBg};color:${headerColor};padding:10px 14px;border-radius:${radius}px ${radius}px 0 0;">${zones.header}</div>`
    : "";
  const topRadius = hasHeader ? "0" : `${radius}px`;
  const bottomRadius = hasFooter ? "0" : `${radius}px`;
  const bodyRadius = `${topRadius} ${topRadius} ${bottomRadius} ${bottomRadius}`;
  const body = `<div style="background:${bodyBg};border:1px solid ${border};${hasHeader ? "border-top:0;" : ""}${hasFooter ? "border-bottom:0;" : ""}padding:12px 14px;border-radius:${bodyRadius};">${zones.body}</div>`;
  const footer = hasFooter
    ? `<div style="background:${footerBg};border:1px solid ${border};border-top:0;padding:10px 14px;border-radius:0 0 ${radius}px ${radius}px;">${zones.footer}</div>`
    : "";
  return `<div style="font-family:${fontStack};max-width:${maxWidth}px;">${header}${body}${footer}</div>`;
}

/* ================================================================== *
 *  v2 STRUCTURAL PRIMITIVES (the "unexpected structures" rebuild)
 *
 *  These power the templates that break the name-top/contacts-stacked
 *  formula — Symmetric Wings, Masthead, Spine, Giant Monogram, Index,
 *  Full-Bleed, Contact Rail, Off-Center, Ticket Stub, Stacked Bands.
 *  Ported from docs/signature-premium-mockup-v3.html. Every one is
 *  email-safe (tables + inline styles, no flex/gradient/shadow/rotate)
 *  and driven by the single `accentColor` field so recoloring the whole
 *  kit is one value.
 * ================================================================== */

/**
 * A rendered surface's color set. A signature inherits the RECIPIENT'S inbox
 * canvas, which may be light or dark — independent of the app's own theme. Every
 * v2 template takes a `Surface` so the preview can show it on both. `on` is the
 * text color that sits on top of a filled accent block (always white here).
 */
export type Surface = {
  ink: string;
  sub: string;
  faint: string;
  rule: string;
  surface: string;
  band: string;
  on: string;
};

export const LIGHT_SURFACE: Surface = {
  ink: "#171a1f",
  sub: "#5b6270",
  faint: "#98a0ad",
  rule: "#e3e6ea",
  surface: "#ffffff",
  band: "#f7f8fb",
  on: "#ffffff",
};

export const DARK_SURFACE: Surface = {
  ink: "#f0f2f5",
  sub: "#aeb4bf",
  faint: "#7c828d",
  rule: "#33383f",
  surface: "#1c1f26",
  band: "#20242c",
  on: "#ffffff",
};

/**
 * On a dark inbox the raw brand hex can go muddy, so lighten it. Mirrors the
 * mockup's `accentFor()` — a small curated map with a graceful passthrough for
 * anything not listed (the user's arbitrary accentColor still renders, just
 * un-brightened, which is acceptable for a first pass).
 */
const DARK_ACCENT: Record<string, string> = {
  "#c2410c": "#fb923c",
  "#4338ca": "#a5b4fc",
  "#0f766e": "#5eead4",
  "#be123c": "#fda4af",
  "#0e1420": "#94a3b8",
  "#4f46e5": "#a5b4fc",
};

/** Resolve the accent to use for a given surface (brightened on dark). */
export function accentForSurface(accent: string, dark: boolean): string {
  if (!dark) return accent;
  return DARK_ACCENT[accent.toLowerCase()] || accent;
}

/**
 * Two-tone name: first name in ink, remaining names in the accent color.
 * "Ruthnie <span>Benoit</span>." Instant identity. (Lesson #3.)
 *
 * `enabled` (default true) is the per-signature `twoToneName` toggle — when
 * false the whole name renders in ink (the restrained single-color look).
 */
export function nameTwoTone(
  fullName: string,
  accent: string,
  ink: string,
  enabled = true,
): string {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  if (!enabled || parts.length === 1) return `<span style="color:${ink};">${parts.join(" ")}</span>`;
  const first = parts[0];
  const rest = parts.slice(1).join(" ");
  return `<span style="color:${ink};">${first}</span> <span style="color:${accent};">${rest}</span>`;
}

/**
 * The visual anchor, resolved logo → photo → monogram (Lesson #5 — the logo is
 * the STAR, monogram the fallback). `variant` controls the crop:
 *  - "circle": round photo / round-ish monogram (the classic avatar)
 *  - "square": edge-to-edge square photo (Full-Bleed)
 *  - "logoFill": on logo mode, a solid accent panel with the white-padded logo
 *    centered (used by Full-Bleed's colored panel).
 */
export function resolveAnchor(
  data: SignatureData,
  accent: string,
  opts: {
    size?: number;
    variant?: "circle" | "square";
    ring?: string;
    logoHeight?: number;
    monogramTextColor?: string;
  } = {},
): string {
  const size = opts.size ?? 72;
  const variant = opts.variant ?? "circle";
  const logo = getResolvedLogo(data);
  const photo = data.profileImageDataUrl;
  if (logo) {
    return logoImg(logo, data.company || data.fullName, {
      height: opts.logoHeight ?? Math.round(size * 0.7),
      radius: 10,
    });
  }
  if (photo) {
    if (variant === "square") {
      return `<img src="${photo}" alt="${data.fullName}" width="${size}" height="${size}" style="display:block;" />`;
    }
    const ring = opts.ring ? `border:3px solid ${opts.ring};` : "";
    return `<img src="${photo}" alt="${data.fullName}" width="${size}" height="${size}" style="display:block;border-radius:${Math.round(size / 2)}px;${ring}" />`;
  }
  const radius = variant === "square" ? 12 : Math.round(size / 2);
  return monogramTile(data.fullName, {
    size,
    color: accent,
    radius,
    textColor: opts.monogramTextColor,
  });
}

/** True when the resolved anchor will be a logo (used to decide colored-panel modes). */
export function hasLogo(data: SignatureData): boolean {
  return Boolean(getResolvedLogo(data));
}

/**
 * A small anchor sized to sit ON a saturated accent band (Stacked Bands' top
 * band). Photo gets a white ring; a logo gets a white pad; a monogram renders
 * as white initials (no tile — it's already on the color). Returns "" only if
 * there is genuinely nothing (never — the monogram always renders).
 */
export function headshotOrLogoBadge(
  data: SignatureData,
  accent: string,
  size: number,
): string {
  const logo = getResolvedLogo(data);
  const photo = data.profileImageDataUrl;
  if (logo) return logoImg(logo, data.company || data.fullName, { height: Math.round(size * 0.55), radius: 6 });
  if (photo) {
    return `<img src="${photo}" alt="${data.fullName}" width="${size}" height="${size}" style="display:block;border-radius:${Math.round(size / 2)}px;border:2px solid #ffffff;" />`;
  }
  // Monogram already on color: white outline circle, no fill.
  void accent;
  const ini = initials(data.fullName);
  return `<div style="display:inline-block;width:${size}px;height:${size}px;line-height:${size - 4}px;text-align:center;border:2px solid rgba(255,255,255,.85);border-radius:${Math.round(size / 2)}px;color:#ffffff;font-family:${fontStack};font-size:${Math.round(size * 0.38)}px;font-weight:700;">${ini}</div>`;
}

type ContactRowsOpts = {
  color: string;
  iconColor: string;
  fontSize?: number;
  align?: "left" | "right";
  includeAddress?: boolean;
  rowGap?: number;
};

/**
 * Contact rows laid as an icon + value table, like `contactGrid`, but with full
 * control over alignment (right-aligned wings), gap, and colors — so the
 * structural templates can place contact wherever the layout demands. On
 * `align:"right"` the value sits BEFORE the icon so the column reads inward
 * toward a centered identity (the Wings layout).
 */
export function contactRows(data: SignatureData, opts: ContactRowsOpts): string {
  const { color, iconColor } = opts;
  const fontSize = opts.fontSize ?? 12;
  const align = opts.align ?? "left";
  const includeAddress = opts.includeAddress ?? true;
  const iconSize = Math.max(13, Math.round(fontSize * 1.1));
  const gap = opts.rowGap ?? 7;
  const rows: { icon: ContactIconKey; value: string }[] = [];
  if (data.email) rows.push({ icon: "email", value: emailLink(data.email, `color:${color};`) });
  if (data.phone) rows.push({ icon: "phone", value: telLink(data.phone, `color:${color};`) });
  if (data.website) rows.push({ icon: "web", value: link(data.website, data.website, `color:${color};`) });
  if (includeAddress && data.address) rows.push({ icon: "address", value: data.address });
  if (!rows.length) return "";
  const body = rows
    .map((r, i) => {
      const last = i === rows.length - 1;
      const pb = last ? 0 : gap;
      const valCell = `<td style="color:${color};font-family:${fontStack};font-size:${fontSize}px;white-space:nowrap;vertical-align:middle;padding-bottom:${pb}px;${align === "right" ? "padding-right:8px;" : ""}">${r.value}</td>`;
      const iconCell = `<td style="line-height:0;vertical-align:middle;padding-bottom:${pb}px;${align === "right" ? "" : "padding-right:8px;"}">${contactIcon(r.icon, iconColor, iconSize)}</td>`;
      return align === "right" ? `<tr>${valCell}${iconCell}</tr>` : `<tr>${iconCell}${valCell}</tr>`;
    })
    .join("");
  const tableStyle = align === "right" ? "margin-left:auto;" : "";
  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;${tableStyle}">${body}</table>`;
}
