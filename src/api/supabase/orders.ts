
import { supabase } from './client';
import { CartItem } from '../../types';
import { logger } from '../../utils/logger';

export class OrdersService {
  static async generateOrderNumber(businessId: string): Promise<number> {
    try {
      logger.info('Generating order number for business:', { businessId });
      
      const { data, error } = await (supabase as any).rpc('generate_order_number', {
        business_id: businessId
      });

      if (error) {
        logger.error('Error generating order number:', { error, businessId });
        throw error;
      }
      
      logger.info('Order number generated successfully:', { data });
      return data;
    } catch (error) {
      logger.error('Error in generateOrderNumber:', { error, businessId });
      throw error;
    }
  }

  static async createOrder(orderData: any) {
    try {
      logger.info('Attempting to create order:', { orderData });
      
      const { data, error } = await supabase
        .from('ordenes' as any)
        .insert(orderData)
        .select()
        .single();

      if (error) {
        logger.error('Supabase error creating order:', { 
          error, 
          orderData,
          errorCode: error.code,
          errorMessage: error.message,
          errorDetails: error.details
        });
        throw error;
      }
      
      logger.info('Order created successfully:', { data });
      return data;
    } catch (error) {
      logger.error('Exception in createOrder:', { error, orderData });
      throw error;
    }
  }

  static async createOrderFromCart(
    clientId: string,
    businessId: string,
    cartItems: CartItem[],
    total: number
  ) {
    try {
      logger.info('Starting order creation from cart:', { clientId, businessId, cartItems, total });
      
      // Validar parámetros de entrada
      if (!clientId || !businessId || !cartItems || cartItems.length === 0) {
        throw new Error('Missing required parameters for order creation');
      }
      
      // Generar número de orden
      const orderNumber = await this.generateOrderNumber(businessId);
      logger.info('Generated order number:', { orderNumber });
      
      // Verificar que el order number sea válido
      if (!orderNumber || typeof orderNumber !== 'number') {
        throw new Error('Failed to generate valid order number');
      }
      
      // Crear una orden por cada producto en el carrito
      const orders = [];
      
      for (const item of cartItems) {
        if (!item.id || !item.quantity || !item.price) {
          logger.error('Invalid cart item:', { item });
          throw new Error('Invalid cart item data');
        }
        
        const orderData = {
          num_pedido: orderNumber.toString(),
          cliente_id: clientId,
          negocio_id: businessId,
          producto_id: item.id,
          Cantidad: item.quantity,
          Monto: item.price * item.quantity,
          total: total,
          estado: 'pendiente',
          Estatus: 'Pendiente'
        };
        
        logger.info('Creating individual order:', { orderData });
        const order = await this.createOrder(orderData);
        orders.push(order);
        logger.info('Individual order created:', { orderId: order.id });
      }
      
      logger.info('All orders created successfully:', { orders, orderNumber, totalOrders: orders.length });
      return { orders, orderNumber };
    } catch (error) {
      logger.error('Error creating order from cart:', { 
        error, 
        clientId, 
        businessId, 
        cartItems, 
        total,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
}
