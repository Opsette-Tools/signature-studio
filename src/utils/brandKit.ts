// ── Brand Kit interop (see opsette-tools.github.io/docs/BRAND-KIT-INTEROP-CONTRACT.md) ──
// Signature Studio is the `signature` source in the shared clipboard contract.
// The same JSON shape does triple duty: (1) export to Brand Board, (2) reopen
// this app's own export to revise a saved signature, (3) archive in a Brand
// Board project file. Version + type + source let the consumer route/validate a
// pasted blob. Mechanism is copy-JSON → paste — no backend.

import { z } from "zod";
import type { SignatureData } from "@/types/signature";
import type { SignatureTemplate } from "@/types/template";
import { sanitizeSignatureData } from "./sanitizeSignatureData";

export type SignaturePayload = {
  type: "signature";
  v: 1;
  source: "opsette";
  data: {
    templateId: string;
    signature: SignatureData;
    // The self-contained email HTML (inline styles, data-URI icons, base64
    // logo/photo). Carried so Brand Board can render a faithful preview in an
    // <iframe srcdoc> WITHOUT importing all 21 templates. `templateId` +
    // `signature` are carried alongside it for re-rendering / reopening.
    html: string;
  };
};

// Serialize the current signature into the shared Brand Kit shape. All the data
// already exists at the CopyPanel boundary — this is a pure mapping, no model
// changes. `renderHtml` is the same call CopyPanel already makes to preview.
export function toKitJson(template: SignatureTemplate, data: SignatureData): SignaturePayload {
  return {
    type: "signature",
    v: 1,
    source: "opsette",
    data: {
      templateId: template.id,
      signature: { ...data },
      html: template.renderHtml(data),
    },
  };
}

// Only the fields the reopen path actually restores need to survive validation:
// the templateId and the signature data. `html` is derived on export and
// re-derived on reopen, so it is optional/ignored here.
const payloadSchema = z.object({
  type: z.literal("signature"),
  v: z.literal(1),
  source: z.literal("opsette"),
  data: z.object({
    templateId: z.string().min(1).max(120),
    signature: z.record(z.string(), z.unknown()),
    html: z.string().optional(),
  }),
});

export type ReopenResult = {
  templateId: string;
  signature: SignatureData;
};

// Parse a pasted blob back into a reopenable signature — used by the reopen
// path. Returns null (never throws) for anything that isn't a valid Opsette
// signature blob, so the caller can show a friendly "that's not a signature"
// message. Strict on the envelope (type/v/source), and the signature data is
// run through the SAME sanitizer the share link and localStorage draft use, so
// a reopened signature is exactly as safe as a freshly-typed one.
export function fromKitJson(raw: string): ReopenResult | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.trim());
  } catch {
    return null;
  }
  const result = payloadSchema.safeParse(parsed);
  if (!result.success) return null;

  // sanitizeSignatureData fills every field from defaults, so a partial or
  // messy `signature` blob still produces a complete, safe SignatureData.
  return {
    templateId: result.data.data.templateId,
    signature: sanitizeSignatureData(result.data.data.signature as Partial<SignatureData>),
  };
}
