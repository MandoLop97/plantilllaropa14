
import React, { useState, useEffect, useMemo } from 'react';
import { Category } from '../types';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { CategorySelector } from './CategorySelector';
import { SectionHeader } from './SectionHeader';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  animationVariants,
  transitionConfig,
  createStaggerDelay
} from '../utils/animations';
import { UI_CONFIG, ROUTES } from '../constants/app';
import { STORE_CONFIG, BUSINESS_ID } from '../config/business';
import { useEnhancedSupabaseProducts } from '../hooks/useEnhancedSupabaseProducts';
import { useIsMobile } from '../hooks/use-mobile';

interface ProductSectionProps {
  categories: Category[];
}

const ProductSectionSkeleton = () => {
  const isMobile = useIsMobile();
  const maxProducts = isMobile ? 6 : 8;

  return (
    <section className="py-0 animate-pulse">
      <div className={UI_CONFIG.CONTAINER_CLASSES}>
        <div className="relative mb-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-2">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="h-8 w-24 bg-gray-200 rounded-full flex-shrink-0"
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 mb-8 px-2">
          <div className="w-14 h-14 rounded-2xl bg-gray-200" />
          <div className="space-y-2">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-64 bg-gray-200 rounded" />
          </div>
        </div>
        <div
          className={`grid ${UI_CONFIG.GRID_COLUMNS.MOBILE} ${UI_CONFIG.GRID_COLUMNS.TABLET} ${UI_CONFIG.GRID_COLUMNS.DESKTOP} gap-4`}
        >
          {[...Array(maxProducts)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <div className="aspect-square bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-6 bg-gray-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ProductSection: React.FC<ProductSectionProps> = ({ categories }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Seleccionar automáticamente la primera categoría cuando las categorías estén disponibles
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].name);
    }
  }, [categories, selectedCategory]);

  const { products, isLoading, isError, error, refetch } = useEnhancedSupabaseProducts(
    selectedCategory,
    BUSINESS_ID
  );
  
  // Limitar productos: 6 en móvil, 8 en escritorio
  const maxProducts = isMobile ? 6 : 8;
  const filteredProducts = useMemo(() => products.slice(0, maxProducts), [products, maxProducts]);
  const currentCategory = useMemo(
    () => categories.find(cat => cat.name === selectedCategory),
    [categories, selectedCategory]
  );

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleViewMore = () => {
    navigate(ROUTES.PRODUCTS);
  };

  // Mostrar skeleton mientras se cargan las categorías
  if (categories.length === 0) {
    return <ProductSectionSkeleton />;
  }

  if (isError) {
    return (
      <section className="py-0">
        <div className={UI_CONFIG.CONTAINER_CLASSES}>
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-4xl text-red-500">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar productos</h3>
            <p className="text-gray-600 mb-4">{error?.message || 'Ha ocurrido un error inesperado'}</p>
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
          icon={currentCategory?.icon || ''}
          title={currentCategory?.name || ''}
          description="Descubre nuestra selección de productos frescos y con estilo, disponibles en una variedad de diseños irresistibles."
        />

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory} 
            {...animationVariants.fadeIn}
            transition={transitionConfig.smooth}
            className={`grid ${UI_CONFIG.GRID_COLUMNS.MOBILE} ${UI_CONFIG.GRID_COLUMNS.TABLET} ${UI_CONFIG.GRID_COLUMNS.DESKTOP} gap-4`}
          >
            {isLoading ? (
              // Loading state
              [...Array(maxProducts)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))
            ) : filteredProducts.length > 0 ? (
              // Products
              filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  {...animationVariants.scaleIn}
                  transition={{
                    ...transitionConfig.productGrid,
                    ...createStaggerDelay(index)
                  }}
                >
                  <ProductCard product={product} onClick={setSelectedProduct} />
                </motion.div>
              ))
            ) : (
              // Empty state
              <div className="col-span-full text-center py-16">
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
          </motion.div>
        </AnimatePresence>

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
        onClose={() => setSelectedProduct(null)} 
      />
    </section>
  );
};
