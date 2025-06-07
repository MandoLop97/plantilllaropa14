
import { useRef, useEffect } from 'react';

export const useCarouselScroll = <T extends { id?: string; name?: string }>(
  selectedItem: string,
  items: T[]
) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (carouselRef.current) {
      const idx = items.findIndex(item => item.name === selectedItem || item.id === selectedItem);
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
