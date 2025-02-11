// src/components/layout/Navbar.tsx
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Link } from "react-router-dom";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">
                {import.meta.env.VITE_APP_NAME}
              </span>
            </Link>

            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/clients"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  Clientes
                </Link>
                <Link
                  to="/deals"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  Negócios
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">{user.nome}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => logout.mutate()}
                >
                  Sair
                </Button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Registrar</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
