
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TemaConfig } from '@/lib/supabase';

export function useTemaConfig(negocioId: string | null) {
  const [temaConfig, setTemaConfig] = useState<TemaConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!negocioId) {
      setLoading(false);
      return;
    }

    fetchTemaConfig();
  }, [negocioId]);

  const fetchTemaConfig = async () => {
    if (!negocioId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tema_config')
        .select('*')
        .eq('negocio_id', negocioId)
        .maybeSingle();

      if (error) throw error;

      setTemaConfig(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomPalette = async (colorType: 'primary' | 'secondary' | 'accent' | 'neutral', palette: Record<string, string>) => {
    if (!negocioId) return;

    try {
      if (temaConfig) {
        // Update existing config - merge with existing configuration
        const currentConfig = temaConfig.configuracion || {};
        const updatedConfig = {
          ...currentConfig,
          colors: {
            ...currentConfig.colors,
            customPalette: {
              ...currentConfig.colors?.customPalette,
              [colorType]: palette
            }
          }
        };

        const { error } = await supabase
          .from('tema_config')
          .update({
            configuracion: updatedConfig
          })
          .eq('id', temaConfig.id);

        if (error) throw error;
      } else {
        // Create new config with the complete structure
        const defaultConfig = {
          cards: {
            base: "rounded-lg border bg-card text-card-foreground shadow-sm"
          },
          colors: {
            light: {
              card: "#ffffff",
              ring: "#020817",
              input: "#e2e8f0",
              muted: "#f1f5f9",
              accent: "#f1f5f9",
              border: "#e2e8f0",
              popover: "#ffffff",
              primary: "#0f172a",
              secondary: "#f1f5f9",
              background: "#ffffff",
              foreground: "#020817",
              destructive: "#ef4444",
              "sidebar-ring": "#3b82f6",
              "sidebar-accent": "#f4f4f5",
              "sidebar-border": "#e5e7eb",
              "card-foreground": "#020817",
              "sidebar-primary": "#18181b",
              "muted-foreground": "#64748b",
              "accent-foreground": "#0f172a",
              "popover-foreground": "#020817",
              "primary-foreground": "#f8fafc",
              "sidebar-background": "#fafafa",
              "sidebar-foreground": "#3f3f46",
              "secondary-foreground": "#0f172a",
              "destructive-foreground": "#f8fafc",
              "sidebar-accent-foreground": "#18181b",
              "sidebar-primary-foreground": "#fafafa"
            },
            dark: {
              card: "#020817",
              ring: "#cbd5e1",
              input: "#1e293b",
              muted: "#1e293b",
              accent: "#1e293b",
              border: "#1e293b",
              popover: "#020817",
              primary: "#f8fafc",
              secondary: "#1e293b",
              background: "#020817",
              foreground: "#f8fafc",
              destructive: "#7f1d1d",
              "sidebar-ring": "#3b82f6",
              "sidebar-accent": "#27272a",
              "sidebar-border": "#27272a",
              "card-foreground": "#f8fafc",
              "sidebar-primary": "#1d4ed8",
              "muted-foreground": "#94a3b8",
              "accent-foreground": "#f8fafc",
              "popover-foreground": "#f8fafc",
              "primary-foreground": "#0f172a",
              "sidebar-background": "#18181b",
              "sidebar-foreground": "#f4f4f5",
              "secondary-foreground": "#f8fafc",
              "destructive-foreground": "#f8fafc",
              "sidebar-accent-foreground": "#f4f4f5",
              "sidebar-primary-foreground": "#ffffff"
            },
            customPalette: {
              [colorType]: palette
            }
          },
          buttons: {
            variants: {
              default: "bg-primary text-primary-foreground hover:bg-primary/90",
              destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
              secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              ghost: "hover:bg-accent hover:text-accent-foreground",
              link: "text-primary underline-offset-4 hover:underline"
            },
            sizes: {
              default: "h-10 px-4 py-2",
              sm: "h-9 rounded-md px-3",
              lg: "h-11 rounded-md px-8",
              icon: "h-10 w-10"
            }
          },
          effects: {
            keyframes: ["accordion-down", "accordion-up", "fade-in", "scale-in", "logo-spin"],
            animations: {
              "accordion-down": "accordion-down 0.2s ease-out",
              "accordion-up": "accordion-up 0.2s ease-out",
              "fade-in": "fade-in 0.3s ease-out",
              "scale-in": "scale-in 0.2s ease-out",
              "logo-spin": "logo-spin infinite 20s linear"
            }
          },
          shadows: {
            sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
          },
          spacing: {
            xs: "0.5rem",
            sm: "1rem",
            md: "1.5rem",
            lg: "2rem",
            xl: "3rem"
          },
          typography: {
            fontFamily: {
              primary: "Inter, system-ui, sans-serif",
              secondary: "Poppins, system-ui, sans-serif",
              mono: "Space Mono, Courier New, monospace",
              businessPrimary: "Bebas Neue, Impact, sans-serif",
              businessSecondary: "Montserrat, system-ui, sans-serif"
            }
          },
          breakpoints: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1400px"
          },
          borderRadius: {
            root: "0.5rem",
            sm: "0.25rem",
            md: "0.5rem",
            lg: "1rem",
            xl: "1.5rem"
          }
        };

        const { error } = await supabase
          .from('tema_config')
          .insert({
            negocio_id: negocioId,
            configuracion: defaultConfig
          });

        if (error) throw error;
      }

      await fetchTemaConfig();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      throw err;
    }
  };

  return {
    temaConfig,
    loading,
    error,
    updateCustomPalette,
    refetch: fetchTemaConfig
  };
}
