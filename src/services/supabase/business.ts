
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
      const { data, error } = await supabase
        .from('negocios')
        .select('id, nombre, descripcion, logo_url, banner_url')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching business:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getBusinessById:', error);
      return null;
    }
  }
};
