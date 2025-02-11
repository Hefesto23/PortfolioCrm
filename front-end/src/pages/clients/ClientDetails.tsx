// src/pages/clients/ClientDetails.tsx
import { ClientStatusBadge } from "@/components/clients/ClientStatusBadge";
import { NotesSection } from "@/components/notes/NotesSection";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useClients } from "@/hooks/useClients";
import { useNotes } from "@/hooks/useNotes";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Link, useParams } from "react-router-dom";

export function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  usePageTitle("Detalhes do Cliente");

  const { clients } = useClients();
  const { notes, createNote, deleteNote } = useNotes(id);

  const client = clients.data?.find((c) => c.id === id);

  if (!client) {
    return <div>Cliente não encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
        <Link to={`/clients/${id}/edit`}>
          <Button>Editar Cliente</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Informações do Cliente
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <ClientStatusBadge status={client.status} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{client.email}</p>
              </div>
              {client.phone && (
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="text-gray-900">{client.phone}</p>
                </div>
              )}
              {client.company && (
                <div>
                  <p className="text-sm text-gray-500">Empresa</p>
                  <p className="text-gray-900">{client.company}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Anotações
            </h2>
            <NotesSection
              notes={notes.data ?? []}
              clientId={id}
              isLoading={notes.isLoading}
              onCreateNote={createNote.mutateAsync}
              onDeleteNote={deleteNote.mutateAsync}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
