import { defineConfig } from "vite";

export default defineConfig({
  root: "./",
  build: {
    outDir: "dist",
  },
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: ["@eye/sdk"],
  },
});
