import React from "react";
import FieldError from "./FieldError";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] text-white/50 font-black uppercase tracking-wider block">
        {label}
      </label>
      <input
        className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-zru-green text-xs transition-colors ${className}`}
        {...props}
      />
      <FieldError message={error} />
    </div>
  );
}
