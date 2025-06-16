
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export type Plan = 'Gratis' | 'Basico' | 'Pro' | 'Negocio';

interface UsePlanReturn {
  plan: Plan | null;
  loading: boolean;
  isPro: boolean;
  isBasico: boolean;
  isNegocio: boolean;
  isGratis: boolean;
}

export function usePlan(): UsePlanReturn {
  const { user } = useAuth();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user plan:', error);
          setPlan('Gratis'); // Default to free plan on error
        } else {
          setPlan(data?.plan || 'Gratis');
        }
      } catch (error) {
        console.error('Error fetching plan:', error);
        setPlan('Gratis');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [user?.id]);

  return {
    plan,
    loading,
    isPro: plan === 'Pro',
    isBasico: plan === 'Basico',
    isNegocio: plan === 'Negocio',
    isGratis: plan === 'Gratis'
  };
}
