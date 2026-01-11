import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    port: 3000,
    allowedHosts: ["192.168.1.4"],
    host: "0.0.0.0",
  },

  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),

    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true, // allow PWA in dev mode
      },
      manifest: {
        name: "Fee Manager",
        short_name: "FMA",
        description: "Manager",
        start_url: "/",
        display: "standalone",
        background_color: "#F9FAFB",
        theme_color: "#4F46E5",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
