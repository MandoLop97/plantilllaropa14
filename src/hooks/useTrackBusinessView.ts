
import { useEffect } from 'react';
import { useDynamicBusinessId } from '../contexts/DynamicBusinessIdContext';
import { BusinessService } from '../api/supabase/business';
import { logger } from '../utils/logger';
import { generateDeviceFingerprint, getClientIP } from '../utils/deviceFingerprint';

export const useTrackBusinessView = () => {
  const { businessId, subdomain } = useDynamicBusinessId();

  useEffect(() => {
    // Solo trackear si tenemos un businessId válido
    if (!businessId) {
      logger.debug('No business ID found, skipping view tracking');
      return;
    }

    // Verificar que estamos en un subdominio válido o en producción
    const hostname = window.location.hostname;
    const isValidSubdomain = subdomain && hostname.includes('.gutix.site');
    const isProduction = hostname.includes('.gutix.site') || hostname.includes('lovable.app');
    
    if (!isValidSubdomain && !isProduction) {
      logger.debug('Development environment or invalid subdomain, skipping view tracking', { 
        hostname, 
        subdomain 
      });
      return;
    }

    const trackView = async () => {
      try {
        // Generar fingerprint del dispositivo
        const deviceFingerprint = generateDeviceFingerprint();
        
        // Obtener IP del cliente (opcional)
        const clientIP = await getClientIP();
        
        logger.info('Tracking daily business view', { 
          businessId, 
          subdomain, 
          hostname,
          deviceFingerprint: deviceFingerprint.slice(0, 8) + '...' // Solo mostrar parte del fingerprint en logs
        });

        // Usar el nuevo método de tracking diario
        const wasNewView = await BusinessService.trackDailyBusinessView(
          businessId,
          deviceFingerprint,
          clientIP || undefined,
          navigator.userAgent
        );

        if (wasNewView) {
          logger.info('New daily view registered', { businessId, subdomain });
        } else {
          logger.debug('View already registered for today', { businessId, subdomain });
        }
      } catch (err) {
        logger.error('Error tracking daily business view:', { 
          businessId, 
          subdomain, 
          hostname 
        }, err as Error);
      }
    };

    // Ejecutar tracking
    trackView();
  }, [businessId, subdomain]);
};
