
import { supabase } from './client';
import { logger } from '../../utils/logger';

export interface BusinessData {
  id: string;
  nombre: string;
  descripcion: string | null;
  logo_url: string | null;
  banner_url: string | null;
  subdominio?: string | null;
}

export const BusinessService = {
  // Obtener datos del negocio específico
  async getBusinessById(id: string): Promise<BusinessData | null> {
    try {
      const { data, error } = await supabase
        .from('negocios')
        .select('id, nombre, descripcion, logo_url, banner_url, subdominio')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        logger.error('Error fetching business:', undefined, error as Error);
        return null;
      }

      if (!data) {
        logger.warn('Business not found', { id });
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error in getBusinessById:', undefined, error as Error);
      return null;
    }
  },

  // Obtener negocio por subdominio
  async getBusinessBySubdomain(subdominio: string): Promise<BusinessData | null> {
    try {
      const { data, error } = await supabase
        .from('negocios')
        .select('id, nombre, descripcion, logo_url, banner_url, subdominio')
        .eq('subdominio', subdominio)
        .maybeSingle();

      if (error) {
        logger.error('Error fetching business by subdomain:', undefined, error as Error);
        return null;
      }

      if (!data) {
        logger.warn('Business not found for subdomain', { subdominio });
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error in getBusinessBySubdomain:', undefined, error as Error);
      return null;
    }
  }
};
