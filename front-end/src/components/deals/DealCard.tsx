// src/components/deals/DealCard.tsx
import { Card } from "@/components/ui/Card";
import { Deal } from "@/types/deal";
import { Link } from "react-router-dom";
import { DealStageBadge } from "./DealStageBadge";

interface DealCardProps {
  deal: Deal;
  clientName: string;
}

export function DealCard({ deal, clientName }: DealCardProps) {
  return (
    <Link to={`/deals/${deal.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">{deal.title}</h3>
            <DealStageBadge stage={deal.stage} />
          </div>

          <p className="text-sm text-gray-500">Cliente: {clientName}</p>

          <p className="text-lg font-semibold text-gray-900">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(deal.value)}
          </p>

          {deal.closeDate && (
            <p className="text-sm text-gray-500">
              Fechamento previsto:{" "}
              {new Date(deal.closeDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
