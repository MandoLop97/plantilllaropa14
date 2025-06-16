import { supabase } from './client';
import { logger } from '../../utils/logger';
import { z } from 'zod';
import type { PromotionBannerConfig } from '../../types/promotionBanner';

export const PromotionBannerSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
  couponCode: z.string(),
  buttonText: z.string(),
  expiresAt: z.string()
});

export type PromotionBannerJson = z.infer<typeof PromotionBannerSchema>;

export class PromotionBannerService {
  static async getByBusinessId(businessId: string): Promise<PromotionBannerJson | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('banner_promocion')
        .select('configuracion')
        .eq('negocio_id', businessId)
        .maybeSingle();

      if (error) {
        logger.error('Error fetching promotion banner', undefined, error as Error);
        return null;
      }

      if (!data || !data.configuracion) {
        return null;
      }

      const parsed = PromotionBannerSchema.safeParse(data.configuracion);
      if (!parsed.success) {
        logger.error('Invalid promotion banner json', { errors: parsed.error.issues });
        return null;
      }

      return parsed.data;
    } catch (err) {
      logger.error('Error getting promotion banner', undefined, err as Error);
      return null;
    }
  }
}
