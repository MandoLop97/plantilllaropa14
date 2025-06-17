
import { useEffect } from 'react';
import { supabase } from '../api/supabase/client';
import { logger } from '../utils/logger';

/**
 * Hook para limpiar automáticamente las vistas diarias antiguas
 * Se ejecuta una vez al día cuando el usuario carga la aplicación
 */
export const useCleanupOldViews = () => {
  useEffect(() => {
    const cleanup = async () => {
      try {
        // Solo ejecutar cleanup una vez al día
        const lastCleanup = localStorage.getItem('lastViewsCleanup');
        const today = new Date().toDateString();
        
        if (lastCleanup === today) {
          logger.debug('Views cleanup already performed today');
          return;
        }

        logger.info('Starting cleanup of old daily views');
        
        const { data, error } = await supabase.rpc('cleanup_old_daily_views' as any);
        
        if (error) {
          logger.error('Error cleaning up old views:', undefined, error as Error);
          return;
        }
        
        const deletedCount = data as number;
        logger.info('Old views cleanup completed', { deletedCount });
        
        // Marcar que ya se hizo cleanup hoy
        localStorage.setItem('lastViewsCleanup', today);
      } catch (err) {
        logger.error('Unexpected error during views cleanup:', undefined, err as Error);
      }
    };

    // Ejecutar cleanup después de 5 segundos para no afectar el rendimiento inicial
    const timer = setTimeout(cleanup, 5000);
    
    return () => clearTimeout(timer);
  }, []);
};
