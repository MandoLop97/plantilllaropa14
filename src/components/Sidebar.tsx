
import React from 'react';
import { X, Home, Phone, MapPin, Mail, Clock } from 'lucide-react';
import { Category } from '../types';
import { Link } from 'react-router-dom';
import { useDynamicBusinessConfig } from '../hooks/useDynamicBusinessConfig';

interface SidebarProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect: (category: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ categories, isOpen, onClose, onCategorySelect }) => {
  const businessConfig = useDynamicBusinessConfig();

  if (!isOpen) return null;

  const handleCategoryClick = (categoryName: string) => {
    onCategorySelect(categoryName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Sidebar */}
      <aside className="relative w-80 max-w-[90vw] bg-white h-full shadow-2xl animate-fade-in rounded-r-3xl flex flex-col overflow-hidden">
        {/* Header with business info */}
        <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-4 mr-12">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/30 p-2">
              {businessConfig.logo.url ? (
                <img
                  src={businessConfig.logo.url}
                  alt={businessConfig.logo.alt}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-white text-2xl font-bold">
                  {businessConfig.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{businessConfig.name}</h2>
              <p className="text-white/80 text-sm mt-1 leading-relaxed">
                {businessConfig.description.length > 50 
                  ? `${businessConfig.description.substring(0, 50)}...` 
                  : businessConfig.description}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4 pl-1">
              Navegación
            </h3>
            <Link
              to="/"
              className="w-full flex items-center gap-4 px-4 py-3 text-left rounded-xl hover:bg-primary-50 transition-colors text-neutral-700 font-medium group"
              onClick={onClose}
            >
              <div className="w-10 h-10 rounded-lg bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center transition-colors">
                <Home size={20} className="text-primary-600" />
              </div>
              <span>Inicio</span>
            </Link>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4 pl-1">
                Categorías
              </h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.name)}
                    className="w-full flex items-center gap-4 px-4 py-3 text-left rounded-xl hover:bg-primary-50 transition-colors text-neutral-700 font-medium group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                      <span className="text-lg">{category.icon || '📦'}</span>
                    </div>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4 pl-1">
              Contacto
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => window.open('https://wa.me/5491234567890', '_blank')}
                className="w-full flex items-center gap-4 px-4 py-3 text-left rounded-xl hover:bg-green-50 transition-colors text-neutral-700 font-medium group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 group-hover:bg-green-200 flex items-center justify-center transition-colors">
                  <Phone size={20} className="text-green-600" />
                </div>
                <span>WhatsApp</span>
              </button>
              
              <button
                className="w-full flex items-center gap-4 px-4 py-3 text-left rounded-xl hover:bg-blue-50 transition-colors text-neutral-700 font-medium group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                  <MapPin size={20} className="text-blue-600" />
                </div>
                <span>Ubicación</span>
              </button>
              
              <button
                className="w-full flex items-center gap-4 px-4 py-3 text-left rounded-xl hover:bg-purple-50 transition-colors text-neutral-700 font-medium group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center transition-colors">
                  <Mail size={20} className="text-purple-600" />
                </div>
                <span>Email</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Business Status & Hours */}
        <div className="p-6 border-t border-neutral-100">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-800">Abierto ahora</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-green-700">
              <Clock size={14} />
              <span>Lunes a Sábado: 9:00 - 20:00</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-neutral-500">¿Necesitas ayuda?</p>
            <button 
              onClick={() => window.open('https://wa.me/5491234567890', '_blank')}
              className="text-xs text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              Contáctanos
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
