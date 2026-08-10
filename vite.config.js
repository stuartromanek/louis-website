import { defineConfig } from "vite";

export default defineConfig({
  // Static one-pager at repo root — no bundling required for deploy.
  server: {
    port: 4173,
    strictPort: true,
  },
});
