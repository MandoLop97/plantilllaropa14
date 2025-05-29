
import { BUSINESS_CONFIG } from '../config/business';

export const formatWhatsAppUrl = (phoneNumber?: string): string => {
  const phone = phoneNumber || BUSINESS_CONFIG.whatsapp;
  return `https://wa.me/${phone}`;
};

export const formatWhatsAppMessage = (message: string): string => {
  return encodeURIComponent(message);
};
