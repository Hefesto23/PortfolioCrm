// src/pages/deals/DealList.tsx
import { DealPipeline } from "@/components/deals/DealPipeline";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useClients } from "@/hooks/useClients";
import { useDeals } from "@/hooks/useDeals";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Link } from "react-router-dom";

export function DealList() {
  usePageTitle("Pipeline de Vendas");
  const { deals, dealMetrics } = useDeals();
  const { clients } = useClients();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pipeline de Vendas</h1>
        <Link to="/deals/new">
          <Button>Nova Oportunidade</Button>
        </Link>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium">Total em Negociação</h3>
            <p className="text-2xl font-bold mt-2">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(dealMetrics.data?.totalValue ?? 0)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium">Ticket Médio</h3>
            <p className="text-2xl font-bold mt-2">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(dealMetrics.data?.avgDealValue ?? 0)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium">Total de Oportunidades</h3>
            <p className="text-2xl font-bold mt-2">
              {dealMetrics.data?.totalDeals ?? 0}
            </p>
          </div>
        </Card>
      </div>

      {/* Pipeline */}
      {deals.data && clients.data && (
        <DealPipeline deals={deals.data} clients={clients.data} />
      )}
    </div>
  );
}
