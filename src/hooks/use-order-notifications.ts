
import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useNotifications } from '@/hooks/use-notifications';
import { useAuth } from '@/hooks/use-auth';
import { useNegocioActivo } from '@/hooks/useNegocioActivo';
import { logger } from '@/lib/logger';

export function useOrderNotifications() {
  const { sendNotification } = useNotifications();
  const { user } = useAuth();
  const { negocioActivo } = useNegocioActivo(user?.id || null);

  // Keep track of orders we've already notified about
  const notifiedOrdersRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!negocioActivo?.id) return;

    logger.log('Setting up real-time order notifications for business:', negocioActivo.id);

    // Subscribe to real-time changes in items table
    const channel = supabase
      .channel('order-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'items',
          filter: `negocio_id=eq.${negocioActivo.id}`
        },
        async (payload) => {
          logger.log('New order detected:', payload);

          const orderNumber = payload.new.num_pedido as string | null;
          if (orderNumber && notifiedOrdersRef.current.has(orderNumber)) {
            // Skip if we've already sent a notification for this order
            return;
          }
          
          try {
            // Get client and product information for the notification
            const [clienteResponse, productoResponse] = await Promise.all([
              supabase
                .from('clientes')
                .select('nombre, apellido')
                .eq('id', payload.new.cliente_id)
                .single(),
              supabase
                .from('productos')
                .select('nombre')
                .eq('id', payload.new.producto_id)
                .single()
            ]);

            const cliente = clienteResponse.data;
            const producto = productoResponse.data;
            
            const clienteName = cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente';
            const productName = producto?.nombre || 'Producto';
            
            const formatPrice = (price: number) => {
              return new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN',
              }).format(price);
            };

            // Send PWA notification
            sendNotification('Nueva Orden Recibida', {
              body: `${clienteName} ordenó ${productName} - Orden #${payload.new.num_pedido} por ${formatPrice(payload.new.total || 0)}`,
              icon: '/pwa-192x192.png',
              badge: '/pwa-192x192.png',
              tag: `order-${payload.new.num_pedido}`,
              data: {
                orderNumber: payload.new.num_pedido,
                clienteName: clienteName,
                productName: productName,
                total: payload.new.total
              }
            });

            if (orderNumber) {
              notifiedOrdersRef.current.add(orderNumber);
            }

          } catch (error) {
            console.error('Error processing order notification:', error);
            
            // Fallback notification without details
            sendNotification('Nueva Orden Recibida', {
              body: `Nueva orden #${payload.new.num_pedido} recibida`,
              icon: '/pwa-192x192.png',
              badge: '/pwa-192x192.png',
              tag: `order-${payload.new.num_pedido}`
            });

            if (orderNumber) {
              notifiedOrdersRef.current.add(orderNumber);
            }
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      logger.log('Cleaning up order notification subscription');
      supabase.removeChannel(channel);
    };
  }, [negocioActivo?.id, sendNotification]);
}
