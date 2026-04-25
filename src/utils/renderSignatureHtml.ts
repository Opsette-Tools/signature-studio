import type { SignatureData } from "@/types/signature";
import { normalizeUrl } from "./sanitizeSignatureData";

/**
 * Helpers for building email-safe signature HTML.
 * All template renderers in src/data/templates use these.
 *
 * INLINE STYLES are intentional here — email clients require them.
 * Do NOT use inline styles in app UI components.
 */

export const fontStack =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

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

/** Joins parts with separator, dropping empty values */
export function join(parts: (string | false | null | undefined)[], sep = " · "): string {
  return parts.filter((v): v is string => Boolean(v && v.trim())).join(sep);
}

export function socialIconsRow(
  data: SignatureData,
  opts: { color?: string; size?: number } = {},
): string {
  const color = opts.color || "#5b6478";
  const size = opts.size || 18;
  const items: { url: string; label: string }[] = [];
  if (data.linkedin) items.push({ url: data.linkedin, label: "in" });
  if (data.twitter) items.push({ url: data.twitter, label: "X" });
  if (data.instagram) items.push({ url: data.instagram, label: "ig" });
  if (data.facebook) items.push({ url: data.facebook, label: "fb" });
  if (data.youtube) items.push({ url: data.youtube, label: "yt" });
  if (data.tiktok) items.push({ url: data.tiktok, label: "tt" });
  if (!items.length) return "";
  return items
    .map(
      (i) =>
        `<a href="${normalizeUrl(i.url)}" style="display:inline-block;margin-right:6px;width:${size}px;height:${size}px;line-height:${size}px;text-align:center;border-radius:${Math.round(size / 4)}px;background:${color};color:#fff;font-family:${fontStack};font-size:${Math.round(size * 0.55)}px;font-weight:700;text-decoration:none;">${i.label}</a>`,
    )
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
