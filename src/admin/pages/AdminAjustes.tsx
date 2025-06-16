
import MinimalAdminLayout from "@/admin/components/MinimalAdminLayout";
import { useAuth } from "@/hooks/use-auth";
import { useNegocioActivo } from "@/hooks/useNegocioActivo";
import { Navigate, useNavigate } from "react-router-dom";
import { Settings, Building, Edit, Palette, Globe, ExternalLink, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import BusinessInfoCard from "@/admin/components/BusinessInfoCard";
import PushNotificationCard from "@/admin/components/PushNotificationCard";
import { useTemaConfig } from "@/hooks/useTemaConfig";

interface FormValues {
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  email: string;
  logo_url: string;
  banner_url: string;
  logo_position: string;
  profile_shape: string;
  button_shape: string;
  background_type: string;
  background_color: string;
  primary_color: string;
  secondary_color: string;
  tertiary_color: string;
}

// Extended interface for negocio with additional properties
interface ExtendedNegocio {
  id: string;
  nombre: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  logo_url?: string;
  banner_url?: string;
  logo_position?: string;
  profile_shape?: string;
  button_shape?: string;
  background_type?: string;
  background_color?: string;
  primary_color?: string;
  secondary_color?: string;
  tertiary_color?: string;
  subdominio?: string;
  vistas?: string;
}

export default function AdminAjustes() {
  const { user, loading } = useAuth();
  const { negocioActivo, isLoading: negociosLoading, refetchNegocios } = useNegocioActivo(user?.id || null);
  const { temaConfig } = useTemaConfig(negocioActivo?.id || null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editingBusiness, setEditingBusiness] = useState<boolean>(false);
  const [editingSubdomain, setEditingSubdomain] = useState<boolean>(false);
  const [subdomainValue, setSubdomainValue] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [phoneCode, setPhoneCode] = useState<string>("+52");

  // Cast negocioActivo to extended type
  const extendedNegocio = negocioActivo as ExtendedNegocio | null;

  const form = useForm<FormValues>({
    defaultValues: {
      nombre: "",
      descripcion: "",
      direccion: "",
      telefono: "",
      email: "",
      logo_url: "",
      banner_url: "",
      logo_position: "center",
      profile_shape: "circle",
      button_shape: "rounded",
      background_type: "color",
      background_color: "#ffffff",
      primary_color: "#4f46e5",
      secondary_color: "#f59e0b",
      tertiary_color: "#10b981",
    },
  });

  useEffect(() => {
    if (extendedNegocio) {
      // Update form with business data
      let phone = extendedNegocio.telefono || "";
      let code = "+52";
      const match = phone.match(/^(\+\d{1,3})\s*(\d{10})$/);
      if (match) {
        code = match[1];
        phone = match[2];
      }
      setPhoneCode(code);
      form.reset({
        nombre: extendedNegocio.nombre || "",
        descripcion: extendedNegocio.descripcion || "",
        direccion: extendedNegocio.direccion || "",
        telefono: phone,
        email: extendedNegocio.email || "",
        logo_url: extendedNegocio.logo_url || "",
        banner_url: extendedNegocio.banner_url || "",
        logo_position: extendedNegocio.logo_position || "center",
        profile_shape: extendedNegocio.profile_shape || "circle",
        button_shape: extendedNegocio.button_shape || "rounded",
        background_type: extendedNegocio.background_type || "color",
        background_color: extendedNegocio.background_color || "#ffffff",
        primary_color: extendedNegocio.primary_color || "#4f46e5",
        secondary_color: extendedNegocio.secondary_color || "#f59e0b",
        tertiary_color: extendedNegocio.tertiary_color || "#10b981",
      });
      setSubdomainValue(extendedNegocio.subdominio || "");
    }
  }, [negocioActivo, form]);

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

  const onSubmit = async (data: FormValues) => {
    if (!negocioActivo) return;

    try {
      const { error } = await supabase
        .from('negocios')
        .update({
          nombre: data.nombre,
          descripcion: data.descripcion,
          direccion: data.direccion,
          telefono: `${phoneCode} ${data.telefono}`,
          email: data.email,
          logo_url: data.logo_url,
          banner_url: data.banner_url,
          logo_position: data.logo_position,
          profile_shape: data.profile_shape,
          button_shape: data.button_shape,
          background_type: data.background_type,
          background_color: data.background_color,
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          tertiary_color: data.tertiary_color,
        })
        .eq('id', negocioActivo.id);

      if (error) {
        throw error;
      }

      await refetchNegocios();
      setEditingBusiness(false);

      toast({
        title: "Negocio actualizado",
        description: "Los datos del negocio han sido actualizados correctamente.",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "No se pudo actualizar el negocio.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleSubdomainUpdate = async () => {
    if (!negocioActivo) return;

    try {
      const { error } = await supabase
        .from('negocios')
        .update({ subdominio: subdomainValue })
        .eq('id', negocioActivo.id);

      if (error) {
        throw error;
      }

      await refetchNegocios();
      setEditingSubdomain(false);

      toast({
        title: "Subdominio actualizado",
        description: "El subdominio ha sido actualizado correctamente.",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "No se pudo actualizar el subdominio.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleLogoSelect = (url: string) => {
    form.setValue("logo_url", url);
  };

  const handleBannerSelect = (url: string) => {
    form.setValue("banner_url", url);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copiado",
        description: "URL copiada al portapapeles",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar la URL",
        variant: "destructive",
      });
    }
  };

  const renderColorPalette = (colorType: 'primary' | 'secondary' | 'accent', label: string) => {
    const palette = temaConfig?.configuracion?.colors?.customPalette?.[colorType];
    if (!palette) return null;

    const previewLevels = ['300', '500', '700'];
    
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-700">{label}</p>
        <div className="flex gap-1">
          {previewLevels.map((level) => {
            const color = palette[level];
            if (!color) return null;
            
            return (
              <div
                key={level}
                className="w-6 h-6 rounded border border-gray-200 shadow-sm"
                style={{ backgroundColor: color }}
                title={`${label} ${level}: ${color}`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <MinimalAdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-3 sm:pb-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2 sm:gap-3">
            <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
            Ajustes
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Configura los ajustes de tu negocio
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Subdominio Section - Improved */}
          <Card className="border border-gray-200 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-gray-900 text-base sm:text-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                Subdominio y URL
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Configura tu URL personalizada para acceder a tu tienda en línea
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:pt-6 sm:p-6">
              {editingSubdomain ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="subdominio" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Configurar subdominio
                    </Label>
                    <div className="flex rounded-lg shadow-sm border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                      <Input
                        id="subdominio"
                        value={subdomainValue}
                        onChange={(e) => setSubdomainValue(e.target.value)}
                        placeholder="mi-negocio"
                        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <span className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-700 text-sm font-medium border-l border-gray-300">
                        .gutix.site
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Elige un nombre único para tu tienda. Solo letras, números y guiones.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingSubdomain(false)}
                      className="w-full sm:w-auto order-2 sm:order-1"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSubdomainUpdate}
                      className="w-full sm:w-auto order-1 sm:order-2 bg-blue-600 hover:bg-blue-700"
                    >
                      Guardar Subdominio
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Tu URL de tienda
                      </p>
                      {extendedNegocio?.subdominio ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <div className="flex-1">
                              <code className="text-sm font-mono text-green-800 break-all">
                                https://{extendedNegocio.subdominio}.gutix.site
                              </code>
                              <p className="text-xs text-green-600 mt-1">
                                ✓ Tu tienda está disponible en esta URL
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(`https://${extendedNegocio.subdominio}.gutix.site`)}
                                className="text-green-700 border-green-300 hover:bg-green-100"
                              >
                                {copied ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`https://${extendedNegocio.subdominio}.gutix.site`, '_blank')}
                                className="text-blue-700 border-blue-300 hover:bg-blue-100"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                          <div className="flex items-start gap-3">
                            <div className="p-1 bg-amber-100 rounded">
                              <Globe className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-amber-800">
                                Sin subdominio configurado
                              </p>
                              <p className="text-xs text-amber-700 mt-1">
                                Configura un subdominio para que tus clientes puedan acceder a tu tienda
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <Button 
                      onClick={() => setEditingSubdomain(true)}
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {extendedNegocio?.subdominio ? 'Editar subdominio' : 'Configurar subdominio'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Business Information Section */}
          {editingBusiness ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <BusinessInfoCard
                  form={form}
                  negocioId={negocioActivo?.id}
                  onLogoSelect={handleLogoSelect}
                  onBannerSelect={handleBannerSelect}
                  phoneCode={phoneCode}
                  onPhoneCodeChange={setPhoneCode}
                />
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingBusiness(false)}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto order-1 sm:order-2">
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Card className="border border-gray-200">
              <CardHeader className="border-b border-gray-200 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-gray-900 text-base sm:text-lg">
                  <Building className="h-4 w-4 sm:h-5 sm:w-5" />
                  Información del Negocio
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:pt-6 sm:p-6">
                {negocioActivo ? (
                  <div className="space-y-4">
                    {/* Logo y Banner */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {negocioActivo.logo_url && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Logo</p>
                          <img 
                            src={negocioActivo.logo_url} 
                            alt="Logo" 
                            className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg object-cover border shadow"
                          />
                        </div>
                      )}
                      {negocioActivo.banner_url && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Banner</p>
                          <img 
                            src={negocioActivo.banner_url} 
                            alt="Banner" 
                            className="h-12 w-24 sm:h-16 sm:w-32 rounded-lg object-cover border shadow"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Nombre</p>
                        <p className="text-gray-900 text-sm sm:text-base">{negocioActivo.nombre}</p>
                      </div>
                      {negocioActivo.telefono && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Teléfono</p>
                          <p className="text-gray-900 text-sm sm:text-base">{negocioActivo.telefono}</p>
                        </div>
                      )}
                      {negocioActivo.email && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Email</p>
                          <p className="text-gray-900 text-sm sm:text-base break-all">{negocioActivo.email}</p>
                        </div>
                      )}
                      {negocioActivo.direccion && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Dirección</p>
                          <p className="text-gray-900 text-sm sm:text-base">{negocioActivo.direccion}</p>
                        </div>
                      )}
                    </div>
                    {negocioActivo.descripcion && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Descripción</p>
                        <p className="text-gray-900 text-sm sm:text-base">{negocioActivo.descripcion}</p>
                      </div>
                    )}
                    <div className="pt-4 border-t border-gray-200">
                      <Button 
                        onClick={() => setEditingBusiness(true)}
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar información
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <Building className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      No hay negocio seleccionado
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      Necesitas seleccionar un negocio para ver la configuración
                    </p>
                    <Button 
                      onClick={() => navigate("/admin/negocios")} 
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      Ver mis negocios
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Push Notifications Card */}
          <PushNotificationCard userId={user?.id} />

          {/* Personalización de Colores */}
          <Card className="border border-gray-200">
            <CardHeader className="border-b border-gray-200 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-gray-900 text-base sm:text-lg">
                <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
                Personalización de Colores
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:pt-6 sm:p-6">
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-gray-600">
                  Personaliza los colores de tu negocio para crear una identidad visual única.
                </p>
                
                {/* Color Palette Preview */}
                {temaConfig?.configuracion?.colors?.customPalette && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-medium text-gray-900">Paletas actuales:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {renderColorPalette('primary', 'Primario')}
                      {renderColorPalette('secondary', 'Secundario')}
                      {renderColorPalette('accent', 'Acento')}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <Button 
                    onClick={() => navigate("/admin/color-personalization")}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Personalizar Colores
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integraciones (Placeholder) */}
          <Card className="border border-gray-200">
            <CardHeader className="border-b border-gray-200 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-gray-900 text-base sm:text-lg">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                Integraciones
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-6 sm:py-8 p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-600">
                Próximamente: Conecta tu negocio con otras plataformas
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MinimalAdminLayout>
  );
}
