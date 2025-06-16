
import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Building, Users, Package, Settings, LogOut, List, ExternalLink, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { logger } from "@/lib/logger";
import TopNavigation from "./TopNavigation";
import MobileHeader from "./MobileHeader";
import { useNegocioActivo } from "@/hooks/useNegocioActivo";

type MinimalAdminLayoutProps = {
  children: ReactNode;
};

const menuItems = [{
  path: "/admin",
  icon: LayoutDashboard,
  label: "Dashboard"
}, {
  path: "/admin/negocios",
  icon: Building,
  label: "Negocios"
}, {
  path: "/admin/clientes",
  icon: Users,
  label: "Clientes"
}, {
  path: "/admin/inventario",
  icon: Package,
  label: "Inventario"
}, {
  path: "/admin/ordenes",
  icon: List,
  label: "Órdenes"
}, {
  path: "/admin/ajustes",
  icon: Settings,
  label: "Ajustes",
  subItems: [
    {
      path: "/admin/ajustes/general",
      label: "General"
    },
    {
      path: "/admin/ajustes/metodo-envio", 
      label: "Método de Envío"
    },
    {
      path: "/admin/ajustes/metodo-pago",
      label: "Método de Pago"
    }
  ]
}];

export default function MinimalAdminLayout({
  children
}: MinimalAdminLayoutProps) {
  const {
    user,
    loading,
    signOut
  } = useAuth();
  const { negocioActivo, negocios, setActiveNegocio } = useNegocioActivo(user?.id || null);
  const isMobile = useMobile();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBusinessSelector, setShowBusinessSelector] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<{[key: string]: boolean}>({});

  // Keep submenus open when they contain the active route
  useEffect(() => {
    const newExpandedMenus: {[key: string]: boolean} = {};
    
    menuItems.forEach((item) => {
      if (item.subItems) {
        const isActiveParent = item.subItems.some(subItem => location.pathname === subItem.path);
        if (isActiveParent) {
          newExpandedMenus[item.path] = true;
        }
      }
    });
    
    setExpandedMenus(prev => ({ ...prev, ...newExpandedMenus }));
  }, [location.pathname]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      </div>;
  }

  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const handleBusinessChange = async (businessId: string) => {
    try {
      await setActiveNegocio(businessId);
      setShowBusinessSelector(false);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Error changing business:", error);
    }
  };

  const handleVisitStore = () => {
    if (negocioActivo) {
      logger.log("Visitando tienda de:", negocioActivo.nombre);
      setMobileMenuOpen(false);
    }
  };

  if (isMobile) {
    return <div className="min-h-screen bg-gray-50">
        {/* Mobile Header with Menu */}
        <MobileHeader 
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
          isMenuOpen={mobileMenuOpen}
        />

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-30 pt-14">
            {/* Business Header */}
            <div className="border-b border-gray-100 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    {negocioActivo?.logo_url ? (
                      <AvatarImage src={negocioActivo.logo_url} alt={negocioActivo.nombre} />
                    ) : (
                      <AvatarFallback className="bg-gray-700 text-white">
                        <Building className="h-5 w-5" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{negocioActivo?.nombre || "Mi Negocio"}</h3>
                    <p className="text-xs text-gray-500">Administración</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBusinessSelector(!showBusinessSelector)}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-8 w-8"
                >
                  <ChevronRight className={cn("h-4 w-4 transition-transform", showBusinessSelector && "rotate-90")} />
                </Button>
              </div>

              {/* Business Options */}
              {showBusinessSelector && (
                <div className="mt-3 space-y-2">
                  {negocios.length > 1 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700 px-2">Cambiar negocio:</p>
                      {negocios.map((negocio) => (
                        <button
                          key={negocio.id}
                          onClick={() => handleBusinessChange(negocio.id)}
                          className={cn(
                            "w-full flex items-center space-x-3 p-2 text-sm rounded-md transition-colors text-left",
                            negocioActivo?.id === negocio.id 
                              ? "bg-blue-50 text-blue-700 border border-blue-200" 
                              : "text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <Avatar className="h-6 w-6">
                            {negocio.logo_url ? (
                              <AvatarImage src={negocio.logo_url} alt={negocio.nombre} />
                            ) : (
                              <AvatarFallback className="bg-gray-600 text-white text-xs">
                                <Building className="h-3 w-3" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <span className="flex-1 text-xs">{negocio.nombre}</span>
                          {negocioActivo?.id === negocio.id && (
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <button
                    onClick={handleVisitStore}
                    className="w-full flex items-center space-x-3 p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span className="text-xs">Visitar tienda</span>
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Menu */}
            <nav className="px-3 space-y-1 mt-3">
              {menuItems.map((item) => {
                const isActive = item.subItems 
                  ? item.subItems.some(subItem => location.pathname === subItem.path)
                  : location.pathname === item.path;
                const isExpanded = expandedMenus[item.path];

                return (
                  <div key={item.path}>
                    {item.subItems ? (
                      <div>
                        <button
                          onClick={() => setExpandedMenus(prev => ({ ...prev, [item.path]: !prev[item.path] }))}
                          className={cn(
                            "w-full flex items-center justify-between p-2.5 text-sm rounded-md transition-colors", 
                            isActive 
                              ? "bg-blue-50 text-blue-700 border border-blue-200" 
                              : "text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <div className="flex items-center space-x-2.5">
                            <item.icon className="h-4 w-4" />
                            <span className="text-sm">{item.label}</span>
                          </div>
                          <ChevronRight className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-90")} />
                        </button>
                        {isExpanded && (
                          <div className="ml-6 mt-1 space-y-1">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                className={cn(
                                  "block p-2 text-sm rounded-md transition-colors",
                                  location.pathname === subItem.path
                                    ? "bg-blue-100 text-blue-800 font-medium"
                                    : "text-gray-600 hover:bg-gray-100"
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link 
                        to={item.path} 
                        className={cn(
                          "flex items-center space-x-2.5 p-2.5 text-sm rounded-md transition-colors", 
                          isActive 
                            ? "bg-blue-50 text-blue-700 border border-blue-200" 
                            : "text-gray-700 hover:bg-gray-50"
                        )} 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Sign Out Button */}
            <div className="absolute bottom-4 left-3 right-3">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 hover:bg-gray-50 border border-gray-200 h-10" 
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2.5" />
                <span className="text-sm">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        )}

        {/* Mobile Content */}
        <main className="pt-20 px-4 pb-4 min-h-screen bg-gray-50">
          {children}
        </main>
      </div>;
  }

  return <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <TopNavigation />
      
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shadow-sm">
          <nav className="flex-1 p-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = item.subItems 
                ? item.subItems.some(subItem => location.pathname === subItem.path)
                : location.pathname === item.path;
              const isExpanded = expandedMenus[item.path];

              return (
                <div key={item.path}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => setExpandedMenus(prev => ({ ...prev, [item.path]: !prev[item.path] }))}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 text-sm transition-colors rounded-md", 
                          isActive 
                            ? "bg-blue-600 text-white shadow-sm" 
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <div className="flex items-center space-x-2.5">
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-90")} />
                      </button>
                      {isExpanded && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={cn(
                                "block px-3 py-2 text-sm transition-colors rounded-md",
                                location.pathname === subItem.path
                                  ? "bg-blue-500 text-white font-medium"
                                  : "text-gray-600 hover:bg-gray-100"
                              )}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link 
                      to={item.path} 
                      className={cn(
                        "flex items-center space-x-2.5 px-3 py-2 text-sm transition-colors rounded-md", 
                        isActive 
                          ? "bg-blue-600 text-white shadow-sm" 
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
          
          <div className="p-3 border-t border-gray-200">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-700 hover:bg-gray-100 h-9" 
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2.5" />
              <span className="text-sm">Cerrar Sesión</span>
            </Button>
          </div>
        </aside>

        {/* Desktop Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>;
}
