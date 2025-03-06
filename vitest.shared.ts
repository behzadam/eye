import { defineConfig } from "vitest/config";

const baseConfig = defineConfig({
  test: {
    globals: true,
    environment: "node",
    passWithNoTests: true,
    cache: {
      dir: "../../node_modules/.vitest",
    },
  },
});

export default baseConfig;
