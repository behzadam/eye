import { defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "../../vitest.shared";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: "node",
      include: ["src/**/*.test.{ts,tsx}"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        exclude: [
          "node_modules/**",
          "dist/**",
          "**/*.test.{ts,tsx}",
          "**/*.d.ts",
        ],
      },
    },
  }),
);
