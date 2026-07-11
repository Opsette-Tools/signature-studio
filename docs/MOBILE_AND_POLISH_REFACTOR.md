# Signature Studio — Mobile Sizing + Polish Refactor (plan)

**Status:** PLAN — not built. Written 2026-07-11 at the end of the template-rebuild session, for a dedicated breakout build session.
**Owner:** Ruthnie. **Role for the next agent:** you are the WORKING/build agent — execute this, don't re-litigate it. Where a real fork appears, pick the durable option and note it.

---

## 0. Why this session exists

The template rebuild (see `SIGNATURE_REBUILD_V2.md`) is done and shipped: 18 Gmail-safe templates, hosted PNG icons, brand controls, two-tone toggle, dark-mode-aware text. But using the app on a phone, Ruthnie hit real problems that are about the APP CHROME, not the signatures:

- Everything is **too small** — inputs, buttons, tab labels, the preview, the drawers. Default 14px Ant type throughout.
- Nothing is **edge-to-edge** on mobile — wasted margins, cramped drawers.
- The **preview bottom-drawer gets cut off** and doesn't scroll well.
- The app "kind of is mobile, but isn't" — it was never *designed* mobile-first (violates the global mobile-first rule; acknowledged).

**Crucial framing:** this is an APP-UI refactor. It must NOT touch the signature render HTML in `src/data/templates/**` or `renderSignatureHtml.ts` — those hardcode px on purpose because email clients strip CSS variables. Two separate systems. Keep them separate.

---

## 1. The good news — the app is ~85% ready to scale from central dials

You are NOT facing a "rip hardcoded pixels out of 40 files" teardown. Audit done 2026-07-11:

- **Spacing / color / radius / shadow** → fully tokenized in `src/styles/tokens.css` (`--space-*`, `--color-*`, `--radius-*`), with a complete `[data-theme="dark"]` block.
- **Component sizing** (inputs, buttons, selects, tabs, drawers) → driven by the **Ant `ConfigProvider` theme token** in `src/app/App.tsx`. This is the master dial.
- **Hardcoded `fontSize` in app UI:** only **1** (`AboutPage.tsx:39`). ~39 inline `style={{}}` total, most are layout not type.
- **The one real gap:** there is **no `--font-size-*` scale** in tokens.css, and Ant's `fontSize` token is unset (defaults to 14px everywhere). That's the lever that's missing.

So the work is: **tune the central dials + fix ~4 mobile layout components.** Not a rewrite.

---

## 2. The tiered plan

### Tier 1 — global size bump (biggest visible win, ~20 min)
In `src/app/App.tsx`, the `ConfigProvider` `token` block:
- Add `fontSize: 15` (or 16 — try both on a phone). Lifts every Ant input/button/select/tab/label app-wide in one line.
- Add `controlHeight: 40` (default 32) → taller, more tappable inputs/buttons on mobile.
- Consider `fontSizeLG`, `fontSizeSM` for proportional scaling.
This alone kills most of "everything is too tiny."

### Tier 2 — real type scale (~30 min)
- Add to `tokens.css`: `--font-size-xs/sm/base/lg/xl/2xl` (e.g. 12/13/15/17/20/24).
- Swap the 1 hardcoded fontSize + the handful of CSS `font-size:` rules to the tokens.
- Now app type tunes from one place.

### Tier 3 — mobile layout (the real time sink, but bounded to ~4 areas)
1. **Preview bottom drawer** (`StudioPage.tsx`) — already bumped to `height:92%` + scrollable body this session; verify it no longer cuts off, make the inbox preview scale to width, consider edge-to-edge padding.
2. **Templates browse drawer** (`StudioPage.tsx`, `width={Math.min(960,...)}`) — on a phone this should be near-full-width and the gallery cards bigger/single-column.
3. **Mobile action bar** (`.mobile-action-bar`) — bigger tap targets, safe-area insets.
4. **`.studio__grid`** breakpoints in `globals.css` — the form/preview stack, spacing, and edge-to-edge behavior at 375px.
- Every stat: design what belongs on a phone deliberately (the global mobile-first rule), don't just shrink desktop.

**Estimate:** Tier 1+2 ≈ 1 hour, ~70% of the felt improvement. Tier 3 ≈ a focused half-day for genuine mobile-first layout.

---

## 3. Open decisions carried in from the rebuild session (Ruthnie's calls)

These are deliberately LEFT for this session — don't assume, confirm with Ruthnie or pick durable:

1. **Contact-text color: how dark?** Current `LIGHT_SURFACE.sub` = `#33404f` (dark slate). Ruthnie wants it to read as **stronger black**. Options: push to `#1f2733` or near-black `#141821`. Tradeoff: pure black can look heavy in a signature, but it also inverts most reliably in dark mode (email clients invert genuinely-dark text; medium grays get left alone and vanish). Lean darker. This lives in `renderSignatureHtml.ts` `LIGHT_SURFACE` — it's signature HTML, so it's the ONE place the two systems touch. Change the token, all templates follow.
2. **Per-field color configuration (new feature Ruthnie wants).** Let the user choose to color specific input fields (e.g. make the job title the accent, or the company). This is a real feature — new per-field color state, a small UI, wiring through templates. Scope it as its own unit; don't block the mobile work on it.
3. **WiseStamp layout study.** Ruthnie plans to handpick polished WiseStamp layouts to make our templates smarter/more polished. Any new structures from that → treat like the rebuild (port render fn, assign id, Gmail-safe, hosted icons). The hosted-icon + two-tone + accent infra is already in place to receive them.

---

## 4. Guardrails (don't regress the rebuild)

- **Never** put SVG data-URI icons back — Gmail/Outlook strip them. Contact + social icons ship as HOSTED PNGs from `tools.opsette.io/signature-icons/` (generated by `opsette-tools.github.io/_brand-icons/gen-signature-icons.mjs`). New accent colors need a new pre-rendered contact-icon set OR fall back to `neutral`.
- **Dark mode = dark text, no signature background.** Don't add background colors to signature bodies (colored bars like Stacked Bands are the intentional exception). Let the client auto-invert.
- Typecheck with **`tsc -b`** (not `--noEmit` — false green here).
- Signature px stays hardcoded (email requirement). App-UI px moves to tokens/Ant.
- Commit rule (Windows): repeated `-m` flags, never a here-string.

---

## 5. Suggested kickoff prompt for the breakout session

> I'm doing the Signature Studio mobile + sizing refactor. Read `docs/MOBILE_AND_POLISH_REFACTOR.md` — you're the build agent. Start with Tier 1 (global Ant `fontSize`/`controlHeight` bump in App.tsx) so I can eyeball it on my phone, then Tier 2 (type scale in tokens.css), then we'll tackle the mobile drawers (Tier 3) together. Also apply open decision #1 — push the contact-text color darker toward a strong near-black. Don't touch the signature render logic except that one `LIGHT_SURFACE.sub` value. Typecheck with `tsc -b` as you go; don't commit until I verify on my phone.
