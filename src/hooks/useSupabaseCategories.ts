
import { useState, useEffect } from 'react';
import { CategoriesService } from '../services';
import { Category } from '../types';

export const useSupabaseCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await CategoriesService.getAll();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Error al cargar las categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const createCategory = async (category: { name: string; icon?: string }) => {
    try {
      const newCategory = await CategoriesService.create({
        name: category.name,
        icon: category.icon
      });
      
      if (newCategory) {
        setCategories(prev => [...prev, newCategory]);
        return newCategory;
      }
    } catch (err) {
      console.error('Error creating category:', err);
      setError('Error al crear la categoría');
    }
    return null;
  };

  const updateCategory = async (id: string, updates: { name?: string; icon?: string }) => {
    try {
      const updatedCategory = await CategoriesService.update(id, {
        name: updates.name,
        icon: updates.icon
      });
      
      if (updatedCategory) {
        setCategories(prev => prev.map(c => c.id === id ? updatedCategory : c));
        return updatedCategory;
      }
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Error al actualizar la categoría');
    }
    return null;
  };

  const deleteCategory = async (id: string) => {
    try {
      const success = await CategoriesService.delete(id);
      if (success) {
        setCategories(prev => prev.filter(c => c.id !== id));
        return true;
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Error al eliminar la categoría');
    }
    return false;
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: () => {
      const fetchCategories = async () => {
        setLoading(true);
        const data = await CategoriesService.getAll();
        setCategories(data);
        setLoading(false);
      };
      fetchCategories();
    }
  };
};
