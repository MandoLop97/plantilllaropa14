
import { useState, useMemo } from 'react';
import { ProductFilters, Product } from '../types';
import { APP_CONFIG } from '../constants/app';

export const useProductFilters = (productList: Product[] = []) => {
  const [filters, setFilters] = useState<ProductFilters>({
    category: '',
    priceRange: [APP_CONFIG.PRICE_RANGE.MIN, APP_CONFIG.PRICE_RANGE.MAX],
    sortBy: 'name',
    searchQuery: ''
  });

  const filteredProducts = useMemo(() => {
    let filtered = productList.filter(product => {
      if (filters.category && product.category !== filters.category) return false;
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
      if (filters.searchQuery && !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
      return true;
    });

    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'name':
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [filters, productList]);

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      priceRange: [APP_CONFIG.PRICE_RANGE.MIN, APP_CONFIG.PRICE_RANGE.MAX],
      sortBy: 'name',
      searchQuery: ''
    });
  };

  return {
    filters,
    filteredProducts,
    handleFilterChange,
    handleClearFilters
  };
};
