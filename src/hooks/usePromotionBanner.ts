import { useEffect, useState } from 'react';
import { PromotionBannerService, PromotionBannerJson } from '../api/supabase/promotionBanner';
import { useDynamicBusinessId } from '../contexts/DynamicBusinessIdContext';
import { BUSINESS_ID } from '../config/business';
import { defaultPromotionBanner } from '../data/promotionBanner';
import { logger } from '../utils/logger';

export const usePromotionBanner = () => {
  const { businessId: dynamicBusinessId } = useDynamicBusinessId();
  const finalBusinessId = dynamicBusinessId || BUSINESS_ID;
  const [data, setData] = useState<PromotionBannerJson>(defaultPromotionBanner);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const banner = await PromotionBannerService.getByBusinessId(finalBusinessId);
        if (banner) {
          setData(banner);
        } else {
          setData(defaultPromotionBanner);
        }
      } catch (err) {
        logger.error('Error loading promotion banner', undefined, err as Error);
        setData(defaultPromotionBanner);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [finalBusinessId]);

  return { data, loading };
};
