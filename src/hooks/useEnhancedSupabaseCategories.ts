
import { useQuery } from '@tanstack/react-query';
import { CategoriesService } from '../api';
import { Category } from '../types';
import { categories as fallbackCategories } from '../data/categories';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEYS = {
  categories: ['categories'] as const,
  businessCategories: (businessId: string) => ['categories', 'business', businessId] as const,
};

export const useEnhancedSupabaseCategories = (businessId?: string) => {
  const { toast } = useToast();

  // Query para obtener categorías usando React Query
  const categoriesQuery = useQuery({
    queryKey: businessId ? QUERY_KEYS.businessCategories(businessId) : QUERY_KEYS.categories,
    queryFn: async () => {
      try {
        return await CategoriesService.getAll(businessId);
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Usar datos de respaldo si no hay datos de Supabase
  const categoriesData = categoriesQuery.data?.length ? categoriesQuery.data : fallbackCategories;

  return {
    categories: categoriesData,
    loading: categoriesQuery.isLoading,
    error: categoriesQuery.error ? (categoriesQuery.error as Error).message : null,
    refetch: categoriesQuery.refetch,
  };
};
