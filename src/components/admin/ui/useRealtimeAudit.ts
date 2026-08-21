"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "./ToastProvider";

export function useRealtimeAudit(onNewLog?: (log: any) => void) {
  const { toast } = useToast();

  useEffect(() => {
    // Only initialize if Supabase credentials exist
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return;
    }

    const supabase = createClient();

    // Subscribe to INSERT events on public.audit_logs
    const channel = supabase
      .channel("realtime-audit-logs")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "audit_logs",
        },
        (payload) => {
          const newEntry = payload.new;
          if (newEntry) {
            onNewLog?.(newEntry);

            // Trigger visual toast for real-time collaboration awareness
            const actionText = newEntry.action || "Activity";
            const actor = newEntry.actor_email || "Admin";
            toast(
              `⚡ [Live Audit] ${actor} performed ${actionText} on ${newEntry.resource || "system"}`,
              "info"
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewLog, toast]);
}
