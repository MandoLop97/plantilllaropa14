
import React from 'react';
import { X, Home, Package, Calendar, Clock } from 'lucide-react';
import { Category } from '../types';
import { Link } from 'react-router-dom';
import { useDynamicBusinessConfig } from '../hooks/useDynamicBusinessConfig';
import { APP_CONFIG } from '../constants/app';

interface SidebarProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect: (category: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ categories, isOpen, onClose, onCategorySelect }) => {
  const businessConfig = useDynamicBusinessConfig();

  if (!isOpen) return null;

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Sidebar */}
      <aside className="relative w-80 max-w-[90vw] bg-white h-full shadow-2xl animate-fade-in rounded-r-3xl flex flex-col overflow-hidden">
        {/* Header with business info - Responsive */}
        <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-4 sm:p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Cerrar menú"
          >
            <X size={16} className="sm:w-5 sm:h-5" />
          </button>
          
          {/* Business Info - Responsive Layout */}
          <div className="mr-10 sm:mr-12 space-y-3 sm:space-y-4">
            {/* Logo */}
            <div className="flex justify-center sm:justify-start">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/30 p-2">
                {businessConfig.logo.url ? (
                  <img
                    src={businessConfig.logo.url}
                    alt={businessConfig.logo.alt}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-white text-lg sm:text-2xl font-bold">
                    {businessConfig.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Business Name & Description */}
            <div className="text-center sm:text-left space-y-1 sm:space-y-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight leading-tight">
                {businessConfig.name}
              </h2>
              <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                {businessConfig.description.length > 60 
                  ? `${businessConfig.description.substring(0, 60)}...` 
                  : businessConfig.description}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3 sm:mb-4 pl-1">
              Navegación
            </h3>
            <div className="space-y-2">
              <Link
                to="/"
                className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 text-left rounded-xl hover:bg-primary-50 transition-colors text-neutral-700 font-medium group"
                onClick={onClose}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center transition-colors">
                  <Home size={18} className="sm:w-5 sm:h-5 text-primary-600" />
                </div>
                <span className="text-sm sm:text-base">Inicio</span>
              </Link>

              <Link
                to="/productos"
                className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 text-left rounded-xl hover:bg-primary-50 transition-colors text-neutral-700 font-medium group"
                onClick={onClose}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                  <Package size={18} className="sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <span className="text-sm sm:text-base">Productos</span>
              </Link>

              <Link
                to="/citas"
                className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 text-left rounded-xl hover:bg-primary-50 transition-colors text-neutral-700 font-medium group"
                onClick={onClose}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-green-100 group-hover:bg-green-200 flex items-center justify-center transition-colors">
                  <Calendar size={18} className="sm:w-5 sm:h-5 text-green-600" />
                </div>
                <span className="text-sm sm:text-base">Citas</span>
              </Link>
            </div>
          </div>

          {/* Categories with Images */}
          {categories.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3 sm:mb-4 pl-1">
                Categorías
              </h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <Link
                    key={category.id}
                    to={`/productos?category=${category.id}`}
                    onClick={() => handleCategoryClick(category.id)}
                    className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 text-left rounded-xl hover:bg-primary-50 transition-colors text-neutral-700 font-medium group"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-neutral-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors overflow-hidden">
                      {category.imagen_url ? (
                        <img
                          src={category.imagen_url}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : category.icon ? (
                        <span className="text-base sm:text-lg">{category.icon}</span>
                      ) : (
                        <Package size={18} className="sm:w-5 sm:h-5 text-neutral-600" />
                      )}
                    </div>
                    <span className="text-sm sm:text-base">{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Business Status & Hours - Responsive */}
        <div className="p-4 sm:p-6 border-t border-neutral-100">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 sm:p-4 mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-semibold text-green-800">Abierto ahora</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 sm:mt-2 text-xs text-green-700">
              <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
              <span>Lunes a Sábado: 9:00 - 20:00</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-neutral-500 mb-1">¿Necesitas ayuda?</p>
            <button
              onClick={() => window.open(`https://wa.me/${businessConfig.whatsapp || APP_CONFIG.WHATSAPP_NUMBER}`, '_blank')}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Contáctanos
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
