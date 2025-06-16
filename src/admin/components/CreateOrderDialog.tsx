
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/use-notifications';
import { Cliente, Producto } from '@/lib/supabase';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  negocioId: string;
  onSuccess: () => void;
}

interface OrderItem {
  producto_id: string;
  cantidad: number;
  precio: number;
}

export default function CreateOrderDialog({ 
  open, 
  onOpenChange, 
  negocioId, 
  onSuccess 
}: CreateOrderDialogProps) {
  const { toast } = useToast();
  const { sendNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const [selectedCliente, setSelectedCliente] = useState('');
  const [items, setItems] = useState<OrderItem[]>([
    { producto_id: '', cantidad: 1, precio: 0 }
  ]);

  useEffect(() => {
    if (open && negocioId) {
      fetchData();
    }
  }, [open, negocioId]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [clientesRes, productosRes] = await Promise.all([
        supabase
          .from('clientes')
          .select('*')
          .eq('negocio_id', negocioId)
          .order('nombre'),
        supabase
          .from('productos')
          .select('*')
          .eq('negocio_id', negocioId)
          .eq('disponible', true)
          .order('nombre')
      ]);

      if (clientesRes.error) throw clientesRes.error;
      if (productosRes.error) throw productosRes.error;

      setClientes(clientesRes.data || []);
      setProductos(productosRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const addItem = () => {
    setItems([...items, { producto_id: '', cantidad: 1, precio: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items];
    if (field === 'producto_id' && typeof value === 'string') {
      const producto = productos.find(p => p.id === value);
      newItems[index] = {
        ...newItems[index],
        producto_id: value,
        precio: producto?.precio || 0
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.cantidad * item.precio);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!selectedCliente) {
      toast({
        title: "Error",
        description: "Selecciona un cliente.",
        variant: "destructive",
      });
      return;
    }

    const validItems = items.filter(item => item.producto_id && item.cantidad > 0);
    if (validItems.length === 0) {
      toast({
        title: "Error",
        description: "Agrega al menos un producto.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Generate order number
      const { data: orderNumberData, error: orderNumberError } = await supabase
        .rpc('generate_order_number', { business_id: negocioId });

      if (orderNumberError) throw orderNumberError;

      const numPedido = orderNumberData?.toString() || Date.now().toString();

      // Get client info for notification
      const cliente = clientes.find(c => c.id === selectedCliente);
      const clienteName = cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente';

      // Create orders for each item
      const ordersToCreate = validItems.map(item => ({
        negocio_id: negocioId,
        cliente_id: selectedCliente,
        producto_id: item.producto_id,
        num_pedido: numPedido,
        Cantidad: item.cantidad,
        Monto: item.precio,
        total: item.cantidad * item.precio,
        estado: 'pendiente',
        fecha_pedido: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('items')
        .insert(ordersToCreate);

      if (error) throw error;

      // Send PWA notification
      sendNotification('Nueva Orden Creada', {
        body: `Orden #${numPedido} de ${clienteName} por ${formatPrice(calculateTotal())}`,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: `order-${numPedido}`,
        data: {
          orderNumber: numPedido,
          clienteName: clienteName,
          total: calculateTotal()
        }
      });

      toast({
        title: "Éxito",
        description: `Orden #${numPedido} creada correctamente.`,
      });

      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setSelectedCliente('');
      setItems([{ producto_id: '', cantidad: 1, precio: 0 }]);
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la orden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Orden</DialogTitle>
        </DialogHeader>

        {loadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cliente Selection */}
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select value={selectedCliente} onValueChange={setSelectedCliente}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre} {cliente.apellido}
                      {cliente.telefono && ` - ${cliente.telefono}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-medium">Productos</Label>
                <Button onClick={addItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border rounded-lg">
                    <div className="md:col-span-2">
                      <Label className="text-sm">Producto</Label>
                      <Select 
                        value={item.producto_id} 
                        onValueChange={(value) => updateItem(index, 'producto_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {productos.map((producto) => (
                            <SelectItem key={producto.id} value={producto.id}>
                              {producto.nombre} - {formatPrice(producto.precio)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm">Cantidad</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => updateItem(index, 'cantidad', parseInt(e.target.value) || 1)}
                      />
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label className="text-sm">Subtotal</Label>
                        <div className="h-10 flex items-center px-3 bg-gray-50 border rounded-md text-sm">
                          {formatPrice(item.cantidad * item.precio)}
                        </div>
                      </div>
                      {items.length > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeItem(index)}
                          className="h-10 w-10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="text-right">
                  <Label className="text-lg font-medium">Total: {formatPrice(calculateTotal())}</Label>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading || loadingData}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Crear Orden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
