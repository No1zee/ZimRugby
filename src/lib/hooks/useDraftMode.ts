"use client";

import { useEffect, useState } from "react";

export function useDraftMode() {
  const [isDraft, setIsDraft] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const hasDraftCookie = cookies.some((c) =>
      c.trim().startsWith("__prerender_bypass")
    );
    requestAnimationFrame(() => {
      setIsDraft(hasDraftCookie);
    });
  }, []);

  return isDraft;
}
