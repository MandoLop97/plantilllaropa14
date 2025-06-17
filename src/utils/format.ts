
/**
 * Formatting utilities
 */

export const formatWhatsAppUrl = (phoneNumber: string, message?: string): string => {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const baseUrl = 'https://wa.me/';
  
  if (message) {
    return `${baseUrl}${cleanNumber}?text=${encodeURIComponent(message)}`;
  }
  
  return `${baseUrl}${cleanNumber}`;
};

export const formatPrice = (price: number, currency = 'COP'): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};
