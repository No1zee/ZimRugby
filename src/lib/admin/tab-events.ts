export const ADMIN_TAB_EVENT = "zru-admin-tab-change";

export function setAdminTab(tab: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ADMIN_TAB_EVENT, { detail: tab }));
}

export function onAdminTab(callback: (tab: string) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (event: Event) => {
    callback((event as CustomEvent).detail);
  };
  window.addEventListener(ADMIN_TAB_EVENT, handler);
  return () => window.removeEventListener(ADMIN_TAB_EVENT, handler);
}
