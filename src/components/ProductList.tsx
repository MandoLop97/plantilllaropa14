
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { formatPrice } from '../utils/currency';
import { ShoppingCart, Heart } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  onProductClick?: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, viewMode, onProductClick }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      setSelectedProduct(product);
    }
  };

  if (products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center shadow-lg"
        >
          <span className="text-4xl text-neutral-400">🔍</span>
        </motion.div>
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold text-neutral-900 mb-2"
        >
          No se encontraron productos
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-neutral-600"
        >
          Prueba ajustando los filtros para encontrar lo que buscas
        </motion.p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        layout
        className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-6'
          }
        `}
      >
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.9 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className={viewMode === 'list' ? 'w-full' : ''}
            >
              {viewMode === 'grid' ? (
                <ProductCard product={product} onClick={handleProductClick} />
              ) : (
                <ProductListItem product={product} onClick={handleProductClick} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {!onProductClick && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

// Componente mejorado para vista de lista
const ProductListItem: React.FC<{ product: Product; onClick: (product: Product) => void }> = ({ 
  product, 
  onClick 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-neutral-100 hover:border-primary-200"
      onClick={() => onClick(product)}
    >
      <div className="flex gap-6 p-6">
        {/* Imagen del producto mejorada */}
        <div className="relative w-32 h-32 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl overflow-hidden flex-shrink-0">
          {product.discount && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 left-2 bg-accent-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg"
            >
              -{product.discount}%
            </motion.div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <Heart size={14} className="text-neutral-600 hover:text-red-500 transition-colors" />
          </motion.button>
          
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            whileHover={{ scale: 1.1 }}
          />
        </div>

        {/* Información del producto mejorada */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <motion.h3 
              className="font-bold text-lg text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2"
            >
              {product.name}
            </motion.h3>
            <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors"
              >
                {formatPrice(product.price)}
              </motion.span>
              {product.originalPrice && (
                <span className="text-sm text-neutral-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount && (
                <span className="text-xs bg-gradient-to-r from-accent-100 to-accent-50 text-accent-700 font-bold px-2 py-1 rounded-full border border-accent-200">
                  -{product.discount}%
                </span>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ShoppingCart size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
