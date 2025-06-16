
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useNegocioActivo } from "@/hooks/useNegocioActivo";
import { supabase } from "@/lib/supabase";
import { Loader2, Search, Plus, Eye, Calendar, User, Package, DollarSign } from "lucide-react";
import { logger } from "@/lib/logger";
import { useNavigate } from "react-router-dom";
import OrderStatusBadge from "@/admin/components/OrderStatusBadge";
import { OrdenWithRelations, OrderItem, Cliente } from "@/admin/types/order";

interface AdminOrdenesProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function AdminOrdenes({ searchQuery, setSearchQuery }: AdminOrdenesProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { negocioActivo } = useNegocioActivo(user?.id || null);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [ordenes, setOrdenes] = useState<OrdenWithRelations[]>([]);

  useEffect(() => {
    if (negocioActivo?.id) {
      fetchOrdenes();
    }
  }, [negocioActivo?.id]);

  const fetchOrdenes = async () => {
    if (!negocioActivo?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ordenes')
        .select(`
          *,
          clientes(*)
        `)
        .eq('negocio_id', negocioActivo.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      logger.log('Orders fetched from ordenes table:', data);
      setOrdenes((data || []) as OrdenWithRelations[]);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las órdenes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredOrdenes = ordenes.filter((orden) => {
    const query = searchQuery.toLowerCase();
    const cliente = orden.clientes as Cliente | undefined;
    return (
      orden.num_pedido?.toLowerCase().includes(query) ||
      (cliente?.nombre?.toLowerCase().includes(query)) ||
      (cliente?.apellido?.toLowerCase().includes(query)) ||
      orden.estado?.toLowerCase().includes(query)
    );
  });

  const handleOrderClick = (orderId: string) => {
    navigate(`/admin/ordenes/${orderId}`);
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(numPrice || 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalItems = (items: OrderItem[] | string | undefined) => {
    if (!items) return 0;
    try {
      const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
      if (Array.isArray(parsedItems)) {
        return parsedItems.reduce((sum, item) => {
          const quantity = item.quantity || item.cantidad || 1;
          return sum + (typeof quantity === 'number' ? quantity : 1);
        }, 0);
      }
    } catch (e) {
      console.error('Error parsing items:', e);
    }
    return 0;
  };

  const getProductCount = (items: OrderItem[] | string | undefined) => {
    if (!items) return 0;
    try {
      const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
      if (Array.isArray(parsedItems)) {
        return parsedItems.length;
      }
    } catch (e) {
      console.error('Error parsing items:', e);
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Órdenes</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Gestiona las órdenes de tu negocio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              {filteredOrdenes.length} órdenes
            </Badge>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por número, cliente o estado..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="space-y-4">
        {filteredOrdenes.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted/50 p-4 mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">No hay órdenes</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                {searchQuery
                  ? "No se encontraron órdenes que coincidan con tu búsqueda."
                  : "Aún no tienes órdenes registradas."}
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Limpiar búsqueda
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredOrdenes.map((orden) => {
              const cliente = orden.clientes as Cliente | undefined;
              
              return (
                <Card 
                  key={orden.id} 
                  className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/20 bg-card"
                  onClick={() => handleOrderClick(orden.id)}
                >
                  <CardContent className="p-4 md:p-6">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold text-foreground">
                            Orden #{orden.num_pedido}
                          </h3>
                          <OrderStatusBadge status={orden.estado || 'pendiente'} type="order" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>
                            {cliente ? `${cliente.nombre} ${cliente.apellido}` : "Cliente no disponible"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(orden.fecha_creacion || orden.created_at)}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderClick(orden.id);
                          }}
                          className="bg-background hover:bg-muted transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalle
                        </Button>
                      </div>
                    </div>
                    
                    {/* Order Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-muted/30 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                          <Package className="h-3 w-3" />
                          <span className="text-xs font-medium">Items</span>
                        </div>
                        <p className="font-semibold text-foreground">{getTotalItems(orden.items)}</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                          <Package className="h-3 w-3" />
                          <span className="text-xs font-medium">Productos</span>
                        </div>
                        <p className="font-semibold text-foreground">{getProductCount(orden.items)}</p>
                      </div>
                      <div className="col-span-2 bg-muted/30 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="text-xs font-medium">Total</span>
                        </div>
                        <p className="font-bold text-lg text-green-600">{formatPrice(orden.total)}</p>
                      </div>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-medium">Pago:</span>
                        <OrderStatusBadge status={orden.estado_pago || 'pendiente'} type="payment" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-medium">Entrega:</span>
                        <OrderStatusBadge status={orden.estado_entrega || 'pendiente'} type="delivery" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
