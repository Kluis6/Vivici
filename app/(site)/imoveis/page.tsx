import type { Metadata } from "next";
import Link from "next/link";
import { DevelopmentStage, PropertyLifecycleStatus } from "@/generated/prisma/client";
import { PropertyCard } from "@/components/property-card";
import { PropertySearchForm } from "@/components/property-search-form";
import { Card, CardContent } from "@/components/ui/card";
import { developmentStageOptions } from "@/lib/catalog";
import { getPrisma } from "@/lib/prisma";
import { buildPageMetadata, seoConfig } from "@/lib/seo";

type PropertiesPageProps = {
  searchParams: Promise<{
    q?: string;
    state?: string;
    region?: string;
    stage?: DevelopmentStage;
    bedrooms?: string;
    page?: string;
  }>;
};

const PAGE_SIZE = 12;

export const metadata: Metadata = buildPageMetadata({
  title: "Buscar imóveis",
  description:
    "Busque imóveis da Vivici por estado, região, fase do empreendimento e dormitórios para encontrar oportunidades alinhadas ao seu perfil.",
  path: "/imoveis",
  image: seoConfig.defaultOgImage,
  imageAlt:
    "Página de busca de imóveis da Vivici com filtros por estado, região, fase e dormitórios.",
  keywords: [
    "buscar imóveis",
    "apartamentos à venda",
    "lançamentos imobiliários",
    "imóveis RJ",
    "imóveis SP",
  ],
});

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);
  if (currentPage <= 2) pages.add(3);
  if (currentPage >= totalPages - 1) pages.add(totalPages - 2);

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const prisma = getPrisma();
  const currentPage = Math.max(1, Number(params.page) || 1);
  const where = {
    status: PropertyLifecycleStatus.ACTIVE,
    ...(params.q
      ? {
          OR: [
            { title: { contains: params.q, mode: "insensitive" as const } },
            { neighborhood: { contains: params.q, mode: "insensitive" as const } },
            { highlightText: { contains: params.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(params.state ? { stateCode: params.state } : {}),
    ...(params.region ? { region: { slug: params.region } } : {}),
    ...(params.stage ? { developmentStage: params.stage } : {}),
    ...(params.bedrooms
      ? {
          OR: [
            { bedroomsLabel: { contains: params.bedrooms, mode: "insensitive" as const } },
            { minBedrooms: { lte: Number(params.bedrooms) } },
            { maxBedrooms: { gte: Number(params.bedrooms) } },
          ],
        }
      : {}),
  };

  const [states, regions, totalProperties] = await Promise.all([
    prisma.state.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    prisma.region.findMany({
      orderBy: [{ stateCode: "asc" }, { name: "asc" }],
    }),
    prisma.property.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalProperties / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const properties = await prisma.property.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
    include: {
      region: true,
    },
    take: PAGE_SIZE,
    skip: (safePage - 1) * PAGE_SIZE,
  });
  const buildPageHref = (page: number) => {
    const query = new URLSearchParams();

    if (params.q) query.set("q", params.q);
    if (params.state) query.set("state", params.state);
    if (params.region) query.set("region", params.region);
    if (params.stage) query.set("stage", params.stage);
    if (params.bedrooms) query.set("bedrooms", params.bedrooms);
    if (page > 1) query.set("page", String(page));

    const search = query.toString();
    return search ? `/imoveis?${search}` : "/imoveis";
  };
  const startResult = totalProperties === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endResult = Math.min(safePage * PAGE_SIZE, totalProperties);
  const visiblePages = getVisiblePages(safePage, totalPages);

  return (
    <main className="mx-auto w-full container px-4 gap-y-16 py-4">
      <Card className="overflow-hidden rounded-none border border-border bg-[linear-gradient(160deg,rgba(10,23,40,0.96),rgba(7,21,37,0.88))] py-0 shadow-[0_30px_100px_rgba(0,0,0,0.24)] ring-0">
        <CardContent className="flex flex-col gap-8 p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                  Busca de imóveis
                </p>
     
              </div>
            </div>
          </div>
          <PropertySearchForm
            params={params}
            states={states}
            regions={regions}
            stageOptions={developmentStageOptions}
          />
        </CardContent>
      </Card>

      <section className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {properties.length > 0 ? (
          properties.map((property) => <PropertyCard key={property.id} property={property} />)
        ) : (
          <div className="rounded-[2rem] border border-border bg-surface/80 p-8 text-muted-foreground">
            Nenhum imóvel encontrado com os filtros atuais.
          </div>
        )}
      </section>

      {totalProperties > 0 ? (
        <section className="mt-10  flex flex-col gap-4 border-t border-border/70 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-center text-sm text-muted-foreground lg:text-left">
            Exibindo {startResult}-{endResult} de {totalProperties} imóveis
          </p>
          <div className="flex  gap-3 sm:flex-row items-center justify-center lg:justify-end">
            {safePage > 1 ? (
              <Link
                href={buildPageHref(safePage - 1)}
                scroll
                className="min-w-28 rounded-none border border-border px-4 py-2 text-center text-sm text-foreground transition hover:bg-white/6"
              >
                Anterior
              </Link>
            ) : (
              <span className="min-w-28 rounded-none border border-border/50 px-4 py-2 text-center text-sm text-muted-foreground">
                Anterior
              </span>
            )}

            <span className="text-sm text-muted-foreground sm:hidden">
              {safePage} / {totalPages}
            </span>

            <div className="hidden flex-wrap items-center justify-center gap-2 sm:flex">
              {visiblePages.map((page, index) => {
                const previousPage = visiblePages[index - 1];
                const hasGap = previousPage && page - previousPage > 1;

                return (
                  <div key={page} className="flex items-center gap-2">
                    {hasGap ? (
                      <span className="px-1 text-sm text-muted-foreground">...</span>
                    ) : null}
                    {page === safePage ? (
                      <span className="min-w-10 rounded-none border border-border bg-white/8 px-3 py-2 text-center text-sm font-semibold text-foreground">
                        {page}
                      </span>
                    ) : (
                      <Link
                        href={buildPageHref(page)}
                        scroll
                        className="min-w-10 rounded-none border border-border px-3 py-2 text-center text-sm text-primary-foreground transition hover:bg-white/6"
                      >
                        {page}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {safePage < totalPages ? (
              <Link
                href={buildPageHref(safePage + 1)}
                scroll
                className="min-w-28 rounded-none bg-accent-soft px-4 py-2 text-center text-sm font-semibold transition hover:bg-primary"
              >
                <span className="text-accent-foreground"> Próxima</span>
               
              </Link>
            ) : (
              <span className="min-w-28 rounded-none  bg-white/8 px-4 py-2 text-center text-sm text-primary-foreground">
                Próxima
              </span>
            )}
          </div>
        </section>
      ) : null}
    </main>
  );
}
