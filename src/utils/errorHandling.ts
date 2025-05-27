
/**
 * Sistema de manejo de errores robusto con retry automático
 * @module ErrorHandling
 */

export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
}

export interface ErrorContext {
  operation: string;
  context?: Record<string, any>;
  timestamp: Date;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Ejecuta una función con retry automático
 * @param fn - Función a ejecutar
 * @param options - Opciones de retry
 * @returns Resultado de la función
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxAttempts = 3, delay = 1000, backoff = true } = options;
  
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw new AppError(
          `Operación falló después de ${maxAttempts} intentos`,
          'RETRY_EXHAUSTED',
          {
            operation: fn.name || 'unknown',
            context: { lastError: lastError.message },
            timestamp: new Date()
          }
        );
      }
      
      const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
}

/**
 * Wrapper para operaciones de Supabase con manejo de errores mejorado
 */
export function handleSupabaseError(error: any, operation: string): never {
  console.error(`Error en ${operation}:`, error);
  
  const errorMessage = error?.message || 'Error desconocido';
  const errorCode = error?.code || 'UNKNOWN_ERROR';
  
  throw new AppError(
    `Error en ${operation}: ${errorMessage}`,
    errorCode,
    {
      operation,
      context: { originalError: error },
      timestamp: new Date()
    }
  );
}
