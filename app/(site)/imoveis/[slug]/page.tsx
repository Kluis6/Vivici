import { notFound } from "next/navigation";

import { CampaignStatus, PropertyLifecycleStatus } from "@/generated/prisma/client";
import { CampaignCard } from "@/components/campaign-card";
import { PropertyCard } from "@/components/property-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  developmentStageOptions,
  labelFromOptions,
  propertyTypeOptions,
} from "@/lib/catalog";
import { normalizeBedroomsLabel } from "@/lib/property";
import { getPrisma } from "@/lib/prisma";

type PropertyDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { slug } = await params;
  const prisma = getPrisma();

  const property = await prisma.property.findUnique({
    where: { slug },
    include: {
      region: true,
      media: {
        orderBy: {
          position: "asc",
        },
      },
      amenities: {
        orderBy: {
          position: "asc",
        },
        include: {
          amenity: true,
        },
      },
      locations: {
        orderBy: {
          position: "asc",
        },
      },
      relatedProperties: {
        orderBy: {
          position: "asc",
        },
        include: {
          relatedProperty: {
            include: {
              region: true,
            },
          },
        },
      },
      campaigns: {
        include: {
          campaign: {
            include: {
              properties: {
                include: {
                  property: {
                    include: {
                      region: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!property || property.status === PropertyLifecycleStatus.ARCHIVED) {
    notFound();
  }

  const activeCampaigns = property.campaigns
    .map((item) => item.campaign)
    .filter((campaign) => {
      const allowedStatuses: CampaignStatus[] = [
        CampaignStatus.ACTIVE,
        CampaignStatus.SCHEDULED,
      ];

      return allowedStatuses.includes(campaign.status);
    });
  const bedroomItems = normalizeBedroomsLabel(property.bedroomsLabel);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden rounded-[2.4rem] border border-border bg-surface/92 py-0 shadow-[0_26px_90px_rgba(0,0,0,0.22)] ring-0">
            <div className="relative overflow-hidden">
              {property.heroImageDesktopUrl ?? property.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={property.heroImageDesktopUrl ?? property.coverImageUrl ?? ""}
                  alt={property.title}
                  className="aspect-[16/10] h-full w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center text-muted-foreground">
                  Sem imagem principal
                </div>
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,21,37,0.12),rgba(7,21,37,0.88))]" />
              <CardContent className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-7 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {labelFromOptions(propertyTypeOptions, property.propertyType) ?? "Imóvel"}
                  </Badge>
                  {property.developmentStage ? (
                    <Badge variant="outline">
                      {labelFromOptions(developmentStageOptions, property.developmentStage)}
                    </Badge>
                  ) : null}
                  <Badge variant="outline">
                    {property.isSoldOut ? "Vendido" : "Disponível"}
                  </Badge>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-soft">
                    {property.region?.name ?? "Catálogo Vivici"}
                  </p>
                  <h1 className="text-5xl font-semibold tracking-[-0.04em] text-foreground">
                    {property.title}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {property.neighborhood}
                    {property.region ? ` • ${property.region.name}` : ""}
                  </p>
                </div>

                <div className="grid gap-3 rounded-[1.8rem] border border-border bg-[rgba(255,245,232,0.14)] p-4 backdrop-blur sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-[0.24em] text-muted">
                      Dormitórios
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {bedroomItems.length > 0 ? (
                        bedroomItems.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-black/20 px-3 py-1 text-sm font-medium text-foreground"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm font-medium text-foreground">
                          Sob consulta
                        </span>
                      )}
                    </div>
                  </div>
                  <Separator orientation="vertical" className="hidden h-10 sm:block" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-[0.24em] text-muted">
                      Bairro
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {property.neighborhood}
                    </span>
                  </div>
                  <Separator orientation="vertical" className="hidden h-10 sm:block" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-[0.24em] text-muted">
                      Fonte
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      Vivici Collection
                    </span>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {property.descriptionText ? (
            <Card className="rounded-[2rem] border border-border bg-surface/82 shadow-[0_18px_60px_rgba(0,0,0,0.14)] ring-0">
              <CardHeader className="flex flex-col gap-2">
                <CardTitle className="text-2xl font-semibold text-foreground">
                  Sobre o imóvel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm leading-8 text-muted-foreground">
                  {property.descriptionText}
                </p>
              </CardContent>
            </Card>
          ) : null}

          {property.media.length > 0 ? (
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-foreground">Galeria</h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {property.media.slice(0, 9).map((media) => (
                  <div
                    key={media.id}
                    className="overflow-hidden rounded-[1.6rem] border border-border bg-surface shadow-[0_14px_50px_rgba(0,0,0,0.12)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={media.url}
                      alt={media.alt ?? property.title}
                      className="aspect-[4/3] h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="flex flex-col gap-6">
          <Card className="rounded-[2rem] border border-border bg-surface/82 ring-0">
            <CardHeader className="flex flex-col gap-2">
              <CardTitle className="text-2xl font-semibold text-foreground">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex justify-between gap-4">
                <dt>Tipo</dt>
                <dd>
                  {labelFromOptions(propertyTypeOptions, property.propertyType) ??
                    "Não informado"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Fase</dt>
                <dd>
                  {labelFromOptions(
                    developmentStageOptions,
                    property.developmentStage,
                  ) ?? "Não informada"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Dormitórios</dt>
                <dd>{bedroomItems.length > 0 ? bedroomItems.join(" • ") : "Não informado"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Status comercial</dt>
                <dd>{property.isSoldOut ? "Vendido" : "Disponível"}</dd>
              </div>
            </CardContent>
          </Card>

          {property.amenities.length > 0 ? (
            <Card className="rounded-[2rem] border border-border bg-surface/82 ring-0">
              <CardHeader className="flex flex-col gap-2">
                <CardTitle className="text-2xl font-semibold text-foreground">
                  Diferenciais
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-muted-foreground">
                {property.amenities.map((item) => (
                  <div
                    key={`${item.propertyId}-${item.amenityId}-${item.source}`}
                    className="rounded-2xl border border-border bg-white/4 px-4 py-3"
                  >
                    {item.amenity.label}
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {property.locations.length > 0 ? (
            <Card className="rounded-[2rem] border border-border bg-surface/82 ring-0">
              <CardHeader className="flex flex-col gap-2">
                <CardTitle className="text-2xl font-semibold text-foreground">
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {property.locations.map((location) => (
                  <div
                    key={location.id}
                    className="rounded-2xl border border-border bg-white/4 p-4 text-sm text-muted-foreground"
                  >
                    <p className="font-medium text-foreground">{location.label}</p>
                    <p className="mt-2 leading-7">{location.address}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </section>

      {activeCampaigns.length > 0 ? (
        <section className="mt-14 flex flex-col gap-5">
          <h2 className="text-3xl font-semibold text-foreground">Campanhas ligadas</h2>
          <div className="grid gap-6">
            {activeCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>
      ) : null}

      {property.relatedProperties.length > 0 ? (
        <section className="mt-14 flex flex-col gap-5">
          <h2 className="text-3xl font-semibold text-foreground">Imóveis relacionados</h2>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {property.relatedProperties
              .map((relation) => relation.relatedProperty)
              .filter((item): item is NonNullable<typeof item> => item !== null)
              .slice(0, 3)
              .map((relatedProperty) => (
                <PropertyCard key={relatedProperty.id} property={relatedProperty} />
              ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
