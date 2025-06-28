import { useState, useEffect } from 'react';

export function useHeroAspectRatio() {
  const [ratio, setRatio] = useState(20 / 9);

  useEffect(() => {
    const handleResize = () => setRatio(20 / 9);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return ratio;
}
