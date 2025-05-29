
import { createClient } from '@supabase/supabase-js';
import { getEnvironmentConfig } from '../../config/environment';

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
    console.log('🔍 Querying paleta table for business ID:', businessId);
    console.log('🔍 Expected business ID:', 'b73218d6-186e-4bc0-8956-4b3db300abb4');
    console.log('🔍 IDs match:', businessId === 'b73218d6-186e-4bc0-8956-4b3db300abb4');
    
    // First, let's check what data exists in the table
    const { data: allData, error: allError } = await supabase
      .from('paleta')
      .select('*');
    
    console.log('📋 ALL data in paleta table:', allData);
    console.log('❌ Error getting all data:', allError);
    
    // Now try the specific query
    const { data, error } = await supabase
      .from('paleta')
      .select('*')
      .eq('negocio_id', businessId)
      .maybeSingle();

    if (error) {
      console.error('❌ Error fetching palette:', error);
      return null;
    }

    console.log('📋 Query result for specific business ID:', data);
    
    // If no data found, let's try different approaches
    if (!data) {
      console.log('⚠️ No data found with exact match. Trying alternative queries...');
      
      // Try querying with string comparison
      const { data: altData, error: altError } = await supabase
        .from('paleta')
        .select('*')
        .ilike('negocio_id', businessId);
      
      console.log('📋 Alternative query result:', altData);
      console.log('❌ Alternative query error:', altError);
    }
    
    return data as PaletaData | null;
  }

  // Method to verify if the table exists and has data
  static async getAllPalettes(): Promise<PaletaData[]> {
    console.log('🔍 Fetching all palettes to debug...');
    
    const { data, error } = await supabase
      .from('paleta')
      .select('*');

    if (error) {
      console.error('❌ Error fetching all palettes:', error);
      return [];
    }

    console.log('📋 All palettes in database:', data);
    return data as PaletaData[];
  }
}
