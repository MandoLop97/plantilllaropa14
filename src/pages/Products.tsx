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
import { Filter, Grid, List } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
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
  return <div className="min-h-screen flex flex-col mx-0 px-0">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      <Sidebar categories={categories} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onCategorySelect={handleCategorySelect} />

      <main className="bg-transparent-glass pb-16 px-4 lg:px-8 xl:px-16 mx-0 lg:mx-[80px] my-0 py-[25px]">
        {/* Contenedor principal con mejor estructura */}
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Sección del Banner */}
          <section className="w-full">
            <BannerSlider />
          </section>

          {/* Sección del Header Principal */}
          <motion.section className="text-center py-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-2 tracking-tight">
              Todos los Productos
            </h1>
            <p className="text-neutral-600 text-base max-w-2xl mx-auto">
              Descubre nuestra colección completa de productos urbanos con estilo único
            </p>
          </motion.section>

          {/* Sección de Controles Superiores */}
          <section className="w-full">
            <div className="flex flex-wrap items-center justify-between gap-4 px-2 py-4 bg-white/50 rounded-xl border border-neutral-100">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-neutral-600 font-medium">
                  {filteredProducts.length} productos
                </span>
                {filters.category && <span className="bg-primary-100 text-primary-600 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                    {categories.find(cat => cat.id === filters.category)?.icon}
                    {categories.find(cat => cat.id === filters.category)?.name}
                    <button onClick={() => handleFilterChange({
                  category: ''
                })} className="ml-1 text-primary-500 hover:text-red-500 focus:outline-none font-bold" title="Limpiar categoría">
                      ×
                    </button>
                  </span>}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Botón filtro móvil */}
                <motion.button whileTap={{
                scale: 0.97
              }} whileHover={{
                scale: 1.05
              }} onClick={() => setShowFilters(!showFilters)} className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shadow-sm ${showFilters ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-neutral-700 border-neutral-300 hover:border-primary-500'}`}>
                  <Filter size={16} />
                  <span className="text-sm font-medium">Filtros</span>
                </motion.button>

                {/* Botones vista grid/list */}
                <div className="flex border border-neutral-300 rounded-full overflow-hidden bg-white shadow-sm">
                  <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}>
                    <Grid size={16} />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}>
                    <List size={16} />
                  </button>
                </div>

                {hasActiveFilters && <DynamicButton onClick={handleClearFilters} variant="primary" size="sm" className="flex items-center gap-2 text-xs px-3 py-2 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Limpiar filtros
                  </DynamicButton>}
              </div>
            </div>
          </section>

          {/* Sección de Contenido Principal con mejor layout */}
          <section className="flex gap-8">
            {/* Sidebar de filtros para escritorio - mejor posicionado */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-6">
                <ProductFilters categories={categories} filters={filters} onFilterChange={handleFilterChange} isMobile={false} />
              </div>
            </div>

            {/* Filtro móvil tipo acordeón */}
            <AnimatePresence>
              {showFilters && <motion.div {...animationVariants.fadeIn} transition={transitionConfig.smooth} className="lg:hidden w-full overflow-hidden bg-white rounded-2xl p-6 shadow-lg border border-neutral-100 mb-6">
                  <ProductFilters categories={categories} filters={filters} onFilterChange={handleFilterChange} isMobile={true} onClose={() => setShowFilters(false)} />
                </motion.div>}
            </AnimatePresence>

            {/* Lista de productos con mejor contenedor */}
            <div className="flex-1 min-w-0">
              <div className="w-full">
                <AnimatePresence mode="wait" initial={false}>
                  {viewMode === 'grid' ? <motion.div key="grid" {...animationVariants.fadeIn} transition={transitionConfig.smooth}>
                      <ProductList products={filteredProducts} viewMode="grid" onProductClick={handleProductClick} />
                    </motion.div> : <motion.div key="list" {...animationVariants.fadeIn} transition={transitionConfig.smooth}>
                      <ProductList products={filteredProducts} viewMode="list" onProductClick={handleProductClick} />
                    </motion.div>}
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Sección del Footer */}
      <section className="bg-transparent-glass py-0 my-0 mx-0 px-0">
        <Footer />
      </section>

      <FloatingCart onClick={() => setIsCartOpen(true)} />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={closeProductModal} />

      {/* Botón de WhatsApp flotante */}
      <a
        href={formatWhatsAppUrl(businessConfig.whatsapp || APP_CONFIG.WHATSAPP_NUMBER)}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-4 left-4 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 ${UI_CONFIG.TRANSITION_CLASSES} z-40 flex items-center justify-center`}
        aria-label="Contactar por WhatsApp"
      >
        <FaWhatsapp size={24} />
        <span className="sr-only">Contactar por WhatsApp</span>
      </a>
    </div>;
};
export default Products;