
/**
 * Currency formatting utilities
 */

export const formatCurrency = (amount: number, currency = 'COP'): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const parseCurrency = (currencyString: string): number => {
  return parseFloat(currencyString.replace(/[^0-9.-]+/g, ''));
};

export const formatPrice = (price: number): string => {
  return formatCurrency(price);
};

export const formatDiscountPercentage = (discount: number): string => {
  return `${Math.round(discount)}%`;
};
