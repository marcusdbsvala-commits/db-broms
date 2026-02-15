import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",

      manifest: {
        name: "Dan Brutal",
        short_name: "DB broms",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      workbox: {
        // NYCKELN: ingen auto takeover. Ny SW ska ligga i "waiting" tills du kör updateSW(true)
        skipWaiting: false,
        clientsClaim: false,

        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 15 MB
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,pdf,woff2}"],
        navigateFallback: "/index.html",
      },
    }),
  ],
});
