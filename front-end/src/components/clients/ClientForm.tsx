// src/components/clients/ClientForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Replace "some-library" with the actual library name
import { z } from "zod";

const clientSchema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  // Add other fields as needed
});

interface ClientFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  client?: any; // Replace 'any' with the appropriate type if available
}

export function ClientForm({ onSubmit, isLoading, client }: ClientFormProps) {
  const form = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: client || {},
  });

  const handleSubmit = async (data: Record<string, any>): Promise<void> => {
    try {
      await onSubmit(data);
      toast.success("Cliente salvo com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar cliente");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nome"
          {...form.register("name")}
          error={form.formState.errors.name?.message?.toString()}
        />
        {/* ... outros campos ... */}
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="secondary" onClick={() => history.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </div>
    </form>
  );
}
