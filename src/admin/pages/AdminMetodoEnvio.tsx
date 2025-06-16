import MinimalAdminLayout from "@/admin/components/MinimalAdminLayout";
import { useAuth } from "@/hooks/use-auth";
import { useNegocioActivo } from "@/hooks/useNegocioActivo";
import { Navigate } from "react-router-dom";
import { Truck, Edit, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface MetodoEnvio {
  id?: string;
  negocio_id?: string;
  "Emvio Económico": string;
  "Envio Gratis": string;
  "Envio Express": string;
  "Motoenvio": string;
}

export default function AdminMetodoEnvio() {
  const { user, loading } = useAuth();
  const { negocioActivo, isLoading: negociosLoading } = useNegocioActivo(user?.id || null);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [metodos, setMetodos] = useState<MetodoEnvio>({
    "Emvio Económico": "No",
    "Envio Gratis": "No",
    "Envio Express": "No",
    "Motoenvio": "No",
  });
  const [precios, setPrecios] = useState({
    economico: "",
    gratis: "",
    express: "",
    motoenvio: "",
  });

  useEffect(() => {
    if (negocioActivo?.id) {
      fetchMetodosEnvio();
    }
  }, [negocioActivo?.id]);

  const fetchMetodosEnvio = async () => {
    if (!negocioActivo?.id) return;

    try {
      const { data, error } = await supabase
        .from('metodo_envio')
        .select('*')
        .eq('negocio_id', negocioActivo.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setMetodos(data);
      }
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
    }
  };

  const handleSave = async () => {
    if (!negocioActivo?.id) return;

    try {
      const { data: existing } = await supabase
        .from('metodo_envio')
        .select('id')
        .eq('negocio_id', negocioActivo.id)
        .single();

      const metodosData = {
        negocio_id: negocioActivo.id,
        "Emvio Económico": metodos["Emvio Económico"],
        "Envio Gratis": metodos["Envio Gratis"],
        "Envio Express": metodos["Envio Express"],
        "Motoenvio": metodos["Motoenvio"],
      };

      if (existing) {
        const { error } = await supabase
          .from('metodo_envio')
          .update(metodosData)
          .eq('negocio_id', negocioActivo.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('metodo_envio')
          .insert(metodosData);

        if (error) throw error;
      }

      setIsEditing(false);
      toast({
        title: "Métodos de envío actualizados",
        description: "Los métodos de envío han sido guardados correctamente.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "No se pudieron guardar los métodos de envío.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleSwitchChange = (metodo: keyof MetodoEnvio, enabled: boolean) => {
    setMetodos(prev => ({
      ...prev,
      [metodo]: enabled ? "Si" : "No"
    }));
  };

  if (loading || negociosLoading) {
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

  return (
    <MinimalAdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-3 sm:pb-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2 sm:gap-3">
            <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
            Métodos de Envío
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Configura los métodos de envío disponibles para tu negocio
          </p>
        </div>

        {/* Shipping Methods Card */}
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200 p-4 sm:p-6">
            <CardTitle className="flex items-center justify-between text-gray-900 text-base sm:text-lg">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                Opciones de Envío
              </div>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:pt-6 sm:p-6">
            <div className="space-y-6">
              {/* Envío Económico */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">Envío Económico</h3>
                  <p className="text-sm text-gray-600">Opción de envío más económica</p>
                </div>
                <div className="flex items-center gap-4">
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="precio-economico" className="text-sm">Precio:</Label>
                      <Input
                        id="precio-economico"
                        placeholder="$0.00"
                        value={precios.economico}
                        onChange={(e) => setPrecios(prev => ({ ...prev, economico: e.target.value }))}
                        className="w-20 h-8"
                      />
                    </div>
                  )}
                  <Switch
                    checked={metodos["Emvio Económico"] === "Si"}
                    onCheckedChange={(checked) => handleSwitchChange("Emvio Económico", checked)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Envío Gratis */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">Envío Gratis</h3>
                  <p className="text-sm text-gray-600">Envío sin costo adicional</p>
                </div>
                <div className="flex items-center gap-4">
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="precio-gratis" className="text-sm">Mínimo:</Label>
                      <Input
                        id="precio-gratis"
                        placeholder="$0.00"
                        value={precios.gratis}
                        onChange={(e) => setPrecios(prev => ({ ...prev, gratis: e.target.value }))}
                        className="w-20 h-8"
                      />
                    </div>
                  )}
                  <Switch
                    checked={metodos["Envio Gratis"] === "Si"}
                    onCheckedChange={(checked) => handleSwitchChange("Envio Gratis", checked)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Envío Express */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">Envío Express</h3>
                  <p className="text-sm text-gray-600">Entrega rápida en 24-48 horas</p>
                </div>
                <div className="flex items-center gap-4">
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="precio-express" className="text-sm">Precio:</Label>
                      <Input
                        id="precio-express"
                        placeholder="$0.00"
                        value={precios.express}
                        onChange={(e) => setPrecios(prev => ({ ...prev, express: e.target.value }))}
                        className="w-20 h-8"
                      />
                    </div>
                  )}
                  <Switch
                    checked={metodos["Envio Express"] === "Si"}
                    onCheckedChange={(checked) => handleSwitchChange("Envio Express", checked)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Motoenvío */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">Motoenvío</h3>
                  <p className="text-sm text-gray-600">Entrega local en motocicleta</p>
                </div>
                <div className="flex items-center gap-4">
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="precio-motoenvio" className="text-sm">Precio:</Label>
                      <Input
                        id="precio-motoenvio"
                        placeholder="$0.00"
                        value={precios.motoenvio}
                        onChange={(e) => setPrecios(prev => ({ ...prev, motoenvio: e.target.value }))}
                        className="w-20 h-8"
                      />
                    </div>
                  )}
                  <Switch
                    checked={metodos["Motoenvio"] === "Si"}
                    onCheckedChange={(checked) => handleSwitchChange("Motoenvio", checked)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      fetchMetodosEnvio(); // Reset to original values
                    }}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSave}
                    className="w-full sm:w-auto order-1 sm:order-2"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border border-blue-200 bg-blue-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Información sobre métodos de envío</h3>
                <p className="text-sm text-blue-700">
                  Habilita los métodos de envío que ofreces a tus clientes. Los precios configurados aquí se mostrarán 
                  durante el proceso de compra. Puedes habilitar múltiples opciones para dar más flexibilidad a tus clientes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MinimalAdminLayout>
  );
}