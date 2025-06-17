import { supabase } from './client';
import { logger } from '../../utils/logger';

interface ServicioRow {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  duracion_minutos: number | null;
  categoria?: string | null; // Made optional to match actual Supabase response
  imagen_url: string | null;
  disponible: boolean;
  negocio_id: string;
  created_at: string;
  updated_at: string;
}

interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionMinutos: number;
  categoria: string;
  imagenUrl: string;
  disponible: boolean;
}

export class ServiciosService {
  static async getAll(businessId?: string): Promise<Servicio[]> {
    try {
      logger.info('🔍 Iniciando consulta de servicios:', { businessId });
      
      let query = supabase
        .from('servicios')
        .select('*')
        .eq('disponible', true)
        .order('nombre');

      // Si se proporciona businessId, filtrar por negocio_id
      if (businessId) {
        query = query.eq('negocio_id', businessId);
        logger.info('🎯 Filtrando por negocio_id:', { businessId });
      }
      
      const { data, error } = await query;
      
      logger.info('📊 Respuesta completa de Supabase:', { 
        data, 
        error,
        dataType: typeof data,
        isArray: Array.isArray(data),
        length: data?.length
      });
      
      if (error) {
        logger.error('❌ Error en query de servicios:', { message: error.message }, error);
        throw error;
      }
      
      if (!data) {
        logger.warn('⚠️ Data es null o undefined');
        return [];
      }
      
      if (data.length === 0) {
        logger.warn('⚠️ No se encontraron servicios para el negocio:', { businessId });
        
        // Hacer una consulta adicional sin filtro de negocio para debug
        const { data: allServices } = await supabase
          .from('servicios')
          .select('negocio_id, nombre, disponible');
        
        logger.info('🔍 Todos los servicios en la DB (para debug):', { 
          allServices,
          count: allServices?.length || 0
        });
        
        return [];
      }
      
      logger.info('✅ Servicios encontrados:', { 
        count: data.length, 
        servicios: data.map(s => ({ id: s.id, nombre: s.nombre, negocio_id: s.negocio_id }))
      });
      
      // Mapeo de datos de la BD a formato de frontend
      const mappedServices = data.map((row: ServicioRow) => this.mapServicioRow(row));
      
      logger.info('🎯 Servicios mapeados:', { 
        count: mappedServices.length,
        first: mappedServices[0]
      });
      
      return mappedServices;
    } catch (error) {
      logger.error('❌ Error al obtener servicios:', { message: (error as Error).message }, error as Error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Servicio | null> {
    try {
      const { data, error } = await supabase
        .from('servicios')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (!data) return null;
      
      return this.mapServicioRow(data);
    } catch (error) {
      logger.error('❌ Error al obtener servicio por ID:', { message: (error as Error).message }, error as Error);
      throw error;
    }
  }

  static mapServicioRow(row: ServicioRow): Servicio {
    return {
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion || '',
      precio: row.precio,
      duracionMinutos: row.duracion_minutos || 30,
      categoria: row.categoria || 'General',
      imagenUrl: row.imagen_url || '/placeholder.svg',
      disponible: row.disponible
    };
  }
}
