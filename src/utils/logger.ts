
/**
 * Sistema de logging para debugging y monitoreo
 * @module Logger
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  stack?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private minLevel: LogLevel = LogLevel.INFO;

  constructor() {
    // Configurar nivel según entorno
    if (import.meta.env.DEV) {
      this.minLevel = LogLevel.DEBUG;
    }
  }

  private addLog(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    if (level < this.minLevel) return;

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      stack: error?.stack
    };

    this.logs.push(entry);

    // Mantener solo los últimos N logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log a consola en desarrollo
    if (import.meta.env.DEV) {
      this.logToConsole(entry);
    }

    // Guardar logs críticos en localStorage
    if (level >= LogLevel.ERROR) {
      this.persistLog(entry);
    }
  }

  private logToConsole(entry: LogEntry) {
    const { timestamp, level, message, context } = entry;
    const timeStr = timestamp.toISOString();
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`[${timeStr}] DEBUG: ${message}`, context || '');
        break;
      case LogLevel.INFO:
        console.info(`[${timeStr}] INFO: ${message}`, context || '');
        break;
      case LogLevel.WARN:
        console.warn(`[${timeStr}] WARN: ${message}`, context || '');
        break;
      case LogLevel.ERROR:
        console.error(`[${timeStr}] ERROR: ${message}`, context || '');
        break;
    }
  }

  private persistLog(entry: LogEntry) {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('app-error-logs') || '[]');
      existingLogs.push(entry);
      
      // Mantener solo los últimos 50 errores
      const recentLogs = existingLogs.slice(-50);
      localStorage.setItem('app-error-logs', JSON.stringify(recentLogs));
    } catch (error) {
      console.warn('No se pudo persistir el log:', error);
    }
  }

  /**
   * Log de debug - solo en desarrollo
   */
  debug(message: string, context?: Record<string, any>) {
    this.addLog(LogLevel.DEBUG, message, context);
  }

  /**
   * Log de información general
   */
  info(message: string, context?: Record<string, any>) {
    this.addLog(LogLevel.INFO, message, context);
  }

  /**
   * Log de advertencias
   */
  warn(message: string, context?: Record<string, any>) {
    this.addLog(LogLevel.WARN, message, context);
  }

  /**
   * Log de errores
   */
  error(message: string, context?: Record<string, any>, error?: Error) {
    this.addLog(LogLevel.ERROR, message, context, error);
  }

  /**
   * Obtener todos los logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Obtener logs por nivel
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Limpiar logs
   */
  clear() {
    this.logs = [];
    localStorage.removeItem('app-error-logs');
  }

  /**
   * Exportar logs como JSON
   */
  exportLogs(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      logs: this.logs,
      environment: import.meta.env.MODE,
      userAgent: navigator.userAgent
    }, null, 2);
  }
}

// Instancia global del logger
export const logger = new Logger();

/**
 * Hook para usar el logger en componentes React
 */
export function useLogger() {
  return logger;
}
