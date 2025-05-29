
/**
 * Sistema de temas granular y configuración visual avanzada
 * @module Theme
 */

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
 * Tema por defecto de Urban Style
 */
export const DEFAULT_THEME: ThemeConfig = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      900: '#0c4a6e'
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      500: '#64748b',
      600: '#475569',
      700: '#334155'
    },
    accent: {
      50: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706'
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
    primary: 'Bebas Neue, Impact, sans-serif',
    secondary: 'Montserrat, system-ui, sans-serif',
    mono: 'Space Mono, Courier New, monospace'

  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  }
};

/**
 * Aplica tema personalizado al documento
 */
export function applyTheme(theme: Partial<ThemeConfig> = {}): void {
  const finalTheme = { ...DEFAULT_THEME, ...theme };
  const root = document.documentElement;
  
  // Aplicar variables CSS personalizadas
  Object.entries(finalTheme.colors.primary).forEach(([key, value]) => {
    root.style.setProperty(`--color-primary-${key}`, value);
  });
  
  Object.entries(finalTheme.colors.secondary).forEach(([key, value]) => {
    root.style.setProperty(`--color-secondary-${key}`, value);
  });
  
  // Aplicar fuentes
  root.style.setProperty('--font-primary', finalTheme.fonts.primary);
  root.style.setProperty('--font-secondary', finalTheme.fonts.secondary);
}

/**
 * Hook para gestión de temas
 */
export function useThemeConfig() {
  const applyCustomTheme = (customTheme: Partial<ThemeConfig>) => {
    applyTheme(customTheme);
    localStorage.setItem('theme-config', JSON.stringify(customTheme));
  };
  
  const resetTheme = () => {
    applyTheme(DEFAULT_THEME);
    localStorage.removeItem('theme-config');
  };
  
  const loadSavedTheme = () => {
    const saved = localStorage.getItem('theme-config');
    if (saved) {
      try {
        const customTheme = JSON.parse(saved);
        applyTheme(customTheme);
      } catch (error) {
        console.warn('Error al cargar tema guardado:', error);
        resetTheme();
      }
    }
  };
  
  return {
    applyCustomTheme,
    resetTheme,
    loadSavedTheme,
    defaultTheme: DEFAULT_THEME
  };
}
