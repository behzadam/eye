export class Logger {
  private readonly debug: boolean;
  private readonly prefix: string = "[Eye Analytics]";

  constructor(debug: boolean = false) {
    this.debug = debug;
  }

  info(message: string, ...args: any[]): void {
    if (this.debug) {
      console.info(`${this.prefix} ${message}`, ...args);
    }
  }

  error(message: string, error?: Error): void {
    console.error(`${this.prefix} ${message}`, error);
  }

  warn(message: string, ...args: any[]): void {
    if (this.debug) {
      console.warn(`${this.prefix} ${message}`, ...args);
    }
  }
}
