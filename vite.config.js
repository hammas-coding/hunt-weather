import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "hunt-weather.webp",
        "vite.svg",
        "assets/cloudy.png",
        "assets/hard-storm.png",
        "assets/humidity.png",
        "assets/night.png",
        "assets/partly-cloudy.png",
        "assets/rain.png",
        "assets/snow.png",
        "assets/storm.png",
        "assets/sun.png",
        "assets/temperature.png",
        "assets/wallpaper.jpg",
        "assets/wind-speed.png",
      ],
      manifest: {
        name: "Weather App",
        short_name: "Weather",
        description: "A Progressive Web App for weather updates",
        theme_color: "#000",
        background_color: "#000",
        display: "standalone",
        start_url: ".",
        icons: [
          {
            src: "hunt-weather.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "hunt-weather.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
