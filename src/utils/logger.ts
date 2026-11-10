export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private currentLevel: LogLevel = LogLevel.INFO;

  public setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  private maskSensitive(message: string): string {
    return message
      .replace(/(password['"]?\s*[:=]\s*['"])([^'"]+)(['"])/gi, '$1********$3')
      .replace(/(token['"]?\s*[:=]\s*['"])([^'"]+)(['"])/gi, '$1[MASKED]$3')
      .replace(/(\b\d{4}\s?\d{4}\s?\d{4}\b)/g, '****-****-****');
  }

  private formatMessage(level: string, message: string, context?: string): string {
    const timestamp = new Date().toISOString();
    const ctx = context ? ` [${context}]` : '';
    return `[${timestamp}] [${level}]${ctx}: ${this.maskSensitive(message)}`;
  }

  public debug(message: string, context?: string): void {
    if (this.currentLevel <= LogLevel.DEBUG) {
      console.info(this.formatMessage('DEBUG', message, context));
    }
  }

  public info(message: string, context?: string): void {
    if (this.currentLevel <= LogLevel.INFO) {
      console.info(this.formatMessage('INFO', message, context));
    }
  }

  public warn(message: string, context?: string): void {
    if (this.currentLevel <= LogLevel.WARN) {
      console.warn(this.formatMessage('WARN', message, context));
    }
  }

  public error(message: string, error?: unknown, context?: string): void {
    if (this.currentLevel <= LogLevel.ERROR) {
      const errDetails = error instanceof Error ? ` - ${error.stack || error.message}` : '';
      console.error(this.formatMessage('ERROR', `${message}${errDetails}`, context));
    }
  }
}

export const logger = new Logger();
