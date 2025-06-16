import { useAuth } from "@/hooks/use-auth";
import { useNegocioActivo } from "@/hooks/useNegocioActivo";
import { useUnifiedPushNotifications } from "@/hooks/use-unified-push-notifications";
import { usePlan } from "@/hooks/usePlan";
import { Navigate, useNavigate } from "react-router-dom";
import MinimalAdminLayout from "@/admin/components/MinimalAdminLayout";
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  Package, 
  Calendar, 
  TrendingUp,
  DollarSign,
  Bell,
  Loader2,
  Eye,
  Plus,
  List
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const { negocioActivo, isLoading: negociosLoading } = useNegocioActivo(user?.id || null);
  const { plan, loading: planLoading, isPro } = usePlan();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    isSubscribed, 
    isLoading: notificationLoading, 
    isSupported,
    activateNotifications
  } = useUnifiedPushNotifications(user?.id);

  const [stats, setStats] = useState({
    totalViews: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalServices: 0,
    totalClients: 0,
    totalSales: 0
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (negocioActivo?.id) {
      fetchStats();
      fetchRecentOrders();
      setupRealTimeOrders();
    }
  }, [negocioActivo?.id]);

  const fetchStats = async () => {
    if (!negocioActivo?.id) return;
    
    setLoadingStats(true);
    try {
      // Fetch views from the negocios table
      const { data: negocioData, error: negocioError } = await supabase
        .from('negocios')
        .select('vistas')
        .eq('id', negocioActivo.id)
        .single();

      if (negocioError) throw negocioError;

      const totalViews = negocioData?.vistas ? parseInt(negocioData.vistas) : 0;

      // Fetch other stats including sales
      const [ordersData, productsData, servicesData, clientsData, salesData] = await Promise.all([
        supabase.from('ordenes').select('id').eq('negocio_id', negocioActivo.id),
        supabase.from('productos').select('id').eq('negocio_id', negocioActivo.id),
        supabase.from('servicios').select('id').eq('negocio_id', negocioActivo.id),
        supabase.from('clientes').select('id').eq('negocio_id', negocioActivo.id),
        supabase.from('ordenes').select('total').eq('negocio_id', negocioActivo.id).eq('estado', 'completado')
      ]);

      // Calculate total sales
      const totalSales = salesData.data?.reduce((sum, order) => {
        return sum + (parseFloat(order.total) || 0);
      }, 0) || 0;

      setStats({
        totalViews,
        totalOrders: ordersData.data?.length || 0,
        totalProducts: productsData.data?.length || 0,
        totalServices: servicesData.data?.length || 0,
        totalClients: clientsData.data?.length || 0,
        totalSales
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas.",
        variant: "destructive",
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRecentOrders = async () => {
    if (!negocioActivo?.id) return;

    try {
      const { data, error } = await supabase
        .from('ordenes')
        .select(`
          *,
          clientes(*)
        `)
        .eq('negocio_id', negocioActivo.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    }
  };

  const setupRealTimeOrders = () => {
    if (!negocioActivo?.id) return;

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ordenes',
          filter: `negocio_id=eq.${negocioActivo.id}`
        },
        (payload) => {
          console.log('Order change detected:', payload);
          fetchRecentOrders();
          fetchStats(); // Update order count
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "¡Nueva orden!",
              description: `Orden #${payload.new.num_pedido} recibida`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (loading || negociosLoading || planLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  if (!negocioActivo && !negociosLoading) {
    return <Navigate to="/admin/negocios" />;
  }

  const handleNotificationActivation = async () => {
    if (!user?.id || !isSupported) return;
    
    console.log('Starting notification activation...');
    await activateNotifications();
  };

  const showNotificationButton = isSupported && !isSubscribed;

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return formatCurrency(numPrice || 0);
  };

  const formatOrderDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <MinimalAdminLayout>
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                <LayoutDashboard className="h-6 w-6 md:h-7 md:w-7" />
                Dashboard
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Resumen de tu negocio {negocioActivo?.nombre}
              </p>
            </div>
            
            {showNotificationButton && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleNotificationActivation}
                  disabled={notificationLoading}
                  className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-[pulse_2s_ease-in-out_infinite]"></div>
                  <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_1.5s_ease-in-out] transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex items-center gap-2">
                    {notificationLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Activando...
                      </>
                    ) : (
                      <>
                        <Bell className="h-4 w-4 animate-[bellRing_2s_ease-in-out_infinite]" />
                        <span className="font-semibold">¡Activar Notificaciones!</span>
                        <div className="ml-1 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                      </>
                    )}
                  </div>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid - Mobile: 2 columns, Desktop: 3x2 grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          <Card className="border-border/50 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Vistas
              </CardTitle>
              <div className="rounded-full bg-blue-100 p-2">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold text-foreground ${!isPro ? 'blur-sm' : ''}`}>
                {loadingStats ? "..." : stats.totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total
                {!isPro && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Pro
                  </span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Órdenes
              </CardTitle>
              <div className="rounded-full bg-green-100 p-2">
                <List className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loadingStats ? "..." : stats.totalOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clientes
              </CardTitle>
              <div className="rounded-full bg-blue-100 p-2">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loadingStats ? "..." : stats.totalClients}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Productos
              </CardTitle>
              <div className="rounded-full bg-purple-100 p-2">
                <Package className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loadingStats ? "..." : stats.totalProducts}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Servicios
              </CardTitle>
              <div className="rounded-full bg-orange-100 p-2">
                <Calendar className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loadingStats ? "..." : stats.totalServices}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ventas
              </CardTitle>
              <div className="rounded-full bg-emerald-100 p-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loadingStats ? "..." : formatPrice(stats.totalSales)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Completadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Orders */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Button
                  onClick={() => navigate('/admin/productos/nuevo')}
                  className="group relative overflow-hidden w-full h-auto p-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
                  variant="outline"
                >
                  <div className="flex items-center gap-4 p-6 w-full">
                    <div className="flex-shrink-0 rounded-xl bg-blue-500 p-3 group-hover:bg-blue-600 transition-colors duration-300">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <h4 className="font-semibold text-base text-blue-800 group-hover:text-blue-900 transition-colors duration-300">
                        Agregar Producto
                      </h4>
                      <p className="text-sm text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                        Añade nuevos productos a tu inventario
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -skew-x-12 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%] group-hover:transition-transform group-hover:duration-700"></div>
                </Button>

                <Button
                  onClick={() => navigate('/admin/servicios/nuevo')}
                  className="group relative overflow-hidden w-full h-auto p-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg"
                  variant="outline"
                >
                  <div className="flex items-center gap-4 p-6 w-full">
                    <div className="flex-shrink-0 rounded-xl bg-purple-500 p-3 group-hover:bg-purple-600 transition-colors duration-300">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <h4 className="font-semibold text-base text-purple-800 group-hover:text-purple-900 transition-colors duration-300">
                        Agregar Servicio
                      </h4>
                      <p className="text-sm text-purple-600 group-hover:text-purple-700 transition-colors duration-300">
                        Configura nuevos servicios
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -skew-x-12 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%] group-hover:transition-transform group-hover:duration-700"></div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders Card */}
          <Card className="border-border/50">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <List className="h-5 w-5" />
                Órdenes Recientes
                {orders.length > 0 && (
                  <Badge variant="outline" className="ml-auto">
                    {orders.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-muted/50 p-4 mb-4 w-fit mx-auto">
                      <List className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No hay órdenes recientes</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/ordenes/${order.id}`)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">
                            Orden #{order.num_pedido}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {order.estado || 'pendiente'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {order.clientes?.nombre} {order.clientes?.apellido} • {formatOrderDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-green-600">
                          {formatPrice(order.total || 0)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {orders.length > 0 && (
                <div className="pt-4 border-t border-border/50 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin/ordenes')}
                    className="w-full"
                  >
                    Ver todas las órdenes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Business Info */}
        <Card className="border-border/50">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Building className="h-5 w-5" />
              Información del Negocio
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {negocioActivo && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="px-3 py-1">
                    Activo
                  </Badge>
                  {plan && (
                    <Badge variant="outline" className={`px-3 py-1 ${
                      plan === 'Pro' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      plan === 'Basico' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      plan === 'Negocio' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      Plan {plan}
                    </Badge>
                  )}
                  {isSubscribed && (
                    <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200">
                      Notificaciones activas
                    </Badge>
                  )}
                  {(negocioActivo as any)?.subdominio && (
                    <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                      {(negocioActivo as any).subdominio}.gutix.site
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                  <p className="text-foreground font-medium">{negocioActivo.nombre}</p>
                </div>
                {negocioActivo.descripcion && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Descripción</p>
                    <p className="text-foreground">{negocioActivo.descripcion}</p>
                  </div>
                )}
                {negocioActivo.direccion && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                    <p className="text-foreground">{negocioActivo.direccion}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Custom CSS for animations */}
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-12deg); }
            100% { transform: translateX(200%) skewX(-12deg); }
          }
          
          @keyframes bellRing {
            0%, 100% { transform: rotate(0deg); }
            10%, 30%, 50%, 70% { transform: rotate(-10deg); }
            20%, 40%, 60% { transform: rotate(10deg); }
            80% { transform: rotate(-5deg); }
            90% { transform: rotate(5deg); }
          }
        `}
      </style>
    </MinimalAdminLayout>
  );
}
