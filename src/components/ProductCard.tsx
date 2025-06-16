
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { formatPrice, formatDiscountPercentage } from '../utils/currency';
import { ShoppingCart, Heart, Package, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { addItem, updateQuantity, removeItem, items } = useCart();

  // Encontrar si el producto ya está en el carrito
  const cartItem = items.find(item => item.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const isInCart = quantity > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      categoryId: product.categoryId
    });
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCart) {
      updateQuantity(product.id, quantity + 1);
    } else {
      handleAddToCart(e);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeItem(product.id);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement favorite functionality
  };

  return (
    <motion.div 
      layout
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        duration: 0.3 
      }}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl border border-neutral-200/50 hover:border-primary-300/60 transition-all duration-500 cursor-pointer overflow-hidden"
      onClick={() => onClick(product)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-neutral-50 via-white to-neutral-100/80 rounded-t-2xl overflow-hidden">
        {/* Discount Badge */}
        {product.discount && (
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 20 }}
            className="absolute top-2 left-2 z-20"
          >
            <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
              {formatDiscountPercentage(product.discount)}
            </div>
          </motion.div>
        )}

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavorite}
          className="absolute top-2 right-2 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 border border-neutral-200/50 hover:bg-white"
        >
          <Heart size={14} className="text-neutral-600 hover:text-red-500 hover:fill-red-500 transition-all duration-300" />
        </motion.button>

        {/* Product Image */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full h-full relative overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover filter group-hover:brightness-110 transition-all duration-500"
            loading="lazy"
          />
        </motion.div>
      </div>
      
      {/* Product Info - More compact */}
      <div className="p-4 bg-gradient-to-b from-white to-neutral-50/50 rounded-b-2xl">
        {/* Product Name */}
        <motion.h3 
          className="font-bold text-neutral-800 mb-2 text-sm text-center group-hover:text-primary-700 transition-colors line-clamp-2 leading-tight"
        >
          {product.name}
        </motion.h3>
        
        {/* Description - Compact */}
        {product.description && (
          <p className="text-xs text-neutral-600 mb-2 text-center line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Availability Status */}
        <div className="flex items-center justify-center gap-1 mb-2">
          <Package size={12} className="text-green-600" />
          <span className="text-xs text-green-600 font-medium">Disponible</span>
        </div>
        
        {/* Price Section */}
        <div className="flex items-center justify-center space-x-2 mb-3">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="text-xl font-black text-neutral-900 group-hover:text-primary-700 transition-colors"
          >
            {formatPrice(product.price)}
          </motion.span>
          {product.originalPrice && (
            <motion.span 
              className="text-sm text-neutral-500 line-through font-medium"
            >
              {formatPrice(product.originalPrice)}
            </motion.span>
          )}
        </div>

        {/* Discount Badge - Bottom */}
        {product.discount && (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex justify-center mb-3"
          >
            <span className="text-xs bg-gradient-to-r from-accent-100 via-accent-50 to-accent-100 text-accent-800 font-bold px-3 py-1 rounded-lg border border-accent-200/60 shadow-sm">
              {formatDiscountPercentage(product.discount)} OFF
            </span>
          </motion.div>
        )}

        {/* Add to Cart Button - Enhanced with quantity controls */}
        <AnimatePresence mode="wait">
          {!isInCart ? (
            <motion.button
              key="add-button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-2 px-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg transition-all duration-300 text-sm"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <ShoppingCart size={16} />
              </motion.div>
              <span>Agregar</span>
            </motion.button>
          ) : (
            <motion.div
              key="quantity-controls"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-2"
            >
              {/* Added indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-1.5 px-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg text-xs"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                >
                  <Check size={14} />
                </motion.div>
                <span>Agregado</span>
              </motion.div>

              {/* Quantity controls */}
              <div className="flex items-center justify-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDecrement}
                  className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center justify-center shadow-md transition-all duration-200"
                >
                  <Minus size={14} />
                </motion.button>

                <motion.div
                  key={quantity}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border-2 border-primary-500 rounded-lg w-12 h-8 flex items-center justify-center font-bold text-primary-700 text-sm shadow-sm"
                >
                  {quantity}
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleIncrement}
                  className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white flex items-center justify-center shadow-md transition-all duration-200"
                >
                  <Plus size={14} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hover Effect Overlay */}
      <motion.div 
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 via-accent-500/3 to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />
    </motion.div>
  );
};
