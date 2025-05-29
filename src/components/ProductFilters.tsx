
import React from 'react';
import { Search } from 'lucide-react';
import { Category } from '../types';
import { motion } from 'framer-motion';

interface ProductFiltersProps {
  categories: Category[];
  filters: any;
  onFilterChange: any;
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
      priceRange: [0, 1500],
      sortBy: 'name',
      searchQuery: ''
    });
  };

  const handleCategory = (categoryName: string) => {
    onFilterChange({ category: categoryName });
  };

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white rounded-xl shadow-lg p-4 space-y-4 border border-gray-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-picton-blue-600 tracking-tight uppercase">Filtros</h3>
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-picton-blue-600 hover:text-picton-blue-700 bg-picton-blue-100/40 px-3 py-1.5 rounded-full transition-all"
          >
            Limpiar
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:ring-2 focus:ring-picton-blue-500 focus:outline-none"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Categoría</label>
          <select
            value={filters.category}
            onChange={(e) => handleCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:ring-2 focus:ring-picton-blue-500 focus:outline-none"
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
            <label className="block text-xs font-semibold text-gray-600 mb-1">Precio (MXN)</label>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                value={filters.priceRange[0]}
                min={0}
                max={filters.priceRange[1]}
                onChange={(e) => onFilterChange({
                  priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]]
                })}
                placeholder="Min"
                className="w-full px-2 py-1.5 text-xs text-center rounded-md border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-picton-blue-500 focus:outline-none"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                min={filters.priceRange[0]}
                max={1500}
                onChange={(e) => onFilterChange({
                  priceRange: [filters.priceRange[0], parseInt(e.target.value) || 1500]
                })}
                placeholder="Max"
                className="w-full px-2 py-1.5 text-xs text-center rounded-md border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-picton-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Ordenar</label>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              className="w-full px-2 py-1.5 rounded-md border border-gray-200 bg-white text-xs focus:ring-2 focus:ring-picton-blue-500 focus:outline-none"
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

  // Diseño para escritorio (más amplio, detallado) - SIN CAMBIOS
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 space-y-8 max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white/95 pb-4 mb-2 flex items-center justify-between border-b border-picton-blue-100">
        <h3 className="text-xl font-extrabold text-picton-blue-800 tracking-tight">Filtros</h3>
        <button
          onClick={clearFilters}
          className="text-sm font-semibold text-picton-blue-500 hover:text-picton-blue-700 bg-picton-blue-100/60 px-3 py-1 rounded-full transition-colors shadow-sm"
        >
          Limpiar
        </button>
      </div>

      {/* Búsqueda */}
      <div>
        <label className="block text-sm font-semibold text-picton-blue-700 mb-2">
          Buscar producto
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-picton-blue-300" size={18} />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Nombre del producto..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-picton-blue-100 focus:ring-2 focus:ring-picton-blue-500 focus:border-picton-blue-300 text-picton-blue-800 bg-picton-blue-50/60 placeholder:text-picton-blue-300"
          />
        </div>
      </div>

      {/* Categorías */}
      <div>
        <label className="block text-sm font-semibold text-picton-blue-700 mb-3">
          Categoría
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleCategory('')}
            className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border transition-all text-xs font-semibold shadow-sm
              ${!filters.category
                ? 'border-picton-blue-500 bg-picton-blue-50 text-picton-blue-700'
                : 'border-picton-blue-100 bg-white text-picton-blue-500 hover:border-picton-blue-300'}
            `}
          >
            <span className="text-2xl">🛍️</span>
            Todas
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategory(category.name)}
              className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border transition-all text-xs font-semibold shadow-sm
                ${filters.category === category.name
                  ? 'border-picton-blue-500 bg-picton-blue-50 text-picton-blue-700'
                  : 'border-picton-blue-100 bg-white text-picton-blue-500 hover:border-picton-blue-300'}
              `}
            >
              <span className="text-2xl">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Rango de Precio */}
      <div>
        <label className="block text-sm font-semibold text-picton-blue-700 mb-3">
          Rango de precio
        </label>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="number"
            value={filters.priceRange[0]}
            min={0}
            max={filters.priceRange[1]}
            onChange={(e) => onFilterChange({
              priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]]
            })}
            placeholder="Min"
            className="w-1/2 px-3 py-2 rounded-lg border border-picton-blue-100 focus:ring-2 focus:ring-picton-blue-500 focus:border-picton-blue-300 text-picton-blue-800 bg-picton-blue-50/60 placeholder:text-picton-blue-300"
          />
          <span className="text-picton-blue-400 font-bold">-</span>
          <input
            type="number"
            value={filters.priceRange[1]}
            min={filters.priceRange[0]}
            max={1500}
            onChange={(e) => onFilterChange({
              priceRange: [filters.priceRange[0], parseInt(e.target.value) || 1500]
            })}
            placeholder="Max"
            className="w-1/2 px-3 py-2 rounded-lg border border-picton-blue-100 focus:ring-2 focus:ring-picton-blue-500 focus:border-picton-blue-300 text-picton-blue-800 bg-picton-blue-50/60 placeholder:text-picton-blue-300"
          />
        </div>
        <div className="text-xs text-picton-blue-400 text-center">
          ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </div>
      </div>

      {/* Ordenar por */}
      <div>
        <label className="block text-sm font-semibold text-picton-blue-700 mb-3">
          Ordenar por
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-picton-blue-100 focus:ring-2 focus:ring-picton-blue-500 focus:border-picton-blue-300 text-picton-blue-800 bg-picton-blue-50/60"
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
