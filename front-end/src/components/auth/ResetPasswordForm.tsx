// src/components/auth/ResetPasswordForm.tsx
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

const resetPasswordSchema = z.object({
  senha: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .refine(
      (senha) => /[A-Za-z]/.test(senha),
      "Senha deve conter pelo menos uma letra"
    )
    .refine(
      (senha) => /\d/.test(senha),
      "Senha deve conter pelo menos um número"
    ),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Token de recuperação inválido");
      return;
    }

    try {
      setStatus("loading");
      await resetPassword.mutateAsync({ token, senha: data.senha });
      setStatus("success");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setStatus("error");
      setErrorMessage("Não foi possível redefinir a senha. Tente novamente.");
      console.error(error);
    }
  };

  if (!token) {
    return <Alert type="error" message="Link de recuperação inválido" />;
  }

  if (status === "success") {
    return (
      <Alert
        type="success"
        message="Senha alterada com sucesso! Você será redirecionado para a página de login."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {status === "error" && <Alert type="error" message={errorMessage} />}

      <Input
        label="Nova Senha"
        type="password"
        {...register("senha")}
        error={errors.senha?.message}
      />

      <Button type="submit" isLoading={status === "loading"} className="w-full">
        Redefinir Senha
      </Button>
    </form>
  );
}
