export const VAPID_KEY_STORAGE = 'vapidPublicKey';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export async function getVapidKey() : Promise<string> {
  const cached = localStorage.getItem(VAPID_KEY_STORAGE);
  if (cached) {
    return cached;
  }
  const { data, error } = await supabase.functions.invoke('get-vapid-key');
  if (error || !data?.vapidPublicKey) {
    console.error('Error getting VAPID key:', error);
    throw new Error('No se pudo obtener la clave VAPID');
  }
  logger.log('Got VAPID key from server:', data.vapidPublicKey);
  localStorage.setItem(VAPID_KEY_STORAGE, data.vapidPublicKey);
  return data.vapidPublicKey;
}
