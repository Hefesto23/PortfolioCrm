// src/pages/deals/DealEdit.tsx
import { DealForm } from "@/components/deals/DealForm";
import { Card } from "@/components/ui/Card";
import { useClients } from "@/hooks/useClients";
import { useDeals } from "@/hooks/useDeals";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNavigate, useParams } from "react-router-dom";

export function DealEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  usePageTitle("Editar Oportunidade");

  const { deals, updateDeal } = useDeals();
  const { clients } = useClients();

  if (!id) {
    return <div>Oportunidade não encontrada</div>;
  }

  const deal = deals.data?.find((d) => d.id === id);

  if (!deal) {
    return <div>Oportunidade não encontrada</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Editar Oportunidade: {deal.title}
      </h1>

      <Card className="max-w-2xl">
        <DealForm
          deal={deal}
          clients={clients.data ?? []}
          onSubmit={async (data) => {
            await updateDeal.mutateAsync({ id, data });
            navigate(`/deals/${id}`);
          }}
          isLoading={updateDeal.isPending}
        />
      </Card>
    </div>
  );
}
