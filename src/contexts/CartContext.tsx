
import React, { createContext, useContext, ReactNode } from 'react';
import { CartItem, CartContextType } from '../types';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { useDynamicBusinessId } from './DynamicBusinessIdContext';
import { logger } from '../utils/logger';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { businessId, subdomain } = useDynamicBusinessId();
  
  // Crear una clave única que combine businessId y subdomain para máximo aislamiento
  const getCartKey = () => {
    if (subdomain && businessId) {
      return `cart-${subdomain}-${businessId}`;
    } else if (businessId) {
      return `cart-business-${businessId}`;
    } else if (subdomain) {
      return `cart-subdomain-${subdomain}`;
    }
    return 'cart-items-default';
  };

  const cartKey = getCartKey();
  
  // Log para debugging del aislamiento del carrito
  logger.debug('🛒 Cart isolation key:', { 
    cartKey, 
    businessId, 
    subdomain,
    hostname: window.location.hostname 
  });
  
  const [items, setItems] = useSessionStorage<CartItem[]>(cartKey, []);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    logger.info('🛒 Adding item to cart:', { 
      item: newItem, 
      cartKey, 
      businessId,
      subdomain 
    });
    
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
    logger.info('🛒 Removing item from cart:', { 
      itemId: id, 
      cartKey, 
      businessId,
      subdomain 
    });
    
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    logger.info('🛒 Updating item quantity:', { 
      itemId: id, 
      quantity, 
      cartKey, 
      businessId,
      subdomain 
    });
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    logger.info('🛒 Clearing cart:', { 
      cartKey, 
      businessId,
      subdomain 
    });
    
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
