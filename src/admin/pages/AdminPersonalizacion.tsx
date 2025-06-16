
import { useState } from "react";
import MinimalAdminLayout from "@/admin/components/MinimalAdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PhoneInput from "@/components/PhoneInput";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building, Paintbrush, Loader2, CheckCircle2 } from "lucide-react";

export default function AdminPersonalizacion() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido aplicados correctamente.",
      });
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  return (
    <MinimalAdminLayout>
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
            <Paintbrush className="h-6 w-6" />
            Personalización
          </h1>
          <p className="text-gray-600 mt-1">
            Configura la apariencia y datos de tu negocio
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Información del Negocio */}
          <Card className="border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Building className="h-5 w-5" />
                Información del Negocio
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Nombre del Negocio</Label>
                  <Input
                    id="business-name"
                    placeholder="Ingresa el nombre de tu negocio"
                    defaultValue="Mi Negocio"
                    autoComplete="organization"
                    maxLength={60}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-description">Descripción</Label>
                  <Textarea
                    id="business-description"
                    placeholder="Describe brevemente tu negocio"
                    defaultValue="Ofrecemos servicios de calidad para nuestros clientes"
                    maxLength={200}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-phone">Teléfono</Label>
                  <PhoneInput
                    id="business-phone"
                    placeholder="Teléfono de contacto"
                    autoComplete="tel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-email">Email</Label>
                  <Input
                    id="business-email"
                    type="email"
                    placeholder="Email de contacto"
                    defaultValue="contacto@minegocio.com"
                    autoComplete="email"
                    maxLength={60}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-address">Dirección</Label>
                  <Input
                    id="business-address"
                    placeholder="Dirección física"
                    defaultValue="Calle Principal 123, Ciudad"
                    autoComplete="street-address"
                    maxLength={100}
                  />
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : saved ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Guardado
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Apariencia */}
          <Card className="border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Paintbrush className="h-5 w-5" />
                Apariencia
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="logo-upload">Logo del Negocio</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-lg font-semibold">
                      Logo
                    </div>
                    <Button variant="outline" size="sm">
                      Cambiar Logo
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">
                    Recomendado: 512x512px, formato PNG o JPG
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Colores del Tema</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1.5">
                      <div className="h-8 w-full rounded-md bg-blue-600" />
                      <div className="text-xs text-center text-gray-600">Principal</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-8 w-full rounded-md bg-gray-100" />
                      <div className="text-xs text-center text-gray-600">Secundario</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-8 w-full rounded-md bg-blue-100" />
                      <div className="text-xs text-center text-gray-600">Acento</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    Personalizar Colores
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Horario de Atención</Label>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Lunes - Viernes</span>
                      <span>9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sábado</span>
                      <span>10:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Domingo</span>
                      <span>Cerrado</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Editar Horario
                  </Button>
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : saved ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Guardado
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MinimalAdminLayout>
  );
}
