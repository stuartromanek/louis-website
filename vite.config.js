import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  // Local preview only — production ships via `npm run build` → dist/.
  server: {
    port: 4173,
    strictPort: true,
  },
});
