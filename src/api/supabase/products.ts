
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
        originalPrice: product.precio_original,
        image: product.imagen_url || '/placeholder.svg',
        categoryId: product.categoria_id || '',
        category: product.categoria || '',
        description: product.descripcion || '',
        sku: product.sku || product.id,
        discount: product.precio_original && product.precio_original > product.precio 
          ? Math.round(((product.precio_original - product.precio) / product.precio_original) * 100)
          : undefined
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
        .eq('categoria_id', categoryId)
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
        originalPrice: product.precio_original,
        image: product.imagen_url || '/placeholder.svg',
        categoryId: product.categoria_id || '',
        category: product.categoria || '',
        description: product.descripcion || '',
        sku: product.sku || product.id,
        discount: product.precio_original && product.precio_original > product.precio 
          ? Math.round(((product.precio_original - product.precio) / product.precio_original) * 100)
          : undefined
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
        precio_original: productData.originalPrice,
        imagen_url: productData.image,
        categoria_id: productData.categoryId,
        categoria: productData.category,
        descripcion: productData.description,
        sku: productData.sku,
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
        originalPrice: data.precio_original,
        image: data.imagen_url || '/placeholder.svg',
        categoryId: data.categoria_id || '',
        category: data.categoria || '',
        description: data.descripcion || '',
        sku: data.sku || data.id,
        discount: data.precio_original && data.precio_original > data.precio 
          ? Math.round(((data.precio_original - data.precio) / data.precio_original) * 100)
          : undefined
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
      if (productData.originalPrice !== undefined) updateData.precio_original = productData.originalPrice;
      if (productData.image) updateData.imagen_url = productData.image;
      if (productData.categoryId) updateData.categoria_id = productData.categoryId;
      if (productData.category) updateData.categoria = productData.category;
      if (productData.description) updateData.descripcion = productData.description;
      if (productData.sku) updateData.sku = productData.sku;

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
        originalPrice: data.precio_original,
        image: data.imagen_url || '/placeholder.svg',
        categoryId: data.categoria_id || '',
        category: data.categoria || '',
        description: data.descripcion || '',
        sku: data.sku || data.id,
        discount: data.precio_original && data.precio_original > data.precio 
          ? Math.round(((data.precio_original - data.precio) / data.precio_original) * 100)
          : undefined
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
