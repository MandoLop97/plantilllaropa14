import React, { useState, useEffect, useMemo } from 'react';
import { Category } from '../types';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { CategorySelector } from './CategorySelector';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { animationVariants, transitionConfig, createStaggerDelay } from '../utils/animations';
import { UI_CONFIG, ROUTES } from '../constants/app';
import { STORE_CONFIG } from '../config/business';
import { useDynamicBusinessId } from '../contexts/DynamicBusinessIdContext';
import { useEnhancedSupabaseProducts } from '../hooks/useEnhancedSupabaseProducts';
import { useIsMobile } from '../hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

interface ProductSectionProps {
  categories: Category[];
}
const ResponsiveSkeleton: React.FC<{
  height: string;
  mobileWidth: string;
  tabletWidth?: string;
  desktopWidth?: string;
  className?: string;
}> = ({
  height,
  mobileWidth,
  tabletWidth,
  desktopWidth,
  className = ""
}) => {
  return <Skeleton className={`${height} ${mobileWidth} ${tabletWidth || ''} ${desktopWidth || ''} ${className}`} />;
};
const ProductSectionSkeleton = () => {
  const isMobile = useIsMobile();
  const maxProducts = isMobile ? 6 : 8;
  return <section className="py-0">
      <div className={UI_CONFIG.CONTAINER_CLASSES}>
        <div className="relative mb-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-2">
            {[...Array(4)].map((_, idx) => <div key={idx} className="flex flex-col items-center gap-1 flex-shrink-0">
                <ResponsiveSkeleton height="h-16 sm:h-20 lg:h-24" mobileWidth="w-16" tabletWidth="sm:w-20" desktopWidth="lg:w-24" className="rounded-full" />
                <ResponsiveSkeleton height="h-2 sm:h-3" mobileWidth="w-12" tabletWidth="sm:w-16" desktopWidth="lg:w-20" />
              </div>)}
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4 px-2">
          <ResponsiveSkeleton height="h-10" mobileWidth="w-10" className="rounded-xl" />
          <div className="space-y-1">
            <ResponsiveSkeleton height="h-4" mobileWidth="w-32" />
            <ResponsiveSkeleton height="h-3" mobileWidth="w-48" />
          </div>
        </div>
        <div className={`grid ${UI_CONFIG.GRID_COLUMNS.MOBILE} ${UI_CONFIG.GRID_COLUMNS.TABLET} ${UI_CONFIG.GRID_COLUMNS.DESKTOP} gap-3`}>
          {[...Array(maxProducts)].map((_, index) => <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <Skeleton className="aspect-square" />
              <div className="p-2 space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export const ProductSection: React.FC<ProductSectionProps> = ({
  categories
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => categories[0]?.id || '');
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    businessId
  } = useDynamicBusinessId();
  useEffect(() => {
    if (categories.length > 0) {
      const exists = categories.some(cat => cat.id === selectedCategory);
      if (!exists) {
        setSelectedCategory(categories[0].id);
      }
    }
  }, [categories, selectedCategory]);
  const {
    products,
    loading,
    error,
    refetch
  } = useEnhancedSupabaseProducts(businessId || '');
  const maxProducts = isMobile ? 6 : 8;
  const filteredProducts = useMemo(() => {
    const categoryFiltered = selectedCategory ? products.filter(product => product.categoryId === selectedCategory) : products;
    return categoryFiltered.slice(0, maxProducts);
  }, [products, selectedCategory, maxProducts]);
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  const handleViewMore = () => {
    navigate(ROUTES.PRODUCTS);
  };
  if (categories.length === 0) {
    return <ProductSectionSkeleton />;
  }
  if (error) {
    return <section className="py-0">
        <div className={UI_CONFIG.CONTAINER_CLASSES}>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl text-red-500">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">Error al cargar productos</h3>
            <p className="text-neutral-600 mb-3 text-sm">{error || 'Ha ocurrido un error inesperado'}</p>
            <button onClick={() => refetch()} className="bg-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-primary-600 transition-colors text-sm">
              Reintentar
            </button>
          </div>
        </div>
      </section>;
  }
  return <section className="py-0">
      <div className="py-0 lg:py-[20px] lg:px-[100px] px-[0px]">
        {/* Category Selector */}
        <CategorySelector categories={categories} selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} />

        {/* Elegant Separator */}
        <div className="relative mb-8 mt-6">
          <div className="flex items-center justify-center">
            <div className="flex-grow">
              <Separator className="bg-gradient-to-r from-transparent via-primary-200 to-transparent h-[2px]" />
            </div>
            <div className="mx-6 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-primary-300 shadow-sm"></div>
              <div className="w-2 h-2 rounded-full bg-primary-400 mx-2 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-primary-300 shadow-sm"></div>
            </div>
            <div className="flex-grow">
              <Separator className="bg-gradient-to-r from-transparent via-primary-200 to-transparent h-[2px]" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div key={selectedCategory} {...animationVariants.fadeIn} transition={transitionConfig.smooth} className={`grid ${UI_CONFIG.GRID_COLUMNS.MOBILE} ${UI_CONFIG.GRID_COLUMNS.TABLET} ${UI_CONFIG.GRID_COLUMNS.DESKTOP} gap-3`}>
            {loading ? [...Array(maxProducts)].map((_, index) => <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <div className="p-2">
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>) : filteredProducts.length > 0 ? filteredProducts.map((product, index) => <motion.div key={product.id} {...animationVariants.scaleIn} transition={{
            ...transitionConfig.productGrid,
            ...createStaggerDelay(index)
          }}>
                  <ProductCard product={product} disableClick={true} />
                </motion.div>) : <div className="col-span-full text-center py-8">
                <div className="w-16 h-16 mx-auto mb-3 bg-neutral-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-neutral-400">📦</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                  No hay productos en esta categoría
                </h3>
                <p className="text-neutral-600 text-sm">Próximamente agregaremos más productos a esta sección</p>
              </div>}
          </motion.div>
        </AnimatePresence>

        {/* View More Button */}
        {!loading && filteredProducts.length > 0 && <div className="text-center mt-6">
            <motion.button whileHover={{
          scale: 1.04,
          x: 3
        }} className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group" onClick={handleViewMore}>
              {STORE_CONFIG.texts.viewMore}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </motion.button>
          </div>}
      </div>

      {/* Product Modal - Removed since clicks are disabled */}
    </section>;
};
