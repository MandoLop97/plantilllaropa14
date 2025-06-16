
import { useOrderNotifications } from '@/hooks/use-order-notifications';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNegocioActivo } from '@/hooks/useNegocioActivo';

interface OrderNotificationProviderProps {
  children: React.ReactNode;
}

export function OrderNotificationProvider({ children }: OrderNotificationProviderProps) {
  const { user } = useAuth();
  const { negocioActivo } = useNegocioActivo(user?.id || null);
  
  // Initialize order notifications
  useOrderNotifications();

  // Send dashboard base URL to service worker once the business is loaded
  useEffect(() => {
    if (!negocioActivo) return;

    navigator.serviceWorker.ready.then((reg) => {
      // Always use the global dashboard domain as base URL
      const baseUrl = 'https://gutix.site';
      reg.active?.postMessage({ type: 'SET_BASE_URL', baseUrl });
    });
  }, [negocioActivo]);

  return <>{children}</>;
}
