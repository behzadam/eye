import { EyeConfig } from "../types";

export function validateConfig(config: EyeConfig): void {
  if (!config.projectId) {
    throw new Error("Project ID is required");
  }

  if (!config.endpoint) {
    throw new Error("Endpoint URL is required");
  }

  try {
    new URL(config.endpoint);
  } catch {
    throw new Error("Invalid endpoint URL");
  }
}
