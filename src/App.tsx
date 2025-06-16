
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientWrapper } from './lib/queryClient';
import { AuthProvider } from './hooks/use-auth';
import { usePWA } from './hooks/use-pwa';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { OrderNotificationProvider } from './admin/components/OrderNotificationProvider';
import { Toaster } from 'sonner';
import PageTransition from './components/PageTransition';

const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminInventario = lazy(() => import('./admin/pages/AdminInventario'));
const AdminProductoForm = lazy(() => import('./admin/pages/AdminProductoForm'));
const AdminCategoriaForm = lazy(() => import('./admin/pages/AdminCategoriaForm'));
const AdminOrdenesPage = lazy(() => import('./admin/pages/AdminOrdenesPage'));
const AdminOrdenDetallePage = lazy(() => import('./admin/pages/AdminOrdenDetallePage'));
const AdminClientes = lazy(() => import('./admin/pages/AdminClientes'));
const AdminCitas = lazy(() => import('./admin/pages/AdminCitas'));
const AdminNegocios = lazy(() => import('./admin/pages/AdminNegocios'));
const AdminPersonalizacion = lazy(() => import('./admin/pages/AdminPersonalizacion'));
const AdminColorPersonalization = lazy(() => import('./admin/pages/AdminColorPersonalization'));
const AdminPlanes = lazy(() => import('./admin/pages/AdminPlanes'));
const AdminPlantillas = lazy(() => import('./admin/pages/AdminPlantillas'));
const AdminAjustes = lazy(() => import('./admin/pages/AdminAjustes'));
const AdminAjustesGeneral = lazy(() => import('./admin/pages/AdminAjustesGeneral'));
const AdminMetodoEnvio = lazy(() => import('./admin/pages/AdminMetodoEnvio'));
const AdminMetodoPago = lazy(() => import('./admin/pages/AdminMetodoPago'));
const AdminVariantesPage = lazy(() => import('./admin/pages/AdminVariantesPage'));
const AdminServicioForm = lazy(() => import('./admin/pages/AdminServicioForm'));
import NotFound from './pages/NotFound';

function AppContent() {
  usePWA();

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <OrderNotificationProvider>
        <Suspense fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/login" element={
              <PageTransition>
                <Login />
              </PageTransition>
            } />
            <Route path="/admin" element={
              <PageTransition>
                <AdminDashboard />
              </PageTransition>
            } />
            <Route path="/admin/dashboard" element={
              <PageTransition>
                <AdminDashboard />
              </PageTransition>
            } />
            <Route path="/admin/inventario" element={
              <PageTransition>
                <AdminInventario />
              </PageTransition>
            } />
            <Route path="/admin/productos/nuevo" element={
              <PageTransition>
                <AdminProductoForm />
              </PageTransition>
            } />
            <Route path="/admin/productos/editar/:id" element={
              <PageTransition>
                <AdminProductoForm />
              </PageTransition>
            } />
            <Route path="/admin/servicios/nuevo" element={
              <PageTransition>
                <AdminServicioForm />
              </PageTransition>
            } />
            <Route path="/admin/servicios/editar/:id" element={
              <PageTransition>
                <AdminServicioForm />
              </PageTransition>
            } />
            <Route path="/admin/categorias/nueva" element={
              <PageTransition>
                <AdminCategoriaForm />
              </PageTransition>
            } />
            <Route path="/admin/categorias/editar/:id" element={
              <PageTransition>
                <AdminCategoriaForm />
              </PageTransition>
            } />
            <Route path="/admin/ordenes" element={
              <PageTransition>
                <AdminOrdenesPage />
              </PageTransition>
            } />
            <Route path="/admin/ordenes/:id" element={
              <PageTransition>
                <AdminOrdenDetallePage />
              </PageTransition>
            } />
            <Route path="/admin/clientes" element={
              <PageTransition>
                <AdminClientes />
              </PageTransition>
            } />
            <Route path="/admin/citas" element={
              <PageTransition>
                <AdminCitas />
              </PageTransition>
            } />
            <Route path="/admin/negocios" element={
              <PageTransition>
                <AdminNegocios />
              </PageTransition>
            } />
            <Route path="/admin/personalizacion" element={
              <PageTransition>
                <AdminPersonalizacion />
              </PageTransition>
            } />
            <Route path="/admin/color-personalization" element={
              <PageTransition>
                <AdminColorPersonalization />
              </PageTransition>
            } />
            <Route path="/admin/planes" element={
              <PageTransition>
                <AdminPlanes />
              </PageTransition>
            } />
            <Route path="/admin/plantillas" element={
              <PageTransition>
                <AdminPlantillas />
              </PageTransition>
            } />
            <Route path="/admin/ajustes" element={<Navigate to="/admin/ajustes/general" replace />} />
            <Route path="/admin/ajustes/general" element={
              <PageTransition>
                <AdminAjustesGeneral />
              </PageTransition>
            } />
            <Route path="/admin/ajustes/metodo-envio" element={
              <PageTransition>
                <AdminMetodoEnvio />
              </PageTransition>
            } />
            <Route path="/admin/ajustes/metodo-pago" element={
              <PageTransition>
                <AdminMetodoPago />
              </PageTransition>
            } />
            <Route
              path="/admin/inventario/productos/:productoId/variantes/:atributoId"
              element={
                <PageTransition>
                  <AdminVariantesPage />
                </PageTransition>
              }
            />
            <Route path="*" element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            } />
          </Routes>
        </Suspense>
      </OrderNotificationProvider>
      <Toaster />
      <PWAInstallPrompt />
    </div>
  );
}

function App() {
  return (
    <QueryClientWrapper>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientWrapper>
  );
}

export default App;
