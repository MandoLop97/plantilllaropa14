
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import { useThemeConfig } from "./config/theme";
import { validateEnvironment } from "./config/environment";
import { logger } from "./utils/logger";
import { analytics } from "./utils/analytics";

// Configurar React Query con opciones optimizadas
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  const { loadSavedTheme } = useThemeConfig();

  useEffect(() => {
    // Inicializar configuraciones al cargar la app
    const initializeApp = async () => {
      try {
        // Validar configuración de entorno
        if (!validateEnvironment()) {
          logger.error('Configuración de entorno inválida');
          return;
        }

        // Cargar tema guardado
        loadSavedTheme();

        // Registrar carga inicial de la app
        analytics.track('app_initialized', {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        });

        logger.info('Aplicación inicializada correctamente');
      } catch (error) {
        logger.error('Error al inicializar la aplicación', { error });
      }
    };

    initializeApp();

    // Cleanup al desmontar
    return () => {
      logger.info('Aplicación desmontada');
    };
  }, [loadSavedTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/productos" element={<Products />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
