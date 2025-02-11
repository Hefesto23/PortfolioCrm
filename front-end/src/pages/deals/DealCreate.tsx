// src/pages/deals/DealCreate.tsx
import { DealForm } from "@/components/deals/DealForm";
import { Card } from "@/components/ui/Card";
import { useClients } from "@/hooks/useClients";
import { useDeals } from "@/hooks/useDeals";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNavigate } from "react-router-dom";

export function DealCreate() {
  usePageTitle("Nova Oportunidade");
  const navigate = useNavigate();
  const { createDeal } = useDeals();
  const { clients } = useClients();

  if (clients.isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Nova Oportunidade</h1>

      <Card className="max-w-2xl">
        <DealForm
          clients={clients.data ?? []}
          onSubmit={async (data) => {
            await createDeal.mutateAsync(data);
            navigate("/deals");
          }}
          isLoading={createDeal.isPending}
        />
      </Card>
    </div>
  );
}
