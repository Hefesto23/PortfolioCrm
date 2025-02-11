// src/components/clients/ClientList.tsx
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/loading-state";
import { Body, Cell, Head, Header, Row, Table } from "@/components/ui/Table";
import { useDebounce } from "@/hooks/useDebounce";
import { ClientStatus } from "@/types/client";
import { useState } from "react";
import { ClientStatusBadge } from "./ClientStatusBadge";

interface Client {
  id: string;
  name: string;
  status: ClientStatus;
  email: string;
  company: string;
}

interface ClientListProps {
  clients: Client[];
  isLoading: boolean;
}

export function ClientList({ clients, isLoading }: ClientListProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Buscar clientes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <Table>
          <Header>
            <Row>
              <Head>Nome</Head>
              <Head>Status</Head>
              <Head>Email</Head>
              <Head>Empresa</Head>
              <Head />
            </Row>
          </Header>
          <Body>
            {filteredClients.map((client) => (
              <Row key={client.id}>
                <Cell>{client.name}</Cell>
                <Cell>
                  <ClientStatusBadge status={client.status} />
                </Cell>
                {/* ... outras células ... */}
              </Row>
            ))}
          </Body>
        </Table>
      )}
    </div>
  );
}
