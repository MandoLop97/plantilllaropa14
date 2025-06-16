
import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FloatingCart } from '../components/FloatingCart';
import { Cart } from '../components/Cart';
import { Sidebar } from '../components/Sidebar';
import { useDynamicBusinessId } from '../contexts/DynamicBusinessIdContext';
import { useDynamicPageMeta } from '../hooks/useDynamicPageMeta';
import { CitasCalendar } from '../components/citas/CitasCalendar';
import { ServiciosSelector } from '../components/citas/ServiciosSelector';
import { CitasForm } from '../components/citas/CitasForm';
import { useSupabaseCategories } from '../hooks/useSupabaseCategories';
import { scrollToTop } from '../utils/scroll';
import { logger } from '../utils/logger';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const Citas = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<any>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(undefined);
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("servicios");
  
  // Use dynamic business context
  const { businessId, subdomain, isLoading: businessLoading } = useDynamicBusinessId();
  
  // Use dynamic page meta
  const businessConfig = useDynamicPageMeta();
  
  const { categories } = useSupabaseCategories(businessId || '');
  const isMobile = useIsMobile();

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    // Log business configuration for debugging
    logger.info('🗓️ Citas page loaded with business config:', {
      businessId,
      subdomain,
      businessName: businessConfig.name,
      isFromDynamicSubdomain: businessConfig.isFromDynamicSubdomain,
      loading: businessLoading || businessConfig.loading
    });
  }, [businessId, subdomain, businessConfig, businessLoading]);

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

  // Auto advance tabs when selections are made
  useEffect(() => {
    if (servicioSeleccionado && activeTab === "servicios") {
      setActiveTab("calendario");
    }
  }, [servicioSeleccionado]);

  useEffect(() => {
    if (fechaSeleccionada && horaSeleccionada && activeTab === "calendario") {
      setActiveTab("datos");
    }
  }, [fechaSeleccionada, horaSeleccionada]);

  // Show loading state while business is being loaded
  if (businessLoading || businessConfig.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 mb-2"></div>
          <div className="h-80 bg-gray-200 mb-2"></div>
          <div className="h-48 bg-gray-200"></div>
        </div>
      </div>
    );
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'servicios': return <User className="w-4 h-4 sm:mr-2" />;
      case 'calendario': return <Calendar className="w-4 h-4 sm:mr-2" />;
      case 'datos': return <CheckCircle className="w-4 h-4 sm:mr-2" />;
      default: return null;
    }
  };

  const getStepStatus = (step: string) => {
    switch (step) {
      case 'servicio':
        return servicioSeleccionado ? 'completed' : activeTab === 'servicios' ? 'active' : 'pending';
      case 'calendario':
        return fechaSeleccionada && horaSeleccionada ? 'completed' : activeTab === 'calendario' ? 'active' : 'pending';
      case 'datos':
        return activeTab === 'datos' ? 'active' : 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="flex-grow py-2 sm:py-4 lg:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-medium mb-2">
              <Sparkles className="w-4 h-4" />
              Reserva en línea
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
              Reserva tu cita
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Selecciona el servicio que necesitas, elige la fecha y hora que mejor te convenga, 
              y completa tus datos para confirmar tu cita.
            </p>
          </div>

          {/* Progress Indicator - Responsive */}
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-center">
              <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 overflow-x-auto pb-2">
                {/* Paso 1: Servicio */}
                <div className={`flex items-center ${getStepStatus('servicio') === 'completed' ? 'text-green-600' : getStepStatus('servicio') === 'active' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 ${
                    getStepStatus('servicio') === 'completed' ? 'bg-green-100' : 
                    getStepStatus('servicio') === 'active' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {getStepStatus('servicio') === 'completed' ? 
                      <CheckCircle className="w-4 h-4" /> : 
                      <User className="w-4 h-4" />
                    }
                  </div>
                  <span className="font-medium text-sm hidden sm:inline">Servicio</span>
                  <span className="font-medium text-xs sm:hidden">1</span>
                </div>
                
                {/* Línea de conexión */}
                <div className={`w-3 sm:w-6 lg:w-8 h-0.5 ${getStepStatus('servicio') === 'completed' ? 'bg-green-200' : 'bg-gray-200'}`}></div>
                
                {/* Paso 2: Fecha y Hora */}
                <div className={`flex items-center ${getStepStatus('calendario') === 'completed' ? 'text-green-600' : getStepStatus('calendario') === 'active' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 ${
                    getStepStatus('calendario') === 'completed' ? 'bg-green-100' : 
                    getStepStatus('calendario') === 'active' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {getStepStatus('calendario') === 'completed' ? 
                      <CheckCircle className="w-4 h-4" /> : 
                      <Calendar className="w-4 h-4" />
                    }
                  </div>
                  <span className="font-medium text-sm hidden sm:inline">Fecha y Hora</span>
                  <span className="font-medium text-xs sm:hidden">2</span>
                </div>
                
                {/* Línea de conexión */}
                <div className={`w-3 sm:w-6 lg:w-8 h-0.5 ${getStepStatus('calendario') === 'completed' ? 'bg-green-200' : 'bg-gray-200'}`}></div>
                
                {/* Paso 3: Confirmar */}
                <div className={`flex items-center ${getStepStatus('datos') === 'active' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 ${
                    getStepStatus('datos') === 'active' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm hidden sm:inline">Confirmar</span>
                  <span className="font-medium text-xs sm:hidden">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid w-full grid-cols-3 mb-4 bg-white/80 backdrop-blur-sm shadow-sm border ${isMobile ? 'h-10' : 'h-12'}`}>
                <TabsTrigger 
                  value="servicios" 
                  className={`flex items-center justify-center ${isMobile ? 'text-xs px-1' : 'text-sm px-2'}`}
                >
                  {getTabIcon('servicios')}
                  <span className="hidden sm:inline ml-1">1. Servicio</span>
                  <span className="sm:hidden">1</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="calendario" 
                  disabled={!servicioSeleccionado}
                  className={`flex items-center justify-center ${isMobile ? 'text-xs px-1' : 'text-sm px-2'}`}
                >
                  {getTabIcon('calendario')}
                  <span className="hidden sm:inline ml-1">2. Fecha</span>
                  <span className="sm:hidden">2</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="datos" 
                  disabled={!servicioSeleccionado || !fechaSeleccionada || !horaSeleccionada}
                  className={`flex items-center justify-center ${isMobile ? 'text-xs px-1' : 'text-sm px-2'}`}
                >
                  {getTabIcon('datos')}
                  <span className="hidden sm:inline ml-1">3. Datos</span>
                  <span className="sm:hidden">3</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="servicios" className="space-y-3">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Selecciona un Servicio
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Elige el servicio que necesitas de nuestra lista disponible
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <ServiciosSelector 
                      businessId={businessId || ''}
                      onServicioSelected={(servicio) => {
                        setServicioSeleccionado(servicio);
                      }}
                      servicioSeleccionado={servicioSeleccionado}
                    />
                    {servicioSeleccionado && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-green-700 font-medium text-sm">Servicio seleccionado</span>
                          </div>
                          <button
                            onClick={() => setActiveTab("calendario")}
                            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Continuar
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendario" className="space-y-3">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      Selecciona Fecha y Hora
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Elige el día y horario que mejor te convenga para tu cita
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <CitasCalendar 
                      servicioId={servicioSeleccionado?.id}
                      onDateSelected={(fecha) => setFechaSeleccionada(fecha)}
                      onTimeSelected={(hora) => setHoraSeleccionada(hora)}
                      fechaSeleccionada={fechaSeleccionada}
                      horaSeleccionada={horaSeleccionada}
                    />
                    {fechaSeleccionada && horaSeleccionada && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-green-700 font-medium text-sm">Fecha y hora seleccionadas</span>
                          </div>
                          <button
                            onClick={() => setActiveTab("datos")}
                            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Continuar
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="datos" className="space-y-3">
                <CitasForm 
                  servicio={servicioSeleccionado}
                  fecha={fechaSeleccionada}
                  hora={horaSeleccionada}
                  businessId={businessId || ''}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
      
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
          onCategorySelect={() => {}}
        />
      </div>
    </div>
  );
};

export default Citas;
