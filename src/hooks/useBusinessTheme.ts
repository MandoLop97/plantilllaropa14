
import React, { useEffect } from 'react';
import { PersonalizationService } from '../api/supabase/personalization';
import { BUSINESS_ID } from '../config/business';
import { applyTheme, DEFAULT_THEME } from '../config/theme';

export const useBusinessTheme = () => {
  useEffect(() => {
    const load = async () => {
      const data = await PersonalizationService.getByBusinessId(BUSINESS_ID);
      if (!data) return;

      const custom = { ...DEFAULT_THEME };

      if (data.color_primario) {
        custom.colors.primary = {
          ...custom.colors.primary,
          500: data.color_primario,
          600: data.color_primario,
          700: data.color_primario,
          900: data.color_primario,
        };
      }

      if (data.color_secundario) {
        custom.colors.secondary = {
          ...custom.colors.secondary,
          500: data.color_secundario,
          600: data.color_secundario,
          700: data.color_secundario,
        };
      }

      if (data.fuente) {
        custom.fonts.primary = data.fuente;
      }

      applyTheme(custom);

      if (typeof data.modo_oscuro === 'boolean') {
        document.documentElement.classList.toggle('dark', data.modo_oscuro);
      }
    };

    load();
  }, []);
};
