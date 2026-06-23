import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { loginWithPassword } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <main className="noise-bg flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-md rounded-[2rem] border border-border bg-surface/90 p-8 shadow-[0_28px_90px_rgba(0,0,0,0.22)] backdrop-blur">
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.34em] text-muted">
            Vivici Admin
          </p>
          <h1 className="text-3xl font-semibold text-foreground">
            Entrar no painel
          </h1>
          <p className="text-sm leading-7 text-muted-foreground">
            Use o usuário administrador sincronizado no Supabase Auth para acessar
            catálogo, campanhas e operação comercial.
          </p>
        </div>

        <form action={loginWithPassword} className="mt-8 space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              className="h-12 w-full rounded-2xl border border-border bg-white/6 px-4 text-base text-foreground outline-none transition focus:border-[var(--border-strong)] focus:bg-white/8"
              placeholder="admin@vivici.com.br"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">Senha</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              className="h-12 w-full rounded-2xl border border-border bg-white/6 px-4 text-base text-foreground outline-none transition focus:border-[var(--border-strong)] focus:bg-white/8"
              placeholder="Sua senha de acesso"
            />
          </label>

          {params.error ? (
            <div className="rounded-2xl border border-[rgba(215,108,76,0.4)] bg-[rgba(215,108,76,0.12)] px-4 py-3 text-sm text-[color:var(--accent-soft)]">
              {params.error}
            </div>
          ) : null}

          <Button type="submit" size="lg" className="h-12 w-full rounded-full">
            Entrar no painel
          </Button>
        </form>
      </section>
    </main>
  );
}
