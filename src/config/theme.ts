
/**
 * Sistema de temas granular y configuración visual avanzada
 * @module Theme
 */

import type { ThemeConfigJson } from '../api/supabase/themeConfig';
import { logger } from '../utils/logger';

/**
 * Tonos estándar de Tailwind
 */
export const TAILWIND_TONES = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950'
];

const DEFAULT_AUTO_COLOR = '#000000';

export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
    900: string;
  };
  secondary: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };
  accent: {
    50: string;
    500: string;
    600: string;
  };
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    500: string;
    700: string;
    900: string;
  };
}

export interface ThemeConfig {
  colors: ThemeColors;
  fonts: {
    primary: string;
    secondary: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

/**
 * Configuración de tema por defecto utilizada como fallback
 */
export const DEFAULT_THEME: ThemeConfig = {
  colors: {
    primary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      900: '#0f172a'
    },
    secondary: {
      50: '#fefaec',
      100: '#fbf1ca',
      500: '#eba01e',
      600: '#cf7710',
      700: '#ac5511'
    },
    accent: {
      50: '#fef3c7',
      500: '#ca8a04',
      600: '#a16207'
    },
    neutral: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      500: '#71717a',
      700: '#3f3f46',
      900: '#18181b'
    }
  },
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    secondary: 'Poppins, system-ui, sans-serif',
    mono: 'Menlo, monospace'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.5rem',
    xl: '1rem'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  }
};

/**
 * Aplica las variables CSS correspondientes a la configuración dada
 */
export function applyTheme(theme: ThemeConfig): void {
  const root = document.documentElement;

  const applyPalette = (name: string, palette: Record<string, string>) => {
    Object.entries(palette).forEach(([tone, value]) => {
      root.style.setProperty(`--color-${name}-${tone}`, String(value));
    });
    if (palette['500']) {
      root.style.setProperty(`--color-${name}`, String(palette['500']));
    }
  };

  applyPalette('primary', theme.colors.primary);
  applyPalette('secondary', theme.colors.secondary);
  applyPalette('accent', theme.colors.accent);
  applyPalette('neutral', theme.colors.neutral);

  root.style.setProperty('--font-primary', theme.fonts.primary);
  root.style.setProperty('--font-secondary', theme.fonts.secondary);
  root.style.setProperty('--font-mono', theme.fonts.mono);

  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, String(value));
  });

  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, String(value));
  });

  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, String(value));
  });

  Object.entries(theme.breakpoints).forEach(([key, value]) => {
    root.style.setProperty(`--breakpoint-${key}`, String(value));
  });
}

/**
 * Aplica un tema proveniente de Supabase usando JSON libre - MEJORADO
 */
export function applyThemeFromJson(config: ThemeConfigJson): void {
   logger.debug('🎨 Aplicando tema desde JSON:', config);
  const root = document.documentElement;
  const darkRules: string[] = [];

  const normalizeHsl = (val: string): string => {
    const m = val.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/i);
    if (m) {
      return `${m[1]} ${m[2]}% ${m[3]}%`;
    }
    return val;
  };

  // Función auxiliar para aplicar una paleta de colores
  const applyPalette = (palette: Record<string, string>, isDark = false) => {
     logger.debug(`🎨 Aplicando paleta ${isDark ? 'oscura' : 'clara'}:`, palette);
    Object.entries(palette).forEach(([key, value]) => {
      const parsed = normalizeHsl(String(value));
      if (isDark) {
        const darkVar = `--color-${key}-dark`;
        root.style.setProperty(darkVar, parsed);
        darkRules.push(`--color-${key}: var(${darkVar})`);
         logger.debug(`🌙 Variable oscura aplicada: ${darkVar} = ${parsed}`);
      } else {
        const lightVar = `--color-${key}`;
        root.style.setProperty(lightVar, parsed);
         logger.debug(`☀️ Variable clara aplicada: ${lightVar} = ${parsed}`);
      }
    });
  };

  // Aplicar colores claros
  if (config?.colors?.light) {
     logger.debug('🎨 Aplicando colores claros');
    applyPalette(config.colors.light);
  }

  // Aplicar colores oscuros
  if (config?.colors?.dark) {
     logger.debug('🎨 Aplicando colores oscuros');
    applyPalette(config.colors.dark, true);
  }

  // Aplicar paletas personalizadas - MEJORADO PARA COINCIDENCIA EXACTA CON TAILWIND
  const customPalette = config?.colors?.customPalette || config?.customPalette;
  if (customPalette) {
     logger.debug('🎨 Aplicando paletas personalizadas:', customPalette);
    Object.entries(customPalette).forEach(([name, palette]) => {
       logger.debug(`🎨 Procesando paleta personalizada: ${name}`);

      const tones = palette as Record<string, string>;
      TAILWIND_TONES.forEach((tone) => {
        let val = tones[tone];
        if (!val) {
          const numeric = parseInt(tone, 10);
          let nearest: string | null = null;
          let diff = Infinity;
          Object.keys(tones).forEach((t) => {
            const d = Math.abs(parseInt(t, 10) - numeric);
            if (d < diff) {
              diff = d;
              nearest = t;
            }
          });
          if (nearest) {
            val = tones[nearest];
            logger.debug(`🛠️ Tono ${tone} agregado automáticamente para ${name} usando ${nearest}`);
          } else {
            val = DEFAULT_AUTO_COLOR;
            logger.debug(`🛠️ Tono ${tone} agregado automáticamente para ${name} con color predeterminado`);
          }
        }
        const cssVar = `--color-${name}-${tone}`;
        const parsed = normalizeHsl(String(val));
        root.style.setProperty(cssVar, parsed);

         logger.debug(`🎨 Variable aplicada: ${cssVar} = ${parsed}`);
      });

      // Si es una paleta principal, también aplicar como variable principal para compatibilidad
      if (name === 'primary') {
        const mainColor = tones['500'] || tones['600'] || DEFAULT_AUTO_COLOR;
        if (mainColor) {
          root.style.setProperty('--color-primary', normalizeHsl(String(mainColor)));
        }
      }
      if (name === 'secondary') {
        const mainColor = tones['500'] || tones['600'] || DEFAULT_AUTO_COLOR;
        if (mainColor) {
          root.style.setProperty('--color-secondary', normalizeHsl(String(mainColor)));
        }
      }
      if (name === 'accent') {
        const mainColor = tones['500'] || tones['600'] || DEFAULT_AUTO_COLOR;
        if (mainColor) {
          root.style.setProperty('--color-accent', normalizeHsl(String(mainColor)));
        }
      }
    });
  }

  // Crear estilos para modo oscuro si hay reglas oscuras
  if (darkRules.length > 0) {
    let style = document.getElementById('theme-dark-vars') as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = 'theme-dark-vars';
      document.head.appendChild(style);
    }
    style.textContent = `.dark {\n  ${darkRules.join(';\n  ')};\n}`; 
     logger.debug('🌙 Estilos de modo oscuro aplicados');
  } else {
    const style = document.getElementById('theme-dark-vars') as HTMLStyleElement | null;
    if (style) {
      if (typeof style.remove === 'function') {
        style.remove();
      } else {
        style.textContent = '';
      }
    }
  }

  // Aplicar tipografía
  if (config?.typography?.fontFamily) {
     logger.debug('🎨 Aplicando tipografía:', config.typography.fontFamily);
    const fonts = config.typography.fontFamily as Record<string, string>;
    
    Object.entries(fonts).forEach(([key, value]) => {
      if (value) {
        const fontVar = `--font-${key}`;
        root.style.setProperty(fontVar, value);
         logger.debug(`🔤 Fuente aplicada: ${fontVar} = ${value}`);
      }
    });
  }

  // Aplicar espaciado
  if (config?.spacing) {
     logger.debug('🎨 Aplicando espaciado:', config.spacing);
    Object.entries(config.spacing).forEach(([key, value]) => {
      const spacingVar = `--spacing-${key}`;
      root.style.setProperty(spacingVar, String(value));
       logger.debug(`📏 Espaciado aplicado: ${spacingVar} = ${value}`);
    });
  }

  // Aplicar border radius
  if (config?.borderRadius) {
     logger.debug('🎨 Aplicando border radius:', config.borderRadius);
    Object.entries(config.borderRadius).forEach(([key, value]) => {
      const radiusVar = `--radius-${key}`;
      root.style.setProperty(radiusVar, String(value));
       logger.debug(`🔄 Border radius aplicado: ${radiusVar} = ${value}`);
    });
  }

  // Aplicar sombras
  if (config?.shadows) {
     logger.debug('🎨 Aplicando sombras:', config.shadows);
    Object.entries(config.shadows).forEach(([key, value]) => {
      const shadowVar = `--shadow-${key}`;
      root.style.setProperty(shadowVar, String(value));
       logger.debug(`🌫️ Sombra aplicada: ${shadowVar} = ${value}`);
    });
  }

  // Aplicar configuración de botones
  if (config?.buttons) {
     logger.debug('🎨 Aplicando configuración de botones:', config.buttons);
    
    if (config.buttons.variants) {
      Object.entries(config.buttons.variants).forEach(([key, value]) => {
        const buttonVar = `--button-variant-${key}`;
        root.style.setProperty(buttonVar, String(value));
         logger.debug(`🔘 Variante de botón aplicada: ${buttonVar} = ${value}`);
      });
    }
    
    if (config.buttons.sizes) {
      Object.entries(config.buttons.sizes).forEach(([key, value]) => {
        const buttonVar = `--button-size-${key}`;
        root.style.setProperty(buttonVar, String(value));
         logger.debug(`📐 Tamaño de botón aplicado: ${buttonVar} = ${value}`);
      });
    }
  }

   logger.debug('✅ Tema aplicado completamente desde JSON');
}

/**
 * Hook para gestión de temas - Solo para cargar desde Supabase
 */
export function useThemeConfig() {
  const loadSavedTheme = () => {
    // Los temas ahora se cargan únicamente desde Supabase a través de useTemaConfig
     logger.debug('🎨 Los temas se cargan desde Supabase únicamente');
  };
  
  return {
    loadSavedTheme
  };
}
