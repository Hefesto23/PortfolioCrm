// src/routes/index.tsx
import { AuthLayout } from "@/components/layout/AuthLayout";
import { DefaultLayout } from "@/components/layout/DefaultLayout";
import { useAuthContext } from "@/contexts/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";

// Auth Pages
import { ForgotPassword } from "@/pages/auth/ForgotPassword";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { ResetPassword } from "@/pages/auth/ResetPassword";

// Dashboard
import { Dashboard } from "@/pages/Dashboard";

// Clients
import { ClientCreate } from "@/pages/clients/ClientCreate";
import { ClientDetails } from "@/pages/clients/ClientDetails";
import { ClientEdit } from "@/pages/clients/ClientEdit";
import { ClientList } from "@/pages/clients/ClientList";

// Deals
import { DealCreate } from "@/pages/deals/DealCreate";
import { DealDetails } from "@/pages/deals/DealDetails";
import { DealEdit } from "@/pages/deals/DealEdit";
import { DealList } from "@/pages/deals/DealList";

// Profile
import { Profile } from "@/pages/Profile";

// Other
import { NotFound } from "@/pages/NotFound";

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
      </Route>

      {/* Rotas Privadas */}
      <Route
        element={
          <PrivateRoute>
            <DefaultLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Rotas de Clientes */}
        <Route path="/clients">
          <Route index element={<ClientList />} />
          <Route path="new" element={<ClientCreate />} />
          <Route path=":id" element={<ClientDetails />} />
          <Route path=":id/edit" element={<ClientEdit />} />
        </Route>

        {/* Rotas de Negócios */}
        <Route path="/deals">
          <Route index element={<DealList />} />
          <Route path="new" element={<DealCreate />} />
          <Route path=":id" element={<DealDetails />} />
          <Route path=":id/edit" element={<DealEdit />} />
        </Route>

        {/* Perfil do Usuário */}
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
