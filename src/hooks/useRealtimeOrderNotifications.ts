
import { useEffect } from 'react';
import { realtimeOrderNotifications } from '../services/realtimeOrderNotifications';
import { logger } from '../utils/logger';

export const useRealtimeOrderNotifications = () => {
  useEffect(() => {
    logger.info('Inicializando notificaciones de órdenes en tiempo real...');
    realtimeOrderNotifications.start();

    // Cleanup al desmontar el componente
    return () => {
      logger.info('Limpiando notificaciones de órdenes en tiempo real...');
      realtimeOrderNotifications.stop();
    };
  }, []);

  return {
    status: realtimeOrderNotifications.getStatus()
  };
};
