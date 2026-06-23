import Link from "next/link";

import { CampaignCard } from "@/components/campaign-card";
import { PropertyCard } from "@/components/property-card";
import { SiteShell } from "@/components/site-shell";
import { formatDateTime, getPublicCatalogData } from "@/lib/catalog";

export default async function Home() {
  const { stats, featuredProperties, highlightedCampaigns, latestImport } =
    await getPublicCatalogData();

  return (
    <SiteShell>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 py-10 sm:px-10">
        <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-7">
            <p className="max-w-fit rounded-full border border-border bg-surface px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-accent-strong">
              Plataforma imobiliária Vivici
            </p>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
                Catálogo, campanhas e operação comercial no mesmo fluxo.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Base pública para captar demanda e painel administrativo para gerir
                imóveis, promoções e evolução comercial.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/imoveis"
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                Buscar imóveis
              </Link>
              <Link
                href="/promocoes"
                className="rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground"
              >
                Ver promoções
              </Link>
              <Link
                href="/admin"
                className="rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground"
              >
                Painel administrativo
              </Link>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-border bg-surface/88 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              Dados gerais
            </p>
            <div className="mt-5 grid gap-3">
              {[
                { label: "Imóveis ativos", value: stats.activeProperties },
                { label: "Regiões", value: stats.regions },
                { label: "Campanhas", value: stats.activeCampaigns },
                { label: "Leads", value: stats.leads },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border bg-white/6 p-4"
                >
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
            {latestImport ? (
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                Catálogo atualizado em {formatDateTime(latestImport.importedAt)}.
              </p>
            ) : null}
          </aside>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                Imóveis em destaque
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-foreground">
                Unidades para vitrine e captação
              </h2>
            </div>
            <Link href="/imoveis" className="text-sm text-accent-soft">
              Ver catálogo completo
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              Promoções ativas
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-foreground">
              Campanhas já prontas para distribuição
            </h2>
          </div>
          <div className="grid gap-6">
            {highlightedCampaigns.length > 0 ? (
              highlightedCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))
            ) : (
              <div className="rounded-[2rem] border border-border bg-surface/80 p-8 text-muted-foreground">
                Nenhuma campanha ativa para exibição pública.
              </div>
            )}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
