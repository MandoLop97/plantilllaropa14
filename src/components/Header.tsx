
import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Cart } from './Cart';
import { useNavigate } from 'react-router-dom';
import { useDynamicBusinessConfig } from '../hooks/useDynamicBusinessConfig';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const businessConfig = useDynamicBusinessConfig();

  useEffect(() => {
    const handleScroll = () => {
      // Solo mostrar cuando hay scroll hacia abajo
      setIsVisible(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (businessConfig.loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg h-14 sm:h-20 shadow -translate-y-full" />
    );
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${isVisible ? 'translate-y-0 shadow-lg' : '-translate-y-full shadow-none'}
          bg-white/80 backdrop-blur-lg`}
        style={{ WebkitBackdropFilter: 'blur(12px)' }}
      >
        {/* Demo Banner */}
        <div className="text-white text-center py-1 px-4" 
             style={{ background: 'linear-gradient(to right, hsl(var(--color-primary-500)), hsl(var(--color-primary-600)))' }}>
          <p className="text-xs font-medium tracking-wide">Esta es una tienda demo 😊</p>
        </div>

        {/* Main Header */}
        <div className="container mx-auto h-14 sm:h-20 flex items-center justify-between px-2 sm:px-4 relative">
          {/* Menú */}
          <button
            onClick={onMenuClick}
            className="flex items-center gap-1 sm:gap-2 transition-colors p-1.5 sm:p-2 rounded-full focus:outline-none focus:ring-2"
            style={{ 
              color: 'hsl(var(--color-primary-700))',
              '--hover-color': 'hsl(var(--color-primary-600))',
              '--hover-bg': 'hsl(var(--color-primary-100))',
              '--focus-ring': 'hsl(var(--color-primary-400))'
            } as React.CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--hover-color)';
              e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'hsl(var(--color-primary-700))';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Abrir menú"
          >
            <Menu size={22} className="sm:size-26" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">Menú</span>
          </button>

          {/* Logo y nombre - clickeable para ir al Home */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-1 sm:gap-2 group focus:outline-none focus:ring-2 rounded-lg p-1"
              style={{ '--focus-ring': 'hsl(var(--color-primary-400))' } as React.CSSProperties}
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110 overflow-hidden"
                   style={{ background: 'linear-gradient(to bottom right, hsl(var(--color-primary-400)), hsl(var(--color-primary-600)))' }}>
                <img
                  src={businessConfig.logo.url}
                  alt={businessConfig.logo.alt}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight transition-colors duration-200"
                  style={{ 
                    color: 'hsl(var(--color-primary-950))',
                    '--hover-color': 'hsl(var(--color-primary-600))'
                  } as React.CSSProperties}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--hover-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--color-primary-950))'}
              >
                {businessConfig.name}
              </h1>
            </button>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className="transition-colors p-1.5 sm:p-2 rounded-full focus:outline-none focus:ring-2"
              style={{ 
                color: 'hsl(var(--color-neutral-600))',
                '--hover-color': 'hsl(var(--color-primary-600))',
                '--hover-bg': 'hsl(var(--color-primary-100))',
                '--focus-ring': 'hsl(var(--color-primary-400))'
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--hover-color)';
                e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'hsl(var(--color-neutral-600))';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Buscar"
            >
              <Search size={18} className="sm:size-22" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative transition-colors p-1.5 sm:p-2 rounded-full focus:outline-none focus:ring-2"
              style={{ 
                color: 'hsl(var(--color-neutral-600))',
                '--hover-color': 'hsl(var(--color-primary-600))',
                '--hover-bg': 'hsl(var(--color-primary-100))',
                '--focus-ring': 'hsl(var(--color-primary-400))'
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--hover-color)';
                e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'hsl(var(--color-neutral-600))';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Abrir carrito"
            >
              <ShoppingCart size={18} className="sm:size-22" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-md border-2 border-white animate-bounce"
                      style={{ backgroundColor: 'hsl(var(--color-primary-500))' }}>
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
