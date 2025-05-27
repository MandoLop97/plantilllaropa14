
// Tipos específicos para la integración con Supabase
export interface SupabaseProduct {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  categoria: string | null;
  disponible: boolean | null;
  negocio_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface SupabaseCategory {
  id: string;
  nombre: string;
  descripcion: string | null;
  tipo: string;
  activo: boolean;
  negocio_id: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseCartItem {
  id: string;
  product_id: string;
  quantity: number;
  created_at?: string;
  updated_at?: string;
}

// Mappers para convertir entre tipos locales y Supabase
export const mapSupabaseProductToLocal = (product: SupabaseProduct) => ({
  id: product.id,
  name: product.nombre,
  description: product.descripcion || '',
  price: product.precio,
  originalPrice: undefined,
  image: product.imagen_url || '/placeholder.svg',
  category: product.categoria || 'General',
  sku: undefined,
  discount: undefined
});

export const mapLocalProductToSupabase = (product: any): Omit<SupabaseProduct, 'id' | 'created_at' | 'updated_at'> => ({
  nombre: product.name,
  descripcion: product.description,
  precio: product.price,
  imagen_url: product.image,
  categoria: product.category,
  disponible: true,
  negocio_id: '00000000-0000-0000-0000-000000000000' // Default business ID para plantilla
});
