
import React, { useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { motion } from 'framer-motion';

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
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-4xl text-gray-400">🔍</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No se encontraron productos
        </h3>
        <p className="text-gray-600">
          Prueba ajustando los filtros para encontrar lo que buscas
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        layout
        className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
            : 'space-y-4'
          }
        `}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={viewMode === 'list' ? 'w-full' : ''}
          >
            {viewMode === 'grid' ? (
              <ProductCard product={product} onClick={handleProductClick} />
            ) : (
              <ProductListItem product={product} onClick={handleProductClick} />
            )}
          </motion.div>
        ))}
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

// Componente para vista de lista
const ProductListItem: React.FC<{ product: Product; onClick: (product: Product) => void }> = ({ 
  product, 
  onClick 
}) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group p-4"
      onClick={() => onClick(product)}
    >
      <div className="flex gap-4">
        {/* Imagen del producto */}
        <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
          {product.discount && (
            <div className="absolute top-1 left-1 bg-urban-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full z-10">
              -{product.discount}%
            </div>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* Información del producto */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-urban-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.discount && (
                <span className="text-xs bg-urban-100 text-urban-600 font-bold px-2 py-0.5 rounded-full">
                  -{product.discount}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
