
import { supabase } from './client';
import { Category } from '../../types';
import { logger } from '../../utils/logger';

export class CategoriesService {
  // Obtener todas las categorías
  static async getAll(businessId?: string): Promise<Category[]> {
    try {
      logger.debug('🏷️ Obteniendo categorías para negocio:', { businessId });

      if (businessId) {
        // Usar consulta directa para obtener categorías
        const { data, error } = await supabase
          .from('categorias')
          .select('id, nombre, descripcion, imagen_url')
          .eq('negocio_id', businessId)
          .eq('activo', true)
          .order('nombre', { ascending: true });

        if (error) {
          logger.error('Error consultando categorías:', undefined, error as Error);
          return [];
        }

        const categorias = (data || []).map((cat: any) => ({
          id: cat.id,
          name: cat.nombre,
          icon: cat.descripcion || '📦',
          imagen_url: cat.imagen_url
        }));

        logger.debug('✅ Categorías obtenidas:', { count: categorias.length, categorias });
        return categorias;
      } else {
        // Consulta sin businessId específico
        const { data, error } = await supabase
          .from('categorias')
          .select('id, nombre, descripcion, imagen_url')
          .eq('activo', true)
          .order('nombre', { ascending: true });

        if (error) {
          logger.error('Error consultando categorías:', undefined, error as Error);
          return [];
        }

        return (data || []).map((cat: any) => ({
          id: cat.id,
          name: cat.nombre,
          icon: cat.descripcion || '📦',
          imagen_url: cat.imagen_url
        }));
      }
    } catch (err) {
      logger.error('Error general obteniendo categorías:', undefined, err as Error);
      return [];
    }
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
      logger.error('Error creating category:', undefined, error as Error);
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
      logger.error('Error updating category:', undefined, error as Error);
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
      logger.error('Error deleting category:', undefined, error as Error);
      return false;
    }

    return true;
  }
}
