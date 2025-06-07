
import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { formatPrice, formatDiscountPercentage } from '../utils/currency';
import { ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <motion.div 
      layout
      whileHover={{ y: -12, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        duration: 0.4 
      }}
      className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-neutral-200/50 hover:border-primary-300/60 transition-all duration-700 cursor-pointer overflow-hidden backdrop-blur-sm"
      onClick={() => onClick(product)}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-accent-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Product Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-neutral-50 via-white to-neutral-100/80 rounded-t-3xl overflow-hidden">
        {/* Discount Badge with Enhanced Glassmorphism */}
        {product.discount && (
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 20 }}
            className="absolute top-3 left-3 z-20"
          >
            <div className="bg-gradient-to-r from-accent-500 to-accent-600 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-2xl shadow-2xl border border-accent-400/30 ring-1 ring-white/20">
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {formatDiscountPercentage(product.discount)}
              </motion.span>
            </div>
          </motion.div>
        )}

        {/* Enhanced Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.85 }}
          className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-500 border border-neutral-200/50 hover:bg-white"
        >
          <Heart size={16} className="text-neutral-600 hover:text-red-500 hover:fill-red-500 transition-all duration-300" />
        </motion.button>

        {/* Product Image with Enhanced Parallax Effect */}
        <motion.div
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full h-full relative overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover filter group-hover:brightness-110 transition-all duration-700"
            loading="lazy"
          />
          
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </motion.div>

        {/* Enhanced Add to Cart Button */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-2xl backdrop-blur-sm border border-primary-500/20 transition-all duration-300"
          >
            <ShoppingCart size={18} />
            <span className="text-sm font-medium">Agregar al carrito</span>
          </motion.button>
        </motion.div>
      </div>
      
      {/* Enhanced Product Info */}
      <div className="p-6 bg-gradient-to-b from-white to-neutral-50/50 rounded-b-3xl relative">
        <motion.h3 
          className="font-bold text-neutral-800 mb-4 text-base text-center group-hover:text-primary-700 transition-colors line-clamp-2 leading-tight tracking-wide"
        >
          {product.name}
        </motion.h3>
        
        <div className="flex items-center justify-center space-x-3 mb-4">
          <motion.span 
            whileHover={{ scale: 1.08 }}
            className="text-2xl font-black text-neutral-900 group-hover:text-primary-700 transition-colors tracking-tight"
          >
            {formatPrice(product.price)}
          </motion.span>
          {product.originalPrice && (
            <motion.span 
              initial={{ opacity: 0.6 }}
              whileHover={{ opacity: 1 }}
              className="text-sm text-neutral-500 line-through font-medium"
            >
              {formatPrice(product.originalPrice)}
            </motion.span>
          )}
        </div>

        {product.discount && (
          <motion.div 
            whileHover={{ scale: 1.08 }}
            className="flex justify-center"
          >
            <span className="text-xs bg-gradient-to-r from-accent-100 via-accent-50 to-accent-100 text-accent-800 font-bold px-4 py-2 rounded-2xl border border-accent-200/60 shadow-lg backdrop-blur-sm">
              {formatDiscountPercentage(product.discount)} DE DESCUENTO
            </span>
          </motion.div>
        )}
        
        {/* Subtle bottom border accent */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Enhanced Floating Shadow Effect */}
      <motion.div 
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/8 via-accent-500/5 to-primary-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        animate={{
          background: [
            "linear-gradient(135deg, hsl(var(--color-primary-500) / 0.08), hsl(var(--color-accent-500) / 0.05), hsl(var(--color-primary-500) / 0.08))",
            "linear-gradient(135deg, hsl(var(--color-accent-500) / 0.08), hsl(var(--color-primary-500) / 0.05), hsl(var(--color-accent-500) / 0.08))",
            "linear-gradient(135deg, hsl(var(--color-primary-500) / 0.08), hsl(var(--color-accent-500) / 0.05), hsl(var(--color-primary-500) / 0.08))"
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};
