import Link from "next/link";

import { CampaignCard } from "@/components/campaign-card";
import { PropertyCard } from "@/components/property-card";


import { formatDateTime, getPublicCatalogData } from "@/lib/catalog";
import Herosection from "@/components/herosection";


export const dynamic = "force-dynamic";

export default async function Home() {
  const { featuredProperties, highlightedCampaigns } =
    await getPublicCatalogData();

  return (
    <main className="mx-auto flex w-full container flex-col gap-y-16 px-4 py-4">
      <Herosection />
  
      {/* <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col gap-7 rounded-[2.4rem] border border-border bg-[linear-gradient(160deg,rgba(11,26,43,0.96),rgba(7,21,37,0.88))] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.28)] sm:p-9">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Luxury-led Interface</Badge>
            <Badge variant="outline">Catálogo + CRM + Promoções</Badge>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
              Catálogo, campanhas e operação comercial no mesmo fluxo.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Base pública para captar demanda e painel administrativo para gerir
              imóveis, promoções e evolução comercial.
            </p>
          </div>

          <div className="grid gap-3 rounded-[2rem] border border-border bg-[rgba(255,255,255,0.04)] p-4 sm:grid-cols-3">
            {[
              { label: "Imóveis ativos", value: stats.activeProperties },
              { label: "Regiões", value: stats.regions },
              { label: "Campanhas", value: stats.activeCampaigns },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-1 rounded-[1.4rem] bg-[rgba(255,241,207,0.06)] p-4"
              >
                <span className="text-[11px] uppercase tracking-[0.24em] text-muted">
                  {stat.label}
                </span>
                <span className="text-3xl font-semibold text-foreground">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/imoveis"
              className="rounded-full bg-accent-soft px-5 py-3 text-sm font-semibold text-primary-foreground"
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

        <Card className="relative overflow-hidden rounded-[2.4rem] border border-border bg-surface/92 py-0 shadow-[0_30px_100px_rgba(0,0,0,0.24)] ring-0">
          <div className="relative min-h-[520px]">
            {spotlightProperty?.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={spotlightProperty.coverImageUrl}
                alt={spotlightProperty.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,21,37,0.16),rgba(7,21,37,0.9))]" />
            <CardContent className="relative flex h-full flex-col justify-between gap-6 p-7 sm:p-9">
              <div className="flex items-start justify-between gap-3">
                <Badge variant="secondary">Spotlight Listing</Badge>
                <Badge variant="outline">Lead-ready</Badge>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent-soft">
                    {spotlightProperty?.region?.name ?? "Vivici Prime"}
                  </p>
                  <h2 className="max-w-xl text-4xl font-semibold leading-tight text-foreground">
                    {spotlightProperty?.title ?? "Seleção editorial de imóveis"}
                  </h2>
                </div>

                <div className="grid gap-3 rounded-[1.8rem] border border-border bg-[rgba(255,245,232,0.14)] p-4 backdrop-blur sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-[0.24em] text-muted">
                      Bairro
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {spotlightProperty?.neighborhood ?? "Curadoria Vivici"}
                    </span>
                  </div>
                  <Separator orientation="vertical" className="hidden h-10 sm:block" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-[0.24em] text-muted">
                      Catálogo atualizado
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {latestImport ? formatDateTime(latestImport.importedAt) : "Aguardando"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </section> */}

      <section className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              Imóveis em destaque
            </p>
            <h2 className="text-3xl font-semibold text-foreground">
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

      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Promoções ativas
          </p>
          <h2 className="text-3xl font-semibold text-foreground">
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
  );
}
