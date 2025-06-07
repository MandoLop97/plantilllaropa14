
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { DynamicBusinessIdProvider } from "./contexts/DynamicBusinessIdContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Citas from "./pages/Citas";
import NotFound from "./pages/NotFound";
import { validateEnvironment } from "./config/environment";
import { logger } from "./utils/logger";
import { analytics } from "./utils/analytics";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { ThemeConfigProvider } from "./contexts/ThemeConfigContext";

// Enhanced React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // More intelligent retry logic
        if (error?.message?.includes('not found') || error?.message?.includes('404')) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

const AppContent = () => {
  useEffect(() => {
    // Initialize app configurations
    const initializeApp = async () => {
      try {
        // Validate environment configuration
        if (!validateEnvironment()) {
          logger.error('❌ Invalid environment configuration');
          return;
        }

        // Log app initialization
        analytics.track('app_initialized', {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          pathname: window.location.pathname,
          hostname: window.location.hostname
        });

        logger.info('✅ Application initialized successfully');
      } catch (error) {
        logger.error('❌ Error during app initialization', { error });
      }
    };

    initializeApp();

    // Cleanup on unmount
    return () => {
      logger.info('🔄 Application unmounted');
    };
  }, []);

  return (
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/citas" element={<Citas />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ScrollToTopButton />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DynamicBusinessIdProvider>
        <ThemeConfigProvider>
          <AppContent />
        </ThemeConfigProvider>
      </DynamicBusinessIdProvider>
    </QueryClientProvider>
  );
};

export default App;
