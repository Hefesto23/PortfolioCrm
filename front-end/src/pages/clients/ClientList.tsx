// src/pages/clients/ClientList.tsx
import { ClientList as ClientListComponent } from "@/components/clients/ClientList";
import { Button } from "@/components/ui/Button";
import { useClients } from "@/hooks/useClients";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Link } from "react-router-dom";

export function ClientList() {
  usePageTitle("Clientes");
  const { clients } = useClients();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <Link to="/clients/new">
          <Button>Novo Cliente</Button>
        </Link>
      </div>

      <ClientListComponent
        clients={clients.data ?? []}
        isLoading={clients.isLoading}
      />
    </div>
  );
}
