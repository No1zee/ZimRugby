export const ADMIN_TAB_EVENT = "zru-admin-tab-change";

export interface AdminTabIntent {
  tab: string;
  /** Item id to open in the target tab's editor (deep link). */
  openItem?: string | number;
  /** Pre-filled draft payload (e.g. Generated Post-Match Report). */
  draftData?: Record<string, any>;
}

export function setAdminTab(tab: string, openItem?: string | number, draftData?: Record<string, any>) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<AdminTabIntent>(ADMIN_TAB_EVENT, { detail: { tab, openItem, draftData } }));
}

export function onAdminTab(callback: (intent: AdminTabIntent) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (event: Event) => {
    callback((event as CustomEvent<AdminTabIntent>).detail);
  };
  window.addEventListener(ADMIN_TAB_EVENT, handler);
  return () => window.removeEventListener(ADMIN_TAB_EVENT, handler);
}
