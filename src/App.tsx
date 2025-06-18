
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './contexts/CartContext';
import { ThemeConfigProvider } from './contexts/ThemeConfigContext';
import { DynamicBusinessIdProvider } from './contexts/DynamicBusinessIdContext';
import { Toaster } from './components/ui/toaster';
import ScrollToTopButton from './components/ScrollToTopButton';
import { lazy, Suspense } from 'react';

const Index = lazy(() => import('./pages/Index'));
const Products = lazy(() => import('./pages/Products'));
const Citas = lazy(() => import('./pages/Citas'));
const Checkout = lazy(() => import('./pages/Checkout'));
const NotFound = lazy(() => import('./pages/NotFound'));
import './App.css';
import { useServiceWorkerUpdater } from './hooks/useServiceWorkerUpdater';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function AppContent() {
  return (
    <>
      <Suspense fallback={<div className="p-4 text-center">Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/negocio/:subdominio" element={<Index />} />
          <Route
            path="/negocio/:subdominio/productos"
            element={<Products />}
          />
          <Route path="/negocio/:subdominio/citas" element={<Citas />} />
          <Route path="/negocio/:subdominio/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      
      {/* Scroll to Top Button - aparece en todas las páginas */}
      <ScrollToTopButton />
    </>
  );
}

function App() {
  useServiceWorkerUpdater();
  return (
    <QueryClientProvider client={queryClient}>
      <DynamicBusinessIdProvider>
        <ThemeConfigProvider>
          <CartProvider>
            <Router>
              <AppContent />
              <Toaster />
            </Router>
          </CartProvider>
        </ThemeConfigProvider>
      </DynamicBusinessIdProvider>
    </QueryClientProvider>
  );
}

export default App;
