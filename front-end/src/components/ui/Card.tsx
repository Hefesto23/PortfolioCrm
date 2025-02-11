// src/components/ui/Card.tsx
import { clsx } from "clsx";
import React, { forwardRef } from "react";

// Atualizamos a interface para incluir todas as props de uma div HTML
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

// Convertemos o componente para usar forwardRef, mantendo a mesma estilização
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx("bg-white rounded-lg shadow-md p-6", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// Adicionamos um displayName para melhor depuração
Card.displayName = "Card";
