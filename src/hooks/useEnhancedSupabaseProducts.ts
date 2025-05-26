
/**
 * Hook mejorado para productos con React Query, retry automático y mejor manejo de errores
 * @module useEnhancedSupabaseProducts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductsService } from '../services';
import { Product } from '../types';
import { withRetry, handleSupabaseError } from '../utils/errorHandling';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEYS = {
  products: ['products'] as const,
  productsByCategory: (category: string) => ['products', 'category', category] as const,
  product: (id: string) => ['products', id] as const,
};

export const useEnhancedSupabaseProducts = (category?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query para obtener productos
  const productsQuery = useQuery({
    queryKey: category ? QUERY_KEYS.productsByCategory(category) : QUERY_KEYS.products,
    queryFn: async () => {
      return withRetry(async () => {
        try {
          return category 
            ? await ProductsService.getByCategory(category)
            : await ProductsService.getAll();
        } catch (error) {
          handleSupabaseError(error, 'obtener productos');
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
      return withRetry(async () => {
        try {
          return await ProductsService.create(product);
        } catch (error) {
          handleSupabaseError(error, 'crear producto');
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
    onError: (error) => {
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
          handleSupabaseError(error, 'actualizar producto');
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
    onError: (error) => {
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
          handleSupabaseError(error, 'eliminar producto');
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
    onError: (error) => {
      toast({
        title: "Error al eliminar producto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    products: productsQuery.data || [],
    
    // Loading states
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    
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
