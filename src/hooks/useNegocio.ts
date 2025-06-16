
import { useState, useEffect } from 'react';
import { Negocio } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { logger } from '@/lib/logger';

export const useNegocio = (userId: string | null) => {
  const [negocio, setNegocio] = useState<Negocio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchNegocio = async (onSuccess?: (data: Negocio) => void) => {
    setIsLoading(true);
    try {
      if (!userId) {
        console.warn("No se proporcionó un ID de usuario.");
        setIsLoading(false);
        return;
      }

      logger.log("Fetching active negocio for user ID:", userId);
      
      // First get the user's active business ID from their profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('negocio_activo_id')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error("Error from Supabase (profile):", profileError);
        throw profileError;
      }

      if (!profileData?.negocio_activo_id) {
        logger.log("No active business set for this user");
        
        // Try to get the first business and set it as active
        const { data: negociosData, error: negociosError } = await supabase
          .from('negocios')
          .select('*')
          .eq('user_id', userId)
          .limit(1);

        if (negociosError) {
          throw negociosError;
        }

        if (negociosData && negociosData.length > 0) {
          const firstBusiness = negociosData[0];
          
          // Set it as active in the profile
          await supabase
            .from('profiles')
            .update({ negocio_activo_id: firstBusiness.id })
            .eq('id', userId);

          setNegocio(firstBusiness);
          if (onSuccess && firstBusiness) {
            onSuccess(firstBusiness);
          }
        } else {
          setNegocio(null);
        }
        
        setIsLoading(false);
        return;
      }

      // Get the active business details
      const { data, error } = await supabase
        .from('negocios')
        .select('*')
        .eq('id', profileData.negocio_activo_id)
        .maybeSingle();

      if (error) {
        console.error("Error from Supabase:", error);
        throw error;
      }

      if (!data) {
        logger.log("Active business not found, it may have been deleted");
        setNegocio(null);
        setIsLoading(false);
        return;
      }

      logger.log("Active negocio data fetched:", data);
      setNegocio(data);
      if (onSuccess && data) {
        onSuccess(data);
      }
    } catch (error) {
      console.error("Error fetching negocio:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información del negocio.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateNegocio = async (id: string, updates: Partial<Negocio>) => {
    try {
      const { data, error } = await supabase
        .from('negocios')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setNegocio(data);
      return data;
    } catch (error) {
      console.error("Error updating negocio:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNegocio();
    } else {
      setIsLoading(false);
    }
  }, [userId]);
  
  return { negocio, isLoading, refetch: fetchNegocio, fetchNegocio, updateNegocio };
};
