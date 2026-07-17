// Signature Studio's adapter for the shared brand-core seed (Mechanism 1 of
// docs/KIT-SUITE-CONNECT-PLAN.md). Maps a generic BrandCore — the four facts
// that ride in a ?seed= URL — onto SignatureData, so a signature opens with the
// client's company, tagline, logo, and accent already filled instead of blank.
// Additive: no seed = today's behavior. Kept out of the vendored (tool-agnostic)
// module.
import type { BrandCore } from "./opsette-kit-link";
import type { SignatureData } from "@/types/signature";

// Normalize a seed hex to the "#RRGGBB" the accent color expects.
function normalizeHex(hex: string): string | null {
  let h = hex.trim();
  if (!h) return null;
  if (!h.startsWith("#")) h = `#${h}`;
  if (/^#[0-9a-fA-F]{3}$/.test(h)) {
    h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  }
  return /^#[0-9a-fA-F]{6}$/.test(h) ? h.toLowerCase() : null;
}

function pickAccent(core: BrandCore): string | null {
  const colors = core.colors ?? [];
  const primary =
    colors.find((c) => c.role === "primary" || c.role === "base") ?? colors[0];
  return primary ? normalizeHex(primary.hex) : null;
}

/**
 * Map a decoded brand core onto a partial SignatureData. Brand name → company,
 * tagline → tagline, primary color → accentColor, a small inlined logo →
 * logoDataUrl. Returns null when nothing maps.
 */
export function seedToSignature(core: BrandCore): Partial<SignatureData> | null {
  const patch: Partial<SignatureData> = {};
  if (core.name) patch.company = core.name;
  if (core.tagline) patch.tagline = core.tagline;
  const accent = pickAccent(core);
  if (accent) patch.accentColor = accent;
  if (core.logo && core.logo.startsWith("data:")) patch.logoDataUrl = core.logo;
  return Object.keys(patch).length > 0 ? patch : null;
}
