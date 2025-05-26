
import { useRef, useEffect } from 'react';
import { APP_CONFIG } from '../constants/app';

export const useCarouselScroll = (selectedItem: string, items: any[]) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.innerWidth < APP_CONFIG.MOBILE_BREAKPOINT && carouselRef.current) {
      const idx = items.findIndex(item => item.id === selectedItem);
      const button = itemRefs.current[idx];
      const carousel = carouselRef.current;
      
      if (button && carousel) {
        const buttonRect = button.getBoundingClientRect();
        const carouselRect = carousel.getBoundingClientRect();
        const scrollLeft = button.offsetLeft - carouselRect.width / 2 + buttonRect.width / 2;
        
        carousel.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedItem, items]);

  return { carouselRef, itemRefs };
};
