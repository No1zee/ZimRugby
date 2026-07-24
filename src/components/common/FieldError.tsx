import React from "react";
import { AlertCircle } from "lucide-react";

interface FieldErrorProps {
  message?: string;
}

export default function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p className="flex items-center gap-1.5 text-red-400 text-[10px] font-semibold mt-1">
      <AlertCircle className="w-3 h-3" />
      <span>{message}</span>
    </p>
  );
}
