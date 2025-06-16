
import { Menu, X, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { logger } from "@/lib/logger";

interface MobileHeaderProps {
  onMenuToggle: () => void;
  isMenuOpen?: boolean;
}

export default function MobileHeader({ onMenuToggle, isMenuOpen = false }: MobileHeaderProps) {
  const navigate = useNavigate();

  const handleUpgrade = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logger.log("Navegando a planes desde botón mejorar móvil...");
    
    try {
      navigate("/admin/planes");
    } catch (error) {
      console.error("Error al navegar a planes:", error);
      // Fallback usando window.location si navigate falla
      window.location.href = "/admin/planes";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-700 z-50">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Menu/Close Button with transition */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="h-8 w-8 text-white hover:text-white hover:bg-gray-800 relative overflow-hidden"
        >
          <div className="relative w-5 h-5">
            <Menu 
              className={`h-5 w-5 absolute transition-all duration-300 ease-in-out ${
                isMenuOpen 
                  ? 'rotate-90 scale-0 opacity-0' 
                  : 'rotate-0 scale-100 opacity-100'
              }`} 
            />
            <X 
              className={`h-5 w-5 absolute transition-all duration-300 ease-in-out ${
                isMenuOpen 
                  ? 'rotate-0 scale-100 opacity-100' 
                  : '-rotate-90 scale-0 opacity-0'
              }`} 
            />
          </div>
        </Button>

        {/* Upgrade Button */}
        <Button 
          size="sm" 
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 h-8 px-3 text-xs"
          onClick={handleUpgrade}
          type="button"
        >
          <Crown className="h-3 w-3 mr-1" />
          Mejorar
        </Button>
      </div>
    </header>
  );
}
