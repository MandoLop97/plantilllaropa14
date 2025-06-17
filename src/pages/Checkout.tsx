
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CheckoutForm } from '../components/CheckoutForm';
import { Cart } from '../components/Cart';
import { Sidebar } from '../components/Sidebar';
import { useCart } from '../contexts/CartContext';
import { useSupabaseCategories } from '../hooks/useSupabaseCategories';
import { useDynamicBusinessId } from '../contexts/DynamicBusinessIdContext';
import { scrollToTop } from '../utils/scroll';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const {
    businessId,
    isLoading: businessLoading
  } = useDynamicBusinessId();

  const {
    categories
  } = useSupabaseCategories(businessId || '');

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/productos');
    }
  }, [items, navigate]);

  const handleCategorySelect = () => {
    setIsSidebarOpen(false);
  };

  if (businessLoading) {
    return (
      <div className="min-h-screen ice-cream-pattern flex flex-col">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 mb-2"></div>
          <div className="h-80 bg-gray-200 mb-2"></div>
          <div className="h-48 bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen ice-cream-pattern parallax-element flex flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="flex-grow py-8 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-transparent-glass rounded-2xl shadow-xl p-6 mb-8">
            <h1 className="text-3xl font-bold text-primary-800 mb-6 text-center">
              Finalizar Compra
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Formulario de checkout */}
              <div className="bg-transparent-light rounded-xl p-6">
                <CheckoutForm />
              </div>
              
              {/* Resumen del pedido */}
              <div className="bg-semi-transparent rounded-xl p-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">
                  Resumen del Pedido
                </h2>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-primary-100">
                      <div className="flex-1">
                        <h3 className="font-medium text-primary-800">{item.name}</h3>
                        <p className="text-sm text-primary-600">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-primary-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary-800">Total:</span>
                      <span className="text-xl font-bold text-secondary-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <div className="bg-transparent-glass">
        <Footer />
      </div>
      
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

export default Checkout;
