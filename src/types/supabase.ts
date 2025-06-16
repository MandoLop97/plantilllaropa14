
import { Product } from './index';

// Definición explícita del tipo de producto de Supabase
export interface SupabaseProduct {
  id: string;
  nombre: string;
  precio: number;
  precio_original?: number;
  imagen_url?: string;
  categoria?: string;
  categoria_id?: string;
  descripcion?: string;
  disponible: boolean;
  sku?: string;
  negocio_id: string;
  created_at?: string;
  updated_at?: string;
}

// Definición explícita del tipo de categoría de Supabase
export interface SupabaseCategory {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo: string;
  activo: boolean;
  negocio_id: string;
  imagen_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Función para mapear producto de Supabase a tipo local
export const mapSupabaseProductToLocal = (product: SupabaseProduct): Product => {
  const discount = product.precio_original && product.precio_original > product.precio 
    ? Math.round(((product.precio_original - product.precio) / product.precio_original) * 100)
    : 0;

  return {
    id: product.id,
    name: product.nombre,
    price: product.precio,
    originalPrice: product.precio_original,
    image: product.imagen_url || '/placeholder.svg',
    categoryId: product.categoria_id || '',
    category: product.categoria || '',
    description: product.descripcion || '',
    sku: product.sku || product.id,
    discount: discount > 0 ? discount : undefined
  };
};

// Función para mapear producto local a tipo Supabase
export const mapLocalProductToSupabase = (product: Partial<Product>, negocio_id: string) => {
  return {
    nombre: product.name || '',
    precio: product.price || 0,
    precio_original: product.originalPrice,
    imagen_url: product.image,
    categoria_id: product.categoryId,
    categoria: product.category,
    descripcion: product.description,
    sku: product.sku,
    negocio_id: negocio_id,
    disponible: true
  };
};
