
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Listen for permission changes
  useEffect(() => {
    if (!isSupported) return;

    const checkPermissionChange = () => {
      if ('Notification' in window) {
        const currentPermission = Notification.permission;
        if (currentPermission !== permission) {
          setPermission(currentPermission);
        }
      }
    };

    // Check every 100ms for permission changes during the first 5 seconds
    // This helps catch permission changes quickly
    const interval = setInterval(checkPermissionChange, 100);
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [permission, isSupported]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast.error('Las notificaciones no están soportadas en este navegador');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      
      // Actualizar estado inmediatamente sin depender del polling
      setPermission(result);
      
      if (result === 'granted') {
        toast.success('Notificaciones activadas', {
          description: 'Ahora recibirás notificaciones de la aplicación'
        });
        
        // Send a test notification
        new Notification('Gutix.Site', {
          body: 'Las notificaciones están activadas correctamente',
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png'
        });
        
        return true;
      } else if (result === 'denied') {
        toast.error('Notificaciones denegadas', {
          description: 'Las notificaciones han sido bloqueadas'
        });
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Error al solicitar permisos de notificación');
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission === 'granted' && isSupported) {
      new Notification(title, {
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        ...options
      });
    }
  }, [permission, isSupported]);

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    isGranted: permission === 'granted'
  };
}
