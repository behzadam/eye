import type { Eye } from "../eye";
import { Logger } from "../utils/logger";

export class DOMManager {
  private readonly eye: Eye;
  private readonly logger: Logger;
  private readonly listeners: Map<string, EventListener> = new Map();

  constructor(eye: Eye, debug: boolean = false) {
    this.eye = eye;
    this.logger = new Logger(debug);
    this.setupListeners();
  }

  /**
   * Setup all DOM event listeners
   */
  private setupListeners(): void {
    this.logger.info("Setting up DOM event listeners");

    // Page view tracking for SPAs
    this.addListener("popstate", () => {
      this.eye.pageView();
    });

    // Click tracking
    this.addListener("click", (event: Event) => {
      const target = event.target as HTMLElement;
      if (target?.tagName === "BUTTON" || target?.tagName === "A") {
        this.eye.track("click", {
          tagName: target.tagName.toLowerCase(),
          text: target.textContent?.trim(),
          id: target.id,
          className: target.className,
          href: (target as HTMLAnchorElement).href,
        });
      }
    });

    // Form submission tracking
    this.addListener("submit", (event: Event) => {
      const form = event.target as HTMLFormElement;
      this.eye.track("form_submit", {
        formId: form.id,
        formName: form.name,
        formAction: form.action,
      });
    });
  }

  /**
   * Add a DOM event listener and store its reference
   */
  private addListener(eventName: string, handler: EventListener): void {
    this.listeners.set(eventName, handler);
    window.addEventListener(eventName, handler);
    this.logger.info(`Added ${eventName} listener`);
  }

  /**
   * Clean up all DOM event listeners
   */
  destroy(): void {
    this.logger.info("Cleaning up DOM event listeners");
    this.listeners.forEach((handler, eventName) => {
      window.removeEventListener(eventName, handler);
    });
    this.listeners.clear();
  }
}
