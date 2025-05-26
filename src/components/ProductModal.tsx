
import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Plus, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { addItem, removeItem, items } = useCart();
  const [localQty, setLocalQty] = useState(1);

  // Encuentra el producto en el carrito
  const cartItem = product ? items.find(item => item.id === product.id) : null;
  const cartQty = cartItem ? cartItem.quantity : 0;

  // Para evitar efecto en el primer render
  const isFirstRender = useRef(true);

  // Al abrir/cambiar producto, sincroniza el localQty con el carrito
  useEffect(() => {
    setLocalQty(cartQty > 0 ? cartQty : 1);
  }, [isOpen, product, cartQty]);

  // Sincroniza automáticamente el carrito cuando cambia localQty (si ya está en el carrito)
  useEffect(() => {
    if (!product) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (cartQty > 0 && localQty !== cartQty) {
      if (localQty > cartQty) {
        for (let i = 0; i < localQty - cartQty; i++) {
          addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            category: product.category
          });
        }
        toast.success(`Cantidad actualizada a ${localQty} en el carrito`);
      } else if (localQty < cartQty) {
        for (let i = 0; i < cartQty - localQty; i++) {
          removeItem(product.id);
        }
        toast.success(`Cantidad actualizada a ${localQty} en el carrito`);
      }
    }
    // eslint-disable-next-line
  }, [localQty]);

  // Cerrar modal al hacer clic fuera y prevenir scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && event.target && !(event.target as Element).closest('.modal-content')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!product || !isOpen) return null;

  // Añadir la primera vez
  const handleAddToCart = () => {
    if (localQty < 1 || cartQty > 0) return;
    for (let i = 0; i < localQty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category
      });
    }
    toast.success(`${localQty} ${product.name} agregado al carrito`);
  };

  const decreaseQuantity = () => setLocalQty(Math.max(1, localQty - 1));
  const increaseQuantity = () => setLocalQty(localQty + 1);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="h-full w-full flex items-center justify-center p-4">
        <div 
          className="modal-content bg-white rounded-3xl w-full max-w-md h-fit max-h-[90vh] overflow-y-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
            
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100 rounded-t-3xl overflow-hidden">
              {product.discount && (
                <div className="absolute top-4 left-4 bg-urban-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                  -{product.discount}%
                </div>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Product Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>
              
              {/* Price */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              
              {/* Quantity Selector + Add to Cart */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-gray-200 rounded-full px-2 py-1 bg-gray-50">
                  <button
                    onClick={decreaseQuantity}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    aria-label="Disminuir cantidad"
                    disabled={localQty <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-base font-semibold w-8 text-center select-none">{localQty}</span>
                  <button
                    onClick={increaseQuantity}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {cartQty > 0 ? (
                  <div
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-semibold bg-green-100 text-green-700 cursor-default text-base"
                    style={{ minWidth: 0 }}
                  >
                    <Check size={18} className="text-green-600" />
                    Añadido ({localQty})
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={localQty < 1}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-semibold transition-all duration-300 text-base
                      bg-gradient-to-r from-urban-400 to-urban-600 text-white hover:from-urban-500 hover:to-urban-700`}
                    style={{ minWidth: 0 }}
                  >
                    Añadir
                  </button>
                )}
              </div>
              {cartQty > 0 && (
                <div className="text-xs text-gray-500 text-center">
                  Actualmente tienes <span className="font-bold text-urban-600">{localQty}</span> en el carrito.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
