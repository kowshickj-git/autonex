import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { getAdminSession } from "@/lib/auth/guard";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Access itself is enforced by src/middleware.ts before this ever renders.
  // Reading the session here supplies the shell with the signed-in identity so
  // it can label the footer and hide owner-only navigation.
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell role={session.role} name={session.name}>
      {children}
    </AdminShell>
  );
}
