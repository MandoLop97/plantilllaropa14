
import { supabase } from './client';
import { logger } from '../../utils/logger';
import { z } from 'zod';

/**
 * Estructura de la configuración de tema almacenada en Supabase.
 */
const PaletteSchema = z
  .record(z.string())
  .refine(p => typeof p['500'] !== 'undefined' && typeof p['600'] !== 'undefined', {
    message: 'Cada paleta debe incluir tonos "500" y "600"'
  });

export const ThemeConfigSchema = z.object({
  colors: z
    .object({
      light: z.record(z.string()).optional(),
      dark: z.record(z.string()).optional(),
      customPalette: z.record(PaletteSchema).optional()
    })
    .optional(),
  customPalette: z.record(PaletteSchema).optional(),
  typography: z
    .object({
      fontFamily: z.record(z.string().optional()).optional()
    })
    .optional(),
  spacing: z.record(z.string()).optional(),
  borderRadius: z.record(z.string()).optional(),
  shadows: z.record(z.string()).optional(),
  buttons: z
    .object({
      variants: z.record(z.string()).optional(),
      sizes: z.record(z.string()).optional()
    })
    .optional()
});

export type ThemeConfigJson = z.infer<typeof ThemeConfigSchema>;

export interface TemaConfigRow {
  id: string;
  negocio_id: string;
  configuracion: ThemeConfigJson;
  created_at: string;
}

export class TemaConfigService {
  static async getByBusinessId(businessId: string): Promise<ThemeConfigJson | null> {
    logger.debug('🔍 Buscando tema_config para negocio_id:', { businessId });

    try {
      // Usar consulta SQL directa para evitar problemas de tipos
      const { data, error } = await (supabase as any)
        .from('tema_config')
        .select('configuracion')
        .eq('negocio_id', businessId)
        .maybeSingle();

      if (error) {
        logger.error('❌ Error consultando tema_config:', undefined, error as Error);
        return null;
      }

      if (!data || !data.configuracion) {
        logger.debug('⚠️ No se encontró configuración de tema');
        return null;
      }

      logger.debug('✅ Configuración de tema encontrada:', data.configuracion);
      return data.configuracion as ThemeConfigJson;
    } catch (err) {
      logger.error('❌ Error general al obtener tema_config:', undefined, err as Error);
      return null;
    }
  }

  static async createOrUpdate(businessId: string, config: ThemeConfigJson): Promise<boolean> {
    logger.debug('💾 Guardando tema_config para negocio_id:', { businessId, config });
    
    try {
      // Usar consulta SQL directa para evitar problemas de tipos
      const { error } = await (supabase as any)
        .from('tema_config')
        .upsert({
          negocio_id: businessId,
          configuracion: config
        });

      if (error) {
        logger.error('❌ Error al guardar tema_config:', undefined, error as Error);
        return false;
      }

      logger.debug('✅ Tema_config guardado exitosamente');
      return true;
    } catch (err) {
      logger.error('❌ Error general al guardar tema_config:', undefined, err as Error);
      return false;
    }
  }
}
