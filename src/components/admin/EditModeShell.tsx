"use client";

import { ReactNode } from "react";
import { EditProvider, InlineEditor } from "@/lib/edit-mode";

export default function EditModeShell({ children }: { children: ReactNode }) {
  return (
    <EditProvider>
      {children}
      <InlineEditor />
    </EditProvider>
  );
}
