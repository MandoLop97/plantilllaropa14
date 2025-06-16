
import { useState, useEffect } from 'react';
import { supabase } from '../api/supabase/client';
import { Product, Category } from '../types';
import { SupabaseProduct, SupabaseCategory, mapSupabaseProductToLocal } from '../types/supabase';
import { logger } from '../utils/logger';

interface BusinessInfo {
  name: string;
  logo_url: string | null;
  banner_url: string | null;
}

export const useDataSync = (businessId: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch business info
        const { data: businessData, error: businessError } = await supabase
          .from('negocios')
          .select('nombre, logo_url, banner_url')
          .eq('id', businessId)
          .single();

        if (businessError) throw businessError;

        setBusinessInfo({
          name: businessData.nombre,
          logo_url: businessData.logo_url,
          banner_url: businessData.banner_url
        });

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categorias')
          .select('*')
          .eq('negocio_id', businessId)
          .eq('activo', true)
          .order('nombre');

        if (categoriesError) throw categoriesError;

        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('productos')
          .select('*')
          .eq('negocio_id', businessId)
          .eq('disponible', true)
          .order('nombre');

        if (productsError) throw productsError;

        // Transform categories
        const transformedCategories: Category[] = (categoriesData || []).map((cat: SupabaseCategory) => ({
          id: cat.id,
          name: cat.nombre,
          icon: '🛍️', // Default icon
          imagen_url: cat.imagen_url || undefined
        }));

        // Transform products using the mapping function
        const transformedProducts: Product[] = (productsData || []).map((product: SupabaseProduct) => 
          mapSupabaseProductToLocal(product)
        );

        setCategories(transformedCategories);
        setProducts(transformedProducts);
      } catch (err) {
        logger.error('Error syncing data:', undefined, err as Error);
        setError('Error al sincronizar los datos');
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchData();
    }
  }, [businessId]);

  return {
    products,
    categories,
    businessInfo,
    loading,
    error
  };
};
