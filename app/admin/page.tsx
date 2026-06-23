import { getPrisma } from "@/lib/prisma";

export default async function AdminPage() {
  const prisma = getPrisma();

  const [propertyCount, campaignCount, leadCount, latestImport] = await Promise.all([
    prisma.property.count(),
    prisma.campaign.count(),
    prisma.lead.count(),
    prisma.catalogImport.findFirst({
      orderBy: {
        importedAt: "desc",
      },
      select: {
        importedAt: true,
        generatedAtUtc: true,
        sourceUrl: true,
      },
    }),
  ]);

  return (
    <section className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Imóveis", value: propertyCount },
          { label: "Campanhas", value: campaignCount },
          { label: "Leads", value: leadCount },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[1.5rem] border border-border bg-surface/82 p-6"
          >
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-4xl font-semibold text-foreground">
              {item.value}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <article className="rounded-[2rem] border border-border bg-surface/82 p-6">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
            Última importação
          </p>
          {latestImport ? (
            <div className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
              <p>Fonte: {latestImport.sourceUrl}</p>
              <p>Gerado em: {latestImport.generatedAtUtc.toLocaleString("pt-BR")}</p>
              <p>Importado em: {latestImport.importedAt.toLocaleString("pt-BR")}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Nenhuma importação registrada ainda.
            </p>
          )}
        </article>

        <article className="rounded-[2rem] border border-border bg-surface/82 p-6">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
            Operações rápidas
          </p>
          <div className="mt-4 grid gap-3">
            {[
              { href: "/admin/imoveis/novo", label: "Cadastrar novo imóvel" },
              { href: "/admin/campanhas/nova", label: "Criar campanha promocional" },
              { href: "/imoveis", label: "Ver catálogo público" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-border bg-white/4 px-4 py-3 text-sm font-medium text-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
