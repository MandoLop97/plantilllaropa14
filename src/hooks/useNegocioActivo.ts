
import { useState, useEffect } from 'react';
import { Negocio } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";

export const useNegocioActivo = (userId: string | null) => {
  const [negocioActivo, setNegocioActivo] = useState<Negocio | null>(null);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchNegocios = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('negocios')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      setNegocios(data || []);
      
      // Get the active business from profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('negocio_activo_id')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Find the active business
      const activeBusiness = data?.find(n => n.id === profileData.negocio_activo_id);
      
      if (activeBusiness) {
        setNegocioActivo(activeBusiness);
      } else if (data && data.length > 0) {
        // If no active business is set, select the first one
        await setActiveNegocio(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching negocios:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los negocios.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setActiveNegocio = async (negocioId: string) => {
    if (!userId) return;

    try {
      // Update the profile with the new active business
      const { error } = await supabase
        .from('profiles')
        .update({ negocio_activo_id: negocioId })
        .eq('id', userId);

      if (error) throw error;

      // Find and set the active business
      const selectedBusiness = negocios.find(n => n.id === negocioId);
      if (selectedBusiness) {
        setNegocioActivo(selectedBusiness);
        
        // Also store in localStorage for quick access
        localStorage.setItem("currentNegocioId", negocioId);
        
        toast({
          title: "Negocio seleccionado",
          description: `Ahora estás trabajando con ${selectedBusiness.nombre}`,
        });
      }
    } catch (error) {
      console.error("Error setting active business:", error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el negocio activo.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNegocios();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  return {
    negocioActivo,
    negocios,
    isLoading,
    setActiveNegocio,
    refetchNegocios: fetchNegocios
  };
};
