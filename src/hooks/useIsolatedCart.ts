
import { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { useDynamicBusinessId } from '../contexts/DynamicBusinessIdContext';
import { logger } from '../utils/logger';

/**
 * Hook para manejo aislado de carrito por negocio/subdominio
 * Garantiza que cada instancia de tienda tenga su propio carrito independiente
 */
export const useIsolatedCart = () => {
  const { businessId, subdomain } = useDynamicBusinessId();
  const [items, setItems] = useState<CartItem[]>([]);

  // Generar clave única para el carrito basada en negocio y subdominio
  const getStorageKey = () => {
    if (subdomain && businessId) {
      return `isolated-cart-${subdomain}-${businessId}`;
    } else if (businessId) {
      return `isolated-cart-business-${businessId}`;
    } else if (subdomain) {
      return `isolated-cart-subdomain-${subdomain}`;
    }
    return 'isolated-cart-default';
  };

  // Cargar carrito específico al cambiar de negocio/subdominio
  useEffect(() => {
    const storageKey = getStorageKey();
    
    try {
      const savedItems = localStorage.getItem(storageKey);
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems) as CartItem[];
        setItems(parsedItems);
        logger.info('🛒 Loaded isolated cart:', { 
          storageKey, 
          itemCount: parsedItems.length,
          businessId,
          subdomain 
        });
      } else {
        setItems([]);
        logger.info('🛒 New isolated cart initialized:', { 
          storageKey, 
          businessId,
          subdomain 
        });
      }
    } catch (error) {
      logger.error('🛒 Error loading isolated cart:', error);
      setItems([]);
    }
  }, [businessId, subdomain]);

  // Guardar carrito cuando cambian los items
  useEffect(() => {
    const storageKey = getStorageKey();
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
      logger.debug('🛒 Saved isolated cart:', { 
        storageKey, 
        itemCount: items.length,
        businessId,
        subdomain 
      });
    } catch (error) {
      logger.error('🛒 Error saving isolated cart:', error);
    }
  }, [items, businessId, subdomain]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...currentItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    storageKey: getStorageKey(),
    businessId,
    subdomain
  };
};
