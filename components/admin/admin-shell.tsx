import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type { User } from "@/generated/prisma/client";

const navItems = [
  { href: "/admin", label: "Resumo" },
  { href: "/admin/imoveis", label: "Imóveis" },
  { href: "/admin/campanhas", label: "Campanhas" },
  { href: "/imoveis", label: "Site público" },
];

export function AdminShell({
  user,
  logoutAction,
  children,
}: {
  user: Pick<User, "fullName" | "role">;
  logoutAction: () => Promise<void>;
  children: ReactNode;
}) {
  return (
    <main className="noise-bg min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:px-10">
        <header className="flex flex-col gap-5 rounded-[2rem] border border-border bg-surface/88 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.34em] text-muted">
              Painel Vivici
            </p>
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                Operação comercial e catálogo
              </h1>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Sessão ativa para {user.fullName} ({user.role}).
              </p>
            </div>
          </div>

          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="lg" className="rounded-full px-5">
              Sair
            </Button>
          </form>
        </header>

        <nav className="flex flex-wrap gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-border bg-surface/70 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {children}
      </div>
    </main>
  );
}
