// src/components/auth/RegisterForm.tsx
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  cnpj: z.string().length(14, "CNPJ deve ter 14 números"),
  senha: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      "Senha deve conter letras e números"
    ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const [error, setError] = React.useState("");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser.mutateAsync(data);
      // Redirect will be handled by the auth context
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <Alert type="error" message={error} />}

      <Input label="Nome" {...register("nome")} error={errors.nome?.message} />

      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <Input
        label="CNPJ"
        {...register("cnpj")}
        error={errors.cnpj?.message}
        maxLength={14}
      />

      <Input
        label="Senha"
        type="password"
        {...register("senha")}
        error={errors.senha?.message}
      />

      <Button
        type="submit"
        isLoading={registerUser.isPending}
        className="w-full"
      >
        Criar conta
      </Button>
    </form>
  );
};
