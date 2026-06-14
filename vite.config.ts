import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// base must be the sub-path ONLY for the production build (served as a route
// under the apex domain, e.g. tools.opsette.io/signature-studio/). In dev it
// must be "/" so the app lands at http://localhost:8114/ — hardcoding the
// sub-path for dev makes Vite redirect to /signature-studio/ on every load.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/signature-studio/" : "/",
  server: {
    host: "::",
    port: 8114,
    hmr: { overlay: false },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: false },
      manifest: false,
      workbox: {
        navigateFallback: "index.html",
      },
    }),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
}));
