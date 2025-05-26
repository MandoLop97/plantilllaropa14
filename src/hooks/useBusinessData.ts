
import { useState, useEffect } from 'react';
import { BusinessService, type BusinessData } from '../services/supabase/business';

const BUSINESS_ID = 'b73218d6-186e-4bc0-8956-4b3db300abb4';

export const useBusinessData = () => {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await BusinessService.getBusinessById(BUSINESS_ID);
        setBusinessData(data);
      } catch (err) {
        console.error('Error loading business data:', err);
        setError('Error al cargar los datos del negocio');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  return {
    businessData,
    loading,
    error
  };
};
