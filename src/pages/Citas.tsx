import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CitasCalendar } from '../components/CitasCalendar';
import { CitasForm } from '../components/CitasForm';
import { Cart } from '../components/Cart';
import { Sidebar } from '../components/Sidebar';
import { FloatingCart } from '../components/FloatingCart';
import { useSupabaseCategories } from '../hooks/useSupabaseCategories';
import { useDynamicBusinessId } from '../contexts/DynamicBusinessIdContext';
import { scrollToTop } from '../utils/scroll';

const Citas = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [showForm, setShowForm] = useState(false);
  
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

  const handleCategorySelect = () => {
    setIsSidebarOpen(false);
  };

  const servicios = [
    { id: 'corte', name: 'Corte de Cabello', duration: '30 min', price: '$250' },
    { id: 'tinte', name: 'Tinte de Cabello', duration: '2 hrs', price: '$800' },
    { id: 'peinado', name: 'Peinado', duration: '45 min', price: '$350' },
    { id: 'manicure', name: 'Manicure', duration: '1 hr', price: '$300' },
    { id: 'pedicure', name: 'Pedicure', duration: '1 hr', price: '$350' },
    { id: 'facial', name: 'Tratamiento Facial', duration: '1 hr', price: '$500' },
  ];

  if (businessLoading) {
    return (
      <div className="min-h-screen paletas-pattern flex flex-col">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 mb-2"></div>
          <div className="h-80 bg-gray-200 mb-2"></div>
          <div className="h-48 bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen paletas-pattern parallax-element flex flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="flex-grow py-8 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-transparent-glass rounded-2xl shadow-xl p-6 mb-8">
            <h1 className="text-3xl font-bold text-primary-800 mb-6 text-center">
              Agendar Cita
            </h1>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-primary-700 mb-4">
                Selecciona un servicio
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {servicios.map((servicio) => (
                  <button
                    key={servicio.id}
                    onClick={() => setSelectedService(servicio.id)}
                    className={`p-4 rounded-xl transition-all ${
                      selectedService === servicio.id
                        ? 'bg-primary-100 border-2 border-primary-300 shadow-md'
                        : 'bg-white border border-neutral-200 hover:bg-primary-50'
                    }`}
                  >
                    <h3 className="font-medium text-primary-800">{servicio.name}</h3>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-neutral-500">{servicio.duration}</span>
                      <span className="font-semibold text-primary-600">{servicio.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-semi-transparent rounded-2xl shadow-lg p-6">
            {showForm ? (
              <CitasForm 
                selectedService={selectedService}
                onBack={() => setShowForm(false)}
              />
            ) : (
              <CitasCalendar 
                selectedService={selectedService}
                onContinue={() => setShowForm(true)}
              />
            )}
          </div>
        </div>
      </main>
      
      <div className="bg-transparent-glass">
        <Footer />
      </div>
      
      {/* Floating Cart with item count indicator */}
      <FloatingCart onClick={() => setIsCartOpen(true)} />
      
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

export default Citas;
