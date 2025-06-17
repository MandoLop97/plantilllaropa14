
import { useState, useEffect } from 'react';
import { APP_CONFIG } from '../constants/app';

export function useHeroAspectRatio() {
  // Inicializar con un valor por defecto seguro
  const [ratio, setRatio] = useState<number>(16 / 9);

  useEffect(() => {
    const calculateRatio = () => {
      if (typeof window !== 'undefined') {
        return window.innerWidth < APP_CONFIG.MOBILE_BREAKPOINT ?  16 / 9 : 30 / 9;
      }
      return 16 / 9; // Valor por defecto para SSR
    };

    // Establecer el ratio inicial
    setRatio(calculateRatio());

    const handleResize = () => {
      setRatio(calculateRatio());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return ratio;
}
