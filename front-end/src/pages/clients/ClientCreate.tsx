// src/pages/clients/ClientCreate.tsx
import { ClientForm } from "@/components/clients/ClientForm";
import { Card } from "@/components/ui/Card";
import { useClients } from "@/hooks/useClients";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNavigate } from "react-router-dom";

export function ClientCreate() {
  usePageTitle("Novo Cliente");
  const navigate = useNavigate();
  const { createClient } = useClients();

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-900">Novo Cliente</h1>
      </div>

      <Card className="max-w-2xl">
        <ClientForm
          onSubmit={async (data) => {
            await createClient.mutateAsync(data);
            navigate("/clients");
          }}
          isLoading={createClient.isPending}
        />
      </Card>
    </div>
  );
}
