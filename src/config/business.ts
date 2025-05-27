
import { useState, useEffect } from 'react';
import { BusinessService } from '../services/supabase/business';

const BUSINESS_ID = 'b73218d6-186e-4bc0-8956-4b3db300abb4';

// Recupera los datos del negocio desde Supabase
const fetchNegocio = async () => {
  try {
    const data = await BusinessService.getBusinessById(BUSINESS_ID);

    if (!data) {
      console.warn('Negocio no encontrado');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchNegocio:', error);
    return null;
  }
};

// Configuración por defecto (fallback)
const DEFAULT_CONFIG = {
  name: 'Verduras chino',
  description: 'Tu rincón de verduras frescas y saludables',
  tagline: 'Del campo a tu mesa, con sabor y calidad natural',
  logo: {
    url: 'https://yxrkezxytovaxlpjnbda.supabase.co/storage/v1/object/public/infonegocio/Logo/b73218d6-186e-4bc0-8956-4b3db300abb4/1748140857465.png',
    alt: 'Logo Urban Style'
  },
  banner: {
    url: 'https://yxrkezxytovaxlpjnbda.supabase.co/storage/v1/object/public/infonegocio/Banner/b73218d6-186e-4bc0-8956-4b3db300abb4/1748140454942.png',
    alt: 'Banner Urban Style'
  }
};


// Hook para obtener configuración dinámica del negocio
export const useBusinessConfig = () => {
  const [config, setConfig] = useState({
    ...DEFAULT_CONFIG,
    loading: true,
    error: null as string | null
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await fetchNegocio();

        if (data) {
          setConfig({
            name: data.nombre || DEFAULT_CONFIG.name,
            description: data.descripcion || DEFAULT_CONFIG.description,
            tagline: DEFAULT_CONFIG.tagline,
            logo: {
              url: data.logo_url || DEFAULT_CONFIG.logo.url,
              alt: `Logo ${data.nombre || DEFAULT_CONFIG.name}`
            },
            banner: {
              url: data.banner_url || DEFAULT_CONFIG.banner.url,
              alt: `Banner ${data.nombre || DEFAULT_CONFIG.name}`
            },
            loading: false,
            error: null
          });
        } else {
          setConfig(cfg => ({ ...cfg, loading: false, error: 'Negocio no encontrado' }));
        }
      } catch (err) {
        console.error('Error loading business data:', err);
        setConfig(cfg => ({ ...cfg, loading: false, error: 'Error al cargar los datos del negocio' }));
      }
    };

    fetchConfig();
  }, []);

  return config;
};

// Configuración específica del negocio - Mantiene compatibilidad con código existente
export const BUSINESS_CONFIG = {
  // Información del negocio
  name: 'Urban Style',
  description: 'Tu rincón de verduras frescas y saludables',
  tagline: 'Del campo a tu mesa, con sabor y calidad natural',
  
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
