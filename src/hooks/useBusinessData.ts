
import { useState, useEffect } from 'react';
import { BusinessService, type BusinessData } from '../api/supabase/business';
import { BUSINESS_ID } from '../config/business';
import { logger } from '../utils/logger';

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
        logger.error('Error loading business data:', undefined, err as Error);
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
