
import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Plus, Check, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import { formatPrice } from '../utils/currency';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Sincroniza automáticamente el carrito cuando cambia localQty
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
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
        >
          <div className="h-full w-full flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="modal-content bg-white rounded-3xl w-full max-w-lg h-fit max-h-[95vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-neutral-200 transition-colors"
                  aria-label="Cerrar"
                >
                  <X size={18} className="text-neutral-600" />
                </motion.button>
                
                {/* Product Image */}
                <div className="relative aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden">
                  {product.discount && (
                    <motion.div 
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-full z-10 shadow-lg"
                    >
                      -{product.discount}%
                    </motion.div>
                  )}
                  <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6 }}
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
                
                {/* Product Info */}
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="space-y-2">
                    <motion.h3 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl font-bold text-neutral-900 leading-tight"
                    >
                      {product.name}
                    </motion.h3>
                    
                    <div className="flex items-center gap-3">
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full"
                      >
                        SKU: {product.sku}
                      </motion.span>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className="text-amber-400 fill-current" />
                        ))}
                        <span className="text-sm text-neutral-600 ml-1">(4.8)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-neutral-700 leading-relaxed text-sm"
                  >
                    {product.description}
                  </motion.p>
                  
                  {/* Price Section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl border border-primary-200"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl font-bold text-primary-700">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-lg text-neutral-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      {product.originalPrice && (
                        <p className="text-sm text-green-600 font-medium">
                          Ahorras {formatPrice(product.originalPrice - product.price)}
                        </p>
                      )}
                    </div>
                  </motion.div>
                  
                  {/* Quantity and Add to Cart */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-neutral-100 rounded-2xl p-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={decreaseQuantity}
                          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                          disabled={localQty <= 1}
                        >
                          <Minus size={18} className={localQty <= 1 ? 'text-neutral-400' : 'text-neutral-600'} />
                        </motion.button>
                        
                        <span className="text-lg font-bold w-12 text-center select-none text-neutral-800">
                          {localQty}
                        </span>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={increaseQuantity}
                          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                        >
                          <Plus size={18} className="text-neutral-600" />
                        </motion.button>
                      </div>
                      
                      {cartQty > 0 ? (
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                        >
                          <Check size={20} className="text-green-600" />
                          En el carrito ({localQty})
                        </motion.div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAddToCart}
                          disabled={localQty < 1}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all duration-300 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 shadow-lg hover:shadow-xl"
                        >
                          Añadir al carrito
                        </motion.button>
                      )}
                    </div>
                    
                    {cartQty > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200"
                      >
                        <p className="text-sm text-blue-700">
                          Cantidad actual: <span className="font-bold">{localQty}</span> en el carrito
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
