
import { Category } from '../types';

// Categorías predeterminadas utilizadas como respaldo cuando Supabase no
// retorna datos. Puedes modificarlas libremente o administrarlas desde la base
// de datos.
export const categories: Category[] = [
  { id: '1', name: 'Camisetas', icon: '👕' },
  { id: '2', name: 'Gorras', icon: '🧢' },
  { id: '3', name: 'Accesorios', icon: '🎒' },
  { id: '4', name: 'Promociones', icon: '🏷️' }
];
