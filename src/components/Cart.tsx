import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { CheckoutForm } from './CheckoutForm';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, total } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckoutClick = () => {
    setIsCheckoutOpen(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
        
        {/* Cart Panel */}
        <div className="relative ml-auto w-full max-w-md bg-white h-full flex flex-col animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Carrito</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">🛍️</span>
                </div>
                <p className="text-gray-500">Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600">${item.price}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-white border flex items-center justify-center hover:border-urban-500 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-white border flex items-center justify-center hover:border-urban-500 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-urban-600">${total}</span>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-urban-500 text-white font-semibold py-3 rounded-xl hover:bg-urban-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag size={18} />
                  <span>Proceder al Checkout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Form */}
      <CheckoutForm 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </>
  );
};