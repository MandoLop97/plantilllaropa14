
import React, { createContext, useContext } from 'react';
import { useTemaConfig } from '../hooks/useTemaConfig';
import { useDynamicBusinessId } from './DynamicBusinessIdContext';
import type { ThemeConfigJson } from '../api/supabase/themeConfig';
import { BUSINESS_ID } from '../config/business';

interface ThemeConfigContextValue {
  config: ThemeConfigJson | null;
  isLoading: boolean;
  error: string | null;
}

const ThemeConfigContext = createContext<ThemeConfigContextValue>({
  config: null,
  isLoading: true,
  error: null
});

export const useThemeConfigData = () => useContext(ThemeConfigContext);

interface ProviderProps {
  businessId?: string;
  children: React.ReactNode;
}

export const ThemeConfigProvider: React.FC<ProviderProps> = ({ 
  businessId, 
  children 
}) => {
  const { businessId: dynamicBusinessId, isLoading: dynamicLoading } = useDynamicBusinessId();
  
  // Usar el businessId dinámico si está disponible, sino usar el prop o el BUSINESS_ID por defecto
  const finalBusinessId = businessId || dynamicBusinessId || BUSINESS_ID;
  
  const { config, isLoading: themeLoading, error } = useTemaConfig(finalBusinessId, {
    enabled: !dynamicLoading,
  });
  
  // Mostrar loading si cualquiera de los dos está cargando
  const isLoading = dynamicLoading || themeLoading;
  
  return (
    <ThemeConfigContext.Provider value={{ config, isLoading, error }}>
      {children}
    </ThemeConfigContext.Provider>
  );
};
