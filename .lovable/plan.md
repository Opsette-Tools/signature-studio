
## Email Signature Generator — Build Plan

A mobile-first, fully local email signature generator. No backend, no auth, no database. Everything stored in the browser.

---

### 1. Project foundation cleanup
- Remove Tailwind: delete `tailwind.config.ts`, `postcss.config.js`, `@tailwind` directives in `index.css`, and the `tailwindcss` / `tailwindcss-animate` deps.
- Remove the entire `src/components/ui/` shadcn folder and the `src/hooks/use-toast.ts` / `use-mobile.tsx` helpers.
- Remove unused deps tied to shadcn (radix-ui packages, sonner, cmdk, vaul, etc.).
- Replace `src/index.css` with a clean `styles/globals.css` + `styles/tokens.css` using CSS custom properties for light/dark theme tokens (spacing, radius, surfaces, typography).
- Keep React Query and React Router (used for routing + favorites/saved cache).

### 2. Ant Design integration
- Install `antd` and configure `ConfigProvider` at the app root with a custom theme using design tokens that read from CSS variables, so light/dark switches feel cohesive.
- Use Ant Design's algorithm switching (`theme.defaultAlgorithm` / `theme.darkAlgorithm`) tied to a `useThemeMode` hook backed by `localStorage` and `prefers-color-scheme`.
- App UI uses Ant Design components only (Layout, Card, Form, Input, Upload, Button, Tabs, Segmented, Drawer, Modal, Tag, Badge, List, Empty, Tooltip, Switch, message, etc.). No inline styles in the app shell.

### 3. App structure
Build the file tree exactly as you specified under `src/`:
- `app/` — `App.tsx`, `routes.tsx`
- `components/layout/` — `AppShell`, `HeaderBar`, `BottomNav`
- `components/signature/` — `SignatureForm`, `SignaturePreview`, `SignatureCard`, `TemplateGallery`, `TemplateFilters`, `CopyPanel`, `SavedSignatures`, `ImageUploader`
- `components/ui/` — `EmptyState`, `SectionCard`, `MobileDrawer`
- `data/templates/` — one file per category + `index.ts` aggregator
- `hooks/`, `types/`, `utils/`, `styles/` as listed

### 4. Layout & navigation
- **Mobile-first**: top `HeaderBar` (logo, theme toggle, saved count badge), and a bottom `BottomNav` with 4 sections — Templates, Edit, Preview, Saved.
- Sections render as routed views (`/templates`, `/edit`, `/preview`, `/saved`) so deep linking works on GH Pages.
- **Tablet (≥768px)**: bottom nav becomes a left rail.
- **Desktop (≥1024px)**: two-column layout — left = template filters + form; right = sticky live preview + copy panel. Bottom nav hidden.
- A persistent floating "Copy" action on mobile preview keeps export within thumb reach.

### 5. Template system (~35 templates)
Each template module exports a typed `SignatureTemplate` with: `id`, `name`, `category`, `tags[]`, `description`, `supportsImage`, `supportsLogo`, `supportsSocialLinks`, `layoutType`, `renderHtml(data)`, `renderPlainText(data)`.

Every template's `renderHtml` produces email-safe HTML using tables + inline styles (this is the one allowed inline-style exception). Empty fields are gracefully omitted in both HTML and plain text.

Templates by category (all built, with meaningfully different layouts):

- **Minimal (5)**: Clean Name + Title, Simple Divider, Text Only, Compact Contact Block, Tiny Footer
- **Modern (5)**: Card Style, Left Accent Bar, Rounded Logo Block, Two Column Modern, Social Row
- **Corporate (5)**: Executive Formal, Legal/Professional, Consultant, Team Member Block, Company Footer
- **Bold (5)**: Big Name, Color Stripe, High Contrast, Block Header, CTA Button Style
- **Creative (5)**: Friendly Creator, Soft Rounded, Personal Brand, Portfolio Style, Casual Service Provider
- **Compact (5)**: One Line, Two Line, Mobile Friendly Tiny, No Logo, Text-Only Professional
- **Social/CTA (5)**: Book a Call, Visit Website, Follow Me, Download Resource, Newsletter CTA

`data/templates/index.ts` aggregates all into a typed array used by gallery, filters, and search.

### 6. Signature form
A single Ant Design `Form` driving a typed `SignatureData` object. Fields:
- Identity: Full name, Pronouns, Job title, Company, Tagline
- Contact: Email, Phone, Website, Booking link, Address
- Media: Logo upload, Logo URL (alternative), Profile photo upload
- Social: LinkedIn, Instagram, Facebook, YouTube, X/Twitter, TikTok
- CTA: Custom CTA label + URL
- Footer: Disclaimer text

Form values live in `useSignatureForm` (local state + debounced persistence to `localStorage` so refresh keeps the draft). Sanitization via `utils/sanitizeSignatureData.ts` strips dangerous characters, normalizes URLs, validates email format softly (warn, don't block).

### 7. Image uploads
- `ImageUploader` wraps Ant Design `Upload` (no server) — converts files to base64 via `utils/imageToBase64.ts`, with size cap (~200 KB) and a friendly resize warning.
- Both Logo URL and Logo Upload are supported. Helper text explains base64 images may not render in every email client and recommends the URL field for max compatibility.

### 8. Preview & template gallery
- `TemplateGallery` shows cards (Ant `Card` + `List`) with a small live mini-render of each template using current form data, plus favorite (star) toggle and category tags.
- `TemplateFilters` provides search input + Ant `Segmented` for category + checkboxes for "supports logo / profile / text-only".
- Search matches name, category, tags, and description.
- `SignaturePreview` renders the selected template at full size in an isolated container (scoped styles so app theme doesn't leak into preview).

### 9. Copy panel
`CopyPanel` provides three Ant `Button`s with tooltips:
- **Copy rich signature** — uses Clipboard API `ClipboardItem` with `text/html` + `text/plain` so pasting into Gmail/Outlook keeps formatting.
- **Copy HTML code** — copies the raw HTML string.
- **Copy plain text** — copies the plain-text rendition.
Success/failure feedback via Ant `message`. Fallback for browsers without `ClipboardItem` (copies HTML string + shows toast explaining).

### 10. Saved signatures (max 3)
- `useLocalSignatures` manages a localStorage array capped at 3.
- Each entry: `id`, `name`, `templateId`, `data`, `updatedAt`.
- `SavedSignatures` view: list with rename (Modal), load-into-editor, delete (confirm), and "Save current" action (prompts name; if 3 already saved, asks which to overwrite).

### 11. Favorites
`useFavorites` keeps a localStorage set of template IDs. Star icon on every template card. A "Favorites" filter chip in `TemplateFilters`.

### 12. Dark mode
- `useThemeMode` toggles between light/dark, persisted in localStorage, defaulting to system preference.
- Ant Design theme algorithm + CSS variable swap drive the entire UI.
- Generated signature HTML stays light-themed by default (email-safe). Templates that intentionally use dark styling (e.g. High Contrast) keep their own colors regardless of app theme.

### 13. Privacy note
Small persistent footer line + a one-time dismissible Ant `Alert` on first load:
> "Your signature data stays on this device. Images are only stored locally unless you paste an external image URL."

### 14. PWA (manifest only — installable, no service worker)
- Add `public/manifest.webmanifest` with name, short_name, theme_color, background_color, display `standalone`, start_url respecting base path.
- Add placeholder icons (192, 512, maskable) to `public/icons/`.
- Link manifest + theme-color from `index.html`.
- **No** `vite-plugin-pwa`, no service worker — this guarantees Lovable preview works without stale-cache issues, while still allowing Add-to-Home-Screen on mobile.

### 15. GitHub Pages deployment
- Add `.github/workflows/deploy.yml` that builds on push to `main` and deploys to GitHub Pages using the official `actions/deploy-pages` action.
- `vite.config.ts` reads `base` from an env var (`VITE_BASE_PATH`) so:
  - Lovable preview / local dev: `/`
  - GH Pages: you set `VITE_BASE_PATH=/<your-repo>/` in the workflow
- Add a `404.html` copy of `index.html` to the build output for GH Pages SPA fallback.
- README section explaining how to set the base path after connecting GitHub.

### 16. Acceptance check (what will work when done)
- Runs in Lovable preview and locally with Vite.
- Deployable to GitHub Pages after setting base path.
- Installable to home screen via manifest.
- Pure Ant Design UI, no Tailwind / shadcn left in the project.
- ~35 templates with genuinely distinct layouts, searchable and filterable.
- Live preview, three copy modes, up to 3 saved signatures, favorites.
- Local image upload + image URL alternative.
- Mobile-first with tablet/desktop enhancements, plus dark mode.

---

Out of scope for v1 (easy to add later): exporting saved signatures as JSON, importing JSON, per-template color customization, true offline mode (would need the full PWA service worker setup with iframe guards).
