// src/components/clients/ClientCard.tsx
import { Card } from "@/components/ui/Card";
import { Client } from "@/types/client";
import { Link } from "react-router-dom";

const statusColors = {
  LEAD: "bg-yellow-100 text-yellow-800",
  PROSPECT: "bg-blue-100 text-blue-800",
  CLIENT: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-100 text-gray-800",
};

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <Link to={`/clients/${client.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
            <p className="text-sm text-gray-500">{client.email}</p>
            {client.company && (
              <p className="text-sm text-gray-500">{client.company}</p>
            )}
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[client.status]}`}
          >
            {client.status}
          </span>
        </div>
      </Card>
    </Link>
  );
}
