
/**
 * Sistema básico de métricas y analytics
 * @module Analytics
 */

import { logger } from './logger';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  userId?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  context?: Record<string, any>;
}

class Analytics {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private metrics: PerformanceMetric[] = [];
  private isEnabled: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = !import.meta.env.DEV; // Deshabilitado en desarrollo
    this.initializePerformanceMonitoring();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializePerformanceMonitoring() {
    // Monitorear Web Vitals básicos
    if (typeof window !== 'undefined' && 'performance' in window) {
      // First Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            this.recordMetric('first_contentful_paint', entry.startTime);
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['paint'] });
      } catch (error) {
        logger.warn('No se pudo inicializar observer de performance', { error });
      }

      // Tiempo de carga
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        this.recordMetric('page_load_time', loadTime);
      });
    }
  }

  /**
   * Registrar evento de analytics
   */
  track(eventName: string, properties?: Record<string, any>, userId?: string) {
    if (!this.isEnabled) {
      logger.debug(`Analytics event: ${eventName}`, properties);
      return;
    }

    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId
    };

    this.events.push(event);
    logger.info(`Evento registrado: ${eventName}`, { properties, userId });

    // Enviar a servicio de analytics si está configurado
    this.sendToAnalyticsService(event);
  }

  /**
   * Registrar métrica de performance
   */
  recordMetric(name: string, value: number, context?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date(),
      context
    };

    this.metrics.push(metric);
    logger.debug(`Métrica registrada: ${name} = ${value}`, context);
  }

  /**
   * Medir tiempo de ejecución de una función
   */
  async measureTime<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordMetric(`${name}_error`, duration);
      throw error;
    }
  }

  /**
   * Obtener métricas de la sesión actual
   */
  getSessionMetrics() {
    return {
      sessionId: this.sessionId,
      events: this.events.length,
      metrics: this.metrics,
      duration: Date.now() - parseInt(this.sessionId.split('_')[1])
    };
  }

  /**
   * Limpiar datos de analytics
   */
  clear() {
    this.events = [];
    this.metrics = [];
  }

  /**
   * Enviar datos a servicio de analytics externo
   */
  private async sendToAnalyticsService(event: AnalyticsEvent) {
    // Aquí se podría integrar con Google Analytics, Mixpanel, etc.
    // Por ahora solo guardamos en localStorage para debugging
    try {
      const existing = JSON.parse(localStorage.getItem('analytics-events') || '[]');
      existing.push(event);
      
      // Mantener solo los últimos 100 eventos
      const recent = existing.slice(-100);
      localStorage.setItem('analytics-events', JSON.stringify(recent));
    } catch (error) {
      logger.warn('No se pudo persistir evento de analytics', { error });
    }
  }

  /**
   * Habilitar/deshabilitar analytics
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    logger.info(`Analytics ${enabled ? 'habilitado' : 'deshabilitado'}`);
  }
}

// Instancia global
export const analytics = new Analytics();

/**
 * Hook para usar analytics en componentes
 */
export function useAnalytics() {
  const trackEvent = (name: string, properties?: Record<string, any>) => {
    analytics.track(name, properties);
  };

  const measurePerformance = async <T>(name: string, fn: () => Promise<T>) => {
    return analytics.measureTime(name, fn);
  };

  return {
    trackEvent,
    measurePerformance,
    getMetrics: () => analytics.getSessionMetrics(),
    setEnabled: analytics.setEnabled.bind(analytics)
  };
}

// Eventos comunes para la plantilla de e-commerce
export const ANALYTICS_EVENTS = {
  // Navegación
  PAGE_VIEW: 'page_view',
  CATEGORY_SELECTED: 'category_selected',
  PRODUCT_VIEWED: 'product_viewed',
  
  // Carrito
  PRODUCT_ADDED_TO_CART: 'product_added_to_cart',
  CART_VIEWED: 'cart_viewed',
  CHECKOUT_STARTED: 'checkout_started',
  
  // Búsqueda y filtros
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
  
  // Interacciones
  WHATSAPP_CLICKED: 'whatsapp_clicked',
  MODAL_OPENED: 'modal_opened',
  
  // Errores
  ERROR_OCCURRED: 'error_occurred'
} as const;
