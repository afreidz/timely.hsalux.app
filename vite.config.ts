import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: ["es2021"],
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },
    }),
    svelte(),
  ],
});
