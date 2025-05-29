
import { supabase } from './client';
import { SupabaseCategory } from '../../types/supabase';
import { Category } from '../../types';

export class CategoriesService {
  // Obtener todas las categorías
  static async getAll(businessId?: string): Promise<Category[]> {
    let query = supabase
      .from('categorias')
      .select('*')
      .order('nombre', { ascending: true });

    if (businessId) {
      query = query.eq('negocio_id', businessId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return (data || []).map(cat => ({
      id: cat.id,
      name: cat.nombre,
      icon: cat.descripcion || '📦' // Usar descripción como icono o default
    }));
  }

  // Crear una nueva categoría
  static async create(category: { name: string; icon?: string }): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categorias')
      .insert({
        nombre: category.name,
        descripcion: category.icon,
        tipo: 'producto',
        negocio_id: '00000000-0000-0000-0000-000000000000' // Default business ID para plantilla
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.nombre,
      icon: data.descripcion || '📦'
    };
  }

  // Actualizar una categoría
  static async update(id: string, updates: { name?: string; icon?: string }): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categorias')
      .update({ 
        nombre: updates.name,
        descripcion: updates.icon,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.nombre,
      icon: data.descripcion || '📦'
    };
  }

  // Eliminar una categoría
  static async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }

    return true;
  }
}
