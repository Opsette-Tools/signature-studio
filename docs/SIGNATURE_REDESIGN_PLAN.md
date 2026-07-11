> # ⛔ DEAD — DO NOT FOLLOW THIS DOC
> **Superseded on 2026-07-11 by [`SIGNATURE_REBUILD_V2.md`](./SIGNATURE_REBUILD_V2.md).** This plan produced "parlor tricks" (bigger fonts, more whitespace) and its per-template verdicts are obsolete. The real rebuild — twelve new unexpected structures + Ruthnie's full triage of the current 21 — lives in `SIGNATURE_REBUILD_V2.md`. Kept only for provenance. **Build from V2, not this.**

---

# Signature Studio — Template Redesign Plan

**Status:** Ready to build. This doc is self-sufficient — a working agent should pick it up and execute without further input from Ruthnie. Where a judgment call arises, the rule is: **pick the structurally stronger, more distinct option.** Do not ask which shade/spacing/font — exercise taste.

**Author context:** A prior session "redesigned" templates by enlarging fonts and adding whitespace. Ruthnie correctly called this "parlor tricks." **That is the failure mode to avoid.** The goal is NOT to polish the existing stacked templates — it is to give the library real *structural variety* so it reads as a designed, enterprise-grade set worth replacing a paid subscription (WiseStamp/Gimmio/Newoldstamp) for.

---

## 1. The core diagnosis (why the current library feels plain)

Of 41 templates, **~22 use the same architecture**: a vertical stack of `name → (rule) → title → one comma-separated contact line`. They differ only in font size, color, and a divider. That single weak architecture, repeated ~22 ways, is why the library feels like "41 takes on the same thing" and why enlarging fonts didn't help.

Research (Designmodo, Exclaimer, Newoldstamp, WiseStamp) is consistent: richness comes from **layout architecture**, not typography. The strong architectures are few:

- **Two-column + vertical divider** — visual element (photo/logo/monogram) left, contact right, thin vertical rule between. The dominant professional structure.
- **Three-column zoned** — `identity | contact | social`, each in its own zone. Handles dense data without clutter. **We currently have ZERO of these.**
- **Card with internal structure** — header zone + body zone + optional footer CTA inside a bordered/tinted container.
- **Footer/banner composite** — contact body with a company strip or CTA docked at bottom (not interrupting flow).

And the non-negotiable rules that make ANY architecture not-plain:

1. **Contact info grouped into zones or labeled rows — NEVER one `email · phone · web` line.** This single line is the #1 plainness culprit across the current library. Replace it everywhere with either a labeled grid (E / P / W / Address in aligned rows) or zoned placement.
2. **Dividers as structure** — vertical rules between columns, hairlines between blocks. Structural, not decorative.
3. **Use the full data model.** We collect `tagline`, `bookingLink`, `disclaimer`, `pronouns`, `address`, 6 socials, `ctaLabel/ctaUrl` — most templates show almost none of it. Rich signatures fill zones with real fields.
4. **Unified social icons** via the existing `socialIconsRow()` helper (consistent size/shape/color). Most templates don't even call it.
5. **≤600px wide, 2–3 colors max.** (Library is already fine here.)

---

## 2. Hard constraints (do not violate)

- **NO uploaded/base64 images.** Image upload was deliberately removed (standalone tool, no host; base64 bloats to 10KB+ and Gmail clips it). Images come ONLY from pasted URLs (`logoUrl`, and `profileImageDataUrl` now holds a URL too). **Every template MUST look complete and rich with NO image** — use `monogramTile()` / `avatarOrMonogram()` as the image-free visual anchor. A template that is blank or weak without an image is a failed template.
- **Email-safe HTML only.** Table-based layout via the `table()`/`tr()`/`td()`/`headerBar()` helpers in `src/utils/renderSignatureHtml.ts`. **NO `display:flex`** (Gmail strips its sub-properties), **NO `linear-gradient`**, **NO `box-shadow`/`transform`/`object-fit`** (all stripped by Gmail). Inline styles only. Use `&rarr;`/`&nbsp;` entities, not raw glyphs; avoid emoji-as-icons.
- **Keep all 7 categories** (minimal, modern, corporate, bold, creative, compact, promotional). Do not merge them. Each category expresses the shared primitives in its own vibe.
- **Preserve template `id`s** for any template that is kept or rebuilt-in-place, so saved signatures and the default (`modern-card-style`) don't break. Cutting a template is fine; silently changing a kept one's id is not.
- **Typecheck continuously** (`npx tsc --noEmit`). Do not run the full prod build until the end.

---

## 3. Strategy: lean first, then grow

Ruthnie's directive: **slash the library to a strong core now, grow it back later.** Strip anything "not worth its keep" (the "I could just write that myself" templates). Get the base primitives genuinely strong, ship the lean set for review, THEN add variations off the strong primitives.

**Phase 1 (this build): cut to a lean, strong core + build the missing primitives.**
**Phase 2 (later session): grow variations off the proven primitives.**

---

## 4. The base primitives to build (Phase 1)

These are reusable layout helpers, added to `renderSignatureHtml.ts`, that templates compose. Building these FIRST is the whole point — they're what makes the redesign structural instead of cosmetic. `headerBar()` already exists; add:

- **`twoColLeftRight(leftHtml, rightHtml, opts)`** — table, left cell (fixed width, the visual anchor: monogram/photo-URL/logo), right cell (content), optional vertical divider rule between (`border-left` on right cell). The workhorse.
- **`contactGrid(data, opts)`** — labeled aligned rows (E / P / W / Address), each label in a fixed-width muted cell, value beside it. This REPLACES the single contact line. Returns a `<table>`.
- **`threeColZoned(identityHtml, contactHtml, socialHtml, opts)`** — three table cells with divider rules between. For corporate/dense templates.
- **`zonedCard({ header, body, footer }, opts)`** — bordered container with internal padded zones and optional accent header / footer CTA.

Each primitive must render gracefully when a zone is empty (drop the cell, don't leave a gap).

---

## 5. Per-template verdict (all 41)

Legend: **KEEP** (strong as-is, leave alone) · **REBUILD** (good concept, weak execution — rebuild on a primitive, keep id) · **CUT** (not worth its keep — remove) · **NEW** (add net-new structure).

### Minimal (3) → keep 2
- `minimal-clean-name-title` — **CUT.** "Just the essentials, one contact line." This is the literal "I could write it myself" template.
- `minimal-simple-divider` — **KEEP.** Refined serif version is good; the one strong minimal.
- `minimal-compact-contact` — **REBUILD** on `contactGrid` (it already gestures at labels — make it the proper labeled-grid minimal).

### Modern (8) → keep/rebuild 5, cut 3
- `modern-card-style` — **KEEP** (default template; solid card). Ensure contact uses `contactGrid`, not the line.
- `modern-left-accent-bar` — **REBUILD** on `twoColLeftRight` with the accent bar as the left rule + `contactGrid` right.
- `modern-rounded-logo` — **KEEP** (logo/monogram left, contact right — already two-column).
- `modern-two-column` — **REBUILD** as the flagship `twoColLeftRight` + vertical divider + `contactGrid`. This is THE workhorse; make it excellent. (Currently uses emoji icons — already partly fixed; finish it.)
- `modern-social-row` — **CUT.** Redundant with other social-bearing templates; weak stacked.
- `modern-photo-left-divider` — **KEEP** (photo/monogram + vertical divider is a strong primitive already).
- `modern-monogram-tile` — **KEEP** (image-free anchor done right — exactly the no-image strategy).
- `modern-horizontal-accent` — **CUT.** Stacked accent line; low distinctiveness now that table-fixed.

### Corporate (7) → keep/rebuild 5, cut 2
- `corporate-executive` — **KEEP** (refined serif premium; good).
- `corporate-legal` — **KEEP** (only template using `disclaimer`; genuinely useful niche). Group contact via `contactGrid`.
- `corporate-consultant` — **REBUILD** on `twoColLeftRight`; emphasize `bookingLink` CTA button.
- `corporate-team-member` — **KEEP.** Ruthnie named this a good one. Leave it.
- `corporate-company-footer` — **REBUILD** as `zonedCard` (company header zone + body + CTA footer).
- `corporate-name-plate` — **CUT.** Reversed name plate overlaps Two-Tone Header conceptually; weaker of the two.
- `corporate-two-tone-header` — **NEW role: promote to the `threeColZoned` corporate flagship** (identity | contact | social). This becomes our first three-column. Keep id.

### Bold (5) → keep 3, cut 2
- `bold-big-name` — **KEEP** but REVERT last session's enlargement if it reads as a parlor trick; keep the accent-bar structure, restrained scale. (Ruthnie said she liked Big Name *before*.)
- `bold-color-stripe` — **KEEP** (table-fixed banner; distinct).
- `bold-high-contrast` — **KEEP** (dark card; genuinely different surface).
- `bold-block-header` — **CUT.** Stacked block, low distinctiveness.
- `bold-all-caps-spaced` — **CUT.** Typographic gimmick, "write it myself" tier.

### Creative (7) → keep/rebuild 4, cut 3
- `creative-friendly-creator` — **KEEP** (monogram + tagline two-column; warm flagship).
- `creative-personal-brand` — **REBUILD** on `twoColLeftRight`; make tagline + pill CTA the structure.
- `creative-portfolio` — **KEEP** (website-CTA focus is a real distinct use).
- `creative-casual-service` — **CUT.** Overlaps Friendly Creator + Personal Brand; weakest of the three.
- `creative-script-sign-off` — **KEEP** (script sign-off is genuinely distinct; cursive is decorative-but-fine).
- `creative-sticker-badge` — **CUT.** Dashed-circle badge reads gimmicky/amateur, not premium.
- `creative-polaroid` — **CUT.** Without box-shadow/rotate (Gmail-stripped) the "polaroid" charm is gone; it's just a bordered photo. Not worth its keep.

### Compact (5) → keep 3, cut 2
- `compact-inline-pill` — **KEEP** (genuinely tiny/distinct).
- `compact-vertical-stripe` — **KEEP** (Ruthnie OK'd it; clean compact).
- `compact-bracket-frame` — **KEEP** (editorial mono; distinct).
- `compact-boxed-initials` — **CUT.** Overlaps Inline Pill + Vertical Stripe.
- `compact-mobile-reply` (Mobile Tap) — **KEEP** (rebuilt this session into a real one-tap mobile sig).

### Promotional (6) → keep/rebuild 4, cut 2
- `promotional-book-call` — **KEEP** (booking CTA; uses `bookingLink`).
- `promotional-visit-website` — **CUT.** Near-duplicate of Book a Call with a different URL field.
- `promotional-download-resource` — **CUT.** Same CTA-button pattern, third variation; redundant.
- `promotional-newsletter` — **KEEP** (distinct dashed subscribe card).
- `promotional-banner-image` — **REBUILD** as `zonedCard` banner driven by tagline/CTA text (image optional via URL), not image-dependent.
- `promotional-event-promo` — **KEEP** (date-badge event block; distinct structure).

### Net result of Phase 1
- **41 → ~26 templates.** 15 cut. Of the ~26: several rebuilt on real primitives, a handful net-stronger (the new three-column + zoned cards).
- The library now has genuine architectural range: stacked, two-column+divider, three-column-zoned, card-zoned, banner-composite, compact, inline — instead of ~22 stacks.

---

## 6. Build sequence (do in this order)

1. **Add the 4 primitives** to `renderSignatureHtml.ts` (`twoColLeftRight`, `contactGrid`, `threeColZoned`, `zonedCard`). Typecheck.
2. **Execute all CUTs** — remove the 15 template objects + their entries in each category's export array. Typecheck (catches orphaned imports). Verify no saved-signature default breaks (`modern-card-style` is kept).
3. **Execute REBUILDs**, one category at a time, composing the primitives. After each category: typecheck + eyeball in the running app (port 8114).
4. **Global pass:** replace EVERY remaining single-line contact (`join([email·phone·web])`) with `contactGrid` or zoned placement. This is the highest-leverage change in the whole plan.
5. **Verify** every kept/rebuilt template renders well with (a) full data, (b) NO image (monogram fallback), (c) the demo data from "Try demo". Paste 2–3 into a real Gmail compose to confirm no clipping/breakage.
6. Typecheck clean, run tests (`npx vitest run`), THEN full build, THEN commit per Ruthnie's cadence (build → she verifies → go → build → commit → push).

---

## 6b. Dark-mode preview (required — not optional polish)

The preview surfaces (`.signature-preview`, `.template-strip__thumb`, `.template-card__preview`) are currently hardcoded white. This is **wrong**, and Ruthnie flagged it specifically. An email signature has no background of its own — it inherits the email client's canvas. In a recipient's **dark-mode inbox the canvas is dark**, and our signatures use hardcoded dark text (`#1a1f2e`) that **disappears on a dark background**. An always-white preview hides this failure.

Required work (do as part of this redesign, not after):
1. **Add a light/dark canvas toggle to the preview** (a small segmented control on the preview card) so the user can see their signature on BOTH a white and a dark canvas — because both is how recipients will actually see it.
2. **Audit every kept/rebuilt template against a dark canvas.** Dark-on-dark text must not vanish. This is the real, hard signature-design problem (it's why WiseStamp pushes transparent-PNG logos). Acceptable approaches, in order of preference:
   - Design templates so text/structure reads on BOTH canvases (e.g. avoid relying on pure `#1a1f2e`; the existing dark `bold-high-contrast` template already carries its own dark surface and is the model for "owns its background").
   - For templates that genuinely need a light surface, give the signature its own explicit light container (a bordered white card) so it's intentional on a dark canvas rather than floating dark-on-dark.
3. The thumbnails/gallery can stay on a neutral light surface for browsing, but the MAIN preview must support the dark-canvas view.

Do NOT just invert the preview with the app theme — app theme ≠ recipient's inbox theme. This is a dedicated canvas toggle on the preview, independent of the app's light/dark mode.

## 7. Definition of done (the bar)

The redesign succeeds if, scrolling the gallery, you see **visibly distinct layouts** (cards, two-column splits, three-column zones, framed, banner) — NOT 26 takes on a stacked name+contact. Each kept template must look complete and intentional **with no image**, use **more of the data model than just name/title/one-contact-line**, and survive a real Gmail paste. If a template can't clear that bar, cut it — lean and strong beats numerous and plain.
