
# Urban Style E-commerce Template v2.0

Esta es una plantilla de e-commerce moderna y completamente funcional construida con React, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características

- **Diseño Responsivo**: Optimizado para todos los dispositivos
- **Carrito de Compras**: Funcionalidad completa de carrito
- **Filtros de Productos**: Búsqueda, categorías, precios y ordenamiento
- **Animaciones Suaves**: Transiciones elegantes con Framer Motion
- **WhatsApp Integration**: Contacto directo por WhatsApp
- **Integración Supabase**: Base de datos en tiempo real
- **Optimizado para SEO**: Estructura semántica
- **Fácil Personalización**: Configuración centralizada
- **Sincronización de Datos**: Herramientas para migrar datos

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── admin/          # Componentes de administración
│   └── ui/             # Componentes UI base
├── config/             # Configuración del negocio y plantilla
│   ├── business.ts     # Datos del negocio (PERSONALIZAR AQUÍ)
│   └── template.ts     # Configuración de plantilla
├── constants/          # Constantes de la aplicación
├── contexts/           # Context providers (carrito, etc.)
├── data/               # Datos locales de productos y categorías
├── hooks/              # Custom hooks
│   ├── useSupabase*.ts # Hooks para Supabase
│   └── use*.ts         # Otros hooks
├── pages/              # Páginas principales
├── api/                # Integración con APIs
│   └── supabase/       # Cliente y servicios de Supabase
├── types/              # Definiciones de TypeScript
│   ├── supabase.ts     # Tipos específicos de Supabase
│   └── index.ts        # Tipos principales
└── utils/              # Utilidades y helpers
    └── dataSync.ts     # Herramientas de sincronización
```

## ⚙️ Personalización Rápida

### 1. Información del Negocio
Edita `src/config/business.ts`:

```typescript
export const BUSINESS_CONFIG = {
  name: 'Tu Tienda',           // ← Cambia aquí
  description: 'Tu descripción', // ← Y aquí
  whatsapp: '1234567890',      // ← Número de WhatsApp
  // ... más configuraciones
}
```

### 2. Configuración de Plantilla
Edita `src/config/template.ts` para configurar el comportamiento:

```typescript
export const TEMPLATE_CONFIG = {
  development: {
    useLocalData: true,        // true para datos locales, false para Supabase
    enableDataSync: true,      // Habilitar herramientas de sincronización
  }
}
```

### 3. Productos y Categorías

#### Opción A: Datos Locales (Desarrollo)
- **Productos**: Edita `src/data/products.ts`
- **Categorías**: Edita `src/data/categories.ts`

#### Opción B: Supabase (Producción)
1. Conecta tu proyecto a Supabase
2. Ejecuta las migraciones SQL (ver sección Supabase)
3. Usa el panel de sincronización para migrar datos locales

### 4. Colores y Estilos
El proyecto usa clases de Tailwind con el color `urban`. Para cambiar:
1. Actualiza `tailwind.config.ts`
2. Reemplaza las clases `picton-blue-*` en los componentes

## 🗄️ Integración con Supabase

### Configuración Inicial

1. **Conecta tu proyecto a Supabase** desde el panel de Lovable
2. **Ejecuta las migraciones SQL** necesarias (ver sección SQL)
3. **Configura las tablas** según el esquema proporcionado

### Migraciones SQL Requeridas

```sql
-- Crear tabla de productos
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image_url TEXT,
  category TEXT NOT NULL,
  sku TEXT,
  discount INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY "Allow public read" ON productos FOR SELECT TO public USING (true);
```

### Sincronización de Datos

La plantilla incluye herramientas para migrar datos entre el entorno local y Supabase:

```typescript
import { DataSync } from './utils/dataSync';

// Sincronizar productos locales a Supabase
await DataSync.syncProductsToSupabase();

// Sincronizar categorías locales a Supabase
await DataSync.syncCategoriesToSupabase();

// Exportar datos de Supabase como JSON
await DataSync.exportData();
```

### Panel de Administración

Incluye el `DataSyncPanel` component para gestionar datos:

```tsx
import { DataSyncPanel } from './components/admin/DataSyncPanel';

// En tu componente de administración
<DataSyncPanel />
```

## 🛠️ Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo (datos locales)
npm run dev

# Construir para producción
npm run build
```

## 📱 Funcionalidades Principales

### Carrito de Compras
- Agregar/quitar productos
- Actualizar cantidades
- Persistencia en localStorage
- Cálculo automático de totales

### Filtros de Productos
- Por categoría
- Por rango de precio
- Búsqueda por texto
- Ordenamiento múltiple

### Diseño Responsivo
- Grid adaptativo de productos
- Navegación móvil optimizada
- Componentes touch-friendly

### Integración Supabase
- CRUD completo de productos
- Gestión de categorías
- Sincronización en tiempo real
- Exportación de datos

## 🎨 Componentes Principales

- **ProductCard**: Tarjeta de producto con imagen y precio
- **ProductList**: Lista/grid de productos con filtros
- **Cart**: Carrito de compras deslizable
- **Header**: Navegación principal
- **Footer**: Información del negocio
- **DataSyncPanel**: Panel de administración de datos

## 🔧 Hooks Personalizados

- **useCart**: Gestión del carrito
- **useProductFilters**: Filtrado de productos
- **useLocalStorage**: Persistencia local
- **useDebounce**: Optimización de búsquedas
- **useSupabaseProducts**: CRUD de productos con Supabase
- **useSupabaseCategories**: CRUD de categorías con Supabase

## 📦 Dependencias Principales

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Lucide React (iconos)
- Supabase JS
- Sonner (notificaciones)

## 🚀 Deployment

### Desarrollo Local
1. Configura `useLocalData: true` en `template.ts`
2. Ejecuta `npm run dev`

### Producción con Supabase
1. Conecta a Supabase
2. Ejecuta migraciones SQL
3. Configura `useLocalData: false`
4. Sincroniza datos usando `DataSyncPanel`
5. Build: `npm run build`
6. Deploy: Sube la carpeta `dist` a tu servidor

## 🔄 Migración de Datos

### Desde Datos Locales a Supabase
```typescript
// 1. Sincronizar categorías primero
await DataSync.syncCategoriesToSupabase();

// 2. Luego sincronizar productos
await DataSync.syncProductsToSupabase();
```

### Backup y Exportación
```typescript
// Exportar todos los datos como JSON
const backup = await DataSync.exportData();
```

### Limpiar Datos (Testing)
```typescript
// Eliminar todos los datos de Supabase
await DataSync.clearSupabaseData();
```

## 📄 Licencia

Este template es de uso libre para proyectos comerciales y personales.

## 🆘 Soporte

Para personalización o soporte adicional:
1. Revisa la documentación de cada componente
2. Utiliza el panel de sincronización para gestionar datos
3. Consulta los logs de consola para debugging

---

¿Necesitas ayuda? Revisa la documentación de Supabase o contacta al desarrollador.
