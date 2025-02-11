// src/pages/Profile.tsx
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuthContext } from "@/contexts/AuthContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usersService } from "@/services/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  senha: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      "Senha deve conter letras e números"
    )
    .optional()
    .or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function Profile() {
  usePageTitle("Meu Perfil");
  const { user, setUser } = useAuthContext();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome: user?.nome,
      email: user?.email,
      senha: "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (!user?.id) return;

      const updateData = {
        ...data,
        senha: data.senha || undefined,
      };

      const updatedUser = await usersService.update(user.id, updateData);
      setUser(updatedUser);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          {status === "success" && (
            <Alert type="success" message="Perfil atualizado com sucesso!" />
          )}

          {status === "error" && (
            <Alert
              type="error"
              message="Erro ao atualizar perfil. Tente novamente."
            />
          )}

          <Input
            label="Nome"
            {...register("nome")}
            error={errors.nome?.message}
          />

          <Input
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Nova Senha (opcional)"
            type="password"
            {...register("senha")}
            error={errors.senha?.message}
          />

          <Button type="submit">Salvar Alterações</Button>
        </form>
      </Card>
    </div>
  );
}
