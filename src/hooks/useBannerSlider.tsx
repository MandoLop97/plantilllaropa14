
import { useState, useEffect, useRef } from 'react';
import { APP_CONFIG } from '../constants/app';

export const useBannerSlider = (images: string[], autoplayDelay: number = APP_CONFIG.AUTOPLAY_DELAY) => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const next = () => setCurrent((current + 1) % images.length);
  const prev = () => setCurrent((current - 1 + images.length) % images.length);

  // Autoplay logic
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setCurrent((current + 1) % images.length);
    }, autoplayDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [current, images.length, autoplayDelay]);

  return {
    current,
    next,
    prev,
    setCurrent
  };
};
