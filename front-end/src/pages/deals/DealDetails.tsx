// src/pages/deals/DealDetails.tsx
import { useParams, Link } from "react-router-dom";
import { useDeals } from "@/hooks/useDeals";
import { useClients } from "@/hooks/useClients";
import { useNotes } from "@/hooks/useNotes";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DealStageBadge } from "@/components/deals/DealStageBadge";
import { NotesSection } from "@/components/notes/NotesSection";
import { usePageTitle } from "@/hooks/usePageTitle";

export function DealDetails() {
  const { id } = useParams<{ id: string }>();
  usePageTitle("Detalhes da Oportunidade");

  const { clients } = useClients();
  const { deals } = useDeals();
  const { notes, createNote, deleteNote } = useNotes(undefined, id);

  if (!id) {
    return <div>Oportunidade não encontrada</div>;
  }

  const deal = deals.data?.find((d) => d.id === id);
  const client = clients.data?.find((c) => c.id === deal?.clientId);

  if (!deal || !client) {
    return <div>Oportunidade não encontrada</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{deal.title}</h1>
        <Link to={`/deals/${id}/edit`}>
          <Button>Editar Oportunidade</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Informações da Oportunidade
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Estágio</p>
                <DealStageBadge stage={deal.stage} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor</p>
                <p className="text-xl font-semibold text-gray-900">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(deal.value)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="text-gray-900">{client.name}</p>
              </div>
              {deal.closeDate && (
                <div>
                  <p className="text-sm text-gray-500">
                    Data Prevista de Fechamento
                  </p>
                  <p className="text-gray-900">
                    {new Date(deal.closeDate).toLocaleDateString()}
                  </p>
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
              dealId={id}
              isLoading={notes.isLoading}
              onCreateNote={async (data) => {
                await createNote.mutateAsync(data);
              }}
              onDeleteNote={async (noteId) => {
                await deleteNote.mutateAsync(noteId);
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
