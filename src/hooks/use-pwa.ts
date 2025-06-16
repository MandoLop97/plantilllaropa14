
import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export function usePWA() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  const {
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      logger.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      logger.log('SW registration error', error);
    },
    onNeedRefresh() {
      setNeedRefresh(true);
      // Auto-update without user interaction
      updateServiceWorker(true);
      toast.success('Aplicación actualizada', {
        description: 'La aplicación se ha actualizado automáticamente',
        duration: 3000,
      });
    },
    onOfflineReady() {
      setOfflineReady(true);
      toast.success('Aplicación lista para usar sin conexión', {
        description: 'Ya puedes usar la aplicación aunque no tengas internet',
        duration: 5000,
      });
    },
  });

  const updateApp = () => {
    updateServiceWorker(true);
  };

  return {
    needRefresh,
    offlineReady,
    updateApp,
  };
}
