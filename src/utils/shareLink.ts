import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { z } from "zod";
import { emptySignatureData, type SignatureData } from "@/types/signature";
import { sanitizeSignatureData } from "./sanitizeSignatureData";

export type ShareMode = "kit" | "full";

export type SharePayload = {
  v: 1;
  mode: ShareMode;
  t: string; // templateId
  d: Partial<SignatureData>;
  stripped?: boolean; // logoDataUrl was stripped before encoding
};

const envelopeSchema = z.object({
  v: z.literal(1),
  mode: z.enum(["kit", "full"]),
  t: z.string().min(1).max(120),
  d: z.record(z.string(), z.unknown()),
  stripped: z.boolean().optional(),
});

/**
 * Fields shared in "brand kit" mode — company-level branding only.
 * Personal fields (name, photo, contact) are blanked so each recipient adds their own.
 */
export const SHARED_FIELDS = [
  "company",
  "tagline",
  "logoUrl",
  "logoDataUrl",
  "accentColor",
  "address",
  "website",
  "disclaimer",
  "ctaLabel",
  "ctaUrl",
  "linkedin",
  "twitter",
  "instagram",
  "facebook",
  "youtube",
  "tiktok",
] as const satisfies readonly (keyof SignatureData)[];

export const PERSONAL_FIELDS = [
  "fullName",
  "pronouns",
  "jobTitle",
  "email",
  "phone",
  "bookingLink",
  "profileImageDataUrl",
] as const satisfies readonly (keyof SignatureData)[];

/** Browsers + Outlook handle ~2k cleanly; refuse to generate beyond this. */
export const URL_HARD_CEILING = 6500;

export function buildPayload(opts: {
  mode: ShareMode;
  templateId: string;
  data: SignatureData;
  stripLogoData?: boolean;
}): SharePayload {
  const { mode, templateId, data, stripLogoData } = opts;
  let d: Partial<SignatureData>;
  let stripped = false;

  if (mode === "kit") {
    d = {};
    for (const k of SHARED_FIELDS) {
      const v = data[k];
      if (typeof v === "string" && v.length > 0) {
        d[k] = v;
      }
    }
  } else {
    // full template — copy everything non-empty
    d = {};
    for (const k of Object.keys(data) as (keyof SignatureData)[]) {
      const v = data[k];
      if (typeof v === "string" && v.length > 0) {
        d[k] = v as never;
      }
    }
  }

  if (stripLogoData && d.logoDataUrl) {
    delete d.logoDataUrl;
    stripped = true;
  }

  return { v: 1, mode, t: templateId, d, stripped: stripped || undefined };
}

export function encodeShare(payload: SharePayload): string {
  const json = JSON.stringify(payload);
  const compressed = compressToEncodedURIComponent(json);
  return compressed;
}

export function decodeShare(token: string): SharePayload | null {
  const json = decompressFromEncodedURIComponent(token);
  if (!json) return null;
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return null;
  }
  const parsed = envelopeSchema.safeParse(raw);
  if (!parsed.success) return null;
  // Sanitize the data payload through the same path the localStorage draft uses.
  const sanitized = sanitizeSignatureData({ ...emptySignatureData, ...(parsed.data.d as Partial<SignatureData>) });
  // Keep only fields that were actually present in the payload, so callers can
  // distinguish "shared blank" from "not shared".
  const presentKeys = new Set(Object.keys(parsed.data.d));
  const d: Partial<SignatureData> = {};
  for (const k of presentKeys) {
    if (k in sanitized) d[k as keyof SignatureData] = sanitized[k as keyof SignatureData] as never;
  }
  return {
    v: 1,
    mode: parsed.data.mode,
    t: parsed.data.t,
    d,
    stripped: parsed.data.stripped,
  };
}

export function buildShareUrl(payload: SharePayload, origin?: string): string {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  const path = (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL
    ? String(import.meta.env.BASE_URL)
    : "/"
  ).replace(/\/$/, "");
  return `${base}${path}/share?d=${encodeShare(payload)}`;
}

export function estimateUrlLength(payload: SharePayload, origin?: string): number {
  return buildShareUrl(payload, origin).length;
}

export type UrlSizeBand = "ok" | "warn" | "tight" | "over";

export function classifyUrlLength(len: number): UrlSizeBand {
  if (len > URL_HARD_CEILING) return "over";
  if (len > 2000) return "tight";
  if (len > 1500) return "warn";
  return "ok";
}

/**
 * Apply a decoded share payload onto a fresh SignatureData base.
 * For kit mode, personal fields are explicitly blanked so the recipient fills them in.
 * For full mode, missing fields fall back to empty defaults.
 */
export function applySharePayload(payload: SharePayload): SignatureData {
  const base: SignatureData = { ...emptySignatureData };
  for (const [k, v] of Object.entries(payload.d)) {
    if (k in base && typeof v === "string") {
      (base as Record<string, string>)[k] = v;
    }
  }
  if (payload.mode === "kit") {
    for (const f of PERSONAL_FIELDS) {
      (base as Record<string, string>)[f] = "";
    }
  }
  return sanitizeSignatureData(base);
}
