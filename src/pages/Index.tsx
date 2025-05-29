
import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { ProductSection } from '../components/ProductSection';
import { PromotionBanner } from '../components/PromotionBanner';
import { Footer } from '../components/Footer';
import { FloatingCart } from '../components/FloatingCart';
import { Cart } from '../components/Cart';
import { Sidebar } from '../components/Sidebar';
import { useSupabaseCategories } from '../hooks/useSupabaseCategories';
import { BUSINESS_ID } from '../config/business';
import { MessageCircle } from 'lucide-react';
import { scrollToElement, scrollToTop } from '../utils/scroll';
import { formatWhatsAppUrl } from '../utils/format';
import { APP_CONFIG } from '../constants/app';

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { categories } = useSupabaseCategories(BUSINESS_ID);

  useEffect(() => {
    scrollToTop();
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="flex-grow pb-0">
        <HeroSection />
        <div id="product-section">
          <ProductSection categories={categories} />
        </div>
        <PromotionBanner />
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
    </div>
  );
};

export default Index;
