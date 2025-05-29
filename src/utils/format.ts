
// Re-exportar todas las utilidades para compatibilidad
export * from './currency';
export * from './text';
export * from './url';
export * from './scroll';

// Mantener las funciones existentes para compatibilidad
export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString('es-MX')}`;
};

export const formatWhatsAppUrl = (phoneNumber: string): string => {
  return `https://wa.me/${phoneNumber}`;
};

export const generateProductId = (name: string, category: string): string => {
  return `${category}-${name.toLowerCase().replace(/\s+/g, '-')}`;
};

export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
