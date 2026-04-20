import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/api';
import { Header, Loader } from '../components';
import { LandingPage, LoginPage, RegisterPage, DashboardPage, EmpresasPage, CarretillasPage, MantenimientosPage, InvitesPage } from '../pages';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  if (!user || user.rol !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const LandingRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main>{children}</main>
  </>
);

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, user, login, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      authApi.getMe()
        .then((res) => { if (res.data) login(res.data as any, token); else logout(); })
        .catch(() => logout());
    }
  }, []);

  if (isAuthenticated === undefined) {
    return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingRoute><LandingPage /></LandingRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
        <Route path="/empresas" element={<ProtectedRoute><AppLayout><EmpresasPage /></AppLayout></ProtectedRoute>} />
        <Route path="/carretillas" element={<ProtectedRoute><AppLayout><CarretillasPage /></AppLayout></ProtectedRoute>} />
        <Route path="/carretillas/:carretillaId/mantenimientos" element={<ProtectedRoute><AppLayout><MantenimientosPage /></AppLayout></ProtectedRoute>} />
        <Route path="/invites" element={<ProtectedRoute><AdminRoute><AppLayout><InvitesPage /></AppLayout></AdminRoute></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};