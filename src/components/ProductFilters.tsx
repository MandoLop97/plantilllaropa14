
import React from 'react';
import { Search } from 'lucide-react';
import type { Category, ProductFilters as ProductFiltersType } from '../types';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../constants/app';
import { formatPrice } from '../utils/currency';

interface ProductFiltersProps {
  categories: Category[];
  filters: ProductFiltersType;
  onFilterChange: (changes: Partial<ProductFiltersType>) => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  filters,
  onFilterChange,
  isMobile = false,
  isOpen,
  onClose
}) => {
  const clearFilters = () => {
    onFilterChange({
      category: '',
      priceRange: [APP_CONFIG.PRICE_RANGE.MIN, APP_CONFIG.PRICE_RANGE.MAX],
      sortBy: 'name',
      searchQuery: ''
    });
  };

  const handleCategory = (categoryName: string) => {
    onFilterChange({ category: categoryName });
  };

  // Fallback image for categories without imagen_url
  const getFallbackImage = (categoryName: string) => {
    const fallbackMap: Record<string, string> = {
      'Tecnología': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop&crop=center',
      'Moda': 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=100&h=100&fit=crop&crop=center',
      'Hogar': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop&crop=center',
      'Deportes': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop&crop=center',
      'Comida': 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=center',
      'Libros': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop&crop=center',
      'Música': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center',
      'Arte': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop&crop=center',
      'Viajes': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop&crop=center',
      'Salud': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&crop=center'
    };
    return fallbackMap[categoryName] || 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=100&h=100&fit=crop&crop=center';
  };

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white rounded-xl shadow-lg p-4 space-y-4 border border-neutral-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-primary-600 tracking-tight uppercase">Filtros</h3>
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-100/40 px-3 py-1.5 rounded-full transition-all"
          >
            Limpiar
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Categoría</label>
          <select
            value={filters.category}
            onChange={(e) => handleCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            <option value="">🛍️ Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Precio y ordenar */}
        <div className="grid grid-cols-2 gap-4">
          <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Precio (MXN)</label>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                value={filters.priceRange[0]}
                min={APP_CONFIG.PRICE_RANGE.MIN}
                max={filters.priceRange[1]}
                onChange={(e) => onFilterChange({
                  priceRange: [parseInt(e.target.value) || APP_CONFIG.PRICE_RANGE.MIN, filters.priceRange[1]]
                })}
                placeholder="Min"
                className="w-full px-2 py-1.5 text-xs text-center rounded-md border border-neutral-200 bg-neutral-50 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
              <span className="text-neutral-400 text-xs">-</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                min={filters.priceRange[0]}
                max={APP_CONFIG.PRICE_RANGE.MAX}
                onChange={(e) => onFilterChange({
                  priceRange: [filters.priceRange[0], parseInt(e.target.value) || APP_CONFIG.PRICE_RANGE.MAX]
                })}
                placeholder="Max"
                className="w-full px-2 py-1.5 text-xs text-center rounded-md border border-neutral-200 bg-neutral-50 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Ordenar</label>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as ProductFiltersType['sortBy'] })}
              className="w-full px-2 py-1.5 rounded-md border border-neutral-200 bg-white text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="name">A-Z</option>
              <option value="price-asc">Precio ↑</option>
              <option value="price-desc">Precio ↓</option>
              <option value="discount">Descuento</option>
            </select>
          </div>
        </div>
      </motion.div>
    );
  }

  // Diseño para escritorio con imágenes
  return (
    <div className="bg-gradient-to-br from-white to-neutral-50 rounded-3xl shadow-2xl border border-neutral-200 p-8 space-y-8 max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 z-10 bg-gradient-to-r from-white via-white to-neutral-50 pb-6 mb-2 flex items-center justify-between border-b-2 border-gradient-to-r border-primary-100">
        <h3 className="text-2xl font-bold text-primary-800 tracking-tight">Filtros</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearFilters}
          className="text-sm font-semibold text-primary-600 hover:text-primary-700 bg-gradient-to-r from-primary-100 to-primary-200 px-4 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
        >
          Limpiar
        </motion.button>
      </div>

      {/* Búsqueda */}
      <div>
        <label className="block text-sm font-bold text-primary-700 mb-3">
          Buscar producto
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" size={20} />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Nombre del producto..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-primary-200 focus:ring-4 focus:ring-primary-200 focus:border-primary-400 text-primary-800 bg-gradient-to-r from-primary-50 to-white placeholder:text-primary-400 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Categorías con imágenes */}
      <div>
        <label className="block text-sm font-bold text-primary-700 mb-4">
          Categoría
        </label>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategory('')}
            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all shadow-lg hover:shadow-xl
              ${!filters.category
                ? 'border-primary-500 bg-gradient-to-br from-primary-100 to-primary-200 text-primary-800 shadow-primary-200'
                : 'border-neutral-200 bg-gradient-to-br from-white to-neutral-50 text-neutral-600 hover:border-primary-300 hover:bg-gradient-to-br hover:from-primary-50 hover:to-white'}
            `}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center overflow-hidden">
              <span className="text-2xl">🛍️</span>
            </div>
            <span className="text-sm font-bold">Todas</span>
          </motion.button>
          
          {categories.map(category => {
            const isSelected = filters.category === category.name;
            const categoryImage = category.imagen_url || getFallbackImage(category.name);
            
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategory(category.name)}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all shadow-lg hover:shadow-xl
                  ${isSelected
                    ? 'border-primary-500 bg-gradient-to-br from-primary-100 to-primary-200 text-primary-800 shadow-primary-200'
                    : 'border-neutral-200 bg-gradient-to-br from-white to-neutral-50 text-neutral-600 hover:border-primary-300 hover:bg-gradient-to-br hover:from-primary-50 hover:to-white'}
                `}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-neutral-200 hover:ring-primary-300 transition-all">
                  <img
                    src={categoryImage}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-sm font-bold text-center leading-tight">
                  {category.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Rango de Precio */}
      <div>
        <label className="block text-sm font-bold text-primary-700 mb-4">
          Rango de precio
        </label>
        <div className="flex items-center gap-3 mb-3">
          <input
            type="number"
            value={filters.priceRange[0]}
            min={APP_CONFIG.PRICE_RANGE.MIN}
            max={filters.priceRange[1]}
            onChange={(e) => onFilterChange({
              priceRange: [parseInt(e.target.value) || APP_CONFIG.PRICE_RANGE.MIN, filters.priceRange[1]]
            })}
            placeholder="Min"
            className="w-1/2 px-4 py-3 rounded-xl border-2 border-primary-200 focus:ring-4 focus:ring-primary-200 focus:border-primary-400 text-primary-800 bg-gradient-to-r from-primary-50 to-white placeholder:text-primary-400 transition-all"
          />
          <div className="w-6 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"></div>
          <input
            type="number"
            value={filters.priceRange[1]}
            min={filters.priceRange[0]}
            max={APP_CONFIG.PRICE_RANGE.MAX}
            onChange={(e) => onFilterChange({
              priceRange: [filters.priceRange[0], parseInt(e.target.value) || APP_CONFIG.PRICE_RANGE.MAX]
            })}
            placeholder="Max"
            className="w-1/2 px-4 py-3 rounded-xl border-2 border-primary-200 focus:ring-4 focus:ring-primary-200 focus:border-primary-400 text-primary-800 bg-gradient-to-r from-primary-50 to-white placeholder:text-primary-400 transition-all"
          />
        </div>
        <div className="text-sm text-primary-600 text-center font-medium bg-gradient-to-r from-primary-100 to-primary-200 py-2 rounded-lg">
          {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
        </div>
      </div>

      {/* Ordenar por */}
      <div>
        <label className="block text-sm font-bold text-primary-700 mb-3">
          Ordenar por
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as ProductFiltersType['sortBy'] })}
          className="w-full px-4 py-3 rounded-xl border-2 border-primary-200 focus:ring-4 focus:ring-primary-200 focus:border-primary-400 text-primary-800 bg-gradient-to-r from-primary-50 to-white transition-all shadow-sm"
        >
          <option value="name">Nombre (A-Z)</option>
          <option value="price-asc">Precio (menor a mayor)</option>
          <option value="price-desc">Precio (mayor a menor)</option>
          <option value="discount">Mayor descuento</option>
        </select>
      </div>
    </div>
  );
};
