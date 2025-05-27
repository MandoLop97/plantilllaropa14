
import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ProductFilters } from '../components/ProductFilters';
import { ProductList } from '../components/ProductList';
import { FloatingCart } from '../components/FloatingCart';
import { Cart } from '../components/Cart';
import { Sidebar } from '../components/Sidebar';
import { BannerSlider } from '../components/BannerSlider';
import { categories, products } from '../data/products';
import { Filter, Grid, List, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductModal } from '../components/ProductModal';
import { useProductFilters } from '../hooks/useProductFilters';
import { Product, ViewMode } from '../types';
import { animationVariants, transitionConfig } from '../utils/animations';
import { formatWhatsAppUrl, scrollToTop } from '../utils/format';
import { APP_CONFIG, UI_CONFIG } from '../constants/app';

const Products = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    filters,
    filteredProducts,
    handleFilterChange,
    handleClearFilters
  } = useProductFilters();

  useEffect(() => {
    scrollToTop();
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    handleFilterChange({ category: categoryId });
    setShowFilters(false);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const hasActiveFilters = filters.category || filters.searchQuery || 
    filters.priceRange[0] !== APP_CONFIG.PRICE_RANGE.MIN || 
    filters.priceRange[1] !== APP_CONFIG.PRICE_RANGE.MAX;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCategorySelect={handleCategorySelect}
      />

      <main className="flex-grow pb-20 py-[10px]">
        <div className={UI_CONFIG.CONTAINER_CLASSES}>
          <BannerSlider />

          <motion.div 
            {...animationVariants.fadeIn} 
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Todos los Productos
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Descubre nuestra colección completa de productos urbanos con estilo único
            </p>
          </motion.div>

          {/* Controles superiores */}
          <div className="mb-8">
            <div className="max-w-3xl mx-auto w-full">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-between sm:flex-nowrap bg-white/80 rounded-xl px-2 py-3 shadow-sm">
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <span className="text-sm text-gray-600">{filteredProducts.length} productos encontrados</span>
                  {filters.category && (
                    <span className="bg-urban-100 text-urban-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      {categories.find(cat => cat.id === filters.category)?.icon}
                      {categories.find(cat => cat.id === filters.category)?.name}
                      <button
                        onClick={() => handleFilterChange({ category: '' })}
                        className="ml-1 text-urban-500 hover:text-red-500 focus:outline-none"
                        title="Limpiar categoría"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {/* Botón filtro móvil */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shadow-sm ${
                      showFilters ? 'bg-urban-500 text-white border-urban-500' : 'bg-white text-gray-700 border-gray-300 hover:border-urban-500'
                    }`}
                  >
                    <Filter size={16} />
                    <span className="hidden sm:inline">Filtros</span>
                  </motion.button>

                  {/* Botones vista grid/list */}
                  <div className="flex border border-gray-300 rounded-full overflow-hidden bg-gray-50">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-urban-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-urban-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <List size={16} />
                    </button>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-urban-100 text-urban-600 hover:bg-urban-200 hover:text-urban-800 font-semibold text-xs shadow transition-all border border-urban-200"
                      title="Limpiar todos los filtros"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Limpiar filtros
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar escritorio */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28">
                <ProductFilters filters={filters} onFilterChange={handleFilterChange} isMobile={false} />
              </div>
            </div>

            {/* Filtro móvil tipo acordeón */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  {...animationVariants.slideIn}
                  transition={transitionConfig.accordion}
                  className="lg:hidden w-full overflow-hidden"
                >
                  <ProductFilters 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                    isMobile={true} 
                    onClose={() => setShowFilters(false)} 
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lista de productos */}
            <div className="flex-1">
              <div className="max-w-5xl mx-auto px-2 sm:px-4">
                <AnimatePresence mode="wait" initial={false}>
                  {viewMode === 'grid' ? (
                    <motion.div
                      key="grid"
                      {...animationVariants.fadeIn}
                      transition={transitionConfig.smooth}
                    >
                      <ProductList 
                        products={filteredProducts} 
                        viewMode="grid" 
                        onProductClick={handleProductClick} 
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="list"
                      {...animationVariants.fadeIn}
                      transition={transitionConfig.smooth}
                    >
                      <ProductList 
                        products={filteredProducts} 
                        viewMode="list" 
                        onProductClick={handleProductClick} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingCart onClick={() => setIsCartOpen(true)} />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <ProductModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct}
        onClose={closeProductModal} 
      />

      {/* Botón de WhatsApp flotante */}
      <a
        href={formatWhatsAppUrl(APP_CONFIG.WHATSAPP_NUMBER)}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 left-6 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 ${UI_CONFIG.TRANSITION_CLASSES} z-40 flex items-center justify-center`}
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={24} />
        <span className="sr-only">Contactar por WhatsApp</span>
      </a>
    </div>
  );
};

export default Products;
