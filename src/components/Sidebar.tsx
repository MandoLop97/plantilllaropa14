import React from 'react';
import { X, Home, Phone, MapPin } from 'lucide-react';
import { Category } from '../types';
import { Link } from 'react-router-dom';

interface SidebarProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect: (category: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ categories, isOpen, onClose, onCategorySelect }) => {
  if (!isOpen) return null;

  const handleCategoryClick = (categoryName: string) => {
    onCategorySelect(categoryName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Sidebar */}
      <aside className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl animate-fade-in rounded-r-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-picton-blue-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-picton-blue-400 to-picton-blue-600 rounded-full flex items-center justify-center shadow">
              <span className="text-white text-lg font-bold">U</span>
            </div>
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Urban Style</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-picton-blue-100/60 transition-colors focus:outline-none focus:ring-2 focus:ring-picton-blue-400"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-7">
          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 pl-1">
              Navegación
            </h3>
            <Link
  to="/"
  className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-picton-blue-100/60 transition-colors text-gray-700 font-medium"
  onClick={onClose}
>
  <Home size={20} className="text-picton-blue-500" />
  <span>Inicio</span>
</Link>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 pl-1">
              Categorías
            </h3>
            <div className="space-y-1">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-picton-blue-100/60 transition-colors text-gray-700 font-medium"
                >
                  <span className="text-lg text-picton-blue-500">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 pl-1">
              Contacto
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => window.open('https://wa.me/5491234567890', '_blank')}
                className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-picton-blue-100/60 transition-colors text-gray-700 font-medium"
              >
                <Phone size={20} className="text-picton-blue-500" />
                <span>WhatsApp</span>
              </button>
              <button
                className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-picton-blue-100/60 transition-colors text-gray-700 font-medium"
              >
                <MapPin size={20} className="text-picton-blue-500" />
                <span>Ubicación</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Status Indicator */}
        <div className="p-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-2 flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-green-700">Estamos atendiendo</span>
          </div>
        </div>
      </aside>
    </div>
  );
};