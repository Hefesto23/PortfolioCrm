// src/pages/NotFound.tsx
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          404 - Página não encontrada
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          A página que você está procurando não existe.
        </p>
        <div className="mt-6 flex justify-center">
          <Link to="/">
            <Button>Voltar ao início</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
