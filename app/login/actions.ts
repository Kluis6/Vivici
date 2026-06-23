"use server";

import { redirect } from "next/navigation";

import { syncAppUserFromAuth } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function loginErrorRedirect(message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`/login?${params.toString()}`);
}

export async function loginWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    loginErrorRedirect("Preencha email e senha.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    loginErrorRedirect("Credenciais inválidas.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    loginErrorRedirect("Não foi possível validar a sessão.");
  }

  const authUser = user;
  const appUser = await syncAppUserFromAuth(authUser);

  if (!appUser || !["ADMIN", "MANAGER"].includes(appUser.role)) {
    await supabase.auth.signOut();
    loginErrorRedirect("Seu usuário não possui acesso ao painel.");
  }

  redirect("/admin");
}
