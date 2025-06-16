
/**
 * Error handling utilities
 */

import { logger } from './logger';

export interface AppError extends Error {
  code?: string;
  context?: Record<string, any>;
}

export const createError = (message: string, code?: string, context?: Record<string, any>): AppError => {
  const error = new Error(message) as AppError;
  error.code = code;
  error.context = context;
  return error;
};

export const handleError = (error: Error | AppError, context?: Record<string, any>): void => {
  logger.error(error.message, {
    ...context,
    ...(error as AppError).context,
    code: (error as AppError).code,
    stack: error.stack
  });
};

export const withErrorHandling = <T extends (...args: any[]) => any>(
  fn: T,
  errorHandler?: (error: Error) => void
): T => {
  return ((...args: any[]) => {
    try {
      const result = fn(...args);
      
      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error) => {
          if (errorHandler) {
            errorHandler(error);
          } else {
            handleError(error);
          }
          throw error;
        });
      }
      
      return result;
    } catch (error) {
      if (errorHandler) {
        errorHandler(error as Error);
      } else {
        handleError(error as Error);
      }
      throw error;
    }
  }) as T;
};

export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
};

export const handleSupabaseError = (error: any): AppError => {
  const message = error?.message || 'Unknown Supabase error';
  const code = error?.code || 'SUPABASE_ERROR';
  
  return createError(message, code, {
    originalError: error,
    source: 'supabase'
  });
};
