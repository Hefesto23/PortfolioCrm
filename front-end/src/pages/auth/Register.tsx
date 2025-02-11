// src/pages/auth/Register.tsx
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Card } from "@/components/ui/Card";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Link } from "react-router-dom";

export function Register() {
  usePageTitle("Criar Conta");

  return (
    <Card className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Criar uma nova conta
        </h1>
        <p className="text-gray-600 mt-2">
          Preencha os dados abaixo para criar sua conta
        </p>
      </div>

      <RegisterForm />

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">Já tem uma conta? </span>
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Faça login
        </Link>
      </div>
    </Card>
  );
}
