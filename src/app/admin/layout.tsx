import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch (e: any) {
    redirect(e?.message === "MfaRequired" ? "/login?redirect=/admin&step=mfa" : "/login?redirect=/admin");
  }

  return (
    <div className="min-h-screen bg-milk-white text-[#1b1c16] font-body">
      {children}
    </div>
  );
}
