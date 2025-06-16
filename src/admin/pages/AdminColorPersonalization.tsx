
import MinimalAdminLayout from "@/admin/components/MinimalAdminLayout";
import { useAuth } from "@/hooks/use-auth";
import { useNegocioActivo } from "@/hooks/useNegocioActivo";
import { Navigate } from "react-router-dom";
import { Palette, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTemaConfig } from "@/hooks/useTemaConfig";
import ColorPaletteCustomizer from "@/admin/components/ColorPaletteCustomizer";

export default function AdminColorPersonalization() {
  const { user, loading } = useAuth();
  const { negocioActivo, isLoading: negociosLoading } = useNegocioActivo(user?.id || null);
  const { temaConfig, updateCustomPalette } = useTemaConfig(negocioActivo?.id || null);

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
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.history.back()}
                  className="p-2 h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                  <Palette className="h-6 w-6 md:h-7 md:w-7" />
                  Personalización de Colores
                </h1>
              </div>
              <p className="text-sm md:text-base text-muted-foreground ml-11">
                Selecciona paletas optimizadas o genera una personalizada para tu negocio
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1">
                Personalización
              </Badge>
            </div>
          </div>
        </div>

        {/* Color Palette Customizer Component */}
        <div className="space-y-6">
          <ColorPaletteCustomizer
            currentPalette={temaConfig?.configuracion?.colors?.customPalette}
            onSave={updateCustomPalette}
          />
        </div>
      </div>
    </MinimalAdminLayout>
  );
}
