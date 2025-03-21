import { Eye } from "@eye/sdk";

// Initialize the SDK with debug mode enabled
const analytics = Eye.init({
  projectId: "playground",
  endpoint: "https://analytics.example.com", // Replace with your actual endpoint
  options: {
    debug: true,
    disableAutoPageview: false,
  },
});

// Set up event logging
const eventLog = document.getElementById("eventLog")!;
const log = (message: string) => {
  const timestamp = new Date().toISOString();
  eventLog.textContent = `${timestamp} - ${message}\n${eventLog.textContent}`;
};

// Console override for logging
const originalConsoleInfo = console.info;
console.info = function (...args) {
  originalConsoleInfo.apply(console, args);
  if (args[0]?.includes("[Eye Analytics]")) {
    log(args.join(" "));
  }
};

// Add event listeners
document.getElementById("trackEvent")?.addEventListener("click", () => {
  analytics.track("button_click", {
    buttonId: "trackEvent",
    timestamp: new Date().toISOString(),
  });
});

document.getElementById("trackPageView")?.addEventListener("click", () => {
  analytics.pageView("/manual-pageview");
});
