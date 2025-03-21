import { beforeEach, describe, expect, it, vi } from "vitest";
import { Eye } from "../index";

describe("Eye Analytics SDK", () => {
  beforeEach(() => {
    // Mock navigator.sendBeacon
    vi.stubGlobal("navigator", {
      sendBeacon: vi.fn(),
      userAgent: "test-agent",
      language: "en-US",
    });

    // Mock window properties
    vi.stubGlobal("window", {
      screen: {
        width: 1920,
        height: 1080,
      },
      location: {
        pathname: "/test-path",
      },
    });

    // Mock document properties
    vi.stubGlobal("document", {
      title: "Test Page",
      referrer: "https://example.com",
    });
  });

  it("should initialize with valid config", () => {
    const sdk = Eye.init({
      projectId: "test-project",
      endpoint: "https://analytics.example.com",
    });

    expect(sdk).toBeInstanceOf(Eye);
  });

  it("should throw error with invalid config", () => {
    expect(() => {
      Eye.init({
        projectId: "",
        endpoint: "https://analytics.example.com",
      });
    }).toThrow("Project ID is required");
  });

  it("should track page views", () => {
    const sdk = Eye.init({
      projectId: "test-project",
      endpoint: "https://analytics.example.com",
    });

    sdk.pageView();

    expect(navigator.sendBeacon).toHaveBeenCalled();
    const [url, data] = (navigator.sendBeacon as any).mock.calls[0];
    const payload = JSON.parse(data);

    expect(url).toBe("https://analytics.example.com/collect");
    expect(payload).toMatchObject({
      type: "pageview",
      path: "/test-path",
      title: "Test Page",
      projectId: "test-project",
    });
  });
});
