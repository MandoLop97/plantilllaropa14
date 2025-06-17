
import { useEffect } from 'react';

const fetchImageAsDataURL = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to convert image'));
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    logger.error('Failed to fetch icon for manifest', undefined, err as Error);
    return url;
  }
};
import { useDynamicBusinessConfig } from './useDynamicBusinessConfig';
import { useThemeConfigData } from '../contexts/ThemeConfigContext';
import { logger } from '../utils/logger';

const normalizeColor = (val: string): string => {
  const trimmed = val.trim();
  if (trimmed.startsWith('#')) {
    return trimmed;
  }
  const hslMatch = trimmed.match(/hsla?\(([^)]+)\)/i);
  if (hslMatch) {
    return `hsl(${hslMatch[1].trim()})`;
  }
  const spaceMatch = trimmed.match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (spaceMatch) {
    return `hsl(${spaceMatch[1]} ${spaceMatch[2]}% ${spaceMatch[3]}%)`;
  }
  return trimmed;
};

export const useDynamicManifest = () => {
  const businessConfig = useDynamicBusinessConfig();
  const { config: themeConfig } = useThemeConfigData();

  useEffect(() => {
    if (businessConfig.loading) return;

    const updateManifest = async () => {
      try {
        const iconDataUrl = await fetchImageAsDataURL(businessConfig.logo.url);
      // Remove existing manifest
      const existingManifest = document.querySelector('link[rel="manifest"]');
      if (existingManifest) {
        existingManifest.remove();
      }

      // Get primary color from theme config or use default
      let primaryColor = '#000000';

      const color500 =
        themeConfig?.colors?.customPalette?.primary?.['500'] ||
        themeConfig?.colors?.light?.['primary-500'];

      if (color500) {
        primaryColor = normalizeColor(color500);
      }

      // Create dynamic manifest with business colors
      const manifest = {
        name: businessConfig.name,
        short_name: businessConfig.name.substring(0, 12),
        description: businessConfig.description,
        start_url: '/',
        display: 'standalone',
        background_color: primaryColor, // Use business primary color
        theme_color: primaryColor, // Use business primary color
        orientation: 'portrait-primary',
        icons: [
          {
            src: iconDataUrl,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: iconDataUrl,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: iconDataUrl,
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: iconDataUrl,
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: iconDataUrl,
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: iconDataUrl,
            sizes: '120x120',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: iconDataUrl,
            sizes: '114x114',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: iconDataUrl,
            sizes: '76x76',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: iconDataUrl,
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: iconDataUrl,
            sizes: '60x60',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: iconDataUrl,
            sizes: '57x57',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        categories: ['shopping', 'business'],
        lang: 'es',
        dir: 'ltr'
      };

      // Create blob and URL for manifest
      const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], {
        type: 'application/json'
      });
      const manifestUrl = URL.createObjectURL(manifestBlob);

      // Add new manifest link
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = manifestUrl;
      document.head.appendChild(manifestLink);

      logger.info('🔧 Dynamic manifest updated with business colors:', {
        name: businessConfig.name,
        iconUrl: businessConfig.logo.url,
        primaryColor,
        backgroundColor: primaryColor
      });

    } catch (error) {
      logger.error('❌ Error updating dynamic manifest:', undefined, error as Error);
    }
    // end updateManifest
    };

    updateManifest();
  }, [businessConfig, themeConfig]);

  return businessConfig;
};
