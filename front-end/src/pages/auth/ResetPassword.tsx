// src/pages/auth/ResetPassword.tsx
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Link, useSearchParams } from "react-router-dom";

export function ResetPassword() {
  usePageTitle("Redefinir Senha");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <Card className="w-full">
        <Alert
          type="error"
          message="Link de recuperação inválido. Por favor, solicite um novo link."
        />
        <div className="mt-6 text-center">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:text-blue-700"
          >
            Solicitar novo link
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Redefinir sua senha
        </h1>
        <p className="text-gray-600 mt-2">Digite sua nova senha abaixo</p>
      </div>

      <ResetPasswordForm />

      <div className="mt-6 text-center text-sm">
        <Link to="/login" className="text-blue-600 hover:text-blue-700">
          Voltar para o login
        </Link>
      </div>
    </Card>
  );
}
