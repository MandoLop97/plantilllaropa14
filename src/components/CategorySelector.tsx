
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarouselScroll } from '../hooks/useCarouselScroll';
import { Category } from '../types';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  const {
    carouselRef,
    itemRefs
  } = useCarouselScroll(selectedCategory, categories);

  // Seleccionar automáticamente la primera categoría válida
  useEffect(() => {
    if (categories.length > 0) {
      const exists = categories.some(cat => cat.id === selectedCategory);
      if (!exists) {
        onCategorySelect(categories[0].id);
      }
    }
  }, [categories, selectedCategory, onCategorySelect]);

  
  const getFallbackImage = (categoryName: string) => {
    const fallbackMap: Record<string, string> = {
      'Tecnología': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop&crop=center',
      'Moda': 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=400&fit=crop&crop=center',
      'Hogar': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
      'Deportes': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop&crop=center',
      'Comida': 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop&crop=center',
      'Libros': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center',
      'Música': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
      'Arte': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center',
      'Viajes': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop&crop=center',
      'Salud': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center'
    };
    return fallbackMap[categoryName] || 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop&crop=center';
  };

  return (
    <div className="relative mb-6">
      {/* Contenedor principal optimizado para móviles */}
      <div className="w-full relative">
        {/* Fades laterales SOLO en mobile */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-4 z-20 block sm:hidden" style={{
          background: 'linear-gradient(to right, #fff 60%, transparent 100%)'
        }} />
        <div className="pointer-events-none absolute top-0 right-0 h-full w-4 z-20 block sm:hidden" style={{
          background: 'linear-gradient(to left, #fff 60%, transparent 100%)'
        }} />

        <div 
          ref={carouselRef} 
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }} 
          className={`relative z-10 flex flex-nowrap py-4 gap-4 sm:gap-6
            ${categories.length > 0 ? 'overflow-x-auto no-scrollbar px-4 sm:px-0 sm:overflow-visible sm:justify-center' : 'justify-center px-4'}
          `}
        >
          <AnimatePresence>
            {categories.map((category, idx) => {
              const isSelected = selectedCategory === category.id;
              const categoryImage = category.imagen_url || getFallbackImage(category.name);
              
              return (
                <motion.div 
                  key={category.id} 
                  className="flex-shrink-0" 
                  style={{
                    scrollSnapAlign: 'center'
                  }} 
                  ref={el => itemRefs.current[idx] = el} 
                  layout 
                  layoutId={`category-${category.id}`}
                >
                  <motion.button 
                    whileHover={{
                      scale: 1.05,
                      y: -2,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 15
                      }
                    }} 
                    whileTap={{
                      scale: 0.95,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 15
                      }
                    }} 
                    animate={{
                      scale: isSelected ? 1.05 : 1,
                      y: isSelected ? -2 : 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        duration: 0.4
                      }
                    }} 
                    onClick={() => onCategorySelect(category.id)}
                    className="flex flex-col items-center justify-center p-2 relative group"
                  >
                    {/* Imagen circular con tamaños optimizados para móviles */}
                    <motion.div 
                      animate={{
                        boxShadow: isSelected 
                          ? '0 10px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.1)' 
                          : '0 2px 8px rgba(0,0,0,0.1)'
                      }} 
                      className="relative rounded-full overflow-hidden transition-all duration-500"
                    >
                      <motion.div 
                        animate={{
                          scale: isSelected ? [1, 1.01, 1] : 1
                        }} 
                        transition={{
                          duration: isSelected ? 2 : 0,
                          repeat: isSelected ? Infinity : 0,
                          ease: "easeInOut"
                        }} 
                        className={`relative rounded-full overflow-hidden transition-all duration-500
                          ${isSelected 
                            ? 'ring-3 ring-primary-400/70 shadow-xl' 
                            : 'ring-2 ring-neutral-200 hover:ring-primary-300 shadow-md group-hover:ring-primary-400/50'
                          }
                          w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20
                        `}
                      >
                        <motion.img 
                          src={categoryImage} 
                          alt={category.name} 
                          className="w-full h-full object-cover" 
                          loading="lazy" 
                          whileHover={{
                            scale: 1.05
                          }} 
                          transition={{
                            duration: 0.3
                          }} 
                        />
                        
                        {/* Overlay sutil */}
                        <motion.div 
                          className={`absolute inset-0 transition-all duration-500
                            ${isSelected 
                              ? 'bg-gradient-to-br from-primary-500/15 via-primary-400/8 to-transparent' 
                              : 'bg-black/3 group-hover:bg-gradient-to-br group-hover:from-primary-500/10 group-hover:via-primary-400/5 group-hover:to-transparent'
                            }
                          `} 
                        />
                      </motion.div>
                    </motion.div>
                    
                    {/* Nombre de la categoría optimizado para móviles */}
                    <motion.span 
                      animate={{
                        color: isSelected ? 'hsl(var(--color-primary-600))' : 'hsl(var(--color-neutral-700))',
                        fontWeight: isSelected ? 700 : 600,
                        scale: isSelected ? 1.02 : 1
                      }} 
                      transition={{
                        duration: 0.3
                      }} 
                      className={`relative text-center transition-all duration-300 mt-2 leading-tight
                        text-xs sm:text-sm lg:text-base max-w-14 sm:max-w-18 lg:max-w-20
                        ${isSelected ? 'text-primary-600' : 'text-neutral-700 group-hover:text-primary-600'}
                      `}
                    >
                      {category.name}
                      
                      {/* Underline effect */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div 
                            layoutId="underline" 
                            initial={{
                              scaleX: 0,
                              opacity: 0
                            }} 
                            animate={{
                              scaleX: 1,
                              opacity: 1
                            }} 
                            exit={{
                              scaleX: 0,
                              opacity: 0
                            }} 
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30
                            }} 
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" 
                          />
                        )}
                      </AnimatePresence>
                    </motion.span>
                  </motion.button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
