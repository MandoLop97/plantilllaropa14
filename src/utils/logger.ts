
/**
 * Logger utility for consistent logging across the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  debug(message: string, context?: LogContext, error?: Error) {
    if (!this.isDevelopment) return;
    console.debug(`🔍 ${message}`, context || '', error || '');
  }

  info(message: string, context?: LogContext, error?: Error) {
    console.info(`ℹ️ ${message}`, context || '', error || '');
  }

  warn(message: string, context?: LogContext, error?: Error) {
    console.warn(`⚠️ ${message}`, context || '', error || '');
  }

  error(message: string, context?: LogContext, error?: Error) {
    console.error(`❌ ${message}`, context || '', error || '');
  }

  log(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    switch (level) {
      case 'debug':
        this.debug(message, context, error);
        break;
      case 'info':
        this.info(message, context, error);
        break;
      case 'warn':
        this.warn(message, context, error);
        break;
      case 'error':
        this.error(message, context, error);
        break;
    }
  }
}

export const logger = new Logger();

// Hook for logger
export const useLogger = () => {
  return logger;
};
