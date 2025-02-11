// src/components/clients/ClientStatusBadge.tsx
import { ClientStatus } from "@/types/client";
import { clsx } from "clsx";

interface ClientStatusBadgeProps {
  status: ClientStatus;
}

const statusConfig = {
  LEAD: {
    color: "bg-yellow-100 text-yellow-800",
    label: "Lead",
  },
  PROSPECT: {
    color: "bg-blue-100 text-blue-800",
    label: "Prospecto",
  },
  CLIENT: {
    color: "bg-green-100 text-green-800",
    label: "Cliente",
  },
  INACTIVE: {
    color: "bg-gray-100 text-gray-800",
    label: "Inativo",
  },
};

export function ClientStatusBadge({ status }: ClientStatusBadgeProps) {
  return (
    <span
      className={clsx(
        "px-2 py-1 text-xs font-medium rounded-full",
        statusConfig[status].color
      )}
    >
      {statusConfig[status].label}
    </span>
  );
}
