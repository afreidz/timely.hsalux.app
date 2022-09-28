import { defineConfig } from "vite";
import basicssl from "@vitejs/plugin-basic-ssl";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), basicssl()],
  server: {
    https: true,
  },
});
