// src/pages/auth/Login.tsx
import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/Card";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Link } from "react-router-dom";

export function Login() {
  usePageTitle("Login");

  return (
    <Card className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Entrar no Portfolio CRM
        </h1>
        <p className="text-gray-600 mt-2">
          Entre com seu email e senha para acessar
        </p>
      </div>

      <LoginForm />

      <div className="mt-6 text-center text-sm">
        <Link
          to="/forgot-password"
          className="text-blue-600 hover:text-blue-700"
        >
          Esqueceu sua senha?
        </Link>
      </div>

      <div className="mt-4 text-center text-sm">
        <span className="text-gray-600">Não tem uma conta? </span>
        <Link
          to="/register"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Registre-se
        </Link>
      </div>
    </Card>
  );
}
