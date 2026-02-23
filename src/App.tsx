import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/admin/AdminLayout';
import { SellerLayout } from './components/seller/SellerLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/shared/ErrorBoundary';

import { Home } from './pages/Home';
import { Categories } from './pages/Categories';
import { AdListing } from './pages/AdListing';
import { AdDetail } from './pages/AdDetail';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Activation } from './pages/Activation';
import { SellerDashboard } from './pages/SellerDashboard';
import { SellerAdsList } from './pages/SellerAdsList';
import { SellerSettings } from './pages/SellerSettings';
import { AdForm } from './pages/AdForm';
import { Terms } from './pages/Terms';
import { Help } from './pages/Help';
import { ShadcnStudio } from './pages/ShadcnStudio';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAds } from './pages/admin/AdminAds';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminBanners } from './pages/admin/AdminBanners';
import { AuthCallback } from './pages/AuthCallback';
import { Dashboard } from './pages/Dashboard';
import { PostLogin } from './pages/PostLogin';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppProvider>
          <AuthProvider>
            <ToastProvider>
              <Routes>
            {/* Admin: layout ERP (sidebar + header), sem Layout do site */}
            <Route path="admin" element={<ProtectedRoute requireAdmin />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="usuarios" element={<AdminUsers />} />
                <Route path="anuncios" element={<AdminAds />} />
                <Route path="categorias" element={<AdminCategories />} />
                <Route path="banners" element={<AdminBanners />} />
              </Route>
            </Route>

            {/* Seller dashboard: no public header/footer */}
            <Route path="vendedor" element={<ProtectedRoute requireApprovedSeller />}>
              <Route element={<SellerLayout />}>
                <Route index element={<SellerDashboard />} />
                <Route path="anuncios" element={<SellerAdsList />} />
                <Route path="novo" element={<AdForm />} />
                <Route path="editar/:id" element={<AdForm />} />
                <Route path="definicoes" element={<SellerSettings />} />
              </Route>
            </Route>

            {/* Dashboard neutro: redireciona baseado no role/status */}
            <Route path="dashboard" element={<ProtectedRoute />}>
              <Route index element={<Dashboard />} />
            </Route>

            {/* Site: header + footer */}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="entrar" element={<Login />} />
              <Route path="cadastro" element={<Signup />} />
              <Route path="auth/callback" element={<AuthCallback />} />
              <Route path="pos-login" element={<PostLogin />} />
              <Route path="ativacao" element={<Activation />} />
              <Route path="pendente" element={<Navigate to="/ativacao" replace />} />
              <Route path="categorias" element={<Categories />} />
              <Route path="anuncios" element={<AdListing />} />
              <Route path="anuncio/:id" element={<AdDetail />} />
              <Route path="ajuda" element={<Help />} />
              <Route path="termos" element={<Terms />} />
              <Route path="shadcn-studio" element={<ShadcnStudio />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
            </Routes>
            </ToastProvider>
          </AuthProvider>
        </AppProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
