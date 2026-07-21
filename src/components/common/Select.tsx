import React from "react";
import FieldError from "./FieldError";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export default function Select({ label, error, children, className = "", ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] text-white/50 font-black uppercase tracking-wider block">
        {label}
      </label>
      <select
        className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-zru-green text-xs transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
      <FieldError message={error} />
    </div>
  );
}
