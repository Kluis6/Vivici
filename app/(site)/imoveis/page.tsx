import { DevelopmentStage, PropertyLifecycleStatus } from "@/generated/prisma/client";
import { PropertyCard } from "@/components/property-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
    <main className="mx-auto w-full container px-4 gap-y-16 py-4">
      <Card className="overflow-hidden rounded-none border border-border bg-[linear-gradient(160deg,rgba(10,23,40,0.96),rgba(7,21,37,0.88))] py-0 shadow-[0_30px_100px_rgba(0,0,0,0.24)] ring-0">
        <CardContent className="flex flex-col gap-8 p-7 sm:p-9">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-4">
       
              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                  Busca de imóveis
                </p>
          
           
              </div>
            </div>

    
          </div>

          <form className="grid gap-4  border border-border bg-[rgba(255,255,255,0.04)] p-5 md:grid-cols-5">
            <Input
              type="text"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Busque por nome, bairro ou destaque"
              className="h-12 rounded-none border-border bg-white/6 px-4"
            />

            <select
              name="state"
              defaultValue={params.state ?? ""}
              className="h-12 rounded-none border border-border bg-white/6 px-4 text-sm text-foreground outline-none"
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
              className="h-12 rounded-none  border border-border bg-white/6 px-4 text-sm text-foreground outline-none"
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
              className="h-12 rounded-none  border border-border bg-white/6 px-4 text-sm text-foreground outline-none"
            >
              <option value="">Todas as fases</option>
              {developmentStageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex flex-col gap-3">
              <Input
                type="text"
                name="bedrooms"
                defaultValue={params.bedrooms ?? ""}
                placeholder="Dormitórios"
                className="h-12 rounded-none border-border bg-white/6 px-4"
              />
              <button
                type="submit"
                className="rounded-none  h-12 bg-accent-soft px-5 text-sm font-semibold text-primary-foreground"
              >
                Filtrar
              </button>
            </div>
          </form>
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
    </main>
  );
}
