export interface ThemeBackup {
  colors?: Record<string, unknown>;
  typography?: Record<string, unknown>;
  spacing?: Record<string, unknown>;
  borderRadius?: Record<string, unknown>;
  shadows?: Record<string, unknown>;
  buttons?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface UserPreferences {
  language?: string;
  darkMode?: boolean;
  currency?: string;
  [key: string]: unknown;
}

import type { CartItem } from './cart';

export interface CartBackup {
  items: CartItem[];
}

import type { PerformanceMetric } from '../utils/analytics';

export interface AnalyticsData {
  sessionId: string;
  events: number;
  metrics: PerformanceMetric[];
  duration: number;
}
