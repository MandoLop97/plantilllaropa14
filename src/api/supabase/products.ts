
import { supabase } from './client';
import { logger } from '../../utils/logger';
import { Product } from '../../types';

export const ProductsService = {
  // Obtener productos por negocio
  async getProductsByBusiness(businessId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('negocio_id', businessId)
        .eq('disponible', true)
        .order('nombre');

      if (error) {
        logger.error('Error fetching products:', undefined, error as Error);
        return [];
      }

      return (data || []).map((product: any) => ({
        id: product.id,
        name: product.nombre,
        price: product.precio,
        originalPrice: undefined, // Campo no existe en BD
        image: product.imagen_url || '/placeholder.svg',
        categoryId: product.categoria || '', // Usar categoria en lugar de categoria_id
        category: product.categoria || '',
        description: product.descripcion || '',
        sku: product.id, // Usar id como sku ya que no existe campo sku
        discount: undefined // No calcular descuento sin precio_original
      }));
    } catch (error) {
      logger.error('Error in getProductsByBusiness:', undefined, error as Error);
      return [];
    }
  },

  // Obtener productos por categoría
  async getProductsByCategory(businessId: string, categoryId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('negocio_id', businessId)
        .eq('categoria', categoryId) // Usar categoria en lugar de categoria_id
        .eq('disponible', true)
        .order('nombre');

      if (error) {
        logger.error('Error fetching products by category:', undefined, error as Error);
        return [];
      }

      return (data || []).map((product: any) => ({
        id: product.id,
        name: product.nombre,
        price: product.precio,
        originalPrice: undefined,
        image: product.imagen_url || '/placeholder.svg',
        categoryId: product.categoria || '',
        category: product.categoria || '',
        description: product.descripcion || '',
        sku: product.id,
        discount: undefined
      }));
    } catch (error) {
      logger.error('Error in getProductsByCategory:', undefined, error as Error);
      return [];
    }
  },

  // Métodos adicionales para mantener compatibilidad
  async getAll(businessId: string): Promise<Product[]> {
    return this.getProductsByBusiness(businessId);
  },

  async getByCategory(businessId: string, categoryId: string): Promise<Product[]> {
    return this.getProductsByCategory(businessId, categoryId);
  },

  async create(productData: Omit<Product, 'id'>, negocio_id: string): Promise<Product | null> {
    try {
      const supabaseData = {
        nombre: productData.name || '',
        precio: productData.price || 0,
        imagen_url: productData.image,
        categoria: productData.category,
        descripcion: productData.description,
        negocio_id: negocio_id,
        disponible: true
      };
      
      const { data, error } = await supabase
        .from('productos')
        .insert(supabaseData)
        .select()
        .single();

      if (error) {
        logger.error('Error creating product:', undefined, error as Error);
        return null;
      }

      return {
        id: data.id,
        name: data.nombre,
        price: data.precio,
        originalPrice: undefined,
        image: data.imagen_url || '/placeholder.svg',
        categoryId: data.categoria || '',
        category: data.categoria || '',
        description: data.descripcion || '',
        sku: data.id,
        discount: undefined
      };
    } catch (error) {
      logger.error('Error in create product:', undefined, error as Error);
      return null;
    }
  },

  async update(id: string, productData: Partial<Product>): Promise<Product | null> {
    try {
      const updateData: any = {};
      
      if (productData.name) updateData.nombre = productData.name;
      if (productData.price !== undefined) updateData.precio = productData.price;
      if (productData.image) updateData.imagen_url = productData.image;
      if (productData.category) updateData.categoria = productData.category;
      if (productData.description) updateData.descripcion = productData.description;

      const { data, error } = await supabase
        .from('productos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error updating product:', undefined, error as Error);
        return null;
      }

      return {
        id: data.id,
        name: data.nombre,
        price: data.precio,
        originalPrice: undefined,
        image: data.imagen_url || '/placeholder.svg',
        categoryId: data.categoria || '',
        category: data.categoria || '',
        description: data.descripcion || '',
        sku: data.id,
        discount: undefined
      };
    } catch (error) {
      logger.error('Error in update product:', undefined, error as Error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Error deleting product:', undefined, error as Error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error in delete product:', undefined, error as Error);
      return false;
    }
  }
};
