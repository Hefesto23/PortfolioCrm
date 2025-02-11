// src/pages/clients/ClientEdit.tsx
import { ClientForm } from "@/components/clients/ClientForm";
import { Card } from "@/components/ui/Card";
import { useClients } from "@/hooks/useClients";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNavigate, useParams } from "react-router-dom";

export function ClientEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  usePageTitle("Editar Cliente");

  const { clients, updateClient } = useClients();
  const client = clients.data?.find((c) => c.id === id);

  if (!id) {
    return <div>Cliente não encontrado</div>;
  }

  if (!client) {
    return <div>Cliente não encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Editar Cliente: {client.name}
        </h1>
      </div>

      <Card className="max-w-2xl">
        <ClientForm
          client={client}
          onSubmit={async (data) => {
            await updateClient.mutateAsync({ id, data });
            navigate(`/clients/${id}`);
          }}
          isLoading={updateClient.isPending}
        />
      </Card>
    </div>
  );
}
