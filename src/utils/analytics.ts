
/**
 * Analytics utility for tracking user interactions
 */

export interface AnalyticsEvent {
  [key: string]: any;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  startTime: number;
  endTime: number;
}

export const ANALYTICS_EVENTS = {
  PRODUCT_VIEWED: 'product_viewed',
  CATEGORY_SELECTED: 'category_selected',
  PAGE_VIEW: 'page_view',
  BUTTON_CLICKED: 'button_clicked',
  SEARCH_PERFORMED: 'search_performed'
};

class Analytics {
  private isEnabled = !import.meta.env.DEV;

  track(eventName: string, properties?: AnalyticsEvent) {
    if (!this.isEnabled) {
      console.log(`📊 Analytics (dev): ${eventName}`, properties);
      return;
    }

    // In production, you would integrate with your analytics service
    // For now, we'll just log to console
    console.log(`📊 Analytics: ${eventName}`, properties);
  }

  page(pageName: string, properties?: AnalyticsEvent) {
    this.track('page_view', {
      page: pageName,
      ...properties
    });
  }

  identify(userId: string, traits?: AnalyticsEvent) {
    this.track('identify', {
      userId,
      ...traits
    });
  }

  async measurePerformance<T>(metricName: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await fn();
      const endTime = performance.now();
      this.track('performance_metric', {
        name: metricName,
        duration: endTime - startTime
      });
      return result;
    } catch (error) {
      const endTime = performance.now();
      this.track('performance_error', {
        name: metricName,
        duration: endTime - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
}

export const analytics = new Analytics();

// Hook for analytics
export const useAnalytics = () => {
  return {
    trackEvent: analytics.track.bind(analytics),
    measurePerformance: analytics.measurePerformance.bind(analytics)
  };
};
