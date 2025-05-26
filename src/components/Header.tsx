
import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Cart } from './Cart';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    setIsVisible(window.scrollY > 0);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${isVisible ? 'translate-y-0 shadow-lg' : '-translate-y-full shadow-none'}
          bg-white/80 backdrop-blur-lg`}
        style={{ WebkitBackdropFilter: 'blur(12px)' }}
      >
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-urban-500 to-urban-600 text-white text-center py-1 px-4">
          <p className="text-xs font-medium tracking-wide">Esta es una tienda demo 😊</p>
        </div>

        {/* Main Header */}
        <div className="container mx-auto h-14 sm:h-20 flex items-center justify-between px-2 sm:px-4 relative">
          {/* Menú */}
          <button
            onClick={onMenuClick}
            className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-urban-600 transition-colors p-1.5 sm:p-2 rounded-full hover:bg-urban-100/60 focus:outline-none focus:ring-2 focus:ring-urban-400"
            aria-label="Abrir menú"
          >
            <Menu size={22} className="sm:size-26" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">Menú</span>
          </button>

          {/* Logo y nombre - clickeable para ir al Home */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-1 sm:gap-2 group focus:outline-none focus:ring-2 focus:ring-urban-400 rounded-lg p-1"
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-urban-400 to-urban-600 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110 overflow-hidden">
                <img
                  src="https://cdn.abacus.ai/images/65fc5268-61a6-423e-b9f1-2a8fa1e3681d.png"
                  alt="Logo Urban Style"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight group-hover:text-urban-600 transition-colors duration-200">
                Urban Style
              </h1>
            </button>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className="text-gray-600 hover:text-urban-600 transition-colors p-1.5 sm:p-2 rounded-full hover:bg-urban-100/60 focus:outline-none focus:ring-2 focus:ring-urban-400"
              aria-label="Buscar"
            >
              <Search size={18} className="sm:size-22" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-gray-600 hover:text-urban-600 transition-colors p-1.5 sm:p-2 rounded-full hover:bg-urban-100/60 focus:outline-none focus:ring-2 focus:ring-urban-400"
              aria-label="Abrir carrito"
            >
              <ShoppingCart size={18} className="sm:size-22" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-urban-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-md border-2 border-white animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
