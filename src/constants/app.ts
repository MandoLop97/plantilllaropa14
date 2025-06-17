
import { BUSINESS_CONFIG } from '../config/business';

export const APP_CONFIG = {
  WHATSAPP_NUMBER: BUSINESS_CONFIG.whatsapp,
  AUTOPLAY_DELAY: 4000,
  MOBILE_BREAKPOINT: 768,
  PRICE_RANGE: {
    MIN: 0,
    MAX: 1500
  },
  ANIMATION_DELAYS: {
    CATEGORY_TRANSITION: 0.5,
    PRODUCT_GRID_DELAY: 0.08,
    PRODUCT_ANIMATION: 0.4
  }
} as const;

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/productos'
} as const;

export const UI_CONFIG = {
  GRID_COLUMNS: {
    MOBILE: 'grid-cols-2',
    TABLET: 'md:grid-cols-3',
    DESKTOP: 'lg:grid-cols-4'
  },
  CONTAINER_CLASSES: 'container mx-auto px-2 sm:px-4',
  TRANSITION_CLASSES: 'transition-all duration-200 transform hover:scale-105'
} as const;

// Configuración de la interfaz específica para plantilla
export const TEMPLATE_CONFIG = {
  // Configuración del tema
  THEME: {
    PRIMARY_COLOR: 'primary',
    BORDER_RADIUS: 'rounded-2xl',
    SHADOW: 'shadow-lg'
  },
  
  // Configuración de animaciones
  ANIMATIONS: {
    ENABLED: true,
    DURATION: 300,
    EASING: 'ease-out'
  },
  
  // Configuración de layout
  LAYOUT: {
    MAX_WIDTH: 'max-w-7xl',
    PADDING: 'px-4 sm:px-6 lg:px-8',
    GAP: 'gap-6'
  }
} as const;
