
import MinimalAdminLayout from "@/admin/components/MinimalAdminLayout";
import NegociosManager from "@/admin/components/NegociosManager";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";
import { Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminNegocios() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  return (
    <MinimalAdminLayout>
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                <Building className="h-6 w-6 md:h-7 md:w-7" />
                Mis Negocios
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Administra los negocios de tu plataforma
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1">
                Gestión de negocios
              </Badge>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <NegociosManager />
        </div>
      </div>
    </MinimalAdminLayout>
  );
}
