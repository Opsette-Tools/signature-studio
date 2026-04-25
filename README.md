# Signature Studio

A free, fully-local email signature builder. Browse 35+ templates, fill in your details, tweak the accent color, and copy the result as rich HTML or plain text into Gmail, Outlook, Apple Mail, or anywhere else.

Part of [Opsette Marketplace](https://opsette.io).

## Features

- 35+ signature templates across modern, classic, minimal, and creative styles
- Live preview as you type
- Photo and logo upload (stored locally as base64) or paste an external URL
- Custom accent color
- Copy as rich HTML (drops straight into mail-client signature settings) or plain text
- Save multiple signatures locally and switch between them
- Share links — signature data is encoded into the URL hash, no backend involved
- Light / dark mode
- Installable PWA — works offline after first load
- 100% local: no accounts, no tracking, no server. Your data never leaves your device.

## Development

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:8080/signature-studio/`.

## Build

```bash
npm run build
```

Outputs a static site to `dist/`.

## Deployment

This repo ships to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to `main`. The base path is hard-coded to `/signature-studio/` in [`vite.config.ts`](vite.config.ts).

If you fork this and rename the repo, update the `base` value in `vite.config.ts` and the matching `start_url` / `scope` in the PWA manifest config.

## Tech

- Vite + React + TypeScript
- Ant Design for UI chrome
- vite-plugin-pwa for the offline manifest + service worker
- localStorage / IndexedDB for storage
