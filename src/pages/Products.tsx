import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ProductFilters } from '../components/ProductFilters';
import { ProductList } from '../components/ProductList';
import { FloatingCart } from '../components/FloatingCart';
import { Cart } from '../components/Cart';
import { Sidebar } from '../components/Sidebar';
import { BannerSlider } from '../components/BannerSlider';
import { ProductsPageSkeleton } from '../components/ProductsPageSkeleton';
import { useSupabaseCategories } from '../hooks/useSupabaseCategories';
import { useDynamicBusinessId } from '../contexts/DynamicBusinessIdContext';
import { Filter, Grid, List, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductModal } from '../components/ProductModal';
import { useProductFilters } from '../hooks/useProductFilters';
import { useEnhancedSupabaseProducts } from '../hooks/useEnhancedSupabaseProducts';
import { Product, ViewMode } from '../types';
import { animationVariants, transitionConfig } from '../utils/animations';
import { formatWhatsAppUrl } from '../utils/format';
import { scrollToTop } from '../utils/scroll';
import { APP_CONFIG, UI_CONFIG } from '../constants/app';
import { DynamicButton } from '../components/DynamicButton';
import { useDynamicBusinessConfig } from '../hooks/useDynamicBusinessConfig';
const Products = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Usar el business ID dinámico
  const {
    businessId
  } = useDynamicBusinessId();
  const businessConfig = useDynamicBusinessConfig();
  const {
    categories
  } = useSupabaseCategories(businessId || '');
  const {
    products,
    loading
  } = useEnhancedSupabaseProducts(businessId || '');
  const {
    filters,
    filteredProducts,
    handleFilterChange,
    handleClearFilters
  } = useProductFilters(products);
  useEffect(() => {
    scrollToTop();

    // Simulate page loading time
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  const handleCategorySelect = (categoryId: string) => {
    handleFilterChange({
      category: categoryId
    });
    setShowFilters(false);
  };
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };
  const closeProductModal = () => {
    setSelectedProduct(null);
  };
  const hasActiveFilters = filters.category || filters.searchQuery || filters.priceRange[0] !== APP_CONFIG.PRICE_RANGE.MIN || filters.priceRange[1] !== APP_CONFIG.PRICE_RANGE.MAX;

  // Show skeleton while page is loading
  if (!isPageLoaded) {
    return <ProductsPageSkeleton />;
  }
  return <div className="min-h-screen ice-cream-pattern flex flex-col mx-0">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      <Sidebar categories={categories} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onCategorySelect={handleCategorySelect} />

      <main className="flex-grow pb-16 py-1 lg:mx-[40px] mx-[2px]">
        <div className="">
          <div className="bg-transparent-glass rounded-2xl p-4 mb-4">
            <BannerSlider />
          </div>

          <motion.div {...animationVariants.fadeIn} className="text-center mb-4 bg-transparent-light rounded-2xl p-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-1 tracking-tight">
              Todos los Productos
            </h1>
            <p className="text-neutral-600 text-base max-w-2xl mx-auto">
              Descubre nuestra colección completa de productos urbanos con estilo único
            </p>
          </motion.div>

          {/* Controles superiores */}
          <div className="mb-4">
            <div className="max-w-3xl mx-auto w-full">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-between sm:flex-nowrap bg-transparent-glass rounded-xl px-2 py-2 shadow-sm">
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <span className="text-sm text-neutral-600">{filteredProducts.length} productos</span>
                  {filters.category && <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      {categories.find(cat => cat.id === filters.category)?.icon}
                      {categories.find(cat => cat.id === filters.category)?.name}
                      <button onClick={() => handleFilterChange({
                    category: ''
                  })} className="ml-1 text-primary-500 hover:text-red-500 focus:outline-none" title="Limpiar categoría">
                        ×
                      </button>
                    </span>}
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {/* Botón filtro móvil */}
                  <motion.button whileTap={{
                  scale: 0.97
                }} whileHover={{
                  scale: 1.05
                }} onClick={() => setShowFilters(!showFilters)} className={`lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors shadow-sm ${showFilters ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-neutral-700 border-neutral-300 hover:border-primary-500'}`}>
                    <Filter size={14} />
                    <span className="hidden sm:inline text-sm">Filtros</span>
                  </motion.button>

                  {/* Botones vista grid/list */}
                  <div className="flex border border-neutral-300 rounded-full overflow-hidden bg-neutral-50">
                    <button onClick={() => setViewMode('grid')} className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}>
                      <Grid size={14} />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}>
                      <List size={14} />
                    </button>
                  </div>

                  {hasActiveFilters && <DynamicButton onClick={handleClearFilters} variant="primary" size="sm" className="flex items-center gap-1 text-xs px-2 py-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Limpiar
                    </DynamicButton>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Sidebar escritorio */}
            <div className="hidden lg:block w-60 flex-shrink-0">
              <div className="sticky top-24 bg-transparent-glass rounded-2xl p-4">
                <ProductFilters categories={categories} filters={filters} onFilterChange={handleFilterChange} isMobile={false} />
              </div>
            </div>

            {/* Filtro móvil tipo acordeón */}
            <AnimatePresence>
              {showFilters && <motion.div {...animationVariants.fadeIn} transition={transitionConfig.smooth} className="lg:hidden w-full overflow-hidden bg-transparent-glass rounded-2xl p-4">
                  <ProductFilters categories={categories} filters={filters} onFilterChange={handleFilterChange} isMobile={true} onClose={() => setShowFilters(false)} />
                </motion.div>}
            </AnimatePresence>

            {/* Lista de productos */}
            <div className="flex-1">
              <div className="max-w-5xl mx-auto px-1 sm:px-2 bg-transparent-light rounded-2xl p-4">
                <AnimatePresence mode="wait" initial={false}>
                  {viewMode === 'grid' ? <motion.div key="grid" {...animationVariants.fadeIn} transition={transitionConfig.smooth}>
                      <ProductList products={filteredProducts} viewMode="grid" onProductClick={handleProductClick} />
                    </motion.div> : <motion.div key="list" {...animationVariants.fadeIn} transition={transitionConfig.smooth}>
                      <ProductList products={filteredProducts} viewMode="list" onProductClick={handleProductClick} />
                    </motion.div>}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="bg-transparent-glass">
        <Footer />
      </div>
      <FloatingCart onClick={() => setIsCartOpen(true)} />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={closeProductModal} />

      {/* Botón de WhatsApp flotante */}
      <a href={formatWhatsAppUrl(businessConfig.whatsapp || APP_CONFIG.WHATSAPP_NUMBER)} target="_blank" rel="noopener noreferrer" className={`fixed bottom-4 left-4 bg-green-500 text-white rounded-full p-2.5 shadow-lg hover:bg-green-600 ${UI_CONFIG.TRANSITION_CLASSES} z-40 flex items-center justify-center`} aria-label="Contactar por WhatsApp">
        <MessageCircle size={20} />
        <span className="sr-only">Contactar por WhatsApp</span>
      </a>
    </div>;
};
export default Products;