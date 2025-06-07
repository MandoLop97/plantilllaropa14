import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { ProductSection } from '../components/ProductSection';
import { PromotionBanner } from '../components/PromotionBanner';
import { BusinessMap } from '../components/BusinessMap';
import { Footer } from '../components/Footer';
import { FloatingCart } from '../components/FloatingCart';
import { Cart } from '../components/Cart';
import { Sidebar } from '../components/Sidebar';
import { useSupabaseCategories } from '../hooks/useSupabaseCategories';
import { useDynamicBusinessId } from '../contexts/DynamicBusinessIdContext';
import { useDynamicPageMeta } from '../hooks/useDynamicPageMeta';
import { MessageCircle } from 'lucide-react';
import { scrollToElement, scrollToTop } from '../utils/scroll';
import { formatWhatsAppUrl } from '../utils/format';
import { APP_CONFIG } from '../constants/app';
import { ThemeConfigDebug } from '../components/ThemeConfigDebug';
import { logger } from '../utils/logger';

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Use dynamic business context
  const { businessId, subdomain, isLoading: businessLoading } = useDynamicBusinessId();
  
  // Use dynamic page meta (favicon y título)
  const businessConfig = useDynamicPageMeta();
  
  const { categories } = useSupabaseCategories(businessId || '');

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    // Log business configuration for debugging
    logger.info('🏠 Index page loaded with business config:', {
      businessId,
      subdomain,
      businessName: businessConfig.name,
      isFromDynamicSubdomain: businessConfig.isFromDynamicSubdomain,
      loading: businessLoading || businessConfig.loading
    });
  }, [businessId, subdomain, businessConfig, businessLoading]);

  const handleCategorySelect = () => {
    setIsSidebarOpen(false);
    scrollToElement('product-section');
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isSidebarOpen && !target.closest('.sidebar-container')) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  // Show loading state while business is being loaded
  if (businessLoading || businessConfig.loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 mb-4"></div>
          <div className="h-96 bg-gray-200 mb-4"></div>
          <div className="h-64 bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="flex-grow pb-0">
        <HeroSection />
        <div id="product-section">
          <ProductSection categories={categories} />
        </div>
        <PromotionBanner />
        <BusinessMap />
      </main>
      
      <Footer />
      
      {/* Floating Cart with item count indicator */}
      <FloatingCart onClick={() => setIsCartOpen(true)} />
      
      {/* WhatsApp Button */}
      <a 
        href={formatWhatsAppUrl(APP_CONFIG.WHATSAPP_NUMBER)} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 left-6 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 z-40 flex items-center justify-center" 
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={24} />
        <span className="sr-only">Contactar por WhatsApp</span>
      </a>
      
      {/* Cart with overlay */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Sidebar with overlay */}
      <div className="sidebar-container">
        <Sidebar
          categories={categories}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCategorySelect={handleCategorySelect}
        />
      </div>

      {/* Theme Config Debug Component */}
      <ThemeConfigDebug />
    </div>
  );
};

export default Index;
