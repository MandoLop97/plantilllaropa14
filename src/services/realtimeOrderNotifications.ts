
import { supabase } from '../api/supabase/client';
import { OrdersService } from '../api/supabase/orders';
import { logger } from '../utils/logger';

export class RealtimeOrderNotifications {
  private channel: any = null;
  private processedOrders: Set<string> = new Set();

  private markOrderProcessed(orderNumber: string) {
    this.processedOrders.add(orderNumber);
    // Remove the order from the cache after one hour to avoid memory leaks
    setTimeout(() => this.processedOrders.delete(orderNumber), 60 * 60 * 1000);
  }

  start() {
    if (this.channel) {
      logger.info('Realtime order notifications already started');
      return;
    }

    logger.info('Starting realtime order notifications...');

    this.channel = supabase
      .channel('on-new-order')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'items',
        },
        async (payload) => {
          try {
            logger.info('Nueva orden detectada via realtime:', { payload });

            const orderData = payload.new;
            logger.info('Datos de la orden:', { orderData });

            const orderNumber = orderData.num_pedido as string;
            if (this.processedOrders.has(orderNumber)) {
              logger.info('Orden ya notificada, ignorando evento duplicado', {
                orderNumber
              });
              return;
            }

            if (orderData.notificado) {
              logger.info('Orden ya marcada como notificada en base de datos', {
                orderNumber
              });
              return;
            }

            this.markOrderProcessed(orderNumber);

            // Llamar al webhook de N8n
            const webhookUrl = 'https://mandon8n.mextv.fun/webhook-test/sendPush';
            logger.info('Enviando notificación al webhook:', { webhookUrl });

            const response = await fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                event: 'new_order',
                order_id: orderData.id,
                num_pedido: orderData.num_pedido,
                cliente_id: orderData.cliente_id,
                negocio_id: orderData.negocio_id,
                producto_id: orderData.producto_id,
                cantidad: orderData.Cantidad,
                monto: orderData.Monto,
                total: orderData.total,
                estado: orderData.estado,
                timestamp: new Date().toISOString(),
                record: orderData
              }),
            });

            if (response.ok) {
              logger.info('Notificación enviada exitosamente al webhook N8n', {
                status: response.status,
                statusText: response.statusText
              });
              await OrdersService.updateOrderNotificadoStatus(orderData.id);
            } else {
              logger.error('Error al enviar notificación al webhook N8n', {
                status: response.status,
                statusText: response.statusText,
                responseText: await response.text()
              });
            }
          } catch (error) {
            logger.error('Error procesando nueva orden en realtime:', { 
              error: error instanceof Error ? error.message : 'Unknown error',
              payload 
            });
          }
        }
      )
      .subscribe((status) => {
        logger.info('Estado de suscripción realtime:', { status });
        if (status === 'SUBSCRIBED') {
          logger.info('✅ Escuchando nuevas órdenes en tiempo real');
        } else if (status === 'CHANNEL_ERROR') {
          logger.error('❌ Error en el canal de tiempo real');
        } else if (status === 'TIMED_OUT') {
          logger.error('⏰ Timeout en conexión de tiempo real');
        } else if (status === 'CLOSED') {
          logger.info('🔌 Canal de tiempo real cerrado');
        }
      });
  }

  stop() {
    if (this.channel) {
      logger.info('Stopping realtime order notifications...');
      supabase.removeChannel(this.channel);
      this.channel = null;
      logger.info('✅ Realtime order notifications stopped');
    }
  }

  getStatus() {
    return this.channel ? 'active' : 'inactive';
  }
}

// Instancia singleton para usar en toda la aplicación
export const realtimeOrderNotifications = new RealtimeOrderNotifications();
