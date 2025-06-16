import MinimalAdminLayout from "@/admin/components/MinimalAdminLayout";
import { useAuth } from "@/hooks/use-auth";
import { useNegocioActivo } from "@/hooks/useNegocioActivo";
import { Navigate } from "react-router-dom";
import { CreditCard, Edit, Save, X, DollarSign, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface MetodoPago {
  id?: string;
  negocio_id?: string;
  "Efectivo": string;
  "Transferencia Bancaria": string;
}

export default function AdminMetodoPago() {
  const { user, loading } = useAuth();
  const { negocioActivo, isLoading: negociosLoading } = useNegocioActivo(user?.id || null);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [metodos, setMetodos] = useState<MetodoPago>({
    "Efectivo": "No",
    "Transferencia Bancaria": "No",
  });
  const [datosBancarios, setDatosBancarios] = useState({
    banco: "",
    titular: "",
    cuenta: "",
    clabe: "",
    referencia: "",
  });

  useEffect(() => {
    if (negocioActivo?.id) {
      fetchMetodosPago();
    }
  }, [negocioActivo?.id]);

  const fetchMetodosPago = async () => {
    if (!negocioActivo?.id) return;

    try {
      const { data, error } = await supabase
        .from('metodo_pago')
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
      console.error('Error fetching payment methods:', error);
    }
  };

  const handleSave = async () => {
    if (!negocioActivo?.id) return;

    try {
      const { data: existing } = await supabase
        .from('metodo_pago')
        .select('id')
        .eq('negocio_id', negocioActivo.id)
        .single();

      const metodosData = {
        negocio_id: negocioActivo.id,
        "Efectivo": metodos["Efectivo"],
        "Transferencia Bancaria": metodos["Transferencia Bancaria"],
      };

      if (existing) {
        const { error } = await supabase
          .from('metodo_pago')
          .update(metodosData)
          .eq('negocio_id', negocioActivo.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('metodo_pago')
          .insert(metodosData);

        if (error) throw error;
      }

      setIsEditing(false);
      toast({
        title: "Métodos de pago actualizados",
        description: "Los métodos de pago han sido guardados correctamente.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "No se pudieron guardar los métodos de pago.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleSwitchChange = (metodo: keyof MetodoPago, enabled: boolean) => {
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
            <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
            Métodos de Pago
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Configura las formas de pago que aceptas en tu negocio
          </p>
        </div>

        {/* Payment Methods Card */}
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200 p-4 sm:p-6">
            <CardTitle className="flex items-center justify-between text-gray-900 text-base sm:text-lg">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                Formas de Pago
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
              {/* Efectivo */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium text-gray-900">Efectivo</h3>
                  </div>
                  <p className="text-sm text-gray-600">Acepta pagos en efectivo al momento de la entrega</p>
                </div>
                <Switch
                  checked={metodos["Efectivo"] === "Si"}
                  onCheckedChange={(checked) => handleSwitchChange("Efectivo", checked)}
                  disabled={!isEditing}
                />
              </div>

              {/* Transferencia Bancaria */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-gray-900">Transferencia Bancaria</h3>
                    </div>
                    <p className="text-sm text-gray-600">Acepta transferencias bancarias directas</p>
                  </div>
                  <Switch
                    checked={metodos["Transferencia Bancaria"] === "Si"}
                    onCheckedChange={(checked) => handleSwitchChange("Transferencia Bancaria", checked)}
                    disabled={!isEditing}
                  />
                </div>

                {/* Datos Bancarios - Solo visible si está habilitado y editando */}
                {metodos["Transferencia Bancaria"] === "Si" && isEditing && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                    <h4 className="font-medium text-blue-900 mb-3">Datos Bancarios</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="banco" className="text-sm font-medium text-gray-700">
                          Banco
                        </Label>
                        <Input
                          id="banco"
                          placeholder="Nombre del banco"
                          value={datosBancarios.banco}
                          onChange={(e) => setDatosBancarios(prev => ({ ...prev, banco: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="titular" className="text-sm font-medium text-gray-700">
                          Titular de la cuenta
                        </Label>
                        <Input
                          id="titular"
                          placeholder="Nombre del titular"
                          value={datosBancarios.titular}
                          onChange={(e) => setDatosBancarios(prev => ({ ...prev, titular: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cuenta" className="text-sm font-medium text-gray-700">
                          Número de cuenta
                        </Label>
                        <Input
                          id="cuenta"
                          placeholder="1234567890"
                          value={datosBancarios.cuenta}
                          onChange={(e) => setDatosBancarios(prev => ({ ...prev, cuenta: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clabe" className="text-sm font-medium text-gray-700">
                          CLABE Interbancaria
                        </Label>
                        <Input
                          id="clabe"
                          placeholder="123456789012345678"
                          value={datosBancarios.clabe}
                          onChange={(e) => setDatosBancarios(prev => ({ ...prev, clabe: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="referencia" className="text-sm font-medium text-gray-700">
                        Instrucciones adicionales
                      </Label>
                      <Textarea
                        id="referencia"
                        placeholder="Incluir nombre del cliente como referencia..."
                        value={datosBancarios.referencia}
                        onChange={(e) => setDatosBancarios(prev => ({ ...prev, referencia: e.target.value }))}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      fetchMetodosPago(); // Reset to original values
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
        <Card className="border border-green-200 bg-green-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900 mb-1">Información sobre métodos de pago</h3>
                <p className="text-sm text-green-700">
                  Configura los métodos de pago que aceptas en tu negocio. Si habilitas transferencias bancarias, 
                  asegúrate de proporcionar los datos correctos para que tus clientes puedan realizar los pagos sin problemas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MinimalAdminLayout>
  );
}