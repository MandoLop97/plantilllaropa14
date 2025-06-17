import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ProductList } from '../components/ProductList';
import { ProductFilters } from '../components/ProductFilters';
import { Footer } from '../components/Footer';
import { FloatingCart } from '../components/FloatingCart';
import { Cart } from '../components/Cart';
import { Sidebar } from '../components/Sidebar';
import { PWAInstallPrompt } from '../components/PWAInstallPrompt';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';
import { useSupabaseCategories } from '../hooks/useSupabaseCategories';
import { useDynamicBusinessId } from '../contexts/DynamicBusinessIdContext';
import { scrollToTop } from '../utils/scroll';
import { MessageCircle } from 'lucide-react';
import { formatWhatsAppUrl } from '../utils/format';
import { APP_CONFIG } from '../constants/app';
const Products = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 1000
  });
  const {
    businessId,
    isLoading: businessLoading
  } = useDynamicBusinessId();
  const {
    products
  } = useSupabaseProducts(businessId || '');
  const {
    categories
  } = useSupabaseCategories(businessId || '');
  useEffect(() => {
    scrollToTop();
  }, []);
  const filteredProducts = products?.filter(product => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriceRange = product.price >= priceRange.min && product.price <= priceRange.max;
    return matchesCategory && matchesSearch && matchesPriceRange;
  }).sort((a, b) => {
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    return 0;
  });
  const handleCategorySelect = () => {
    setIsSidebarOpen(false);
  };
  if (businessLoading) {
    return <div className="min-h-screen bg-white flex flex-col">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 mb-2"></div>
          <div className="h-80 bg-gray-200 mb-2"></div>
          <div className="h-48 bg-gray-200"></div>
        </div>
      </div>;
  }
  return (
    <div className="min-h-screen paletas-pattern parallax-element flex flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="flex-grow py-8 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-transparent-glass rounded-2xl shadow-xl p-6 mb-8">
            <h1 className="text-3xl font-bold text-primary-800 mb-6 text-center">
              Nuestros Productos
            </h1>
            
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
            />
          </div>
          
          <div className="bg-semi-transparent rounded-2xl shadow-lg p-6">
            <ProductList products={filteredProducts} />
          </div>
        </div>
      </main>
      
      <div className="bg-transparent-glass">
        <Footer />
      </div>
      
      {/* Floating Cart with item count indicator */}
      <FloatingCart onClick={() => setIsCartOpen(true)} />
      
      {/* WhatsApp Button - Ahora más grande */}
      <a href={formatWhatsAppUrl(APP_CONFIG.WHATSAPP_NUMBER)} target="_blank" rel="noopener noreferrer" className="fixed bottom-4 left-4 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 z-40 flex items-center justify-center" aria-label="Contactar por WhatsApp">
        <MessageCircle size={24} />
        <span className="sr-only">Contactar por WhatsApp</span>
      </a>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Cart with overlay */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Sidebar with overlay */}
      <div className="sidebar-container">
        <Sidebar categories={categories} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onCategorySelect={handleCategorySelect} />
      </div>
    </div>
  );
};
export default Products;
