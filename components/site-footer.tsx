export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-[rgba(7,21,37,0.92)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground sm:px-10 md:flex-row md:items-center md:justify-between">
        <p>Vivici. Operação imobiliária com catálogo, campanhas e gestão comercial.</p>
        <p>Next.js 16, Prisma 7, Supabase e Vercel.</p>
      </div>
    </footer>
  );
}
