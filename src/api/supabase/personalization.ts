import { supabase } from './client';

export interface PersonalizationData {
  id: string;
  negocio_id: string;
  color_primario: string | null;
  color_secundario: string | null;
  fuente: string | null;
  modo_oscuro: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export class PersonalizationService {
  static async getByBusinessId(businessId: string): Promise<PersonalizationData | null> {
    const { data, error } = await supabase
      .from('personalizacion')
      .select('*')
      .eq('negocio_id', businessId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching personalization:', error);
      return null;
    }

    return data as PersonalizationData | null;
  }
}
