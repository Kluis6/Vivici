import Link from "next/link";

const links = [
  { href: "/", label: "Início" },
  { href: "/imoveis", label: "Imóveis" },
  { href: "/promocoes", label: "Promoções" },
  { href: "/admin", label: "Painel" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border/80 bg-[rgba(7,21,37,0.88)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="space-y-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted">
            Vivici
          </p>
          <p className="text-lg font-semibold text-foreground">
            Imobiliária digital
          </p>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
