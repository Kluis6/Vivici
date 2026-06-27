export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/80 bg-[rgba(7,21,37,0.92)]">
      <div className="mx-auto flex w-full container flex-col gap-2 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground hidden md:block">
          Vivic Imobiliária. Encontre oportunidades, lançamentos e imóveis para o seu perfil.
        </p>
        <p>© {currentYear} Vivic Imobiliária. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
