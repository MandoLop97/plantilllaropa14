
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface OptimizedColorPalette {
  id: string;
  '50': string;
  '100': string;
  '200': string;
  '300': string;
  '400': string;
  '500': string;
  '600': string;
  '700': string;
  '800': string;
  '900': string;
  '950': string;
  created_at: string;
}

export function useOptimizedColors() {
  const [palettes, setPalettes] = useState<OptimizedColorPalette[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOptimizedColors();
  }, []);

  const fetchOptimizedColors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('colores')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setPalettes(data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const formatColorPalette = (palette: OptimizedColorPalette): Record<string, string> => {
    const levels = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;
    const formattedPalette: Record<string, string> = {};

    levels.forEach(level => {
      const colorValue = palette[level];
      if (colorValue) {
        // Add # if not present
        formattedPalette[level] = colorValue.startsWith('#') ? colorValue : `#${colorValue}`;
      }
    });

    return formattedPalette;
  };

  const getPreviewColors = (palette: OptimizedColorPalette): string[] => {
    const previewLevels = ['100', '300', '500', '700', '900'] as const;
    return previewLevels.map(level => {
      const color = palette[level];
      return color?.startsWith('#') ? color : `#${color}`;
    });
  };

  return {
    palettes,
    loading,
    error,
    formatColorPalette,
    getPreviewColors,
    refetch: fetchOptimizedColors
  };
}
