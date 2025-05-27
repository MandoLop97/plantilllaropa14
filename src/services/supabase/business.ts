
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
      console.log('Buscando negocio con ID:', id);
      
      const { data, error } = await supabase
        .from('negocios')
        .select('id, nombre, descripcion, logo_url, banner_url')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching business:', error);
        return null;
      }

      if (!data) {
        console.warn('Business not found with ID:', id);
        return null;
      }

      console.log('Business data found:', data);
      return data;
    } catch (error) {
      console.error('Error in getBusinessById:', error);
      return null;
    }
  }
};
