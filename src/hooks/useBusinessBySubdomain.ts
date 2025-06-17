
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../api/supabase/client';
import { logger } from '../utils/logger';

export interface BusinessBySubdomain {
  id: string;
  nombre: string;
  descripcion: string | null;
  direccion: string | null;
  logo_url: string | null;
  banner_url: string | null;
  telefono: string | null;
  subdominio: string | null;
}

export const useBusinessBySubdomain = (subdominio: string | undefined) => {
  return useQuery({
    queryKey: ['business-by-subdomain', subdominio],
    queryFn: async (): Promise<BusinessBySubdomain | null> => {
      if (!subdominio || subdominio.trim() === '') {
        logger.debug('🏢 No subdomain provided, skipping query');
        return null;
      }

      const cleanSubdomain = subdominio.toLowerCase().trim();
      logger.info('🏢 Fetching business by subdomain:', { subdominio: cleanSubdomain });

      try {
        const { data, error } = await supabase
          .from('negocios')
          .select('id, nombre, descripcion, direccion, logo_url, banner_url, telefono, subdominio')
          .eq('subdominio', cleanSubdomain)
          .maybeSingle();

        if (error) {
          logger.error('🏢 Error fetching business by subdomain:', undefined, error);
          throw new Error(`Error al buscar negocio: ${error.message}`);
        }

        if (!data) {
          logger.warn('🏢 Business not found for subdomain:', { subdominio: cleanSubdomain });
          return null;
        }

        logger.info('🏢 Business found successfully:', { 
          business: { 
            id: data.id, 
            nombre: data.nombre, 
            subdominio: data.subdominio 
          } 
        });
        
        return data;
      } catch (err) {
        logger.error('🏢 Unexpected error in business fetch:', undefined, err as Error);
        throw err;
      }
    },
    enabled: !!subdominio && subdominio.trim() !== '',
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's a "not found" case
      if (error?.message?.includes('not found')) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
