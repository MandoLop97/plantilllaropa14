
import { useState, useEffect } from 'react';
import { BusinessService } from '../api/supabase/business';
import { useDynamicBusinessId } from '../contexts/DynamicBusinessIdContext';
import { logger } from '../utils/logger';

interface BusinessConfig {
  id: string;
  name: string;
  description: string;
  tagline: string;
  logo: {
    url: string;
    alt: string;
  };
  banner: {
    url: string;
    alt: string;
  };
  loading: boolean;
  error: string | null;
  isFromDynamicSubdomain: boolean;
}

// Default configuration (fallback)
const DEFAULT_CONFIG = {
  name: 'Verduras chino',
  description: 'Tu rincón de verduras frescas y saludables',
  tagline: 'Del campo a tu mesa, con sabor y calidad natural',
  logo: {
    url: 'https://yxrkezxytovaxlpjnbda.supabase.co/storage/v1/object/public/infonegocio/Logo/b73218d6-186e-4bc0-8956-4b3db300abb4/1748140857465.png',
    alt: 'Logo del negocio'
  },
  banner: {
    url: 'https://yxrkezxytovaxlpjnbda.supabase.co/storage/v1/object/public/infonegocio/Banner/b73218d6-186e-4bc0-8956-4b3db300abb4/1748140454942.png',
    alt: 'Banner del negocio'
  }
};

export const useDynamicBusinessConfig = () => {
  const { businessId, subdomain, businessData, isLoading: dynamicLoading, error: dynamicError } = useDynamicBusinessId();
  const [config, setConfig] = useState<BusinessConfig>({
    id: '',
    name: '',
    description: '',
    tagline: '',
    logo: { url: '', alt: '' },
    banner: { url: '', alt: '' },
    loading: true,
    error: null,
    isFromDynamicSubdomain: false
  });

  useEffect(() => {
    const loadBusinessConfig = async () => {
      if (dynamicLoading) {
        setConfig(prev => ({ ...prev, loading: true, error: null }));
        return;
      }

      if (dynamicError) {
        setConfig(prev => ({ 
          ...prev, 
          loading: false, 
          error: dynamicError 
        }));
        return;
      }

      try {
        setConfig(prev => ({ ...prev, loading: true, error: null }));

        let businessInfo = businessData;
        const isFromSubdomain = !!subdomain && !!businessData;

        // If we don't have business data from subdomain, fetch by ID
        if (!businessInfo && businessId) {
          logger.info('🏢 Fetching business config by ID:', { businessId });
          businessInfo = await BusinessService.getBusinessById(businessId);
        }

        if (businessInfo) {
          setConfig({
            id: businessInfo.id,
            name: businessInfo.nombre || DEFAULT_CONFIG.name,
            description: businessInfo.descripcion || DEFAULT_CONFIG.description,
            tagline: DEFAULT_CONFIG.tagline,
            logo: {
              url: businessInfo.logo_url || DEFAULT_CONFIG.logo.url,
              alt: `Logo ${businessInfo.nombre || DEFAULT_CONFIG.name}`
            },
            banner: {
              url: businessInfo.banner_url || DEFAULT_CONFIG.banner.url,
              alt: `Banner ${businessInfo.nombre || DEFAULT_CONFIG.name}`
            },
            loading: false,
            error: null,
            isFromDynamicSubdomain: isFromSubdomain
          });

          logger.info('🏢 Business config loaded successfully:', {
            id: businessInfo.id,
            name: businessInfo.nombre,
            isFromSubdomain
          });
        } else {
          // Use default config as fallback
          setConfig({
            id: businessId || '',
            ...DEFAULT_CONFIG,
            loading: false,
            error: subdomain ? 'Negocio no encontrado para este subdominio' : null,
            isFromDynamicSubdomain: false
          });

          logger.warn('🏢 Using default business config', { businessId, subdomain });
        }
      } catch (err) {
        logger.error('🏢 Error loading business config:', undefined, err as Error);
        setConfig({
          id: businessId || '',
          ...DEFAULT_CONFIG,
          loading: false,
          error: 'Error al cargar la configuración del negocio',
          isFromDynamicSubdomain: false
        });
      }
    };

    loadBusinessConfig();
  }, [businessId, subdomain, businessData, dynamicLoading, dynamicError]);

  return config;
};
