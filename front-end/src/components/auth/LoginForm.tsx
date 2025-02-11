// src/components/auth/LoginForm.tsx
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [error, setError] = React.useState("");

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login.mutateAsync(data);
      // Redirect will be handled by the auth context
    } catch (err) {
      setError("Email ou senha inválidos");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <Alert type="error" message={error} />}

      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <Input
        label="Senha"
        type="password"
        {...register("senha")}
        error={errors.senha?.message}
      />

      <Button type="submit" isLoading={login.isPending} className="w-full">
        Entrar
      </Button>
    </form>
  );
};
