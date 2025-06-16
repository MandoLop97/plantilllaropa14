
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Building, ExternalLink, Crown } from "lucide-react";
import { logger } from "@/lib/logger";
import { useAuth } from "@/hooks/use-auth";
import { useNegocioActivo } from "@/hooks/useNegocioActivo";
import { NegocioSelector } from "@/components/NegocioSelector";
import { useNavigate } from "react-router-dom";

type UserPlan = "gratuito" | "básico" | "pro" | "empresa";

export default function TopNavigation() {
  const { user } = useAuth();
  const { negocioActivo, negocios, isLoading, setActiveNegocio } = useNegocioActivo(user?.id || null);
  const [userPlan, setUserPlan] = useState<UserPlan>("gratuito");
  const [showNegocioSelector, setShowNegocioSelector] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserPlan();
    }
  }, [user]);

  const fetchUserPlan = async () => {
    try {
      // Simular obtención del plan del usuario
      setUserPlan("gratuito");
    } catch (error) {
      console.error("Error al obtener el plan del usuario:", error);
      setUserPlan("gratuito");
    }
  };

  const shouldShowUpgrade = userPlan === "gratuito" || userPlan === "básico";

  const getPlanColor = (plan: UserPlan) => {
    switch (plan) {
      case "gratuito":
        return "bg-gray-700 text-gray-100";
      case "básico":
        return "bg-blue-700 text-blue-100";
      case "pro":
        return "bg-purple-700 text-purple-100";
      case "empresa":
        return "bg-amber-700 text-amber-100";
      default:
        return "bg-gray-700 text-gray-100";
    }
  };

  const getPlanName = (plan: UserPlan) => {
    switch (plan) {
      case "gratuito":
        return "Gratuito";
      case "básico":
        return "Básico";
      case "pro":
        return "Pro";
      case "empresa":
        return "Empresa";
      default:
        return "Gratuito";
    }
  };

  const handleNegocioChange = (negocioId: string) => {
    setActiveNegocio(negocioId);
    setShowNegocioSelector(false);
  };

  const handleVisitStore = () => {
    if (negocioActivo) {
      // Aquí puedes implementar la lógica para ir a la tienda del negocio
      logger.log("Visitando tienda de:", negocioActivo.nombre);
      // window.open(`/tienda/${negocioActivo.id}`, '_blank');
    }
  };

  // Función unificada para manejar el upgrade - usada por ambos botones
  const handleUpgrade = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logger.log("Navegando a planes desde botón mejorar...");
    
    try {
      navigate("/admin/planes");
    } catch (error) {
      console.error("Error al navegar a planes:", error);
      // Fallback usando window.location si navigate falla
      window.location.href = "/admin/planes";
    }
  };

  // Componente del botón Mejorar reutilizable
  const UpgradeButton = ({ className = "" }: { className?: string }) => (
    <Button 
      size="sm" 
      className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 transition-all duration-200 ${className}`}
      onClick={handleUpgrade}
      type="button"
    >
      <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
      <span className="hidden sm:inline">Mejorar</span>
      <span className="sm:hidden">+</span>
    </Button>
  );

  if (isLoading) {
    return (
      <div className="bg-black border-b border-gray-700 px-3 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-3 w-24 sm:h-4 sm:w-32 bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-5 w-16 sm:h-6 sm:w-20 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!negocioActivo) {
    return (
      <div className="bg-black border-b border-gray-700 px-3 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xs sm:text-sm text-gray-300">No hay negocio seleccionado</div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Badge className={`${getPlanColor(userPlan)} text-xs sm:text-sm px-2 py-1`}>
              <Crown className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Plan </span>{getPlanName(userPlan)}
            </Badge>
            {shouldShowUpgrade && <UpgradeButton />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black border-b border-gray-700 px-3 sm:px-6 py-3 relative z-50">
      <div className="flex items-center justify-between">
        {/* Información del negocio */}
        {showNegocioSelector ? (
          <div className="flex items-center gap-2 sm:gap-3 flex-1 mr-2">
            <NegocioSelector
              negocios={negocios}
              negocioActivo={negocioActivo}
              onSelect={handleNegocioChange}
              isLoading={isLoading}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNegocioSelector(false)}
              className="border-gray-600 text-white hover:bg-gray-800 text-xs px-2"
            >
              <span className="hidden sm:inline">Cancelar</span>
              <span className="sm:hidden">×</span>
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 sm:gap-3 h-auto p-1 sm:p-2 hover:bg-gray-800 text-white flex-1 justify-start mr-2">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                  {negocioActivo.logo_url ? (
                    <AvatarImage src={negocioActivo.logo_url} alt={negocioActivo.nombre} />
                  ) : (
                    <AvatarFallback className="bg-gray-700 text-white">
                      <Building className="h-3 w-3 sm:h-4 sm:w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-left min-w-0 flex-1">
                  <h2 className="text-xs sm:text-sm font-medium text-white truncate">{negocioActivo.nombre}</h2>
                  <p className="text-xs text-gray-300 hidden sm:block">Panel de administración</p>
                </div>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 sm:w-56 bg-gray-900 border-gray-700">
              {negocios.length > 1 && (
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer text-white hover:bg-gray-800 text-sm"
                  onClick={() => setShowNegocioSelector(true)}
                >
                  <Building className="h-4 w-4" />
                  <span>Cambiar de negocio</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer text-white hover:bg-gray-800 text-sm"
                onClick={handleVisitStore}
              >
                <ExternalLink className="h-4 w-4" />
                <span>Visitar tienda</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Plan del usuario */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Badge className={`${getPlanColor(userPlan)} text-xs sm:text-sm px-2 py-1`}>
            <Crown className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Plan </span>{getPlanName(userPlan)}
          </Badge>
          {shouldShowUpgrade && <UpgradeButton />}
        </div>
      </div>
    </div>
  );
}
