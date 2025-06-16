
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useNegocioActivo } from "@/hooks/useNegocioActivo";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";
import InlineStatusSelector from "@/admin/components/InlineStatusSelector";
import { logger } from "@/lib/logger";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { OrdenWithRelations, OrderItem, Cliente } from "@/admin/types/order";

export default function AdminOrdenDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { negocioActivo } = useNegocioActivo(user?.id || null);
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrdenWithRelations | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (negocioActivo?.id && id) {
      fetchOrder();
    }
  }, [negocioActivo?.id, id]);

  // Add real-time subscription for status updates using num_pedido
  useEffect(() => {
    if (!negocioActivo?.id || !order?.num_pedido) return;

    logger.log('Setting up real-time subscription for order num_pedido:', order.num_pedido);

    const channel = supabase
      .channel('order-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ordenes',
          filter: `negocio_id=eq.${negocioActivo.id}`
        },
        (payload) => {
          logger.log('Real-time update received:', payload);
          
          // Check if this update affects our current order by num_pedido
          if (payload.new && payload.new.num_pedido === order.num_pedido) {
            logger.log('Update affects current order, refreshing...');
            fetchOrder();
          }
        }
      )
      .subscribe();

    return () => {
      logger.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [negocioActivo?.id, order?.num_pedido]);

  const fetchOrder = async () => {
    if (!negocioActivo?.id || !id) return;
    
    setLoading(true);
    try {
      logger.log('Fetching order with ID:', id);
      
      // Fetch order from ordenes table by ID using maybeSingle() to handle no results
      const { data, error } = await supabase
        .from('ordenes')
        .select(`
          *,
          clientes(*)
        `)
        .eq('negocio_id', negocioActivo.id)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching order:', error);
        throw error;
      }

      if (data) {
        logger.log('Order data loaded:', data);
        setOrder(data as OrdenWithRelations);
      } else {
        logger.log('No order found with ID:', id);
        toast({
          title: "Orden no encontrada",
          description: "La orden solicitada no existe o ha sido eliminada.",
          variant: "destructive",
        });
        navigate('/admin/ordenes');
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la orden. Verifica que la orden existe.",
        variant: "destructive",
      });
      // Navigate back to orders list on error
      navigate('/admin/ordenes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!order) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('ordenes')
        .delete()
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: "Orden eliminada",
        description: "La orden ha sido eliminada correctamente.",
      });

      navigate('/admin/ordenes');
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la orden.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Updated handleStatusChange to refresh data immediately
  const handleStatusChange = async () => {
    logger.log('Status changed, refreshing order data...');
    await fetchOrder();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p>Orden no encontrada</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/ordenes')}
          className="mt-4"
        >
          Volver a Órdenes
        </Button>
      </div>
    );
  }

  // Parse items for display
  let parsedItems: OrderItem[] = [];
  let totalAmount = 0;
  let totalItems = 0;

  if (order.items) {
    try {
      parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      if (Array.isArray(parsedItems)) {
        totalItems = parsedItems.reduce((sum: number, item: OrderItem) => {
          const quantity = item.quantity || item.cantidad || 0;
          return sum + (typeof quantity === 'number' ? quantity : 0);
        }, 0);
      }
    } catch (e) {
      console.error('Error parsing items:', e);
      parsedItems = [];
    }
  }

  // Calculate total from order.total or items
  if (order.total) {
    totalAmount = parseFloat(order.total);
  } else if (Array.isArray(parsedItems)) {
    totalAmount = parsedItems.reduce((sum: number, item: OrderItem) => {
      const price = item.price || item.precio || 0;
      const quantity = item.quantity || item.cantidad || 1;
      const itemPrice = typeof price === 'number' ? price : 0;
      const itemQuantity = typeof quantity === 'number' ? quantity : 1;
      return sum + (itemPrice * itemQuantity);
    }, 0);
  }

  const cliente = order.clientes as Cliente | undefined;

  return (
    <div className="space-y-6 px-1 md:px-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/ordenes')} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Orden #{order.num_pedido}</h1>
            <p className="text-sm text-muted-foreground">{formatDate(order.fecha_creacion || order.created_at)}</p>
          </div>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={deleting} className="self-end sm:self-auto">
              {deleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Eliminar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="mx-4 md:mx-0">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar orden?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente la orden #{order.num_pedido}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Estados y Cliente */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estados Section - Improved */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                Estados de la Orden
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                    <label className="text-sm font-medium text-foreground">Estado de Orden</label>
                  </div>
                  <InlineStatusSelector
                    status={order.estado || 'pendiente'}
                    type="order"
                    orderNumPedido={order.num_pedido}
                    negocioId={negocioActivo?.id || ''}
                    onStatusChange={handleStatusChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <label className="text-sm font-medium text-foreground">Estado de Pago</label>
                  </div>
                  <InlineStatusSelector
                    status={order.estado_pago || 'pendiente'}
                    type="payment"
                    orderNumPedido={order.num_pedido}
                    negocioId={negocioActivo?.id || ''}
                    onStatusChange={handleStatusChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                    <label className="text-sm font-medium text-foreground">Estado de Entrega</label>
                  </div>
                  <InlineStatusSelector
                    status={order.estado_entrega || 'pendiente'}
                    type="delivery"
                    orderNumPedido={order.num_pedido}
                    negocioId={negocioActivo?.id || ''}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cliente Section */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium text-foreground">
                    {cliente ? `${cliente.nombre} ${cliente.apellido}` : "Cliente no disponible"}
                  </p>
                </div>
                {cliente?.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm break-all text-foreground">{cliente.email}</p>
                  </div>
                )}
                {cliente?.telefono && (
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="text-sm text-foreground">{cliente.telefono}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Resumen */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Resumen de Orden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Total de Items:</span>
                  <span className="font-medium text-foreground">{totalItems}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Productos únicos:</span>
                  <span className="font-medium text-foreground">{Array.isArray(parsedItems) ? parsedItems.length : 0}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-semibold text-foreground">Total:</span>
                  <span className="text-xl font-bold text-green-600">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Artículos Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Artículos de la Orden</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.isArray(parsedItems) && parsedItems.length > 0 ? (
              parsedItems.map((item: OrderItem, index: number) => {
                const itemPrice = item.price || item.precio || 0;
                const itemQuantity = item.quantity || item.cantidad || 1;
                const itemName = item.name || item.producto || `Producto ${index + 1}`;
                const safePrice = typeof itemPrice === 'number' ? itemPrice : 0;
                const safeQuantity = typeof itemQuantity === 'number' ? itemQuantity : 1;
                
                return (
                  <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-muted/20 rounded-lg border border-border/50">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {String(itemName)}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Cantidad: {safeQuantity}
                      </p>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className="font-semibold text-foreground">{formatPrice(safePrice * safeQuantity)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(safePrice)} c/u
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay artículos disponibles</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
