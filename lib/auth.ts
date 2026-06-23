import type { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { UserRole } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ADMIN_ROLES = new Set<UserRole>([UserRole.ADMIN, UserRole.MANAGER]);

export async function syncAppUserFromAuth(authUser: SupabaseAuthUser) {
  const prisma = getPrisma();
  const email = authUser.email?.toLowerCase();

  if (!email) {
    return null;
  }

  const appUser = await prisma.user.findFirst({
    where: {
      OR: [{ authUserId: authUser.id }, { email }],
    },
  });

  if (!appUser) {
    return null;
  }

  const nextFullName =
    typeof authUser.user_metadata?.full_name === "string" && authUser.user_metadata.full_name.trim().length > 0
      ? authUser.user_metadata.full_name.trim()
      : appUser.fullName;

  if (appUser.authUserId !== authUser.id || appUser.fullName !== nextFullName) {
    return prisma.user.update({
      where: { id: appUser.id },
      data: {
        authUserId: authUser.id,
        fullName: nextFullName,
      },
    });
  }

  return appUser;
}

export async function requireAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const appUser = await syncAppUserFromAuth(user);

  if (!appUser || !ADMIN_ROLES.has(appUser.role)) {
    await supabase.auth.signOut();
    redirect("/login?error=Acesso%20administrativo%20negado.");
  }

  return {
    authUser: user,
    appUser,
  };
}
