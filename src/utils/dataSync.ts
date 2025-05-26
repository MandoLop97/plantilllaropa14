
import { products as localProducts } from '../data/products';
import { categories as localCategories } from '../data/categories';
import { ProductsService, CategoriesService } from '../services';

// Utilidad para sincronizar datos locales con Supabase
export class DataSync {
  // Sincronizar productos locales a Supabase
  static async syncProductsToSupabase(): Promise<{ success: number; errors: number }> {
    let success = 0;
    let errors = 0;

    console.log('Iniciando sincronización de productos...');

    for (const product of localProducts) {
      try {
        await ProductsService.create(product);
        success++;
        console.log(`✅ Producto sincronizado: ${product.name}`);
      } catch (error) {
        console.error(`❌ Error sincronizando producto ${product.name}:`, error);
        errors++;
      }
    }

    console.log(`Sincronización completada: ${success} éxitos, ${errors} errores`);
    return { success, errors };
  }

  // Sincronizar categorías locales a Supabase
  static async syncCategoriesToSupabase(): Promise<{ success: number; errors: number }> {
    let success = 0;
    let errors = 0;

    console.log('Iniciando sincronización de categorías...');

    for (const category of localCategories) {
      try {
        await CategoriesService.create({
          name: category.name,
          icon: category.icon
        });
        success++;
        console.log(`✅ Categoría sincronizada: ${category.name}`);
      } catch (error) {
        console.error(`❌ Error sincronizando categoría ${category.name}:`, error);
        errors++;
      }
    }

    console.log(`Sincronización completada: ${success} éxitos, ${errors} errores`);
    return { success, errors };
  }

  // Exportar datos de Supabase a JSON
  static async exportData(): Promise<{ products: any[]; categories: any[] } | null> {
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

      // Eliminar productos
      for (const product of products) {
        await ProductsService.delete(product.id);
      }

      // Eliminar categorías
      for (const category of categories) {
        await CategoriesService.delete(category.id);
      }

      console.log('✅ Datos limpiados correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error limpiando datos:', error);
      return false;
    }
  }
}
