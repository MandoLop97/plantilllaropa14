
import { useState, useEffect } from 'react';
import { ProductsService } from '../api';
import { Product } from '../types';
import { products as fallbackProducts } from '../data/products';
import { logger } from '../utils/logger';

export const useSupabaseProducts = (category?: string, businessId?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = category
          ? await ProductsService.getByCategory(category, businessId)
          : await ProductsService.getAll(businessId);
        
        // Si no hay datos de Supabase, usar productos locales como respaldo
        if (data.length === 0) {
          const fallback = category ? fallbackProducts.filter(p => p.category.toLowerCase() === category.toLowerCase()) : fallbackProducts;
          setProducts(fallback);
        } else {
          setProducts(data);
        }
      } catch (err) {
        logger.error('Error fetching products:', undefined, err as Error);
        setError('Error al cargar los productos');
        
        // En caso de error, usar productos locales filtrados
        const fallback = category ? fallbackProducts.filter(p => p.category.toLowerCase() === category.toLowerCase()) : fallbackProducts;
        setProducts(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, businessId]);

  const createProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct = await ProductsService.create(product);
      
      if (newProduct) {
        setProducts(prev => [newProduct, ...prev]);
        return newProduct;
      }
    } catch (err) {
      logger.error('Error creating product:', undefined, err as Error);
      setError('Error al crear el producto');
    }
    return null;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const updatedProduct = await ProductsService.update(id, updates);
      
      if (updatedProduct) {
        setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
        return updatedProduct;
      }
    } catch (err) {
      logger.error('Error updating product:', undefined, err as Error);
      setError('Error al actualizar el producto');
    }
    return null;
  };

  const deleteProduct = async (id: string) => {
    try {
      const success = await ProductsService.delete(id);
      if (success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        return true;
      }
    } catch (err) {
      logger.error('Error deleting product:', undefined, err as Error);
      setError('Error al eliminar el producto');
    }
    return false;
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: () => {
      const fetchProducts = async () => {
        setLoading(true);
        const data = category
          ? await ProductsService.getByCategory(category, businessId)
          : await ProductsService.getAll(businessId);
        setProducts(data);
        setLoading(false);
      };
      fetchProducts();
    }
  };
};
