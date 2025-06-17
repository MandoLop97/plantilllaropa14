
import { useEffect } from 'react';
import { realtimeOrderNotifications } from '../services/realtimeOrderNotifications';
import { logger } from '../utils/logger';

export const useRealtimeOrderNotifications = () => {
  useEffect(() => {
    logger.info('Inicializando notificaciones de órdenes en tiempo real...');

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (realtimeOrderNotifications.getStatus() !== 'active') {
          logger.info('Página visible, activando notificaciones en tiempo real');
          realtimeOrderNotifications.start();
        }
      } else {
        if (realtimeOrderNotifications.getStatus() === 'active') {
          logger.info('Página oculta, deteniendo notificaciones en tiempo real');
          realtimeOrderNotifications.stop();
        }
      }
    };

    // Iniciar solo si la página está visible al montar
    if (document.visibilityState === 'visible') {
      realtimeOrderNotifications.start();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup al desmontar el componente
    return () => {
      logger.info('Limpiando notificaciones de órdenes en tiempo real...');
      realtimeOrderNotifications.stop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    status: realtimeOrderNotifications.getStatus()
  };
};
