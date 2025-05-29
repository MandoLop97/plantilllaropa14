
/**
 * Versión mejorada del ProductSection con todas las mejoras aplicadas
 * Mantiene el mismo diseño y funcionalidad, pero con mejor performance y robustez
 */

import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { CategorySelector } from './CategorySelector';
import { SectionHeader } from './SectionHeader';
import { Product, Category } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { animationVariants, transitionConfig, createStaggerDelay } from '../utils/animations';
import { UI_CONFIG, ROUTES } from '../constants/app';
import { STORE_CONFIG, BUSINESS_ID } from '../config/business';
import { useEnhancedSupabaseProducts } from '../hooks/useEnhancedSupabaseProducts';
import { useAnalytics, ANALYTICS_EVENTS } from '../utils/analytics';
import { useLogger } from '../utils/logger';
import { useDebounce } from '../hooks/useDebounce';

// Componente de imagen optimizada con lazy loading
const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-2xl" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
      />
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-t-2xl">
          <span className="text-gray-400">📷</span>
        </div>
      )}
    </div>
  );
};

interface EnhancedProductSectionProps {
  categories: Category[];
}

export const EnhancedProductSection: React.FC<EnhancedProductSectionProps> = ({ categories }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(STORE_CONFIG.defaultCategory);
  const navigate = useNavigate();
  const { trackEvent, measurePerformance } = useAnalytics();
  const logger = useLogger();

  // Usar el hook mejorado con React Query
  const {
    products,
    isLoading,
    isError,
    error,
    refetch
  } = useEnhancedSupabaseProducts(selectedCategory, BUSINESS_ID);

  // Debounce para optimizar cambios de categoría
  const debouncedCategory = useDebounce(selectedCategory, 300);

  // Memoizar productos filtrados para evitar re-renders innecesarios
  const filteredProducts = useMemo(() => {
    logger.debug('Filtrando productos', { 
      category: debouncedCategory, 
      totalProducts: products.length 
    });
    
    return products.filter(product => product.category === debouncedCategory);
  }, [products, debouncedCategory, logger]);

  // Memoizar categoría actual
  const currentCategory = useMemo(() => {
    return categories.find(cat => cat.name === debouncedCategory);
  }, [categories, debouncedCategory]);

  const handleCategorySelect = async (categoryName: string) => {
    await measurePerformance('category_selection', async () => {
      setSelectedCategory(categoryName);
      trackEvent(ANALYTICS_EVENTS.CATEGORY_SELECTED, {
        category: categoryName,
        previousCategory: selectedCategory
      });
      logger.info('Categoría seleccionada', { from: selectedCategory, to: categoryName });
    });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    trackEvent(ANALYTICS_EVENTS.PRODUCT_VIEWED, {
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price
    });
    logger.info('Producto seleccionado', { product: product.name, id: product.id });
  };

  const handleViewMore = async () => {
    await measurePerformance('navigation_to_products', async () => {
      navigate(ROUTES.PRODUCTS);
      trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, { page: 'products', from: 'home' });
    });
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
    logger.debug('Modal de producto cerrado');
  };

  // Manejar estados de carga y error
  if (isError) {
    logger.error('Error al cargar productos', { error });
    return (
      <section className="py-0">
        <div className={UI_CONFIG.CONTAINER_CLASSES}>
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-4xl text-red-500">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error al cargar productos
            </h3>
            <p className="text-gray-600 mb-4">
              {error?.message || 'Ha ocurrido un error inesperado'}
            </p>
            <button
              onClick={() => refetch()}
              className="bg-picton-blue-500 text-white px-4 py-2 rounded-lg hover:bg-picton-blue-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-0">
      <div className={UI_CONFIG.CONTAINER_CLASSES}>
        {/* Category Selector */}
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Section Header */}
        <SectionHeader
          icon={currentCategory?.icon || '📦'}
          title={currentCategory?.name || 'Productos'}
          description="Descubre nuestra selección de productos frescos y con estilo, disponibles en una variedad de diseños irresistibles."
        />

        {/* Loading State */}
        {isLoading && (
          <div className={`grid ${UI_CONFIG.GRID_COLUMNS.MOBILE} ${UI_CONFIG.GRID_COLUMNS.TABLET} ${UI_CONFIG.GRID_COLUMNS.DESKTOP} gap-4`}>
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-3">
                  <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
          <AnimatePresence mode="wait">
            <motion.div 
              key={debouncedCategory} 
              {...animationVariants.fadeIn}
              transition={transitionConfig.smooth}
              className={`grid ${UI_CONFIG.GRID_COLUMNS.MOBILE} ${UI_CONFIG.GRID_COLUMNS.TABLET} ${UI_CONFIG.GRID_COLUMNS.DESKTOP} gap-4`}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  {...animationVariants.scaleIn}
                  transition={{
                    ...transitionConfig.productGrid,
                    ...createStaggerDelay(index)
                  }}
                >
                  <ProductCard 
                    product={product} 
                    onClick={handleProductClick}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-4xl text-gray-400">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay productos en esta categoría
            </h3>
            <p className="text-gray-600">
              Próximamente agregaremos más productos a esta sección
            </p>
          </div>
        )}

        {/* View More Button */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="text-center mt-10">
            <motion.button 
              whileHover={{ scale: 1.06, x: 4 }} 
              className="inline-flex items-center gap-2 text-picton-blue-600 font-semibold hover:text-picton-blue-700 transition-colors group text-lg" 
              onClick={handleViewMore}
            >
              {STORE_CONFIG.texts.viewMore}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 text-xl">→</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={handleModalClose}
      />
    </section>
  );
};
