
import { useEffect } from 'react';
import { useDynamicBusinessConfig } from './useDynamicBusinessConfig';
import { useDynamicManifest } from './useDynamicManifest';
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

export const useDynamicPageMeta = () => {
  const businessConfig = useDynamicBusinessConfig();
  const { config: themeConfig } = useThemeConfigData();
  
  // Update manifest dynamically
  useDynamicManifest();

  useEffect(() => {
    if (businessConfig.loading) return;

    try {
      // Update title dynamically
      const title = `${businessConfig.name}: ${businessConfig.description}`;
      document.title = title;
      
      // Get primary color for theme
      let primaryColor = '#000000';
      const color500 =
        themeConfig?.colors?.customPalette?.primary?.['500'] ||
        themeConfig?.colors?.light?.['primary-500'];

      if (color500) {
        primaryColor = normalizeColor(color500);
        const bgVal = primaryColor.replace(/hsl\(|\)/g, '').trim();
        document.documentElement.style.setProperty('--background', bgVal);
      }
      
      // Update favicon dynamically with comprehensive mobile support
      if (businessConfig.logo.url) {
        // Remove ALL existing favicons and apple touch icons
        const existingIcons = document.querySelectorAll('link[rel*="icon"], link[rel*="apple-touch-icon"], link[rel*="shortcut"]');
        existingIcons.forEach(icon => icon.remove());
        
        // Standard favicon
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        favicon.href = businessConfig.logo.url;
        document.head.appendChild(favicon);
        
        // Shortcut icon for older browsers
        const shortcutIcon = document.createElement('link');
        shortcutIcon.rel = 'shortcut icon';
        shortcutIcon.href = businessConfig.logo.url;
        document.head.appendChild(shortcutIcon);
        
        // Comprehensive Apple Touch Icons for all iOS devices
        const appleTouchIconSizes = [
          '180x180', // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus, X, XS, XS Max, XR, 11, 11 Pro, 11 Pro Max, 12, 12 Pro, 12 Pro Max, 13, 14, 15
          '167x167', // iPad Pro 12.9" 2nd gen
          '152x152', // iPad mini, iPad Air, iPad Pro 9.7"
          '144x144', // IE11 Tiles
          '120x120', // iPhone 4, 4S, 5, 5C, 5S, 6, 6S, 7, 8, SE
          '114x114', // iPhone 4, 4S Retina
          '76x76',   // iPad
          '72x72',   // iPad mini
          '60x60',   // iPhone 3GS
          '57x57'    // iPhone original, 3G
        ];
        
        appleTouchIconSizes.forEach(size => {
          const appleTouchIcon = document.createElement('link');
          appleTouchIcon.rel = 'apple-touch-icon';
          appleTouchIcon.setAttribute('sizes', size);
          appleTouchIcon.href = businessConfig.logo.url;
          document.head.appendChild(appleTouchIcon);
        });
        
        // Apple Touch Icon without sizes (fallback)
        const appleTouchIconDefault = document.createElement('link');
        appleTouchIconDefault.rel = 'apple-touch-icon';
        appleTouchIconDefault.href = businessConfig.logo.url;
        document.head.appendChild(appleTouchIconDefault);
        
        // Apple Touch Icon precomposed (for older iOS versions)
        const appleTouchIconPrecomposed = document.createElement('link');
        appleTouchIconPrecomposed.rel = 'apple-touch-icon-precomposed';
        appleTouchIconPrecomposed.href = businessConfig.logo.url;
        document.head.appendChild(appleTouchIconPrecomposed);
        
        logger.info('🎨 Comprehensive favicon and mobile icons updated:', {
          title,
          iconUrl: businessConfig.logo.url,
          businessName: businessConfig.name,
          primaryColor
        });
      }
      
      // Update meta tags for PWA with business color
      updateMetaTag('description', businessConfig.description);
      updateMetaTag('theme-color', primaryColor);
      updateMetaTag('msapplication-TileColor', primaryColor);
      updateMetaTag('msapplication-TileImage', businessConfig.logo.url);
      
      // Update Open Graph meta tags
      updateMetaTag('og:title', businessConfig.name);
      updateMetaTag('og:description', businessConfig.description);
      updateMetaTag('og:image', businessConfig.logo.url);
      updateMetaTag('og:type', 'website');
      
      // Update Twitter meta tags
      updateMetaTag('twitter:card', 'summary_large_image');
      updateMetaTag('twitter:image', businessConfig.logo.url);
      updateMetaTag('twitter:title', businessConfig.name);
      updateMetaTag('twitter:description', businessConfig.description);
      
      // Add iOS specific meta tags for PWA
      updateMetaTag('apple-mobile-web-app-capable', 'yes');
      updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
      updateMetaTag('apple-mobile-web-app-title', businessConfig.name);
      
      // Add viewport meta tag if not exists
      if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
        document.head.appendChild(viewport);
      }
      
    } catch (error) {
      logger.error('❌ Error updating PWA meta data:', undefined, error as Error);
    }
  }, [businessConfig, themeConfig]);

  return businessConfig;
};

// Helper function to update meta tags
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
  
  // If doesn't exist, create the meta tag
  const meta = document.createElement('meta');
  if (property.startsWith('og:') || property.startsWith('twitter:')) {
    meta.setAttribute('property', property);
  } else {
    meta.setAttribute('name', property);
  }
  meta.setAttribute('content', content);
  document.head.appendChild(meta);
};
