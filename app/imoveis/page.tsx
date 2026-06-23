import { DevelopmentStage, PropertyLifecycleStatus } from "@/generated/prisma/client";
import { PropertyCard } from "@/components/property-card";
import { SiteShell } from "@/components/site-shell";
import { developmentStageOptions } from "@/lib/catalog";
import { getPrisma } from "@/lib/prisma";

type PropertiesPageProps = {
  searchParams: Promise<{
    q?: string;
    state?: string;
    region?: string;
    stage?: DevelopmentStage;
    bedrooms?: string;
  }>;
};

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const prisma = getPrisma();

  const [states, regions, properties] = await Promise.all([
    prisma.state.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    prisma.region.findMany({
      orderBy: [{ stateCode: "asc" }, { name: "asc" }],
    }),
    prisma.property.findMany({
      where: {
        status: PropertyLifecycleStatus.ACTIVE,
        ...(params.q
          ? {
              OR: [
                { title: { contains: params.q, mode: "insensitive" } },
                { neighborhood: { contains: params.q, mode: "insensitive" } },
                { highlightText: { contains: params.q, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(params.state ? { stateCode: params.state } : {}),
        ...(params.region ? { region: { slug: params.region } } : {}),
        ...(params.stage ? { developmentStage: params.stage } : {}),
        ...(params.bedrooms
          ? {
              OR: [
                { bedroomsLabel: { contains: params.bedrooms, mode: "insensitive" } },
                { minBedrooms: { lte: Number(params.bedrooms) } },
                { maxBedrooms: { gte: Number(params.bedrooms) } },
              ],
            }
          : {}),
      },
      orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
      include: {
        region: true,
      },
    }),
  ]);

  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
        <section className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Busca de imóveis
          </p>
          <h1 className="text-5xl font-semibold tracking-[-0.04em] text-foreground">
            Catálogo com filtros operacionais
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
            Explore imóveis por texto, estado, região, fase do empreendimento e
            dormitórios.
          </p>
        </section>

        <form className="mt-8 grid gap-4 rounded-[2rem] border border-border bg-surface/84 p-6 md:grid-cols-5">
          <input
            type="text"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Busque por nome, bairro ou destaque"
            className="h-12 rounded-2xl border border-border bg-white/6 px-4 text-sm text-foreground outline-none focus:border-[var(--border-strong)]"
          />

          <select
            name="state"
            defaultValue={params.state ?? ""}
            className="h-12 rounded-2xl border border-border bg-white/6 px-4 text-sm text-foreground outline-none"
          >
            <option value="">Todos os estados</option>
            {states.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>

          <select
            name="region"
            defaultValue={params.region ?? ""}
            className="h-12 rounded-2xl border border-border bg-white/6 px-4 text-sm text-foreground outline-none"
          >
            <option value="">Todas as regiões</option>
            {regions.map((region) => (
              <option key={region.id} value={region.slug}>
                {region.name} ({region.stateCode})
              </option>
            ))}
          </select>

          <select
            name="stage"
            defaultValue={params.stage ?? ""}
            className="h-12 rounded-2xl border border-border bg-white/6 px-4 text-sm text-foreground outline-none"
          >
            <option value="">Todas as fases</option>
            {developmentStageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <input
              type="text"
              name="bedrooms"
              defaultValue={params.bedrooms ?? ""}
              placeholder="Dormitórios"
              className="h-12 min-w-0 flex-1 rounded-2xl border border-border bg-white/6 px-4 text-sm text-foreground outline-none focus:border-[var(--border-strong)]"
            />
            <button
              type="submit"
              className="rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              Filtrar
            </button>
          </div>
        </form>

        <section className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="rounded-[2rem] border border-border bg-surface/80 p-8 text-muted-foreground">
              Nenhum imóvel encontrado com os filtros atuais.
            </div>
          )}
        </section>
      </main>
    </SiteShell>
  );
}
