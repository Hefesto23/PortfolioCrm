// src/components/ui/Alert.tsx
import { clsx } from "clsx";
import React from "react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ type, message, className }) => {
  const variants = {
    success: "bg-green-100 text-green-800 border-green-500",
    error: "bg-red-100 text-red-800 border-red-500",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-500",
    info: "bg-blue-100 text-blue-800 border-blue-500",
  };

  return (
    <div
      className={clsx("rounded-md p-4 border-l-4", variants[type], className)}
    >
      {message}
    </div>
  );
};
