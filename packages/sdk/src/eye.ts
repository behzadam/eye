import { EventManager } from "./managers/event-manager";
import { EyeConfig } from "./types";
import { Logger } from "./utils/logger";
import { generateUUID } from "./utils/uuid";
import { validateConfig } from "./utils/validate";

export class Eye {
  private readonly config: EyeConfig;
  private readonly sessionId: string;
  private readonly logger: Logger;
  private readonly eventManager: EventManager;

  constructor(config: EyeConfig) {
    validateConfig(config);
    this.config = config;
    this.sessionId = generateUUID();
    this.logger = new Logger(config.options?.debug);

    this.logger.info("Initialized with config:", config);

    // Initialize event manager
    this.eventManager = new EventManager(this, config.options?.debug);

    if (!config.options?.disableAutoPageview) {
      this.pageView();
    }
  }

  /**
   * Initialize the analytics SDK
   */
  static init(config: EyeConfig): Eye {
    return new Eye(config);
  }

  /**
   * Track a page view
   */
  pageView(path?: string): void {
    const payload = {
      type: "pageview",
      path: path || window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
    };

    this.logger.info("Tracking page view:", payload);
    this.send(payload);
  }

  /**
   * Track a custom event
   */
  track(eventName: string, properties?: Record<string, any>): void {
    const payload = {
      type: "event",
      event: eventName,
      properties,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
    };

    this.logger.info("Tracking event:", payload);
    this.send(payload);
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.logger.info("Cleaning up Eye instance");
    this.eventManager.destroy();
  }

  private send(payload: any): void {
    const endpoint = `${this.config.endpoint}/collect`;

    // Add common properties
    const finalPayload = {
      ...payload,
      projectId: this.config.projectId,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    };

    // Send data to the collection endpoint
    if (navigator.sendBeacon) {
      this.logger.info("Sending data using sendBeacon:", endpoint);
      navigator.sendBeacon(endpoint, JSON.stringify(finalPayload));
    } else {
      this.logger.info("Sending data using fetch:", endpoint);
      fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(finalPayload),
        headers: {
          "Content-Type": "application/json",
        },
        // Use keepalive to ensure the request completes even if the page is unloading
        keepalive: true,
      }).catch((error) => {
        this.logger.error("Failed to send data:", error);
      });
    }
  }
}
