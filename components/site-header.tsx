import Link from "next/link";

import { Badge } from "@/components/ui/badge";

const links = [
  { href: "/", label: "Início" },
  { href: "/imoveis", label: "Imóveis" },
  { href: "/promocoes", label: "Promoções" },
  { href: "/admin", label: "Painel" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-[rgba(7,21,37,0.76)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="flex items-center gap-4">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-accent-soft text-sm font-semibold text-primary-foreground">
            VI
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted">
              Vivici
            </p>
            <p className="text-lg font-semibold text-foreground">
              Imobiliária digital
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          {links.map((link) => (
            <Badge
              key={link.href}
              variant="outline"
              render={
                <Link
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition hover:bg-white/6"
                />
              }
            >
              {link.label}
            </Badge>
          ))}
        </nav>
      </div>
    </header>
  );
}
