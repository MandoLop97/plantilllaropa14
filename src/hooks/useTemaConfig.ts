
import { useEffect, useState } from 'react';
import { TemaConfigService, ThemeConfigJson } from '../api/supabase/themeConfig';
import { BUSINESS_ID } from '../config/business';
import { applyThemeFromJson, DEFAULT_THEME, applyTheme } from '../config/theme';
import { logger } from '../utils/logger';

export const useTemaConfig = (businessId: string = BUSINESS_ID) => {
  const [config, setConfig] = useState<ThemeConfigJson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        logger.debug('🎨 Cargando tema config para business ID:', { businessId });
        
        const data = await TemaConfigService.getByBusinessId(businessId);
        
        logger.debug('🎨 Tema config obtenido:', { data });
        
        if (data) {
          setConfig(data);
          applyThemeFromJson(data);
          logger.debug('🎨 Tema aplicado exitosamente desde Supabase');
        } else {
          logger.debug('🎨 No se encontró configuración, aplicando tema por defecto');
          applyTheme(DEFAULT_THEME);
          setConfig(null);
        }
      } catch (err) {
        logger.error('🎨 Error cargando tema config:', undefined, err as Error);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        // En caso de error, aplicar tema por defecto
        applyTheme(DEFAULT_THEME);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [businessId]);

  return { config, isLoading, error };
};
