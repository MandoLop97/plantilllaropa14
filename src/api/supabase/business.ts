
import { supabase } from './client';
import { logger } from '../../utils/logger';

export interface BusinessData {
  id: string;
  nombre: string;
  descripcion: string | null;
  direccion: string | null;
  logo_url: string | null;
  banner_url: string | null;
  telefono: string | null;
  subdominio?: string | null;
  vistas?: number;
}

export const BusinessService = {
  // Obtener datos del negocio específico
  async getBusinessById(id: string): Promise<BusinessData | null> {
    try {
      const { data, error } = await supabase
        .from('negocios')
        .select('id, nombre, descripcion, direccion, logo_url, banner_url, telefono, subdominio')
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
        .select('id, nombre, descripcion, direccion, logo_url, banner_url, telefono, subdominio')
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
  },

  // Trackear vista diaria (solo una por dispositivo por día)
  async trackDailyBusinessView(
    businessId: string, 
    deviceFingerprint: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<boolean> {
    try {
      logger.info('Tracking daily business view', { 
        businessId, 
        deviceFingerprint: deviceFingerprint.slice(0, 8) + '...',
        ipAddress 
      });
      
      const { data, error } = await supabase.rpc('track_daily_business_view' as any, {
        p_negocio_id: businessId,
        p_device_fingerprint: deviceFingerprint,
        p_ip_address: ipAddress || null,
        p_user_agent: userAgent || navigator.userAgent
      });
      
      if (error) {
        logger.error('Error tracking daily business view via RPC:', { businessId }, error as Error);
        throw error;
      }
      
      const wasNewView = data as boolean;
      if (wasNewView) {
        logger.info('New daily view registered successfully', { businessId });
      } else {
        logger.debug('View already registered for today', { businessId });
      }
      
      return wasNewView;
    } catch (error) {
      logger.error('Unexpected error tracking daily business view:', { businessId }, error as Error);
      throw error;
    }
  },

  // Sincronizar el conteo de vistas desde vistas_diarias
  async syncBusinessViewsCount(businessId: string): Promise<number> {
    try {
      logger.info('Syncing business views count from daily views', { businessId });
      
      const { data, error } = await supabase.rpc('sync_business_views_count' as any, {
        p_negocio_id: businessId
      });
      
      if (error) {
        logger.error('Error syncing business views count:', { businessId }, error as Error);
        throw error;
      }
      
      const totalViews = data as number;
      logger.info('Business views count synchronized', { businessId, totalViews });
      
      return totalViews;
    } catch (error) {
      logger.error('Unexpected error syncing business views count:', { businessId }, error as Error);
      throw error;
    }
  },

  // Incrementar vistas del negocio con logging mejorado (método legacy)
  async incrementBusinessViews(id: string): Promise<void> {
    try {
      logger.info('Incrementing business views (legacy method)', { businessId: id });
      
      const { error } = await supabase.rpc('increment_negocio_vistas' as any, { n_id: id });
      
      if (error) {
        logger.error('Error incrementing business views via RPC:', { businessId: id }, error as Error);
        throw error;
      } else {
        logger.info('Business views incremented successfully (legacy)', { businessId: id });
      }
    } catch (error) {
      logger.error('Unexpected error incrementing business views:', { businessId: id }, error as Error);
      throw error;
    }
  },

  // Método para obtener las vistas actuales (para debugging)
  async getBusinessViews(id: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('negocios')
        .select('vistas')
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Error fetching business views:', { businessId: id }, error as Error);
        return 0;
      }

      const views = data.vistas ? Number(data.vistas) : 0;
      logger.debug('Business views fetched', { businessId: id, views });
      return views;
    } catch (error) {
      logger.error('Unexpected error fetching business views:', { businessId: id }, error as Error);
      return 0;
    }
  }
};
