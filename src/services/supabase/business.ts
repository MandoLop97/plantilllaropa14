
import { supabase } from '../../integrations/supabase/client';

const BUSINESS_ID = 'b73218d6-186e-4bc0-8956-4b3db300abb4';

// Recupera los datos del negocio desde Supabase
const fetchNegocio = async () => {
  try {
    const { data, error } = await supabase
      .from('negocios')
      .select('id, nombre, descripcion, logo_url, banner_url')
      .eq('id', BUSINESS_ID)
      .single();

    if (error) {
      console.error('Error fetching negocio:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchNegocio:', error);
    return null;
  }
};

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
        .maybeSingle();

      if (error) {
        console.error('Error fetching business:', error);
        return null;
      }

      if (!data) {
        console.warn('Business not found');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getBusinessById:', error);
      return null;
    }
  }
};
