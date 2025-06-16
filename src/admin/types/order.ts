
// Type definitions for order-related data
export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  [key: string]: unknown;
}

export interface OrderItem {
  id?: string;
  name?: string;
  producto?: string;
  price?: number;
  precio?: number;
  cantidad?: number;
  quantity?: number;
  [key: string]: unknown;
}

export interface OrdenWithRelations {
  id: string;
  negocio_id: string;
  cliente_id: string;
  num_pedido: string;
  estado: string;
  estado_pago?: string;
  estado_entrega?: string;
  total: string;
  items: OrderItem[] | string;
  fecha_creacion: string;
  created_at: string;
  clientes?: Cliente;
}
