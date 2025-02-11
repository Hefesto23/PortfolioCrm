// src/components/ui/loading-state.tsx
import { Loader2 } from "lucide-react";

export function LoadingState({ message = "Carregando..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600 mb-2" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
