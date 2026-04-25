import type { SignatureData } from "@/types/signature";

const URL_REGEX = /^https?:\/\//i;

export function normalizeUrl(input: string): string {
  const v = (input || "").trim();
  if (!v) return "";
  if (URL_REGEX.test(v)) return v;
  if (v.startsWith("mailto:") || v.startsWith("tel:")) return v;
  return `https://${v}`;
}

export function escapeHtml(input: string): string {
  return (input || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function sanitizeSignatureData(input: Partial<SignatureData>): SignatureData {
  const trim = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  return {
    fullName: trim(input.fullName),
    pronouns: trim(input.pronouns),
    jobTitle: trim(input.jobTitle),
    company: trim(input.company),
    tagline: trim(input.tagline),
    email: trim(input.email),
    phone: trim(input.phone),
    website: trim(input.website),
    bookingLink: trim(input.bookingLink),
    address: trim(input.address),
    logoUrl: trim(input.logoUrl),
    logoDataUrl: typeof input.logoDataUrl === "string" ? input.logoDataUrl : "",
    profileImageDataUrl:
      typeof input.profileImageDataUrl === "string" ? input.profileImageDataUrl : "",
    linkedin: trim(input.linkedin),
    instagram: trim(input.instagram),
    facebook: trim(input.facebook),
    youtube: trim(input.youtube),
    twitter: trim(input.twitter),
    tiktok: trim(input.tiktok),
    ctaLabel: trim(input.ctaLabel),
    ctaUrl: trim(input.ctaUrl),
    disclaimer: trim(input.disclaimer),
    accentColor: trim(input.accentColor) || "#4f46e5",
  };
}

export function getResolvedLogo(data: SignatureData): string {
  return data.logoUrl || data.logoDataUrl || "";
}

export function hasAnyContent(data: SignatureData): boolean {
  return Boolean(
    data.fullName ||
      data.jobTitle ||
      data.company ||
      data.email ||
      data.phone ||
      data.website,
  );
}

export function hasAnySocial(data: SignatureData): boolean {
  return Boolean(
    data.linkedin ||
      data.instagram ||
      data.facebook ||
      data.youtube ||
      data.twitter ||
      data.tiktok,
  );
}
