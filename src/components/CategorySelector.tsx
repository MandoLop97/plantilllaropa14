import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const {
    carouselRef,
    itemRefs
  } = useCarouselScroll(selectedCategory, categories);

  // Seleccionar automáticamente la primera categoría si no hay ninguna seleccionada
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      onCategorySelect(categories[0].name);
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
    <div className="relative mb-8">
      <div className="w-screen -mx-4 max-w-none sm:w-auto sm:mx-0 sm:max-w-full relative">
        {/* Fades laterales SOLO en mobile */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-6 z-20 block sm:hidden" style={{
          background: 'linear-gradient(to right, #fff 70%, transparent 100%)'
        }} />
        <div className="pointer-events-none absolute top-0 right-0 h-full w-6 z-20 block sm:hidden" style={{
          background: 'linear-gradient(to left, #fff 70%, transparent 100%)'
        }} />

        <div 
          ref={carouselRef} 
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }} 
          className={`relative z-10 flex flex-nowrap py-6 sm:px-0 px-[31px] mx-0 gap-4 sm:gap-8
            ${categories.length > 0 ? 'overflow-x-auto no-scrollbar sm:overflow-visible sm:justify-center' : 'justify-center'}
          `}
        >
          <AnimatePresence>
            {categories.map((category, idx) => {
              const isSelected = selectedCategory === category.name;
              const categoryImage = category.imagen_url || getFallbackImage(category.name);
              
              return (
                <motion.div 
                  key={category.id} 
                  className="flex-shrink-0" 
                  style={{
                    scrollSnapAlign: 'start'
                  }} 
                  ref={el => itemRefs.current[idx] = el} 
                  layout 
                  layoutId={`category-${category.id}`}
                >
                  <motion.button 
                    whileHover={{
                      scale: 1.05,
                      y: -8,
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
                      scale: isSelected ? 1.08 : 1,
                      y: isSelected ? -8 : 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        duration: 0.4
                      }
                    }} 
                    onClick={() => onCategorySelect(category.name)} 
                    className="flex flex-col items-center justify-center p-3 sm:p-4 relative group"
                  >
                    {/* Imagen circular con tamaños más grandes y mejor responsividad */}
                    <motion.div 
                      animate={{
                        boxShadow: isSelected 
                          ? '0 20px 40px rgba(0,0,0,0.15), 0 12px 20px rgba(0,0,0,0.1)' 
                          : '0 6px 12px rgba(0,0,0,0.1)'
                      }} 
                      className="relative rounded-full overflow-hidden transition-all duration-500"
                    >
                      <motion.div 
                        animate={{
                          scale: isSelected ? [1, 1.02, 1] : 1
                        }} 
                        transition={{
                          duration: isSelected ? 2 : 0,
                          repeat: isSelected ? Infinity : 0,
                          ease: "easeInOut"
                        }} 
                        className={`relative rounded-full overflow-hidden transition-all duration-500
                          ${isSelected 
                            ? 'ring-4 ring-primary-400/80 shadow-2xl' 
                            : 'ring-3 ring-neutral-200 hover:ring-primary-300 shadow-lg group-hover:ring-primary-400/60'
                          }
                          w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32
                        `}
                      >
                        <motion.img 
                          src={categoryImage} 
                          alt={category.name} 
                          className="w-full h-full object-cover" 
                          loading="lazy" 
                          whileHover={{
                            scale: 1.1
                          }} 
                          transition={{
                            duration: 0.3
                          }} 
                        />
                        
                        {/* Overlay sutil mejorado */}
                        <motion.div 
                          className={`absolute inset-0 transition-all duration-500
                            ${isSelected 
                              ? 'bg-gradient-to-br from-primary-500/25 via-primary-400/15 to-transparent' 
                              : 'bg-black/5 group-hover:bg-gradient-to-br group-hover:from-primary-500/20 group-hover:via-primary-400/10 group-hover:to-transparent'
                            }
                          `} 
                        />
                      </motion.div>
                    </motion.div>
                    
                    {/* Nombre de la categoría con mejor espaciado y tipografía */}
                    <motion.span 
                      animate={{
                        color: isSelected ? 'hsl(var(--color-primary-600))' : 'hsl(var(--color-neutral-700))',
                        fontWeight: isSelected ? 700 : 600,
                        scale: isSelected ? 1.05 : 1
                      }} 
                      transition={{
                        duration: 0.3
                      }} 
                      className={`relative text-center transition-all duration-300 mt-4 leading-tight
                        text-sm sm:text-base lg:text-lg max-w-20 sm:max-w-28 lg:max-w-32
                        ${isSelected ? 'text-primary-600' : 'text-neutral-700 group-hover:text-primary-600'}
                      `}
                    >
                      {category.name}
                      
                      {/* Underline effect mejorado para selected */}
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
                            className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" 
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
