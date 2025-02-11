// src/components/auth/ForgotPasswordForm.tsx
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setStatus("loading");
      // Chamar a API de recuperação de senha
      await forgotPassword.mutateAsync(data.email);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        "Não foi possível enviar o email de recuperação. Tente novamente."
      );
      console.error(error);
    }
  };

  if (status === "success") {
    return (
      <Alert
        type="success"
        message="Se este email estiver cadastrado, você receberá instruções para redefinir sua senha."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {status === "error" && <Alert type="error" message={errorMessage} />}

      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <Button type="submit" isLoading={status === "loading"} className="w-full">
        Recuperar Senha
      </Button>
    </form>
  );
}
