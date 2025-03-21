export interface EyeConfig {
  /**
   * Your project ID
   */
  projectId: string;

  /**
   * The endpoint where analytics data will be sent
   */
  endpoint: string;

  /**
   * Optional configuration options
   */
  options?: {
    /**
     * Disable automatic page view tracking
     * @default false
     */
    autoPageview?: boolean;

    /**
     * Disable automatic snapshot tracking
     * @default false
     */
    autoSnapshot?: boolean;

    /**
     * Debug mode - logs all tracking events to console
     * @default false
     */
    debug?: boolean;
  };
}

export interface PageViewEvent {
  type: "pageview";
  path: string;
  title: string;
  referrer: string;
  sessionId: string;
  timestamp: string;
}

export interface CustomEvent {
  type: "event";
  event: string;
  properties?: Record<string, any>;
  sessionId: string;
  timestamp: string;
}

export type AnalyticsEvent = PageViewEvent | CustomEvent;
