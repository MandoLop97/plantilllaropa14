
import React from 'react';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { useDynamicBusinessConfig } from '../hooks/useDynamicBusinessConfig';
import { APP_CONFIG } from '../constants/app';

export const BusinessMap = () => {
  const businessConfig = useDynamicBusinessConfig();

  const address = businessConfig.address || '';
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  const handleDirections = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  };

  if (businessConfig.loading) {
    return (
      <section className="py-8 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-80 bg-neutral-200"></div>
            <div className="p-6">
              <div className="h-6 bg-neutral-200 rounded mb-3 w-1/2"></div>
              <div className="h-4 bg-neutral-200 rounded mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-8 lg:py-12 bg-gradient-to-br from-neutral-50 to-primary-50/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-2 sm:mb-3">
            Nuestra Ubicación
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base max-w-xl mx-auto">
            Te esperamos en nuestra tienda física
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200/50">
            {/* Mapa responsivo */}
            <div className="relative h-64 sm:h-80 lg:h-96 bg-neutral-100">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title={`Ubicación de ${businessConfig.name}`}
              ></iframe>
              
              <button
                onClick={handleDirections}
                className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-primary-700 px-3 py-2 rounded-lg shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium text-sm"
              >
                <Navigation size={16} />
                <span className="hidden sm:inline">Direcciones</span>
              </button>
            </div>

            {/* Información más responsiva y ordenada */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                {/* Información principal */}
                <div className="space-y-6">
                  {/*<div className="text-center lg:text-left">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 mb-2">
                      {businessConfig.name}
                    </h3>
                    <p className="text-neutral-600 text-sm sm:text-base">
                      {businessConfig.description}
                    </p>
                  </div>*/}
                  
                  {/* Cards de información organizadas */}
                  <div className="grid gap-4">
                    {/* Dirección */}
                    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin size={20} className="text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-neutral-900 mb-1 text-sm sm:text-base">Dirección</h4>
                          <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                            {businessConfig.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Teléfono */}
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone size={20} className="text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-neutral-900 mb-1 text-sm sm:text-base">Teléfono</h4>
                          <p className="text-neutral-600 text-xs sm:text-sm">
                            <a
                              href={`tel:+${businessConfig.whatsapp || APP_CONFIG.WHATSAPP_NUMBER}`}
                              className="hover:text-green-600 transition-colors font-medium"
                            >
                              {`${businessConfig.whatsapp || APP_CONFIG.WHATSAPP_NUMBER}`}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Horarios */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-neutral-900 mb-2 text-sm sm:text-base">Horarios de Atención</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                              <span className="text-neutral-600 font-medium">Lunes - Viernes:</span>
                              <span className="text-neutral-800 font-semibold">9:00 - 20:00</span>
                            </div>
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                              <span className="text-neutral-600 font-medium">Sábados:</span>
                              <span className="text-neutral-800 font-semibold">9:00 - 18:00</span>
                            </div>
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                              <span className="text-neutral-600 font-medium">Domingos:</span>
                              <span className="text-red-600 font-semibold">Cerrado</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel de beneficios */}
                <div className="bg-gradient-to-br from-primary-50 to-primary-100/30 rounded-xl p-4 sm:p-6 h-fit">
                  <h4 className="text-lg sm:text-xl font-bold text-neutral-900 mb-3 sm:mb-4">
                    ¿Por qué visitarnos?
                  </h4>
                  <ul className="space-y-2 sm:space-y-3 text-neutral-700 text-xs sm:text-sm mb-6">
                    <li className="flex items-center gap-2 sm:gap-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                      <span>Atención personalizada</span>
                    </li>
                    <li className="flex items-center gap-2 sm:gap-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                      <span>Productos frescos y de calidad</span>
                    </li>
                    <li className="flex items-center gap-2 sm:gap-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                      <span>Precios competitivos</span>
                    </li>
                    <li className="flex items-center gap-2 sm:gap-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                      <span>Estacionamiento disponible</span>
                    </li>
                    <li className="flex items-center gap-2 sm:gap-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                      <span>Fácil acceso y ubicación</span>
                    </li>
                  </ul>

                  <button
                    onClick={handleDirections}
                    className="w-full bg-primary-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl text-xs sm:text-sm"
                  >
                    Obtener Direcciones
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
