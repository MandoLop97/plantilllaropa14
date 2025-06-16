
import { useEffect } from 'react';
import { BusinessService } from '../api/supabase/business';
import { logger } from '../utils/logger';

/**
 * Hook para sincronizar el conteo de vistas desde vistas_diarias a negocios
 * Se ejecuta una vez al día cuando el usuario carga la aplicación
 */
export const useSyncBusinessViews = (businessId?: string) => {
  useEffect(() => {
    if (!businessId) return;

    const syncViews = async () => {
      try {
        // Solo ejecutar sync una vez al día
        const lastSync = localStorage.getItem(`lastViewsSync_${businessId}`);
        const today = new Date().toDateString();
        
        if (lastSync === today) {
          logger.debug('Views sync already performed today for business', { businessId });
          return;
        }

        logger.info('Starting business views count synchronization', { businessId });
        
        const totalViews = await BusinessService.syncBusinessViewsCount(businessId);
        
        logger.info('Business views count synchronization completed', { 
          businessId, 
          totalViews 
        });
        
        // Marcar que ya se hizo sync hoy
        localStorage.setItem(`lastViewsSync_${businessId}`, today);
      } catch (err) {
        logger.error('Unexpected error during business views sync:', { businessId }, err as Error);
      }
    };

    // Ejecutar sync después de 3 segundos para no afectar el rendimiento inicial
    const timer = setTimeout(syncViews, 3000);
    
    return () => clearTimeout(timer);
  }, [businessId]);
};
