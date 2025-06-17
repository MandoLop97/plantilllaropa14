
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { ServiciosService } from '../../api/supabase/servicios';
import { Clock, Calendar, AlertCircle, Loader2, Star, CheckCircle2 } from 'lucide-react';
import { logger } from '../../utils/logger';
import { useIsMobile } from '../../hooks/use-mobile';

interface ServiciosSelectorProps {
  businessId: string;
  onServicioSelected: (servicio: any) => void;
  servicioSeleccionado: any | null;
}

export const ServiciosSelector: React.FC<ServiciosSelectorProps> = ({
  businessId,
  onServicioSelected,
  servicioSeleccionado
}) => {
  const isMobile = useIsMobile();

  // Debug: Log inicial
  React.useEffect(() => {
    logger.info('🎯 ServiciosSelector montado:', { businessId });
  }, [businessId]);

  // Query para cargar servicios usando React Query
  const { data: servicios, isLoading, error, refetch } = useQuery({
    queryKey: ['servicios', businessId],
    queryFn: async () => {
      logger.info('🔄 Ejecutando queryFn para servicios:', { businessId });
      
      if (!businessId) {
        logger.warn('⚠️ BusinessId no está definido');
        return [];
      }
      
      const result = await ServiciosService.getAll(businessId);
      logger.info('✅ Query completada exitosamente:', { count: result.length, result });
      return result;
    },
    enabled: !!businessId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Debug: Log del estado actual
  React.useEffect(() => {
    logger.info('🎯 ServiciosSelector estado actualizado:', {
      businessId,
      isLoading,
      serviciosCount: servicios?.length || 0,
      hasError: !!error,
      errorMessage: error?.message,
      servicios: servicios ? servicios.slice(0, 2) : null // Solo los primeros 2 para no saturar logs
    });
  }, [businessId, isLoading, servicios, error]);

  // Si está cargando, muestra un skeleton mejorado
  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-blue-600" />
            <span className="text-blue-600 font-medium text-sm sm:text-base">Cargando servicios disponibles...</span>
          </div>
          <p className="text-xs sm:text-sm text-blue-500">Negocio ID: {businessId}</p>
          <p className="text-xs text-gray-500 mt-1">Esto puede tomar unos segundos...</p>
        </div>
        <div className={`grid gap-4 sm:gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse border-0 shadow-lg">
              <CardHeader>
                <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 sm:h-40 bg-gray-200 rounded-lg mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 sm:h-5 bg-gray-200 rounded w-12"></div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-8 sm:h-10 bg-gray-200 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Si hay un error, muestra un mensaje detallado
  if (error) {
    return (
      <div className="text-center p-6 sm:p-8 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
        <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-red-600 text-lg sm:text-xl font-semibold mb-2">
          Error al cargar los servicios
        </h3>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          {error.message || 'Ha ocurrido un error inesperado al cargar los servicios'}
        </p>
        <div className="bg-red-100 p-3 sm:p-4 rounded-lg mb-4">
          <p className="text-xs sm:text-sm text-gray-700">
            <strong>Negocio ID:</strong> {businessId}
          </p>
          <p className="text-xs sm:text-sm text-gray-700 mt-1">
            <strong>Error técnico:</strong> {error.message}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => refetch()} 
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Reintentar
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            variant="default"
          >
            Recargar página
          </Button>
        </div>
      </div>
    );
  }

  // Si no hay servicios, muestra un mensaje informativo
  if (!servicios || servicios.length === 0) {
    return (
      <div className="text-center p-6 sm:p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
        <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-amber-700 text-lg sm:text-xl font-semibold mb-2">
          No hay servicios disponibles
        </h3>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          Este negocio aún no tiene servicios configurados para reserva de citas.
        </p>
        <div className="bg-amber-100 p-3 sm:p-4 rounded-lg mb-4">
          <p className="text-xs sm:text-sm text-gray-700">
            <strong>Negocio ID:</strong> {businessId}
          </p>
        </div>
        <Button 
          onClick={() => refetch()} 
          variant="outline"
          className="border-amber-300 text-amber-600 hover:bg-amber-50"
        >
          Verificar nuevamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
        <div className="flex items-center justify-center gap-2 mb-1">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-green-700 font-medium text-sm sm:text-base">
            {servicios.length} servicio{servicios.length !== 1 ? 's' : ''} disponible{servicios.length !== 1 ? 's' : ''}
          </p>
        </div>
        <p className="text-xs sm:text-sm text-green-600">
          Selecciona el servicio que necesitas
        </p>
      </div>
      
      <div className={`grid gap-4 sm:gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {servicios.map((servicio, index) => (
          <motion.div
            key={servicio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`h-full transition-all duration-300 cursor-pointer border-0 shadow-lg hover:shadow-xl ${
                servicioSeleccionado?.id === servicio.id ? 
                'ring-2 ring-blue-500 shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50' : 
                'hover:shadow-xl hover:border-blue-300 bg-gradient-to-br from-white to-gray-50'
              }`}
              onClick={() => onServicioSelected(servicio)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base sm:text-lg leading-tight">{servicio.nombre}</CardTitle>
                    {servicio.descripcion && (
                      <CardDescription className="text-xs sm:text-sm mt-1 line-clamp-2">
                        {servicio.descripcion}
                      </CardDescription>
                    )}
                  </div>
                  {servicioSeleccionado?.id === servicio.id && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 relative">
                  <img 
                    src={servicio.imagenUrl} 
                    alt={servicio.nombre} 
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{servicio.duracionMinutos} min</span>
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-gray-900">
                      ${servicio.precio.toFixed(2)}
                    </div>
                  </div>
                  {servicio.categoria && servicio.categoria !== 'General' && (
                    <div className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3" />
                      {servicio.categoria}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant={servicioSeleccionado?.id === servicio.id ? "default" : "outline"}
                  className={`w-full transition-all duration-200 ${
                    servicioSeleccionado?.id === servicio.id 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                      : 'border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300'
                  } ${isMobile ? 'text-sm py-2' : 'py-3'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onServicioSelected(servicio);
                  }}
                >
                  {servicioSeleccionado?.id === servicio.id ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Seleccionado
                    </span>
                  ) : (
                    'Seleccionar servicio'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
