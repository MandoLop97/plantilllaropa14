
import { useState, useEffect } from 'react';
import { ProductsService } from '../services';
import { Product } from '../types';

export const useSupabaseProducts = (category?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = category 
          ? await ProductsService.getByCategory(category)
          : await ProductsService.getAll();
        
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const createProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct = await ProductsService.create(product);
      
      if (newProduct) {
        setProducts(prev => [newProduct, ...prev]);
        return newProduct;
      }
    } catch (err) {
      console.error('Error creating product:', err);
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
      console.error('Error updating product:', err);
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
      console.error('Error deleting product:', err);
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
          ? await ProductsService.getByCategory(category)
          : await ProductsService.getAll();
        setProducts(data);
        setLoading(false);
      };
      fetchProducts();
    }
  };
};
