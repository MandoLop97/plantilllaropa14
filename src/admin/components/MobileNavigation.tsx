
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  Building,
  Package,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileNavigationProps {
  currentPath: string;
}

export default function MobileNavigation({ currentPath }: MobileNavigationProps) {
  const navItems = [
    { icon: LayoutDashboard, label: "Inicio", path: "/admin" },
    { icon: Package, label: "Inventario", path: "/admin/inventario" },
    { icon: Calendar, label: "Citas", path: "/admin/citas" },
    { icon: Users, label: "Clientes", path: "/admin/clientes" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analiticas" },
    { icon: Settings, label: "Ajustes", path: "/admin/ajustes" }
  ];

  const isActive = (path: string) => {
    if (path === "/admin" && currentPath === "/admin") return true;
    if (path !== "/admin" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border/50 shadow-lg">
      <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-3xl flex justify-between items-center h-16 px-2 md:px-4">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                group relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300
                ${active ? "text-primary" : "text-muted-foreground"}
                hover:bg-primary/10 rounded-xl mx-1
              `}
            >
              <div className="relative flex items-center justify-center">
                <div className={`
                  flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-300
                  ${active 
                    ? "bg-gradient-to-br from-primary/20 to-accent/20 shadow-sm" 
                    : "group-hover:bg-primary/10"
                  }
                `}>
                  <item.icon
                    size={20}
                    className={`transition-all duration-300 ${
                      active ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-2 w-8 h-1 rounded-full bg-gradient-to-r from-primary to-accent"
                      initial={{ opacity: 0, scaleX: 0.7 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0.7 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                </AnimatePresence>
              </div>
              <span className={`text-[10px] mt-1 truncate transition-all duration-300 font-medium ${
                active ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
