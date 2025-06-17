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
import { Calendar, Clock, User, CheckCircle, ArrowRight, Calendar as CalendarIcon } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
const Citas = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<any>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(undefined);
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("servicios");

  // Use dynamic business context
  const {
    businessId,
    subdomain,
    isLoading: businessLoading
  } = useDynamicBusinessId();

  // Use dynamic page meta
  const businessConfig = useDynamicPageMeta();
  const {
    categories
  } = useSupabaseCategories(businessId || '');
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
    return <div className="min-h-screen ice-cream-pattern flex flex-col">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 mb-2"></div>
          <div className="h-80 bg-gray-200 mb-2"></div>
          <div className="h-48 bg-gray-200"></div>
        </div>
      </div>;
  }
  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'servicios':
        return <User className="w-4 h-4" />;
      case 'calendario':
        return <CalendarIcon className="w-4 h-4" />;
      case 'datos':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };
  const getStepNumber = (step: string) => {
    switch (step) {
      case 'servicios':
        return '1';
      case 'calendario':
        return '2';
      case 'datos':
        return '3';
      default:
        return '1';
    }
  };
  const isStepCompleted = (step: string) => {
    switch (step) {
      case 'servicios':
        return !!servicioSeleccionado;
      case 'calendario':
        return !!(fechaSeleccionada && horaSeleccionada);
      case 'datos':
        return false;
      default:
        return false;
    }
  };
  return <div className="min-h-screen flex flex-col px-0">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="bg-transparent-glass pb-16 px-4 lg:px-8 xl:px-16 my-0 mx-0 lg:mx-[80px]">
        <div className="max-w-6xl mx-auto py-0 my-[16px]">
          {/* Header Section */}
          <div className="text-center mb-8 pt-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Reserva tu cita
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Selecciona el servicio, fecha y hora que prefieras
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="flex items-center space-x-4 sm:space-x-8">
                {/* Step 1 */}
                <div className={`flex items-center ${isStepCompleted('servicios') ? 'text-green-600' : activeTab === 'servicios' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-2 ${isStepCompleted('servicios') ? 'bg-green-100 text-green-600' : activeTab === 'servicios' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                    {isStepCompleted('servicios') ? <CheckCircle className="w-4 h-4" /> : '1'}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">Servicio</span>
                </div>
                
                <div className={`w-8 h-0.5 ${isStepCompleted('servicios') ? 'bg-green-200' : 'bg-gray-200'}`}></div>
                
                {/* Step 2 */}
                <div className={`flex items-center ${isStepCompleted('calendario') ? 'text-green-600' : activeTab === 'calendario' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-2 ${isStepCompleted('calendario') ? 'bg-green-100 text-green-600' : activeTab === 'calendario' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                    {isStepCompleted('calendario') ? <CheckCircle className="w-4 h-4" /> : '2'}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">Fecha</span>
                </div>
                
                <div className={`w-8 h-0.5 ${isStepCompleted('calendario') ? 'bg-green-200' : 'bg-gray-200'}`}></div>
                
                {/* Step 3 */}
                <div className={`flex items-center ${activeTab === 'datos' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-2 ${activeTab === 'datos' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                    3
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">Confirmar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/90 backdrop-blur-sm shadow-sm border">
              <TabsTrigger value="servicios" className="flex items-center justify-center text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <span className="flex items-center gap-2">
                  {getTabIcon('servicios')}
                  <span className="hidden sm:inline">Servicio</span>
                  <span className="sm:hidden">{getStepNumber('servicios')}</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="calendario" disabled={!servicioSeleccionado} className="flex items-center justify-center text-sm font-medium disabled:opacity-40 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <span className="flex items-center gap-2">
                  {getTabIcon('calendario')}
                  <span className="hidden sm:inline">Fecha</span>
                  <span className="sm:hidden">{getStepNumber('calendario')}</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="datos" disabled={!servicioSeleccionado || !fechaSeleccionada || !horaSeleccionada} className="flex items-center justify-center text-sm font-medium disabled:opacity-40 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <span className="flex items-center gap-2">
                  {getTabIcon('datos')}
                  <span className="hidden sm:inline">Confirmar</span>
                  <span className="sm:hidden">{getStepNumber('datos')}</span>
                </span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="servicios" className="space-y-6">
              <Card className="border shadow-sm bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl font-semibold">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Selecciona un Servicio
                  </CardTitle>
                  <CardDescription>
                    Elige el servicio que necesitas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ServiciosSelector businessId={businessId || ''} onServicioSelected={servicio => {
                  setServicioSeleccionado(servicio);
                }} servicioSeleccionado={servicioSeleccionado} />
                  {servicioSeleccionado && <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <div>
                            <span className="text-green-800 font-medium">Servicio seleccionado</span>
                            <p className="text-sm text-green-600">{servicioSeleccionado.nombre}</p>
                          </div>
                        </div>
                        <button onClick={() => setActiveTab("calendario")} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          Continuar
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendario" className="space-y-6">
              <Card className="border shadow-sm bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl font-semibold">
                    <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Selecciona Fecha y Hora
                  </CardTitle>
                  <CardDescription>
                    Elige el día y horario que prefieras
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CitasCalendar servicioId={servicioSeleccionado?.id} onDateSelected={fecha => setFechaSeleccionada(fecha)} onTimeSelected={hora => setHoraSeleccionada(hora)} fechaSeleccionada={fechaSeleccionada} horaSeleccionada={horaSeleccionada} />
                  {fechaSeleccionada && horaSeleccionada && <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <div>
                            <span className="text-green-800 font-medium">Fecha y hora seleccionadas</span>
                            <p className="text-sm text-green-600">
                              {fechaSeleccionada.toLocaleDateString()} - {horaSeleccionada}
                            </p>
                          </div>
                        </div>
                        <button onClick={() => setActiveTab("datos")} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          Continuar
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="datos" className="space-y-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg border shadow-sm p-6">
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-blue-600 mr-2" />
                    <div>
                      <h3 className="text-xl font-semibold">Confirma tu cita</h3>
                      <p className="text-gray-600">Completa tus datos para finalizar</p>
                    </div>
                  </div>
                </div>
                <CitasForm servicio={servicioSeleccionado} fecha={fechaSeleccionada} hora={horaSeleccionada} businessId={businessId || ''} />
              </div>
            </TabsContent>
          </Tabs>
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
        <Sidebar categories={categories} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onCategorySelect={() => {}} />
      </div>
    </div>;
};
export default Citas;