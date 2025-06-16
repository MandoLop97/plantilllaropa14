import { PromotionBannerConfig } from '../types/promotionBanner';

export const defaultPromotionBanner: PromotionBannerConfig = {
  label: 'Oferta Especial',
  title: '25% OFF',
  description: 'En toda la tienda. Aprovecha esta oportunidad única.',
  couponCode: 'URBAN25',
  buttonText: 'Comprar Ahora',
  // Last day of current month
  expiresAt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()
};
