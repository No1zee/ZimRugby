import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch {
    redirect("/admin-login");
  }

  return (
    <div className="min-h-screen bg-[#001A0E] flex font-body">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
