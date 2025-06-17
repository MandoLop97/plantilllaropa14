
/**
 * Hook mejorado para productos con React Query, retry automático y mejor manejo de errores
 * @module useEnhancedSupabaseProducts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ProductsService } from '../api';
import { Product } from '../types';
import { products as fallbackProducts } from '../data/products';
import { withRetry, handleSupabaseError } from '../utils/errorHandling';
import { useToast } from '@/hooks/use-toast';
import { logger } from '../utils/logger';

const QUERY_KEYS = {
  products: ['products'] as const,
  productsByCategory: (category: string) => ['products', 'category', category] as const,
  product: (id: string) => ['products', id] as const,
};

export const useEnhancedSupabaseProducts = (businessId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query para obtener productos con logging mejorado
  const productsQuery = useQuery({
    queryKey: [...QUERY_KEYS.products, businessId],
    queryFn: async () => {
      logger.info('Fetching products for business', { businessId });
      return withRetry(async () => {
        try {
          const products = await ProductsService.getAll(businessId || '');
          logger.info('Products fetched successfully', { 
            businessId, 
            count: products.length,
            productsWithDiscount: products.filter(p => p.discount && p.discount > 0).length
          });
          return products;
        } catch (error) {
          logger.error('Error fetching products', { businessId }, error as Error);
          handleSupabaseError(error as any);
          throw error;
        }
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Mutación para crear producto
  const createProductMutation = useMutation({
    mutationFn: async (product: Omit<Product, 'id'>) => {
      if (!businessId) {
        throw new Error('businessId es requerido para crear productos');
      }
      
      return withRetry(async () => {
        try {
          return await ProductsService.create(product, businessId);
        } catch (error) {
          handleSupabaseError(error as any);
          throw error;
        }
      });
    },
    onSuccess: (newProduct) => {
      if (newProduct) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
        toast({
          title: "Producto creado",
          description: `${newProduct.name} se ha creado exitosamente.`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear producto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutación para actualizar producto
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      return withRetry(async () => {
        try {
          return await ProductsService.update(id, updates);
        } catch (error) {
          handleSupabaseError(error as any);
          throw error;
        }
      });
    },
    onSuccess: (updatedProduct, { id }) => {
      if (updatedProduct) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
        queryClient.setQueryData(QUERY_KEYS.product(id), updatedProduct);
        toast({
          title: "Producto actualizado",
          description: `${updatedProduct.name} se ha actualizado exitosamente.`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error al actualizar producto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutación para eliminar producto
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return withRetry(async () => {
        try {
          return await ProductsService.delete(id);
        } catch (error) {
          handleSupabaseError(error as any);
          throw error;
        }
      });
    },
    onSuccess: (success, id) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
        queryClient.removeQueries({ queryKey: QUERY_KEYS.product(id) });
        toast({
          title: "Producto eliminado",
          description: "El producto se ha eliminado exitosamente.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error al eliminar producto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const productsData = useMemo(() => {
    const data = productsQuery.data || [];
    if (data.length > 0) {
      logger.debug('Products data processed', { 
        totalProducts: data.length,
        productsWithOriginalPrice: data.filter(p => p.originalPrice).length,
        productsWithDiscount: data.filter(p => p.discount && p.discount > 0).length
      });
      return data;
    }
    return fallbackProducts;
  }, [productsQuery.data]);

  return {
    // Data
    products: productsData,
    
    // Loading states - usando nombres consistentes
    loading: productsQuery.isLoading,
    error: productsQuery.error?.message || null,
    
    // Mutation states
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    
    // Actions
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    
    // Utils
    refetch: productsQuery.refetch,
    invalidate: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products }),
  };
};
