
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { getVapidKey } from '@/utils/vapid';

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function useUnifiedPushNotifications(userId?: string) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  // Check if notifications are supported
  useEffect(() => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  // Check subscription status when dependencies change
  const checkSubscriptionStatus = useCallback(async () => {
    if (!userId || !isSupported) {
      setIsSubscribed(false);
      return;
    }

    try {
      // Check current permission
      const currentPermission = Notification.permission;
      setPermission(currentPermission);

      if (currentPermission !== 'granted') {
        setIsSubscribed(false);
        return;
      }

      // Check database subscription
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('pushSubscription')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking subscription in database:', error);
        setIsSubscribed(false);
        return;
      }

      // Check browser subscription
      const registration = await navigator.serviceWorker.ready;
      const browserSubscription = await registration.pushManager.getSubscription();
      
      const hasSubscription = !!(profile?.pushSubscription && browserSubscription);
      setIsSubscribed(hasSubscription);

      // If database has subscription but browser doesn't, clean up database
      if (profile?.pushSubscription && !browserSubscription) {
        logger.log('Database has subscription but browser doesnt, clearing database');
        await supabase
          .from('profiles')
          .update({ pushSubscription: null })
          .eq('id', userId);
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsSubscribed(false);
    }
  }, [userId, isSupported]);

  useEffect(() => {
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);

  const activateNotifications = useCallback(async () => {
    if (!userId || !isSupported) {
      toast.error('Usuario no válido o notificaciones no soportadas');
      return false;
    }

    setIsLoading(true);
    
    try {
      logger.log('Starting unified notification activation flow...');

      // Step 1: Request permission
      logger.log('Requesting notification permission...');
      const permissionResult = await Notification.requestPermission();
      
      // Update permission state immediately
      setPermission(permissionResult);
      
      if (permissionResult !== 'granted') {
        logger.log('Permission denied:', permissionResult);
        toast.error('Permisos de notificación denegados');
        return false;
      }

      logger.log('Permission granted, proceeding with subscription...');

      // Step 2: Get service worker registration
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await navigator.serviceWorker.ready;
      }

      // Step 3: Check for existing subscription
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Step 4: Get VAPID key and create subscription
        const vapidKey = await getVapidKey();
        logger.log('Creating push subscription with VAPID key...');

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey)
        });
      }

      if (subscription) {
        // Step 5: Save subscription to database
        logger.log('Saving subscription to database...', subscription.toJSON());
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            pushSubscription: JSON.stringify(subscription.toJSON())
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Error saving subscription to database:', updateError);
          throw updateError;
        }

        logger.log('Subscription saved successfully');
        
        // Update state immediately
        setIsSubscribed(true);
        
        // Show success feedback
        toast.success('Notificaciones activadas', {
          description: 'Ahora recibirás notificaciones de la aplicación'
        });
        
        // Send test notification
        new Notification('Gutix.Site', {
          body: 'Las notificaciones están activadas correctamente',
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png'
        });
        
        return true;
      }
      
      return false;
    } catch (error: unknown) {
      console.error('Error activating notifications:', error);

      let errorMessage = 'No se pudo activar las notificaciones';
      const message = error instanceof Error ? error.message : '';

      if (message.includes('VAPID') || message.includes('applicationServerKey')) {
        errorMessage = 'Error de configuración VAPID';
      } else if (message.includes('not supported')) {
        errorMessage = 'Tu navegador no soporta notificaciones push';
      } else if (message.includes('obtener la clave')) {
        errorMessage = 'Error del servidor al obtener configuración VAPID';
      }
      
      toast.error('Error al activar notificaciones', {
        description: errorMessage
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId, isSupported]);

  const deactivateNotifications = useCallback(async () => {
    if (!userId) return false;

    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
      }

      // Remove subscription from database
      const { error } = await supabase
        .from('profiles')
        .update({
          pushSubscription: null
        })
        .eq('id', userId);

      if (error) {
        console.error('Error removing subscription from database:', error);
        throw error;
      }

      setIsSubscribed(false);
      toast.success('Notificaciones desactivadas');
      return true;
    } catch (error: unknown) {
      console.error('Error deactivating notifications:', error);
      const message =
        error instanceof Error ? error.message : 'No se pudo desactivar las notificaciones';
      toast.error('Error al desactivar notificaciones', {
        description: message
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return {
    isSubscribed,
    isLoading,
    permission,
    isSupported,
    isGranted: permission === 'granted',
    activateNotifications,
    deactivateNotifications,
    checkSubscriptionStatus
  };
}
