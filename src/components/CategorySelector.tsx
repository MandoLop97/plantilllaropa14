
import React from 'react';
import { motion } from 'framer-motion';
import { useCarouselScroll } from '../hooks/useCarouselScroll';
import { Category } from '../types';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryName: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  const { carouselRef, itemRefs } = useCarouselScroll(selectedCategory, categories);

  return (
    <div className="relative mb-8">
      <div className="w-screen -mx-4 max-w-none sm:w-auto sm:mx-0 sm:max-w-full relative pl-2">
        {/* Fades laterales SOLO en mobile */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-5 z-20 block sm:hidden" style={{
          background: 'linear-gradient(to right, #fff 40%, transparent 100%)'
        }} />
        <div className="pointer-events-none absolute top-0 right-0 h-full w-5 z-20 block sm:hidden" style={{
          background: 'linear-gradient(to left, #fff 20%, transparent 100%)'
        }} />

        <div 
          ref={carouselRef} 
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }} 
          className="relative z-10 flex flex-nowrap overflow-x-auto no-scrollbar gap-2 sm:gap-3 py-2 sm:px-0 px-[16px] mx-0"
        >
          {/* Espaciador opcional para que el primer botón no quede pegado al borde */}
          <div className="flex-shrink-0 w-1 sm:w-0" />
          
          {categories.map((category, idx) => (
            <div
              key={category.id}
              className="flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
              ref={el => itemRefs.current[idx] = el}
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.07 }}
                onClick={() => onCategorySelect(category.name)}
                className={`flex items-center gap-2 rounded-full whitespace-nowrap transition-all duration-300 shadow-sm
                  ${selectedCategory === category.name
                    ? 'bg-picton-blue-500 text-white shadow-lg ring-2 ring-picton-blue-400'
                    : 'bg-gray-100 text-gray-700 hover:bg-picton-blue-100/80'
                  }
                  px-3 py-1.5 text-sm
                  sm:px-5 sm:py-2.5 sm:text-base
                `}
                style={{
                  minWidth: 90,
                  minHeight: 36
                }}
              >
                <span className="text-lg sm:text-xl">{category.icon}</span>
                <span className="font-semibold">{category.name}</span>
              </motion.button>
            </div>
          ))}
          
          {/* Espaciador opcional para que el último botón no quede pegado al borde */}
          <div className="flex-shrink-0 w-1 sm:w-0" />
        </div>
      </div>
    </div>
  );
};
