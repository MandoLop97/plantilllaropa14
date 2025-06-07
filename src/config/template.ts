
// Configuración específica para el uso como plantilla
export const TEMPLATE_CONFIG = {
  // Información de la plantilla
  name: 'Urban Style E-commerce Template',
  version: '2.0.0',
  description: 'Plantilla de e-commerce moderna con React, TypeScript y Supabase',
  
  // Configuración de desarrollo
  development: {
    useLocalData: false, // true para usar datos locales, false para Supabase
    enableDataSync: true, // Habilitar herramientas de sincronización
    showDebugInfo: false // Mostrar información de debug
  },
  
  // Configuración de producción
  production: {
    useLocalData: false, // Siempre usar Supabase en producción
    enableDataSync: true,
    showDebugInfo: true
  },
  
  // Configuración de Supabase
  supabase: {
    enabled: true,
    tables: {
      products: 'productos',
      categories: 'categorias',
      businesses: 'negocios'
    }
  },
  
  // Características de la plantilla
  features: {
    cart: true,
    productFilters: true,
    whatsappIntegration: true,
    responsiveDesign: true,
    animations: true,
    supabaseIntegration: true
  }
} as const;

// Función para obtener configuración según el entorno
export const getTemplateConfig = () => {
  const isDevelopment = import.meta.env.DEV;
  return isDevelopment ? TEMPLATE_CONFIG.development : TEMPLATE_CONFIG.production;
};
