import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  base: "/signature-studio/",
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon.svg", "favicon.ico", "robots.txt"],
      manifest: {
        name: "Signature Studio — Email Signature Generator",
        short_name: "Signature Studio",
        description:
          "Build polished email signatures locally on your device. Browse 35+ templates, fill in your details, and copy as rich HTML or plain text. No accounts, no tracking.",
        start_url: "/signature-studio/",
        scope: "/signature-studio/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#0f1218",
        theme_color: "#4f46e5",
        icons: [
          {
            src: "icons/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
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
});
