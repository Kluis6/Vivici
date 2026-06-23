import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminUser } from "@/lib/auth";

import { logoutAction } from "./actions";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { appUser } = await requireAdminUser();

  return (
    <AdminShell user={appUser} logoutAction={logoutAction}>
      {children}
    </AdminShell>
  );
}
