import { createClient } from "@supabase/supabase-js";

// Allow configuring Supabase credentials through environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ??
  "https://yxrkezxytovaxlpjnbda.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cmtlenh5dG92YXhscGpuYmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTczMzQsImV4cCI6MjA2MzQzMzMzNH0.JWzIz01JTcrqBvGixAjMP19jN36nNYZhRCWLWstuURE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para las tablas de la base de datos
export type Profile = {
  id: string;
  email: string;
  plan: "Gratis" | "Basico" | "Pro" | "Negocio"; 
  created_at: string;
  updated_at: string;
};

export type Negocio = {
  id: string;
  user_id: string;
  nombre: string;
  descripcion: string | null;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  logo_url: string | null;
  banner_url: string | null;
  logo_position: string | null;
  profile_shape: string | null;
  button_shape: string | null;
  background_type: string | null;
  background_color: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  tertiary_color: string | null;
  subdominio?: string | null;
  horario: string | null;
  nombre_personalizado: string | null;
  created_at: string;
  updated_at: string;
};

export type Personalizacion = {
  id: string;
  negocio_id: string;
  color_primario: string;
  color_secundario: string;
  fuente: string;
  modo_oscuro: boolean;
  created_at: string;
  updated_at: string;
};

export type Cliente = {
  id: string;
  negocio_id: string;
  nombre: string;
  apellido: string;
  email: string | null;
  telefono: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
};

export type Cita = {
  id: string;
  negocio_id: string;
  cliente_id: string;
  servicio_id: string | null;
  fecha: string;
  duracion_minutos: number;
  estado: string;
  notas: string | null;
  created_at: string;
  updated_at: string;
};

export type Plantilla = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string | null;
  preview_url: string | null;
  es_premium: boolean;
  created_at: string;
  updated_at: string;
};

export type Categoria = {
  id: string;
  negocio_id: string;
  nombre: string;
  descripcion: string | null;
  tipo: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
};

export type Producto = {
  id: string;
  negocio_id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  disponible: boolean;
  categoria_id: string | null;
  categoria?: string | null;
  tipo?: string;
  sku?: string | null;
  precio_original?: number | null;
  costo_unidad?: number | null;
  tiene_costo_unidad?: boolean;
  precio_por_unidad?: boolean;
  peso?: number | null;
  volumen?: number | null;
  unidades?: number | null;
  unidad_medida?: string | null;
  seguimiento_inventario?: boolean;
  created_at: string;
  updated_at: string;
};

export type Servicio = {
  id: string;
  negocio_id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  duracion_minutos: number | null;
  imagen_url: string | null;
  disponible: boolean;
  categoria_id: string | null;
  categoria?: { id: string; nombre: string };
  created_at: string;
  updated_at: string;
};

export type Ingreso = {
  id: string;
  negocio_id: string;
  fecha: string;
  producto_id: string | null;
  servicio_id: string | null;
  cantidad: number;
  precio_unitario: number;
  estado: "pendiente" | "completado" | "cancelado" | "devolucion";
  notas: string | null;
  created_at: string;
  updated_at: string;
};

export type Estadistica = {
  id: string;
  negocio_id: string;
  fecha: string;
  vistas_sitio: number;
  vistas_catalogo: number;
  citas_totales: number;
  ventas_mes: number;
  ingresos_mes: number;
  created_at: string;
  updated_at: string;
};

export type Atributo = {
  id: string;
  negocio_id: string;
  nombre: string;
  created_at: string;
};

export type ProductoAtributo = {
  id: string;
  negocio_id: string;
  producto_id: string;
  atributo_id: string;
  atributo: string;
  descripcion: string | null;
  imagen_url: string | null;
  created_at: string;
};

export type Inventario = {
  id: string;
  negocio_id: string;
  producto_id: string;
  producto_atributo_id: string | null;
  stock_actual: string | null;
  stock_minimo: string | null;
  created_at: string;
};

export type Orden = {
  id: string;
  negocio_id: string;
  cliente_id: string;
  producto_id: string;
  num_pedido: string;
  Cantidad: number;
  Monto: number;
  total: number;
  estado: string;
  Estatus: string;
  fecha_pedido: string;
  created_at: string;
};

export type TemaConfig = {
  id: string;
  negocio_id: string;
  configuracion: {
    cards?: {
      base?: string;
    };
    colors?: {
      light?: Record<string, string>;
      dark?: Record<string, string>;
      customPalette?: {
        primary?: Record<string, string>;
        secondary?: Record<string, string>;
        accent?: Record<string, string>;
        neutral?: Record<string, string>;
      };
    };
    buttons?: {
      variants?: Record<string, string>;
      sizes?: Record<string, string>;
    };
    effects?: {
      keyframes?: string[];
      animations?: Record<string, string>;
    };
    shadows?: Record<string, string>;
    spacing?: Record<string, string>;
    typography?: {
      fontFamily?: Record<string, string>;
    };
    breakpoints?: Record<string, string>;
    borderRadius?: Record<string, string>;
  };
  created_at: string;
};
