
import { products as localProducts } from '../data/products';
import { categories as localCategories } from '../data/categories';
import { ProductsService, CategoriesService } from '../services';
import type { Product, Category } from '../types';

// Utilidad para sincronizar datos locales con Supabase
export class DataSync {
  private static async syncItems<T>(
    items: T[],
    createFn: (item: T) => Promise<unknown>,
    getName: (item: T) => string
  ): Promise<{ success: number; errors: number }> {
    const results = await Promise.allSettled(items.map(createFn));

    const success = results.filter(r => r.status === 'fulfilled').length;
    const errors = results.length - success;

    results.forEach((result, idx) => {
      const name = getName(items[idx]);
      if (result.status === 'fulfilled') {
        console.log(`✅ Sincronizado: ${name}`);
      } else {
        console.error(`❌ Error sincronizando ${name}:`, result.reason);
      }
    });

    console.log(`Sincronización completada: ${success} éxitos, ${errors} errores`);
    return { success, errors };
  }

  // Sincronizar productos locales a Supabase
  static async syncProductsToSupabase(): Promise<{ success: number; errors: number }> {
    console.log('Iniciando sincronización de productos...');
    return this.syncItems(
      localProducts,
      product => ProductsService.create(product),
      product => product.name
    );
  }

  // Sincronizar categorías locales a Supabase
  static async syncCategoriesToSupabase(): Promise<{ success: number; errors: number }> {
    console.log('Iniciando sincronización de categorías...');
    return this.syncItems(
      localCategories,
      category => CategoriesService.create({ name: category.name, icon: category.icon }),
      category => category.name
    );
  }

  // Exportar datos de Supabase a JSON
  static async exportData(): Promise<{ products: Product[]; categories: Category[] } | null> {
    try {
      const [products, categories] = await Promise.all([
        ProductsService.getAll(),
        CategoriesService.getAll()
      ]);

      const exportData = {
        products,
        categories,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      // Crear y descargar archivo JSON
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ecommerce-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return exportData;
    } catch (error) {
      console.error('Error exportando datos:', error);
      return null;
    }
  }

  // Limpiar todos los datos de Supabase (para testing)
  static async clearSupabaseData(): Promise<boolean> {
    try {
      console.log('⚠️ Iniciando limpieza de datos...');
      
      // Obtener todos los datos
      const [products, categories] = await Promise.all([
        ProductsService.getAll(),
        CategoriesService.getAll()
      ]);

      // Eliminar productos y categorías en paralelo
      await Promise.all([
        Promise.all(products.map(product => ProductsService.delete(product.id))),
        Promise.all(categories.map(category => CategoriesService.delete(category.id)))
      ]);

      console.log('✅ Datos limpiados correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error limpiando datos:', error);
      return false;
    }
  }
}
