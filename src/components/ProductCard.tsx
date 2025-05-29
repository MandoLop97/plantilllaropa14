
import React from 'react';
import { Product } from '../types';
import { formatPrice, formatDiscountPercentage } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(product)}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-50 rounded-t-2xl overflow-hidden">
        {product.discount && (
          <div className="absolute top-3 left-3 bg-picton-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            {formatDiscountPercentage(product.discount)}
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      
      {/* Product Info */}
      <div className="p-3 flex flex-col items-center">
        <h3 className="font-semibold text-gray-900 mb-1 text-base text-center group-hover:text-picton-blue-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-center space-x-2 mb-1">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.discount && (
            <span className="text-xs bg-picton-blue-100 text-picton-blue-600 font-bold px-2 py-0.5 rounded-full ml-1">
              {formatDiscountPercentage(product.discount)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
