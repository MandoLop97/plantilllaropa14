
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDynamicBusinessConfig } from '../hooks/useDynamicBusinessConfig';
export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const businessConfig = useDynamicBusinessConfig();
  if (businessConfig.loading) {
    return null;
  }
  return <footer className="bg-gradient-to-b from-primary-50 to-primary-100 pt-12 pb-8 mt-16 border-t border-primary-50 py-[44px]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center">

          {/* Logo y nombre dinámico - clickeable */}
          <button onClick={() => navigate('/')} className="flex items-center justify-center gap-2 mb-4 group select-none focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-lg p-2 mx-auto">
            <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110 overflow-hidden">
              <img src={businessConfig.logo.url} alt={businessConfig.logo.alt} className="w-full h-full object-contain" />
            </div>
            <h3 className="text-lg sm:text-2xl font-extrabold text-primary-950 tracking-tight group-hover:text-primary-600 transition-colors duration-200">
              {businessConfig.name}
            </h3>
          </button>

          {/* Descripción con mejor contraste */}
          <p className="text-primary-800 mb-6 max-w-md mx-auto text-base font-medium">
            {businessConfig.description}
          </p>

          {/* Estado y horarios */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-primary-100 px-4 py-1 rounded-full text-xs font-semibold text-primary-700 border border-primary-100 shadow-sm">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full inline-block"></span>
              <span>¡Estamos atendiendo!</span>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <span className="inline-block bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium border border-primary-100">
                Lun-Vie: 9-18h
              </span>
              <span className="inline-block bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium border border-primary-100">
                Sáb: 10-16h
              </span>
              <span className="inline-block bg-primary-50 text-primary-500 px-3 py-1 rounded-full text-xs font-medium border border-primary-100">
                Dom: Cerrado
              </span>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="flex justify-center gap-5 mt-8 mb-2">
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full p-2 bg-white border border-primary-100 text-primary-500 hover:bg-primary-100 hover:text-primary-700 transition-colors shadow-sm">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M17 2.5h-2.5A4.5 4.5 0 0 0 10 7v2H7.5a.5.5 0 0 0-.5.5V12a.5.5 0 0 0 .5.5H10v7a.5.5 0 0 0 .5.5H13a.5.5 0 0 0 .5-.5v-7h2.1a.5.5 0 0 0 .5-.5V9.5a.5.5 0 0 0-.5-.5H13.5V7a1.5 1.5 0 0 1 1.5-1.5H17a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5Z" fill="currentColor" />
              </svg>
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-primary-100">
            <p className="text-xs text-primary-900">
              © 2024 {businessConfig.name}. Todos los derechos reservados.
            </p>
          </div>

        </div>
      </div>
    </footer>;
};
