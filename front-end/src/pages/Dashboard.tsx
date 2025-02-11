// src/pages/Dashboard.tsx
import { Chart } from "@/components/Chart";
import { DealPipeline } from "@/components/deals/DealPipeline";
import { Sidebar } from "@/components/layout/Sidebar"; // Importamos o componente Sidebar
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/loading-state";
import { useClients } from "@/hooks/useClients";
import { useDeals } from "@/hooks/useDeals";

export function Dashboard() {
  const {
    deals,
    dealMetrics,
    isLoading: isDealsLoading,
    error: dealsError,
  } = useDeals();
  const {
    clients,
    isLoading: isClientsLoading,
    error: clientsError,
  } = useClients();

  if (isDealsLoading || isClientsLoading) {
    return <LoadingState message="Carregando dashboard..." />;
  }

  if (dealsError || clientsError) {
    return (
      <Alert
        type="error"
        message="Ocorreu um erro ao carregar os dados. Por favor, tente novamente."
      />
    );
  }

  function handleDragEnd(result: any): void {
    if (!result.destination) return;

    const updatedDeals = Array.from(deals.data ?? []);
    const [movedDeal] = updatedDeals.splice(result.source.index, 1);
    updatedDeals.splice(result.destination.index, 0, movedDeal);

    // Here you would typically update the state or make an API call to save the new order
    console.log("Updated deals order:", updatedDeals);
  }

  return (
    // Container flexível para layout com sidebar
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar existente */}
      <Sidebar />

      {/* Área principal do conteúdo */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Métricas principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Total de Negócios
                    </h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {dealMetrics.data?.totalDeals ?? 0}
                    </p>
                  </div>
                </div>
                <div className="mt-4 h-32">
                  <Chart
                    data={deals.data ?? []}
                    type="line"
                    color="#3b82f6"
                    height={128}
                  />
                </div>
              </div>
            </Card>

            {/* Outros cards de métricas permanecem iguais */}
          </div>

          {/* Pipeline de vendas */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Pipeline de Vendas</h2>
              <div className="relative overflow-x-auto">
                <DealPipeline
                  deals={deals.data ?? []}
                  clients={clients.data ?? []}
                  onDragEnd={handleDragEnd}
                />
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
