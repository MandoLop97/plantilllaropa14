
import { supabase } from './client';
import { CartItem } from '../../types';
import { logger } from '../../utils/logger';

export class OrdersService {
  static async generateOrderNumber(businessId: string): Promise<number> {
    try {
      logger.info('🔢 Generating order number for business:', { businessId });

      // Query the ordenes table which exists in the database
      const { data, error } = await (supabase as any)
        .from('ordenes')
        .select('num_pedido')
        .eq('negocio_id', businessId)
        .order('num_pedido', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        logger.error('Error fetching last order number:', { error, businessId });
        throw error;
      }

      const lastNumber = data?.num_pedido ? parseInt(data.num_pedido, 10) : 0;
      const newNumber = lastNumber + 1;

      logger.info('🔢 Order number generated successfully:', { 
        newNumber, 
        businessId,
        lastNumber 
      });
      return newNumber;
    } catch (error) {
      logger.error('Error in generateOrderNumber:', { error, businessId });
      throw error;
    }
  }

  static async createOrder(orderData: any) {
    try {
      logger.info('📝 Creating individual order item:', { orderData });

      // Validar que el orderData tenga negocio_id
      if (!orderData.negocio_id) {
        throw new Error('Missing negocio_id in order data');
      }

      const { data, error } = await (supabase as any)
        .from('items')
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
      
      logger.info('📝 Order created successfully:', { data });
      return data;
    } catch (error) {
      logger.error('Exception in createOrder:', { error, orderData });
      throw error;
    }
  }

  static async createOrderInOrdenesTable(orderData: {
    num_pedido: number;
    negocio_id: string;
    cliente_id: string;
    items: CartItem[];
    total: number;
    subdomain?: string;
  }) {
    try {
      logger.info('📦 Creating order in ordenes table:', { 
        orderData: {
          ...orderData,
          itemsCount: orderData.items.length
        }
      });

      // Validar datos requeridos
      if (!orderData.negocio_id) {
        throw new Error('Missing negocio_id for order');
      }

      if (!orderData.cliente_id) {
        throw new Error('Missing cliente_id for order');
      }

      // Preparar los datos JSONB de los items con información del negocio
      const itemsJsonb = orderData.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        image: item.image,
        total: item.price * item.quantity,
        businessId: orderData.negocio_id, // Asociar explícitamente al negocio
        subdomain: orderData.subdomain || null
      }));

      const ordenData = {
        num_pedido: String(orderData.num_pedido),
        negocio_id: orderData.negocio_id,
        cliente_id: orderData.cliente_id,
        items: itemsJsonb,
        total: String(orderData.total),
        notificado: false,
        estado: 'pendiente',
        fecha_creacion: new Date().toISOString()
      };

      const { data, error } = await (supabase as any)
        .from('ordenes')
        .insert(ordenData)
        .select()
        .single();

      if (error) {
        logger.error('Error creating order in ordenes table:', { error, ordenData });
        throw error;
      }

      logger.info('📦 Order created successfully in ordenes table:', { 
        data,
        businessId: orderData.negocio_id,
        subdomain: orderData.subdomain
      });
      return data;
    } catch (error) {
      logger.error('Exception in createOrderInOrdenesTable:', { error, orderData });
      throw error;
    }
  }

  static async createOrderFromCart(orderData: {
    num_orden: number;
    negocio_id: string;
    cliente_id: string;
    items: CartItem[];
    subdomain?: string;
  }) {
    try {
      logger.info('🛒 Creating isolated order from cart:', { 
        orderData: {
          ...orderData,
          itemsCount: orderData.items.length
        }
      });

      // Validaciones estrictas para aislamiento
      if (!orderData.cliente_id || !orderData.negocio_id || !orderData.items || orderData.items.length === 0) {
        throw new Error('Missing required parameters for isolated order creation');
      }

      // Verificar que todos los items pertenezcan al mismo negocio o no tengan businessId definido
      const businessItems = orderData.items.filter(item => 
        !item.businessId || item.businessId === orderData.negocio_id
      );

      if (businessItems.length !== orderData.items.length) {
        logger.warn('🚨 Some items filtered out due to business mismatch:', {
          totalItems: orderData.items.length,
          validItems: businessItems.length,
          businessId: orderData.negocio_id
        });
      }

      const totalOrder = businessItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Crear orden en la tabla ordenes con información del negocio
      const ordenCreated = await this.createOrderInOrdenesTable({
        num_pedido: orderData.num_orden,
        negocio_id: orderData.negocio_id,
        cliente_id: orderData.cliente_id,
        items: businessItems,
        total: totalOrder,
        subdomain: orderData.subdomain
      });

      // Crear items individuales en la tabla items (manteniendo funcionalidad existente)
      const orderPromises = businessItems.map(item => {
        const itemRow = {
          num_pedido: String(orderData.num_orden),
          negocio_id: orderData.negocio_id,
          cliente_id: orderData.cliente_id,
          producto_id: item.id,
          Cantidad: item.quantity,
          Monto: item.price,
          total: item.price * item.quantity,
          estado: 'pendiente',
          notificado: false
        };
        return this.createOrder(itemRow);
      });

      const orders = await Promise.all(orderPromises);

      logger.info('✅ Isolated order created successfully:', {
        orderCount: orders.length,
        num_pedido: orderData.num_orden,
        total: totalOrder,
        ordenId: ordenCreated.id,
        businessId: orderData.negocio_id,
        subdomain: orderData.subdomain
      });

      return { orders, orden: ordenCreated };
    } catch (error) {
      logger.error('❌ Error creating isolated order from cart:', {
        error,
        orderData,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  // Marca una orden como notificada para evitar envíos duplicados
  static async updateOrderNotificadoStatus(orderId: string) {
    try {
      const { error } = await (supabase as any)
        .from('ordenes')
        .update({ notificado: true, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) {
        logger.error('Error updating order notificado status:', { error, orderId });
      } else {
        logger.info('📧 Order marked as notified:', { orderId });
      }
    } catch (error) {
      logger.error('Exception in updateOrderNotificadoStatus:', { error, orderId });
    }
  }

  // Método para obtener órdenes por negocio (útil para admin)
  static async getOrdersByBusiness(businessId: string) {
    try {
      const { data, error } = await (supabase as any)
        .from('ordenes')
        .select('*')
        .eq('negocio_id', businessId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching orders by business:', { error, businessId });
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('Exception in getOrdersByBusiness:', { error, businessId });
      throw error;
    }
  }
}
