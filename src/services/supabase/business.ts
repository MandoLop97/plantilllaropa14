
import { supabase } from '../../integrations/supabase/client';

export interface BusinessData {
  id: string;
  nombre: string;
  descripcion: string | null;
  logo_url: string | null;
  banner_url: string | null;
}

export const BusinessService = {
  // Obtener datos del negocio específico
  async getBusinessById(id: string): Promise<BusinessData | null> {
    try {
      console.log('🔍 Buscando negocio con ID:', id);
      
      const { data, error } = await supabase
        .from('negocios')
        .select('id, nombre, descripcion, logo_url, banner_url')
        .eq('id', id)
        .maybeSingle();

      console.log('📊 Respuesta completa de Supabase:', { data, error });

      if (error) {
        console.error('❌ Error de Supabase:', error);
        console.error('❌ Código de error:', error.code);
        console.error('❌ Mensaje de error:', error.message);
        return null;
      }

      if (!data) {
        console.warn('⚠️ No se encontró negocio con ID:', id);
        
        // Intentar listar todos los negocios para debug
        const { data: allBusinesses, error: listError } = await supabase
          .from('negocios')
          .select('id, nombre')
          .limit(5);
        
        if (listError) {
          console.error('❌ Error listando negocios:', listError);
        } else {
          console.log('📋 Negocios disponibles:', allBusinesses);
        }
        
        return null;
      }

      console.log('✅ Datos del negocio encontrados:', data);
      return data;
    } catch (error) {
      console.error('💥 Error inesperado en getBusinessById:', error);
      return null;
    }
  }
};
