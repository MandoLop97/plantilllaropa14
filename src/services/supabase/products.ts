
import { supabase } from '../../integrations/supabase/client';
import { SupabaseProduct, mapSupabaseProductToLocal, mapLocalProductToSupabase } from '../../types/supabase';
import { Product } from '../../types';

export class ProductsService {
  // Obtener todos los productos
  static async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return (data || []).map(mapSupabaseProductToLocal);
  }

  // Obtener productos por categoría
  static async getByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('categoria', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by category:', error);
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
      console.error('Error creating product:', error);
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
      console.error('Error updating product:', error);
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
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  }
}
