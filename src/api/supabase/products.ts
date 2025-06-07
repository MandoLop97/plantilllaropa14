
import { supabase } from './client';
import { SupabaseProduct, mapSupabaseProductToLocal, mapLocalProductToSupabase } from '../../types/supabase';
import { Product } from '../../types';
import { logger } from '../../utils/logger';

export class ProductsService {
  // Obtener todos los productos
  static async getAll(businessId?: string): Promise<Product[]> {
    let query = supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });

    if (businessId) {
      query = query.eq('negocio_id', businessId);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Error fetching products:', undefined, error as Error);
      return [];
    }

    return (data || []).map(mapSupabaseProductToLocal);
  }

  // Obtener productos por categoría
  static async getByCategory(category: string, businessId?: string): Promise<Product[]> {
    let query = supabase
      .from('productos')
      .select('*')
      .eq('categoria', category)
      .order('created_at', { ascending: false });

    if (businessId) {
      query = query.eq('negocio_id', businessId);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Error fetching products by category:', undefined, error as Error);
      return [];
    }

    return (data || []).map(mapSupabaseProductToLocal);
  }

  // Crear un nuevo producto
  static async create(product: Omit<Product, 'id'>): Promise<Product | null> {
    const supabaseProduct = mapLocalProductToSupabase(product);
    
    const { data, error } = await supabase
      .from('productos')
      .insert(supabaseProduct)
      .select()
      .single();

    if (error) {
      logger.error('Error creating product:', undefined, error as Error);
      return null;
    }

    return mapSupabaseProductToLocal(data);
  }

  // Actualizar un producto
  static async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const supabaseUpdates = mapLocalProductToSupabase(updates);
    
    const { data, error } = await supabase
      .from('productos')
      .update({ ...supabaseUpdates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating product:', undefined, error as Error);
      return null;
    }

    return mapSupabaseProductToLocal(data);
  }

  // Eliminar un producto
  static async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting product:', undefined, error as Error);
      return false;
    }

    return true;
  }
}
