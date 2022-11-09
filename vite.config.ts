import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: "AC_",
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },
    }),
    svelte(),
  ],
});
