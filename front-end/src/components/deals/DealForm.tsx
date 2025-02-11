// src/components/deals/DealForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { Deal } from "@/types/deal";

const dealSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  value: z.number().min(0, "Valor não pode ser negativo"),
  clientId: z.string().uuid("Cliente inválido"),
  stage: z.enum([
    "INITIAL_CONTACT",
    "NEGOTIATION",
    "PROPOSAL",
    "CLOSED_WON",
    "CLOSED_LOST",
  ]),
  closeDate: z.string().optional(),
});

type DealFormData = z.infer<typeof dealSchema>;

interface DealFormProps {
  deal?: Deal;
  onSubmit: (data: DealFormData) => Promise<void>;
  isLoading: boolean;
  clients: Array<{ id: string; name: string }>;
}

export function DealForm({
  deal,
  onSubmit,
  isLoading,
  clients,
}: DealFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      ...deal,
      value: deal?.value || 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Título"
        {...register("title")}
        error={errors.title?.message}
      />

      <Input
        label="Valor"
        type="number"
        step="0.01"
        {...register("value", { valueAsNumber: true })}
        error={errors.value?.message}
      />

      <Select
        label="Cliente"
        {...register("clientId")}
        error={errors.clientId?.message}
      >
        <option value="">Selecione um cliente</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </Select>

      {deal && (
        <>
          <Select
            label="Estágio"
            {...register("stage")}
            error={errors.stage?.message}
          >
            <option value="INITIAL_CONTACT">Contato Inicial</option>
            <option value="NEGOTIATION">Negociação</option>
            <option value="PROPOSAL">Proposta</option>
            <option value="CLOSED_WON">Ganho</option>
            <option value="CLOSED_LOST">Perdido</option>
          </Select>

          <Input
            label="Data de Fechamento"
            type="date"
            {...register("closeDate")}
            error={errors.closeDate?.message}
          />
        </>
      )}

      <Button type="submit" isLoading={isLoading} className="w-full">
        {deal ? "Atualizar" : "Criar"} Negócio
      </Button>
    </form>
  );
}
