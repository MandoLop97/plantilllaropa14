
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/currency';
import { STORE_CONFIG } from '../config/business';

interface FloatingCartProps {
  onClick: () => void;
}

export const FloatingCart: React.FC<FloatingCartProps> = ({ onClick }) => {
  const { itemCount, total } = useCart();

  if (itemCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-urban-400 to-urban-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 z-40 animate-fade-in"
      aria-label="Ver carrito de compras"
    >
      <div className="flex items-center space-x-3 px-5 py-3.5">
        <div className="relative">
          <ShoppingCart size={24} strokeWidth={2.5} />
          <span className="absolute -top-2 -right-2 bg-white text-urban-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {itemCount}
          </span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-medium">{STORE_CONFIG.texts.viewOrder}</span>
          <span className="text-sm font-bold">{formatPrice(total)}</span>
        </div>
      </div>
    </button>
  );
};
