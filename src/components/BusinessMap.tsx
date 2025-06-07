
import React from 'react';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { useBusinessConfig } from '../config/business';

export const BusinessMap = () => {
  const businessConfig = useBusinessConfig();

  // Obtener la dirección del negocio desde la configuración
  const address = "tepeyac 356, puente de guadalupe, IRAPUATO, GUANAJUATO, México";
  const encodedAddress = encodeURIComponent(address);
  
  // Usar embed directo de Google Maps sin API key
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.123456789!2d-101.3467890!3d20.6666667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodedAddress}!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx`;

  const handleDirections = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  };

  if (businessConfig.loading) {
    return (
      <section className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-96 bg-neutral-200"></div>
            <div className="p-8">
              <div className="h-8 bg-neutral-200 rounded mb-4 w-1/2"></div>
              <div className="h-4 bg-neutral-200 rounded mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-primary-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Visita Nuestra Tienda
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Te esperamos en nuestra ubicación física para que puedas conocer de cerca todos nuestros productos
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200/50">
            {/* Mapa embebido directo sin API key */}
            <div className="relative h-96 md:h-[500px] bg-neutral-100">
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
              
              {/* Overlay con botón de direcciones */}
              <button
                onClick={handleDirections}
                className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-primary-700 px-4 py-2 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <Navigation size={18} />
                <span className="hidden sm:inline">Cómo llegar</span>
              </button>
            </div>

            {/* Información de contacto */}
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                    {businessConfig.name}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin size={20} className="text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900 mb-1">Dirección</h4>
                        <p className="text-neutral-600 leading-relaxed">
                          Tepeyac 356, Puente de Guadalupe<br />
                          Irapuato, Guanajuato, México
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone size={20} className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900 mb-1">Teléfono</h4>
                        <p className="text-neutral-600">
                          <a 
                            href="tel:+5214621234567" 
                            className="hover:text-primary-600 transition-colors"
                          >
                            +52 462 123 4567
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900 mb-1">Horarios</h4>
                        <div className="text-neutral-600 space-y-1">
                          <p>Lunes a Viernes: 9:00 - 20:00</p>
                          <p>Sábados: 9:00 - 18:00</p>
                          <p>Domingos: Cerrado</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-neutral-900 mb-4">
                    ¿Por qué visitarnos?
                  </h4>
                  <ul className="space-y-3 text-neutral-700">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span>Atención personalizada</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span>Productos de calidad garantizada</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span>Precios competitivos</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span>Estacionamiento disponible</span>
                    </li>
                  </ul>

                  <div className="mt-6 pt-6 border-t border-primary-200">
                    <button
                      onClick={handleDirections}
                      className="w-full bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                      Obtener Direcciones
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
