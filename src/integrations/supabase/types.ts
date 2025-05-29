export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      atributos: {
        Row: {
          created_at: string
          id: string
          negocio_id: string | null
          nombre: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          negocio_id?: string | null
          nombre?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          negocio_id?: string | null
          nombre?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "a_negocio_id_fkey"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          id: string
          negocio_id: string
          nombre: string
          tipo: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          negocio_id: string
          nombre: string
          tipo: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          negocio_id?: string
          nombre?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_negocio_id_fkey"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      citas: {
        Row: {
          cliente_id: string
          created_at: string | null
          duracion_minutos: number
          estado: string
          fecha: string
          id: string
          negocio_id: string
          notas: string | null
          servicio_id: string | null
          updated_at: string | null
        }
        Insert: {
          cliente_id: string
          created_at?: string | null
          duracion_minutos: number
          estado?: string
          fecha: string
          id?: string
          negocio_id: string
          notas?: string | null
          servicio_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cliente_id?: string
          created_at?: string | null
          duracion_minutos?: number
          estado?: string
          fecha?: string
          id?: string
          negocio_id?: string
          notas?: string | null
          servicio_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "citas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citas_negocio_id_fkey"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citas_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          apellido: string
          created_at: string | null
          email: string | null
          id: string
          negocio_id: string
          nombre: string
          notas: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          apellido: string
          created_at?: string | null
          email?: string | null
          id?: string
          negocio_id: string
          nombre: string
          notas?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          apellido?: string
          created_at?: string | null
          email?: string | null
          id?: string
          negocio_id?: string
          nombre?: string
          notas?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_negocio_id_fkey"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      estadisticas: {
        Row: {
          citas_totales: number | null
          created_at: string | null
          fecha: string
          id: string
          ingresos_mes: number | null
          negocio_id: string
          updated_at: string | null
          ventas_mes: number | null
          vistas_catalogo: number | null
          vistas_sitio: number | null
        }
        Insert: {
          citas_totales?: number | null
          created_at?: string | null
          fecha?: string
          id?: string
          ingresos_mes?: number | null
          negocio_id: string
          updated_at?: string | null
          ventas_mes?: number | null
          vistas_catalogo?: number | null
          vistas_sitio?: number | null
        }
        Update: {
          citas_totales?: number | null
          created_at?: string | null
          fecha?: string
          id?: string
          ingresos_mes?: number | null
          negocio_id?: string
          updated_at?: string | null
          ventas_mes?: number | null
          vistas_catalogo?: number | null
          vistas_sitio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "estadisticas_negocio_id_fkey"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      ingresos: {
        Row: {
          cantidad: number
          created_at: string | null
          estado: string
          fecha: string
          id: string
          negocio_id: string
          notas: string | null
          precio_unitario: number
          producto_id: string | null
          servicio_id: string | null
          updated_at: string | null
        }
        Insert: {
          cantidad?: number
          created_at?: string | null
          estado?: string
          fecha?: string
          id?: string
          negocio_id: string
          notas?: string | null
          precio_unitario: number
          producto_id?: string | null
          servicio_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cantidad?: number
          created_at?: string | null
          estado?: string
          fecha?: string
          id?: string
          negocio_id?: string
          notas?: string | null
          precio_unitario?: number
          producto_id?: string | null
          servicio_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingresos_negocio_id_fkey"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingresos_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingresos_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      inventario: {
        Row: {
          created_at: string
          id: string
          negocio_id: string | null
          producto_atributo_id: string | null
          producto_id: string | null
          stock_actual: string | null
          stock_minimo: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          negocio_id?: string | null
          producto_atributo_id?: string | null
          producto_id?: string | null
          stock_actual?: string | null
          stock_minimo?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          negocio_id?: string | null
          producto_atributo_id?: string | null
          producto_id?: string | null
          stock_actual?: string | null
          stock_minimo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventario_negocio_id_fkey"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_producto_atributo_id_fkey"
            columns: ["producto_atributo_id"]
            isOneToOne: false
            referencedRelation: "producto_atributo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      negocios: {
        Row: {
          background_color: string | null
          background_type: string | null
          banner_url: string | null
          button_shape: string | null
          created_at: string | null
          descripcion: string | null
          direccion: string | null
          email: string | null
          horario: string | null
          id: string
          logo_position: string | null
          logo_url: string | null
          nombre: string
          primary_color: string | null
          profile_shape: string | null
          secondary_color: string | null
          subdominio: string | null
          telefono: string | null
          tertiary_color: string | null
          updated_at: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          background_color?: string | null
          background_type?: string | null
          banner_url?: string | null
          button_shape?: string | null
          created_at?: string | null
          descripcion?: string | null
          direccion?: string | null
          email?: string | null
          horario?: string | null
          id?: string
          logo_position?: string | null
          logo_url?: string | null
          nombre: string
          primary_color?: string | null
          profile_shape?: string | null
          secondary_color?: string | null
          subdominio?: string | null
          telefono?: string | null
          tertiary_color?: string | null
          updated_at?: string | null
          url?: string | null
          user_id: string
        }
        Update: {
          background_color?: string | null
          background_type?: string | null
          banner_url?: string | null
          button_shape?: string | null
          created_at?: string | null
          descripcion?: string | null
          direccion?: string | null
          email?: string | null
          horario?: string | null
          id?: string
          logo_position?: string | null
          logo_url?: string | null
          nombre?: string
          primary_color?: string | null
          profile_shape?: string | null
          secondary_color?: string | null
          subdominio?: string | null
          telefono?: string | null
          tertiary_color?: string | null
          updated_at?: string | null
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      paleta: {
        Row: {
          "100": string | null
          "200": string | null
          "300": string | null
          "400": string | null
          "50": string | null
          "500": string | null
          "600": string | null
          "700": string | null
          "800": string | null
          "900": string | null
          "950": string | null
          created_at: string | null
          id: string
          negocio_id: string
          updated_at: string | null
        }
        Insert: {
          "100"?: string | null
          "200"?: string | null
          "300"?: string | null
          "400"?: string | null
          "50"?: string | null
          "500"?: string | null
          "600"?: string | null
          "700"?: string | null
          "800"?: string | null
          "900"?: string | null
          "950"?: string | null
          created_at?: string | null
          id?: string
          negocio_id: string
          updated_at?: string | null
        }
        Update: {
          "100"?: string | null
          "200"?: string | null
          "300"?: string | null
          "400"?: string | null
          "50"?: string | null
          "500"?: string | null
          "600"?: string | null
          "700"?: string | null
          "800"?: string | null
          "900"?: string | null
          "950"?: string | null
          created_at?: string | null
          id?: string
          negocio_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_negocio"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personalizacion_negocio_id_fkey"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      plantillas: {
        Row: {
          categoria: string
          created_at: string | null
          descripcion: string | null
          es_premium: boolean | null
          id: string
          nombre: string
          preview_url: string | null
          updated_at: string | null
        }
        Insert: {
          categoria: string
          created_at?: string | null
          descripcion?: string | null
          es_premium?: boolean | null
          id?: string
          nombre: string
          preview_url?: string | null
          updated_at?: string | null
        }
        Update: {
          categoria?: string
          created_at?: string | null
          descripcion?: string | null
          es_premium?: boolean | null
          id?: string
          nombre?: string
          preview_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      producto_atributo: {
        Row: {
          atributo: string | null
          atributo_id: string | null
          created_at: string
          descripcion: string | null
          id: string
          imagen_url: string | null
          negocio_id: string | null
          producto_id: string | null
        }
        Insert: {
          atributo?: string | null
          atributo_id?: string | null
          created_at?: string
          descripcion?: string | null
          id?: string
          imagen_url?: string | null
          negocio_id?: string | null
          producto_id?: string | null
        }
        Update: {
          atributo?: string | null
          atributo_id?: string | null
          created_at?: string
          descripcion?: string | null
          id?: string
          imagen_url?: string | null
          negocio_id?: string | null
          producto_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "p_a_atributo_id_fkey"
            columns: ["atributo_id"]
            isOneToOne: false
            referencedRelation: "atributos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "p_a_negocio_id_fkey"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "p_a_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          atributos: number | null
          categoria: string | null
          categoria_id: string | null
          created_at: string | null
          descripcion: string | null
          disponible: boolean | null
          id: string
          imagen_url: string | null
          negocio_id: string
          nombre: string
          precio: number
          updated_at: string | null
        }
        Insert: {
          atributos?: number | null
          categoria?: string | null
          categoria_id?: string | null
          created_at?: string | null
          descripcion?: string | null
          disponible?: boolean | null
          id?: string
          imagen_url?: string | null
          negocio_id: string
          nombre: string
          precio: number
          updated_at?: string | null
        }
        Update: {
          atributos?: number | null
          categoria?: string | null
          categoria_id?: string | null
          created_at?: string | null
          descripcion?: string | null
          disponible?: boolean | null
          id?: string
          imagen_url?: string | null
          negocio_id?: string
          nombre?: string
          precio?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_negocio_id_fkey"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          plan: Database["public"]["Enums"]["plan"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          plan?: Database["public"]["Enums"]["plan"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          plan?: Database["public"]["Enums"]["plan"] | null
          updated_at?: string
        }
        Relationships: []
      }
      servicios: {
        Row: {
          categoria: string | null
          categoria_id: string | null
          created_at: string | null
          descripcion: string | null
          disponible: boolean | null
          duracion_minutos: number | null
          id: string
          imagen_url: string | null
          negocio_id: string
          nombre: string
          precio: number
          updated_at: string | null
        }
        Insert: {
          categoria?: string | null
          categoria_id?: string | null
          created_at?: string | null
          descripcion?: string | null
          disponible?: boolean | null
          duracion_minutos?: number | null
          id?: string
          imagen_url?: string | null
          negocio_id: string
          nombre: string
          precio: number
          updated_at?: string | null
        }
        Update: {
          categoria?: string | null
          categoria_id?: string | null
          created_at?: string | null
          descripcion?: string | null
          disponible?: boolean | null
          duracion_minutos?: number | null
          id?: string
          imagen_url?: string | null
          negocio_id?: string
          nombre?: string
          precio?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "servicios_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servicios_negocio_id_fkey"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_business_categories: {
        Args: { business_id: string }
        Returns: {
          id: string
          nombre: string
          descripcion: string
          tipo: string
          activo: boolean
          created_at: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      plan: "Gratis" | "Pro" | "Basico" | "Negocio"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      plan: ["Gratis", "Pro", "Basico", "Negocio"],
    },
  },
} as const
