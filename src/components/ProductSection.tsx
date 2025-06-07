
import React, { useState, useEffect, useMemo } from 'react';
import { Category } from '../types';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { CategorySelector } from './CategorySelector';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  animationVariants,
  transitionConfig,
  createStaggerDelay
} from '../utils/animations';
import { UI_CONFIG, ROUTES } from '../constants/app';
import { STORE_CONFIG } from '../config/business';
import { useDynamicBusinessId } from '../contexts/DynamicBusinessIdContext';
import { useEnhancedSupabaseProducts } from '../hooks/useEnhancedSupabaseProducts';
import { useIsMobile } from '../hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductSectionProps {
  categories: Category[];
}

const ResponsiveSkeleton: React.FC<{
  height: string;
  mobileWidth: string;
  tabletWidth?: string;
  desktopWidth?: string;
  className?: string;
}> = ({ height, mobileWidth, tabletWidth, desktopWidth, className = "" }) => {
  return (
    <Skeleton 
      className={`${height} ${mobileWidth} ${tabletWidth || ''} ${desktopWidth || ''} ${className}`} 
    />
  );
};

const ProductSectionSkeleton = () => {
  const isMobile = useIsMobile();
  const maxProducts = isMobile ? 6 : 8;

  return (
    <section className="py-0">
      <div className={UI_CONFIG.CONTAINER_CLASSES}>
        <div className="relative mb-8">
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-2">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <ResponsiveSkeleton
                  height="h-20 sm:h-28 lg:h-32"
                  mobileWidth="w-20"
                  tabletWidth="sm:w-28"
                  desktopWidth="lg:w-32"
                  className="rounded-full"
                />
                <ResponsiveSkeleton
                  height="h-3 sm:h-4"
                  mobileWidth="w-16"
                  tabletWidth="sm:w-20"
                  desktopWidth="lg:w-24"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 mb-8 px-2">
          <ResponsiveSkeleton
            height="h-14"
            mobileWidth="w-14"
            className="rounded-2xl"
          />
          <div className="space-y-2">
            <ResponsiveSkeleton height="h-6" mobileWidth="w-40" />
            <ResponsiveSkeleton height="h-4" mobileWidth="w-64" />
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
              <Skeleton className="aspect-square" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-20" />
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
  
  // Usar el business ID dinámico
  const { businessId } = useDynamicBusinessId();

  // Seleccionar automáticamente la primera categoría cuando las categorías estén disponibles
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].name);
    }
  }, [categories, selectedCategory]);

  const { products, loading, error, refetch } = useEnhancedSupabaseProducts(businessId || '');
  
  // Filter products by selected category and limit products: 6 en móvil, 8 en escritorio
  const maxProducts = isMobile ? 6 : 8;
  const filteredProducts = useMemo(() => {
    const categoryFiltered = selectedCategory 
      ? products.filter(product => product.category === selectedCategory)
      : products;
    return categoryFiltered.slice(0, maxProducts);
  }, [products, selectedCategory, maxProducts]);

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

  if (error) {
    return (
      <section className="py-0">
        <div className={UI_CONFIG.CONTAINER_CLASSES}>
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-4xl text-red-500">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Error al cargar productos</h3>
            <p className="text-neutral-600 mb-4">{error || 'Ha ocurrido un error inesperado'}</p>
            <button
              onClick={() => refetch()}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
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

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory} 
            {...animationVariants.fadeIn}
            transition={transitionConfig.smooth}
            className={`grid ${UI_CONFIG.GRID_COLUMNS.MOBILE} ${UI_CONFIG.GRID_COLUMNS.TABLET} ${UI_CONFIG.GRID_COLUMNS.DESKTOP} gap-4`}
          >
            {loading ? (
              // Loading state
              [...Array(maxProducts)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <div className="p-3">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-6 w-20" />
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
                <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl text-neutral-400">📦</span>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  No hay productos en esta categoría
                </h3>
                <p className="text-neutral-600">
                  Próximamente agregaremos más productos a esta sección
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* View More Button */}
        {!loading && filteredProducts.length > 0 && (
          <div className="text-center mt-10">
            <motion.button 
              whileHover={{ scale: 1.06, x: 4 }} 
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group text-lg"
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
