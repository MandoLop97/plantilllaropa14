
import { useEffect } from 'react';
import { useDynamicBusinessConfig } from './useDynamicBusinessConfig';
import { logger } from '../utils/logger';

export const useDynamicPageMeta = () => {
  const businessConfig = useDynamicBusinessConfig();

  useEffect(() => {
    if (businessConfig.loading) return;

    try {
      // Actualizar título dinámicamente
      const title = `${businessConfig.name}: ${businessConfig.description}`;
      document.title = title;
      
      // Actualizar favicon dinámicamente
      if (businessConfig.logo.url) {
        // Remover favicon existente
        const existingFavicon = document.querySelector('link[rel="icon"]');
        if (existingFavicon) {
          existingFavicon.remove();
        }
        
        // Crear nuevo favicon
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        favicon.href = businessConfig.logo.url;
        document.head.appendChild(favicon);
        
        logger.info('🎨 Favicon y título actualizados dinámicamente:', {
          title,
          faviconUrl: businessConfig.logo.url,
          businessName: businessConfig.name
        });
      }
      
      // Actualizar meta tags Open Graph
      updateMetaTag('og:title', businessConfig.name);
      updateMetaTag('og:description', businessConfig.description);
      updateMetaTag('og:image', businessConfig.logo.url);
      
      // Actualizar meta tags Twitter
      updateMetaTag('twitter:image', businessConfig.logo.url);
      updateMetaTag('description', businessConfig.description);
      
    } catch (error) {
      logger.error('❌ Error actualizando meta datos:', undefined, error as Error);
    }
  }, [businessConfig]);

  return businessConfig;
};

// Función auxiliar para actualizar meta tags
const updateMetaTag = (property: string, content: string) => {
  if (!content) return;
  
  const selectors = [
    `meta[property="${property}"]`,
    `meta[name="${property}"]`
  ];
  
  for (const selector of selectors) {
    const meta = document.querySelector(selector);
    if (meta) {
      meta.setAttribute('content', content);
      return;
    }
  }
  
  // Si no existe, crear el meta tag
  const meta = document.createElement('meta');
  if (property.startsWith('og:') || property.startsWith('twitter:')) {
    meta.setAttribute('property', property);
  } else {
    meta.setAttribute('name', property);
  }
  meta.setAttribute('content', content);
  document.head.appendChild(meta);
};
