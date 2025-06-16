
import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from './use-notifications';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';
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

export function usePushSubscription(userId?: string) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isSupported } = useNotifications();
  const { toast } = useToast();

  const syncSubscriptionEndpoint = useCallback(async () => {
    if (!userId || !isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const browserSubscription = await registration.pushManager.getSubscription();
      if (!browserSubscription) return;

      await supabase
        .from('profiles')
        .update({ pushSubscription: JSON.stringify(browserSubscription.toJSON()) })
        .eq('id', userId);
    } catch (error) {
      console.error('Error syncing push subscription:', error);
    }
  }, [userId, isSupported]);

  // Check if user already has a push subscription
  const checkSubscription = useCallback(async () => {
    if (!userId || !isSupported) {
      setIsSubscribed(false);
      return;
    }

    // Verificar permiso actual en tiempo real
    const currentPermission = 'Notification' in window ? Notification.permission : 'default';
    if (currentPermission !== 'granted') {
      setIsSubscribed(false);
      return;
    }

    try {
      // Check in database first
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

      // Also check browser subscription
      const registration = await navigator.serviceWorker.ready;
      const browserSubscription = await registration.pushManager.getSubscription();

      // User is subscribed if they have both database record and browser subscription
      const hasSubscription = !!(profile?.pushSubscription && browserSubscription);
      setIsSubscribed(hasSubscription);

      // Keep endpoint in database in sync with browser subscription
      if (browserSubscription) {
        const dbSub = typeof profile?.pushSubscription === 'string'
          ? JSON.parse(profile.pushSubscription)
          : profile?.pushSubscription;

        if (!dbSub || dbSub.endpoint !== browserSubscription.endpoint) {
          await supabase
            .from('profiles')
            .update({ pushSubscription: JSON.stringify(browserSubscription.toJSON()) })
            .eq('id', userId);
        }
      }
    } catch (error) {
      console.error('Error checking push subscription:', error);
      setIsSubscribed(false);
    }
  }, [userId, isSupported]);

  // Check subscription status when dependencies change
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  const subscribeToPush = useCallback(async () => {
    if (!userId || !isSupported) {
      toast({
        title: "Error",
        description: "Usuario no válido o notificaciones no soportadas",
        variant: "destructive",
      });
      return false;
    }

    // Verificar permiso actual en tiempo real antes de proceder
    const currentPermission = 'Notification' in window ? Notification.permission : 'default';
    if (currentPermission !== 'granted') {
      toast({
        title: "Error",
        description: "Las notificaciones deben estar habilitadas primero",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    try {
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await navigator.serviceWorker.ready;
      }

      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();

      let vapidKey: string | undefined;

      if (!subscription) {
        vapidKey = await getVapidKey();
        logger.log('Creating push subscription with server VAPID key...');

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey)
        });
      }

      if (subscription) {
        // Save subscription to database
        logger.log('Saving subscription to database...', subscription.toJSON());
        
        const { data: updateData, error: updateError } = await supabase
          .from('profiles')
          .update({
            pushSubscription: JSON.stringify(subscription.toJSON())
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Error saving subscription to database:', updateError);
          throw updateError;
        }

        logger.log('Subscription saved successfully:', updateData);
        setIsSubscribed(true);
        
        toast({
          title: "Suscripción activada",
          description: "Ahora recibirás notificaciones push de pedidos",
        });
        return true;
      }
      
      return false;
    } catch (error: unknown) {
      console.error('Error subscribing to push notifications:', error);

      // Provide more specific error messages
      const message =
        error instanceof Error ? error.message : 'No se pudo activar las notificaciones push';
      let errorMessage = 'No se pudo activar las notificaciones push';

      if (message.includes('VAPID') || message.includes('applicationServerKey')) {
        errorMessage = 'Error de configuración VAPID. Verifica que la clave esté configurada correctamente.';
      } else if (message.includes('not supported')) {
        errorMessage = 'Tu navegador no soporta notificaciones push';
      } else if (message.includes('denied')) {
        errorMessage = 'Permisos de notificación denegados';
      } else if (message.includes('obtener la clave')) {
        errorMessage = 'Error del servidor al obtener configuración VAPID';
      }
      
      toast({
        title: "Error al suscribirse",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, isSupported, toast]);

  const unsubscribeFromPush = useCallback(async () => {
    if (!userId) return false;

    setLoading(true);
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
      toast({
        title: "Suscripción desactivada",
        description: "Ya no recibirás notificaciones push",
      });
      return true;
    } catch (error: unknown) {
      console.error('Error unsubscribing from push notifications:', error);
      const message =
        error instanceof Error ? error.message : 'No se pudo desactivar las notificaciones push';
      toast({
        title: 'Error al desuscribirse',
        description: message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  // Verificar permisos en tiempo real para canSubscribe
  const currentPermission = 'Notification' in window ? Notification.permission : 'default';
  const canSubscribe = currentPermission === 'granted' && isSupported && userId;

  return {
    isSubscribed,
    loading,
    canSubscribe,
    subscribeToPush,
    unsubscribeFromPush,
    syncSubscriptionEndpoint,
    isSupported,
    isGranted: currentPermission === 'granted'
  };
}
