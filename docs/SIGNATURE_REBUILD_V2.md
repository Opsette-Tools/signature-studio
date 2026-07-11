# Signature Studio — Rebuild v2 (the real one)

**Status:** Ready to build. Self-sufficient — a working agent should execute the whole rebuild from this doc without re-deriving anything.
**Created:** 2026-07-11 by Ruthnie + planning session.
**Supersedes:** `SIGNATURE_REDESIGN_PLAN.md` in this same folder is **DEAD**. Do NOT follow it. It produced "parlor tricks" (enlarged fonts, more whitespace) and its per-template verdicts are obsolete. This doc replaces it entirely.

**Context — why this matters:** These signature templates are the flagship deliverable in Ruthnie's Fiverr Brand Starter Kit gig. She judged the current 21 templates as "picked from the garbage" / "hit enter with no styling intention." This rebuild is the differentiator for a real, paying gig. Build to a premium, shippable bar — not a demo.

---

## 0. The three reference mockups (LOOK AT THESE FIRST)

All three are published artifacts. Open them and study the rendered output — they are the visual source of truth. Every new structure below corresponds to a card in v3.

- **v3 — Unexpected Structures (THE ONE TO BUILD):** https://claude.ai/code/artifact/27ddbd20-06e7-4b14-9ecf-a25c35a2685b
- v2 — Bold/branded track (colored icons, logo, business-card containers): https://claude.ai/code/artifact/a04bc317-7635-485e-994b-e73c7c97ee08
- v1 — first pass (mostly superseded; kept for provenance): https://claude.ai/code/artifact/3d41c6f8-4b3e-4fcb-844a-fc41e0d5e4ce

The **full self-contained HTML source** for the v3 mockup is committed right next to this doc: **`docs/signature-premium-mockup-v3.html`**. It holds all twelve render functions, the colored-icon set (`SOC`), the two-tone name helper, and the logo/photo/monogram anchor logic. Port the render functions from it — they are already email-safe (tables, inline styles, no flex/gradient/shadow/transform) and already use the real DeeBuilt data. This file IS the reference implementation.

---

## 1. The hard-won lessons (WHY the old ones failed — do not repeat)

These are the rules the current library violates. They are the whole reason it looks cheap. Bake every one in:

1. **Break the wireframe.** The #1 failure of the current library: every template is name-top → title-under → contacts-stacked → icons-to-the-side → button-at-bottom. Everything lands where you'd expect. The new templates win by putting elements in **unexpected places** (contact wings on both sides, name as a full-width masthead, a spine down the middle, contact as a top rail). "Two columns vs three columns" is NOT variety — *placement* is variety.
2. **Colored brand social icons.** Real Instagram pink (#E4405F), LinkedIn blue (#0A66C2), Facebook (#1877F2), YouTube red (#FF0000). This is "the pop." The current monochrome-everything look reads flat. (Keep a monochrome option available per-template for restrained/corporate looks, but default to brand color.)
3. **Two-tone name.** First name in ink, last name in the brand color (`Ruthnie <span style="color:accent">Benoit</span>`). Instant identity. Currently every name is one flat color.
4. **Solid, saturated color — never timid tints.** The current templates (and mockup v2) used washed-out accent tints that read "watered down." Use the full-strength brand hex for color blocks, bars, and the last name. A solid rust `#c2410c` block, not a pale `#fdf0e9` wash.
5. **Logo is the STAR, monogram is the FALLBACK.** This is the OPPOSITE of how the app is built today. The current templates lead with a monogram tile and treat the logo as optional. Flip it: the anchor should render the user's logo when present, fall back to a photo, then fall back to a monogram. The Fiverr signatures pop *because they show the brand logo.*
6. **Every template must be complete with NO image.** Still true (image upload is URL-only, no host). A template that's blank without a photo is a failed template. The monogram fallback and the type-driven layouts (Masthead, Directory, Spine) carry themselves with zero image.
7. **The coherence hook (the real differentiator).** The signature's brand color and font should be able to come from the rest of the kit (Palette Studio color, the kit's font pair). A signature that visibly matches the client's Digital Card / QR / palette is worth more than a prettier standalone one. Wire `accentColor` (already in `SignatureData`) as the single color driver across all new templates so recoloring the whole set is one field. (Font-from-kit is a later enhancement; don't block on it.)

---

## 2. Hard technical constraints (email-safe — do not violate)

Unchanged from reality; restated so the agent doesn't drift:

- **Table-based layout only.** Use the helpers in `src/utils/renderSignatureHtml.ts` (`table`/`tr`/`td`/`twoColLeftRight`/`contactGrid`/`threeColZoned`/`zonedCard` etc.). Inline styles only.
- **NO `display:flex`** (Gmail strips align-items/justify-content), **NO `linear-gradient`**, **NO `box-shadow`**, **NO `transform`/`rotate`**, **NO absolute-positioned overlaps** (text-on-image). All are stripped or broken by Gmail. Use `&rarr;`/`&nbsp;` entities, not raw glyphs.
- **Divider lines** = a `<td>` with `background-color` (a thin colored cell), or `border-left`/`border-top` on a cell. NOT `<hr>` (Outlook kills it).
- **Vertical color bar (the Spine)** = a narrow `<td>` with `background:accent` — a cell background auto-stretches to content height.
- **≤600px wide, ≤~650px tall** (Gmail clips taller). 2–3 colors max.
- **Preserve template `id`s** for any KEPT template so saved signatures and the default don't break. `modern-card-style` is the current default — see §5 note.
- **Typecheck with `tsc -b`, NOT `tsc --noEmit`.** The root tsconfig has `"files": []` and only project references, so `--noEmit` checks nothing and is a false green. `tsc -b` correctly catches missing-prop errors. (Memory: `project_opsette_tools_typecheck_command`.)

---

## 3. ⚠️ Dependency flag: PNG export does NOT exist yet

Two of the twelve new structures (**Vertical Name Rail** and **Diagonal Split**) require rotation / a true diagonal edge, which email HTML cannot do. They only work as a **flat rendered image with clickable zones over it.**

**As of 2026-07-11, Signature Studio has NO PNG/image export** (confirmed: no `html-to-image`/`toPng`/`dom-to-image` anywhere in `src/`). The BRAND-KIT contract listed it as *optional* and it was never built.

**Therefore:**
- **Phase 1 (this build): ship the 10 email-safe HTML structures only.** Defer the 2 image-only ones.
- **Phase 2 (separate, later): build a PNG export** (`html-to-image` over the preview node, download + Brand Board handoff), THEN add Vertical Name Rail + Diagonal Split as image-based templates. Do NOT try to force these two into HTML — they will look broken (the v3 previews of them are deliberately rough and use `position:absolute`, which is preview-only).
- If the agent wants to build PNG export in the same session, that's fine — but it's a real feature (node ref, html-to-image dep, download UX), not a 10-minute add. Treat as its own unit.

---

## 4. The twelve new structures (build the 10 HTML ones)

Each maps to a v3 mockup card. Ruthnie wants ALL of them ("I'm greedy, I want everything you've designed"). Port the render function from the v3 mockup source; assign a category; give each a stable new `id`.

Legend: 🟢 = email-safe HTML, build now · 🟣 = image-only, defer to Phase 2.

| # | Name | id (proposed) | Category | The unexpected move | Build |
|---|------|---------------|----------|---------------------|-------|
| 1 | **Symmetric Wings** | `modern-symmetric-wings` | modern | Contact split into two mirrored side columns; identity centered between them. **Ruthnie's favorite.** | 🟢 |
| 2 | **The Masthead** | `bold-masthead` | bold | Name set huge & full-width like a magazine nameplate; everything else small beneath a rule. | 🟢 |
| 3 | **The Spine** | `modern-spine` | modern | A bold color bar down the middle IS the design; identity hangs left, contact right. | 🟢 |
| 4 | **Giant Monogram** | `creative-giant-monogram` | creative | Initials at ~104px as a serif graphic block (replaces the weak `modern-monogram-tile`). | 🟢 |
| 5 | **The Index** | `corporate-index` | corporate | Contact as a numbered spec-sheet (01 EMAIL, 02 PHONE) — product-label style. (Ruthnie: "weird but different"; keep — she asked for different.) | 🟢 |
| 6 | **Full-Bleed Photo** | `modern-full-bleed-photo` | modern | Square photo flush to the card edge, full height; text vertically centered beside. Logo mode fills the panel with color. | 🟢 |
| 7 | **Contact Rail** | `corporate-contact-rail` | corporate | Email/phone/socials in a colored rail across the TOP; identity below it (inverted order). | 🟢 |
| 8 | **Off-Center** | `bold-off-center` | bold | Deliberate asymmetry — anchor pinned far right, text weighted left. | 🟢 |
| 9 | **Ticket Stub** | `promotional-ticket-stub` | promotional | Dashed "perforation" splits body from a tear-off stub holding logo + CTA. | 🟢 |
| 10 | **Stacked Bands** | `bold-stacked-bands` | bold | Three full-width color bands (identity / contact ribbon / CTA), separated by color not spacing. | 🟢 |
| 11 | **Vertical Name Rail** | `creative-name-rail` | creative | Name runs vertically up a color rail like a lanyard badge. **Needs PNG export.** | 🟣 |
| 12 | **Diagonal Split** | `creative-diagonal` | creative | Brand triangle cuts the corner, name reversed on the color. **Needs PNG export.** | 🟣 |

Notes on the render code you're porting:
- **Colored icons + two-tone name + anchor logic** are already implemented in the v3 source (`SOC` map with brand hexes, `svg()` data-URI helper, `socials(color,size,brand)`, `anchor(size,ring,accent)` that honors logo→photo→monogram). Move these into `renderSignatureHtml.ts` as shared helpers so all templates use them and the old monochrome `socialIconsRow` is replaced (or given a `brand` option).
- **Anchor priority must be logo → photo → monogram** (see lesson #5). The v3 mockup toggles logo/photo manually; in the real app, `getResolvedLogo(d)` + `d.profileImageDataUrl` + `monogramTile` decide automatically in that order.

---

## 5. The triage — Ruthnie's per-template verdicts (all 21 current)

Exact IDs confirmed against the repo. **REPLACE** = cut the template object + its entry in the category export array. **KEEP** = leave as-is. **KEEP+FIX** = keep the id but redo icons/polish (use the new colored-icon + two-tone-name helpers).

### Minimal
- `minimal-simple-divider` (Simple Divider) — **KEEP.**
- `minimal-compact-contact` (Compact Contact Block) — **REPLACE.** ("Compact block, replace.")

### Modern
- `modern-card-style` (Card Style) — **REPLACE the design**, but ⚠️ it's the **current default template** (`SignatureContext` / saved-signature default). Do NOT delete the id outright — either (a) repoint the default to a strong new template like `modern-symmetric-wings` and then remove `modern-card-style`, or (b) rebuild `modern-card-style` in place as one of the new structures. Pick one; don't orphan the default. Confirm the default id in `src/app/` before cutting.
- `modern-two-column` (Two Column Modern) — **KEEP+FIX** (replace the icons; Ruthnie: "keepable, but replace the icons").
- `modern-rounded-logo` (Rounded Logo Block) — **REPLACE.**
- `modern-monogram-tile` (Monogram Tile) — **REPLACE** with the new **Giant Monogram** (#4).

### Corporate
- `corporate-executive` (Executive Formal) — **KEEP+FIX** ("keep for now, change icons or something").
- `corporate-legal` (Legal / Professional) — **REPLACE** ("it's nothing, just hitting return multiple times").
- `corporate-consultant` (Consultant Signature) — **REPLACE** ("basic").
- `corporate-team-member` (Team Member Block) — **KEEP** (maybe; leave for now).
- `corporate-two-tone-header` (Zoned Columns) — **REPLACE** (the new Spine/Wings/Contact Rail are better columns).

### Bold
- `bold-big-name` (Big Name) — **KEEP** (maybe; leave for now). Note the new **Masthead** is the stronger big-name play; if Big Name feels redundant beside Masthead after building, cut it then.

### Creative
- `creative-friendly-creator` (Friendly Creator) — **REPLACE** ("nothing special").
- `creative-personal-brand` (Personal Brand) — **REPLACE** (off button).
- `creative-portfolio` (Portfolio Style) — **REPLACE** ("nothing special").
- `creative-script-sign-off` (Script Sign-Off) — **KEEP** (genuinely distinct).

### Compact
- `compact-vertical-stripe` (Vertical Stripe) — **REPLACE** ("not worth much").
- `compact-bracket-frame` (Bracket Frame) — **REPLACE.**

### Promotional
- `promotional-book-call` (Book a Call) — **REPLACE** ("enough Book Me's, not one of the better ones").
- `promotional-newsletter` (Newsletter CTA) — **KEEP** ("has potential").
- `promotional-event-promo` (Event Promo) — **KEEP** ("has potential").

### Triage summary
- **KEEP (6):** simple-divider, script-sign-off, team-member, big-name, newsletter, event-promo.
- **KEEP+FIX icons (2):** two-column-modern, executive.
- **REPLACE (13):** compact-contact, rounded-logo, monogram-tile, legal, consultant, zoned-columns, friendly-creator, personal-brand, portfolio, vertical-stripe, bracket-frame, book-call, + card-style (special: it's the default, handle per note above).
- **ADD (10 now + 2 later):** the twelve new structures in §4.

**Net after Phase 1:** ~8 kept/fixed + 10 new = **~18 strong templates**, every one either genuinely distinct or polished — replacing a library where "one template and the next look the same." Ruthnie said don't worry about matching the old count; quality and distinctiveness over number.

---

## 6. Build sequence

1. **Get the v3 mockup source** (`signature-premium-mockup-v3.html`) from Ruthnie and read its render functions. This is your reference implementation.
2. **Add shared helpers** to `renderSignatureHtml.ts`: the colored-brand-icon set (`SOC` with hexes + a `socialRow(opts)` that takes `brand: boolean`), the two-tone name helper (`nameTwoTone(data, accent)`), and confirm the anchor priority logo→photo→monogram. Typecheck (`tsc -b`).
3. **Execute the REPLACE cuts** — remove the 13 template objects + their export-array entries. Handle `modern-card-style` per the default-template note (§5) FIRST so the default never breaks. Typecheck (catches orphaned imports).
4. **Build the 10 new HTML structures** (§4, 🟢 only), one category at a time, porting from the mockup. After each: `tsc -b` + eyeball in the running app (dev server; check `DEV_SERVERS.md` for the port — Signature Studio has been on 8114).
5. **KEEP+FIX pass** — swap the new colored-icon + two-tone-name helpers into `two-column-modern` and `executive`.
6. **Verify every template** renders well with (a) full data, (b) NO image (monogram fallback), (c) a logo URL (logo as star), (d) the demo data. Paste 2–3 into a real Gmail compose to confirm no clipping.
7. **Dark-canvas check** — the preview already needs a light/dark inbox toggle (see §7). Every new template must not vanish on a dark canvas.
8. Typecheck clean → `npx vitest run` → full build → commit per Ruthnie's cadence (build → she verifies → go → build → commit → push). **Windows commit rule: repeated `-m` flags, never a here-string.**
9. **Update THIS doc** with a dated completion entry (what shipped, file/line, what's deferred to Phase 2).

---

## 7. Dark-canvas preview (still required)

An email signature inherits the recipient's inbox canvas. In a dark-mode inbox the canvas is dark, and hardcoded dark text (`#1a1f2e`) vanishes. The main preview needs a **light/dark canvas toggle** (independent of the app's own theme — app theme ≠ recipient's inbox theme). Audit every kept/new template against a dark canvas; templates that need a light surface should carry their own explicit light container (a bordered card) so they read intentionally on dark, rather than floating dark-on-dark. The v3 mockup already demonstrates this toggle and both-canvas rendering — mirror it.

---

## 8. Delivery model (business context — informs, doesn't block the build)

For the gig itself (not a code task, but shapes intent): the volume Fiverr/Upwork sellers **reuse a small set of base templates** and swap in the buyer's name/logo/colors — "custom" means *your details in our template.* That's exactly what Signature Studio automates. Ruthnie's delivery = the buyer picks one of the house layouts, she fills it with their brand (color via `accentColor`, logo via URL). The differentiator is **not** signature uniqueness (impossible — everyone fishes the same layout pond) but **coherence**: the signature shares color + font with the rest of the kit (Palette Studio, Digital Card, QR). So the priority for THIS build is a strong, distinct, *brand-color-driven* set — the coherence is what makes it worth more than the sum of $10 parts.

---

## 9. ✅ Completion log — Phase 1 shipped (2026-07-11)

Built by the working agent in one session. **Phase 1 = the 10 email-safe HTML structures + KEEP/FIX pass + dark-canvas toggle.** The 2 image-only structures (Vertical Name Rail, Diagonal Split) are deferred to Phase 2 as planned (§3) — no PNG export was built this session.

**Final library: 18 templates** (10 new + 8 kept/fixed). Old count was 21; per §5 quality-over-count, the ~13 weak ones were cut.

### Shared helpers added to `src/utils/renderSignatureHtml.ts`
- `BRAND_COLOR` map + `socialIconsRow(..., { variant: "brand" })` — real LinkedIn/IG/FB/YouTube/X colors (lesson #2). Also `brandChips` option for colored chips.
- `nameTwoTone(fullName, accent, ink)` — first name ink, rest accent (lesson #3).
- `resolveAnchor(data, accent, opts)` — logo → photo → monogram priority (lesson #5). `hasLogo()`, `headshotOrLogoBadge()` (on-accent-band badge).
- `contactRows(data, opts)` — icon+value rows with left/right alignment (for wings, spine, index).
- `Surface` type + `LIGHT_SURFACE`/`DARK_SURFACE`/`accentForSurface()` + `serifStack`. Exported `contactIcon()`, `initials()`.

### The 10 new HTML structures (id → file)
| # | Name | id | file |
|---|------|----|----|
| 1 | Symmetric Wings | `modern-card-style` ⭐ | modern.ts — **rebuilt in place**; this is the app default (§5 option b), so no orphaned default, no test breakage. Was "Card Style." |
| 2 | The Masthead | `bold-masthead` | bold.ts |
| 3 | The Spine | `modern-spine` | modern.ts |
| 4 | Giant Monogram | `creative-giant-monogram` | creative.ts |
| 5 | The Index | `corporate-index` | corporate.ts |
| 6 | Full-Bleed Photo | `modern-full-bleed-photo` | modern.ts |
| 7 | Contact Rail | `corporate-contact-rail` | corporate.ts |
| 8 | Off-Center | `bold-off-center` | bold.ts |
| 9 | Ticket Stub | `promotional-ticket-stub` | promotional.ts |
| 10 | Stacked Bands | `bold-stacked-bands` | bold.ts |

### KEEP+FIX / KEEP (8)
- KEEP+FIX (new helpers wired in): `modern-two-column`, `corporate-executive`.
- KEEP (two-tone name added, otherwise intact): `minimal-simple-divider`, `corporate-team-member`, `bold-big-name`, `creative-script-sign-off`, `promotional-newsletter`, `promotional-event-promo`.

### REPLACE (cut) — 13
`minimal-compact-contact`, `modern-rounded-logo`, `modern-monogram-tile`, `corporate-legal`, `corporate-consultant`, `corporate-two-tone-header`, `creative-friendly-creator`, `creative-personal-brand`, `creative-portfolio`, `compact-vertical-stripe`, `compact-bracket-frame`, `promotional-book-call`, + `modern-card-style`'s old design (repurposed, id kept). The **Compact category is now empty** → `compact.ts` deleted, `"compact"` removed from `TemplateCategory` + `CATEGORY_LABELS`.

### Dark-canvas toggle (§7)
`SignaturePreview` takes a `canvas: "light" | "dark"` prop; `StudioPage` has a Light/Dark **inbox** Segmented control (independent of app theme) wired to both the desktop preview and the mobile preview drawer. CSS `.signature-preview--light/--dark` in `globals.css`. Templates render on a light surface and carry their own bordered light containers where needed, so they read on a dark inbox.

### Verification done
- `tsc -b` clean, `vitest run` 7/7 pass.
- Dev server (was 8114; ran on 8116 this session) serves all template modules with no transform errors.
- All 18 render functions execute against 4 data states (photo / no-image / logo / alt-accent) with no runtime errors — dumped to a QA gallery artifact for eyeball review (light+dark canvas per cell).
- ⏳ **Still owed by Ruthnie's cadence:** her live in-app verify → go → full `vite build` → commit/push. Paste 2–3 into a real Gmail compose (§6.7) before the gig gallery uses them.

### Deferred to Phase 2 (unchanged from §3)
Build PNG export (`html-to-image` over the preview node), then add **Vertical Name Rail** (`creative-name-rail`) + **Diagonal Split** (`creative-diagonal`) as image-based templates. Do not force them into HTML.

---

## 10. Round 2 — richness pass + customization (same day, 2026-07-11)

After the first ship, Ruthnie flagged the in-app preview looked "cheap / naked / flimsy" vs. the artifact, and asked for lost details back + new controls. All done:

**Preview shell (the big one).** The bare `.signature-preview` white box is replaced by an **inbox-message mock** (`SignaturePreview.tsx` → `.sig-inbox`): a floating message window with a chrome bar, a "New message" label, a faint email tail ("Thanks so much — talk soon,"), and the signature sitting where it truly lands. This is what made the artifact read richer than the app — the framing, not the signature. Light/dark inbox both styled. `CopyPanel`'s "Rich preview" still uses the plain `.signature-preview` class (kept). **Export is unaffected — the Brand Board / clipboard / Gmail only ever get `renderHtml(data)`, never the shell.**

**Lost details restored.**
- **Symmetric Wings** photo now carries the accent ring again (`resolveAnchor(..., { ring: accent })`).
- **Spine** split color confirmed present (first line ink, surname line accent + the 4px accent bar) — it was never gone; the muted indigo default made it hard to see.

**New customization (2 new `SignatureData` fields + a Brand tab).**
- **`accentColor` default changed `#4f46e5` → `#c2410c`** (rust). Indigo was washing out the pop; rust is the DeeBuilt brand and makes the two-tone/social/bars read immediately. Changed in `emptySignatureData`, `sampleSignatureData`, and the sanitizer default.
- **`twoToneName: boolean`** (new field, default true). Toggles the surname-in-accent look vs. a restrained single-color name. Wired through `nameTwoTone(..., enabled)` at all 15 call sites + the Spine's manual split.
- **New `BrandControls.tsx`** + a **"Brand" tab** (first tab in `SignatureForm`): 6 preset accent swatches (Rust/Indigo/Teal/Crimson/Ink/Violet) + custom picker, and the two-tone toggle with a live inline name example. This is the fix for "the accent control was an underexposed tiny header swatch." Header swatch tooltip updated to point at it.
- Both new fields round-trip through **share links** (`SHARED_FIELDS` gained `twoToneName`; `buildPayload`/`applySharePayload` now copy booleans, not just strings) and **saved signatures** (via the sanitizer). Legacy saved sigs without the field default `twoToneName` ON.

**Cleanup.** Stripped the dead `void logo` / unused `const logo` from Stacked Bands (its logo was already wired through `headshotOrLogoBadge` → lands white-padded in the top accent band). Removed now-unused `getResolvedLogo` import from bold.ts.

**Verification (round 2).** `tsc -b` clean, `vitest` 7/7. Direct-render checks confirmed: Wings photo ring present, Stacked Bands logo lands in the top band, two-tone ON accents surname / OFF renders single-color. QA gallery artifact regenerated with an inbox shell + a "Two-tone OFF" column + inlined photo/logo (survives the artifact CSP). **Still owed:** Ruthnie's live verify → go → full build → commit/push.
