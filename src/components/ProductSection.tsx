
import React, { useState } from 'react';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { CategorySelector } from './CategorySelector';
import { SectionHeader } from './SectionHeader';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { animationVariants, transitionConfig, createStaggerDelay } from '../utils/animations';
import { UI_CONFIG, ROUTES } from '../constants/app';
import { STORE_CONFIG } from '../config/business';

export const ProductSection: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(STORE_CONFIG.defaultCategory);
  const navigate = useNavigate();
  
  const filteredProducts = products.filter(product => product.category === selectedCategory);
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleViewMore = () => {
    navigate(ROUTES.PRODUCTS);
  };

  return (
    <section className="py-0">
      <div className={UI_CONFIG.CONTAINER_CLASSES}>
        {/* Category Selector */}
        <CategorySelector 
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Section Header */}
        <SectionHeader
          icon={currentCategory?.icon || ''}
          title={currentCategory?.name || ''}
          description="Descubre nuestra selección de productos frescos y con estilo, disponibles en una variedad de diseños irresistibles."
        />

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory} 
            {...animationVariants.fadeIn}
            transition={transitionConfig.smooth}
            className={`grid ${UI_CONFIG.GRID_COLUMNS.MOBILE} ${UI_CONFIG.GRID_COLUMNS.TABLET} ${UI_CONFIG.GRID_COLUMNS.DESKTOP} gap-4`}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                {...animationVariants.scaleIn}
                transition={{
                  ...transitionConfig.productGrid,
                  ...createStaggerDelay(index)
                }}
              >
                <ProductCard product={product} onClick={setSelectedProduct} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View More Button */}
        <div className="text-center mt-10">
          <motion.button 
            whileHover={{ scale: 1.06, x: 4 }} 
            className="inline-flex items-center gap-2 text-urban-600 font-semibold hover:text-urban-700 transition-colors group text-lg" 
            onClick={handleViewMore}
          >
            {STORE_CONFIG.texts.viewMore}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 text-xl">→</span>
          </motion.button>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </section>
  );
};
