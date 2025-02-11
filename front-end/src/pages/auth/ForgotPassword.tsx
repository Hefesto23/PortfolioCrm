// src/pages/auth/ForgotPassword.tsx
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Card } from "@/components/ui/Card";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Link } from "react-router-dom";

export function ForgotPassword() {
  usePageTitle("Recuperar Senha");

  return (
    <Card className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Recuperar senha</h1>
        <p className="text-gray-600 mt-2">
          Digite seu email para receber instruções de recuperação
        </p>
      </div>

      <ForgotPasswordForm />

      <div className="mt-6 text-center text-sm">
        <Link to="/login" className="text-blue-600 hover:text-blue-700">
          Voltar para o login
        </Link>
      </div>
    </Card>
  );
}
