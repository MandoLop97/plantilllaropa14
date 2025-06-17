
import { createClient } from '@supabase/supabase-js';
import { getEnvironmentConfig } from '../../config/environment';
import { logger } from '../../utils/logger';

// Define the paleta data structure based on the actual database schema
export interface PaletaData {
  id: string;
  negocio_id: string;
  "50": string | null;
  "100": string | null;
  "200": string | null;
  "300": string | null;
  "400": string | null;
  "500": string | null;
  "600": string | null;
  "700": string | null;
  "800": string | null;
  "900": string | null;
  "950": string | null;
  created_at: string | null;
  updated_at: string | null;
}

const { supabase: supabaseEnv } = getEnvironmentConfig();
const supabase = createClient(supabaseEnv.url, supabaseEnv.anonKey);

export class PaletaService {
  static async getByBusinessId(businessId: string): Promise<PaletaData | null> {
     logger.debug('🔍 Querying paleta table for business ID:', { businessId });
    
    const { data, error } = await supabase
      .from('paleta')
      .select('*')
      .eq('negocio_id', businessId)
      .maybeSingle();

    if (error) {
      logger.error('❌ Error fetching palette:', undefined, error as Error);
      return null;
    }

     logger.debug('📋 Query result for specific business ID:', { data });
    return data as PaletaData | null;
  }

  // Method to verify if the table exists and has data
  static async getAllPalettes(): Promise<PaletaData[]> {
     logger.debug('🔍 Fetching all palettes to debug...');
    
    const { data, error } = await supabase
      .from('paleta')
      .select('*');

    if (error) {
      logger.error('❌ Error fetching all palettes:', undefined, error as Error);
      return [];
    }

     logger.debug('📋 All palettes in database:', { data });
    return data as PaletaData[];
  }

  // Method to create a palette for debugging
  static async createPalette(businessId: string, colors: Partial<PaletaData>): Promise<PaletaData | null> {
     logger.debug('🎨 Creating palette for business ID:', { businessId });
    
    const { data, error } = await supabase
      .from('paleta')
      .insert({
        negocio_id: businessId,
        ...colors
      })
      .select()
      .single();

    if (error) {
      logger.error('❌ Error creating palette:', undefined, error as Error);
      return null;
    }

     logger.debug('✅ Palette created successfully:', data);
    return data as PaletaData;
  }
}
