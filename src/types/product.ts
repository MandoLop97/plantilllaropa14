
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  discount?: number;
  sku?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  imagen_url?: string; // Add this field for database images
}

export interface ProductFilters {
  category: string;
  priceRange: [number, number];
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'discount';
  searchQuery: string;
}

export type ViewMode = 'grid' | 'list';
