
import { useBusinessData } from '../hooks/useBusinessData';

// Configuración por defecto (fallback)
const DEFAULT_CONFIG = {
  name: 'Urban Style',
  description: 'Tu destino para la moda urbana más fresca',
  tagline: 'Calidad, estilo y autenticidad en cada prenda',
  logo: {
    url: 'https://cdn.abacus.ai/images/65fc5268-61a6-423e-b9f1-2a8fa1e3681d.png',
    alt: 'Logo Urban Style'
  },
  banner: {
    url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop&q=80',
    alt: 'Banner Urban Style'
  }
};

// Hook para obtener configuración dinámica del negocio
export const useBusinessConfig = () => {
  const { businessData, loading, error } = useBusinessData();
  
  if (loading || error || !businessData) {
    return {
      ...DEFAULT_CONFIG,
      loading,
      error
    };
  }

  return {
    name: businessData.nombre || DEFAULT_CONFIG.name,
    description: businessData.descripcion || DEFAULT_CONFIG.description,
    tagline: DEFAULT_CONFIG.tagline,
    logo: {
      url: businessData.logo_url || DEFAULT_CONFIG.logo.url,
      alt: `Logo ${businessData.nombre || DEFAULT_CONFIG.name}`
    },
    banner: {
      url: businessData.banner_url || DEFAULT_CONFIG.banner.url,
      alt: `Banner ${businessData.nombre || DEFAULT_CONFIG.name}`
    },
    loading: false,
    error: null
  };
};

// Configuración específica del negocio - Mantiene compatibilidad con código existente
export const BUSINESS_CONFIG = {
  // Información del negocio
  name: 'Urban Style',
  description: 'Tu destino para la moda urbana más fresca',
  tagline: 'Calidad, estilo y autenticidad en cada prenda',
  
  // Contacto
  whatsapp: '524622364910',
  
  // Horarios
  schedule: {
    weekdays: 'Lun-Vie: 9-18h',
    saturday: 'Sáb: 10-16h',
    sunday: 'Dom: Cerrado',
    status: '¡Estamos atendiendo!'
  },
  
  // Redes sociales
  social: {
    facebook: 'https://facebook.com/',
  },
  
  // Logo
  logo: {
    url: 'https://cdn.abacus.ai/images/65fc5268-61a6-423e-b9f1-2a8fa1e3681d.png',
    alt: 'Logo Urban Style'
  }
} as const;

// Configuración de la tienda
export const STORE_CONFIG = {
  // Configuración de productos
  defaultCategory: 'camisetas',
  productsPerPage: 12,
  
  // Configuración de precios
  currency: '$',
  locale: 'es-MX',
  
  // Configuración del carrito
  maxQuantityPerItem: 99,
  
  // Textos de la tienda
  texts: {
    noProducts: 'No se encontraron productos',
    noProductsDescription: 'Prueba ajustando los filtros para encontrar lo que buscas',
    viewMore: 'Ver más productos',
    addToCart: 'Agregar al carrito',
    viewOrder: 'Ver pedido',
    clearFilters: 'Limpiar filtros'
  }
} as const;
