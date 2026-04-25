import type { SignatureData } from "@/types/signature";
import { join } from "./renderSignatureHtml";

/** Default plain-text rendering used by templates as a fallback. */
export function renderDefaultPlainText(data: SignatureData): string {
  const lines: string[] = [];
  const namePronouns = join([data.fullName, data.pronouns && `(${data.pronouns})`], " ");
  if (namePronouns) lines.push(namePronouns);
  const titleCompany = join([data.jobTitle, data.company], " · ");
  if (titleCompany) lines.push(titleCompany);
  if (data.tagline) lines.push(data.tagline);
  if (lines.length) lines.push("");

  if (data.email) lines.push(`Email: ${data.email}`);
  if (data.phone) lines.push(`Phone: ${data.phone}`);
  if (data.website) lines.push(`Web:   ${data.website}`);
  if (data.bookingLink) lines.push(`Book:  ${data.bookingLink}`);
  if (data.address) lines.push(`Addr:  ${data.address}`);

  const social = [
    data.linkedin && `LinkedIn: ${data.linkedin}`,
    data.twitter && `X: ${data.twitter}`,
    data.instagram && `Instagram: ${data.instagram}`,
    data.facebook && `Facebook: ${data.facebook}`,
    data.youtube && `YouTube: ${data.youtube}`,
    data.tiktok && `TikTok: ${data.tiktok}`,
  ].filter(Boolean) as string[];
  if (social.length) {
    lines.push("");
    lines.push(...social);
  }

  if (data.ctaLabel && data.ctaUrl) {
    lines.push("");
    lines.push(`${data.ctaLabel}: ${data.ctaUrl}`);
  }

  if (data.disclaimer) {
    lines.push("");
    lines.push(data.disclaimer);
  }

  return lines.join("\n").trim();
}

/** Strips HTML tags into a plain-text approximation. */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
