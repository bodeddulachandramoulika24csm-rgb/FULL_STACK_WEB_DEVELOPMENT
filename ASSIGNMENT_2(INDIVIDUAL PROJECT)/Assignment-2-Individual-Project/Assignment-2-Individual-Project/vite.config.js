import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The app lives in src/, so index.html is served from src/ (as required by the assignment structure).
export default defineConfig({
  root: "src",
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
});
