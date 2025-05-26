
import { STORE_CONFIG } from '../config/business';

export const formatPrice = (price: number): string => {
  return `${STORE_CONFIG.currency}${price.toLocaleString(STORE_CONFIG.locale)}`;
};

export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const formatDiscountPercentage = (discount: number): string => {
  return `-${discount}%`;
};
