
// Re-exportar todos los tipos para fácil importación
export * from './product';
export * from './cart';
export * from './ui';

// Tipos específicos de props de componentes
export interface ProductListProps {
  products: Product[];
  viewMode: ViewMode;
  onProductClick?: (product: Product) => void;
}

export interface ProductModalProps extends ModalProps {
  product: Product | null;
}

// Importar tipos necesarios
import { Product, ViewMode } from './product';
import { ModalProps } from './ui';
