import { notFound } from "next/navigation";
import {
  AmenitySource,
  CampaignStatus,
  PropertyLifecycleStatus,
} from "@/generated/prisma/client";
import { CampaignCard } from "@/components/campaign-card";
import { PropertyCard } from "@/components/property-card";
import { PropertyMediaGallery } from "@/components/property-media-gallery";
import { PropertyShareActions } from "@/components/property-share-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  developmentStageOptions,
  labelFromOptions,
  propertyTypeOptions,
} from "@/lib/catalog";
import { getAmenityIcon } from "@/lib/amenity-icons";
import { normalizeBedroomsLabel } from "@/lib/property";
import { getPrisma } from "@/lib/prisma";
import { LuBedDouble } from "react-icons/lu";

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
  const dedupedAmenities = Array.from(
    property.amenities
      .slice()
      .sort((a, b) => {
        const sourceScore = (source: AmenitySource) =>
          source === AmenitySource.DETAIL ? 0 : 1;

        return sourceScore(a.source) - sourceScore(b.source);
      })
      .reduce((map, item) => {
        const key = item.amenityId;

        if (!map.has(key)) {
          map.set(key, item);
        }

        return map;
      }, new Map<string, (typeof property.amenities)[number]>())
      .values(),
  ).sort((a, b) => a.position - b.position);

  return (
    <main className="mx-auto w-full container px-4 py-4">
      <Card className="overflow-hidden rounded-none border border-border bg-surface/90 py-0 shadow-[0_22px_70px_rgba(0,0,0,0.22)] ring-0">
        <div className="relative overflow-hidden">
          {(property.heroImageDesktopUrl ?? property.coverImageUrl) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={property.heroImageDesktopUrl ?? property.coverImageUrl ?? ""}
              alt={property.title}
              className="md:aspect-16/10 h-[50vh] md:h-[80vh] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-16/10 items-center justify-center text-muted-foreground">
              Sem imagem principal
            </div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,21,37,0.12),rgba(7,21,37,0.88))]" />
          <CardContent className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-5 md:p-8">
            <div className="flex flex-wrap gap-2">
              {/* <Badge variant="secondary">
                {labelFromOptions(propertyTypeOptions, property.propertyType) ?? "Imóvel"}
              </Badge> */}
              {property.developmentStage ? (
                <Badge className="rounded-none bg-accent-foreground text-white">
                  {labelFromOptions(
                    developmentStageOptions,
                    property.developmentStage,
                  )}
                </Badge>
              ) : null}
              <Badge className="rounded-none bg-accent-foreground text-white">
                {property.isSoldOut ? "Vendido" : "Disponível"}
              </Badge>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-soft">
                {property.region?.name ?? "Catálogo Vivici"}
              </p>
              <h1 className="lg:text-5xl text-3xl font-semibold tracking-[-0.04em] text-foreground">
                {property.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {property.neighborhood}
                {property.region ? ` • ${property.region.name}` : ""}
              </p>
            </div>

            {/* <div className="grid gap-3 rounded-[1.8rem] border border-border bg-[rgba(255,245,232,0.14)] p-4 backdrop-blur sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
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
            </div> */}
          </CardContent>
        </div>

        <CardContent className="flex flex-col gap-8 p-5 sm:p-6">
          <section className="flex flex-col gap-4">
            {dedupedAmenities.length > 0 ? (
              <section className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {dedupedAmenities.map((item) => (
                    <Badge
                      key={`${item.propertyId}-${item.amenityId}-${item.source}`}
                      className="rounded-none text-white bg-black/30 gap-x-1.5"
                    >
                      {getAmenityIcon(item.amenity.label)}
                      <p>{item.amenity.label}</p>
                    </Badge>
                  ))}
                </div>
              </section>
            ) : null}

            {property.descriptionText ? (
              <section className="flex flex-col gap-4">
                <p className="whitespace-pre-line text-sm leading-8 text-muted-foreground">
                  {property.descriptionText}
                </p>
              </section>
            ) : null}

            {property.locations.length > 0 ? (
              <section className="flex flex-col gap-4">
                <CardTitle className="md:text-2xl text-xl font-semibold text-foreground">
                  Localização
                </CardTitle>
                <div className="grid gap-4">
                  {property.locations.map((location) => (
                    <div
                      key={location.id}
                      className="text-sm text-muted-foreground"
                    >
                      <p className="font-medium text-foreground">
                        {location.label}
                      </p>
                      <p className="mt-2 leading-7">{location.address}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <PropertyShareActions title={property.title} />
            {/* <div className="grid gap-3 md:grid-cols-2">
              <div className="flex justify-between gap-4 border border-border bg-white/4 px-4 py-3">
                <dt>Tipo</dt>
                <dd>
                  {labelFromOptions(propertyTypeOptions, property.propertyType) ??
                    "Não informado"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border border-border bg-white/4 px-4 py-3">
                <dt>Fase</dt>
                <dd>
                  {labelFromOptions(
                    developmentStageOptions,
                    property.developmentStage,
                  ) ?? "Não informada"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border border-border bg-white/4 px-4 py-3">
                <dt>Dormitórios</dt>
                <dd>{bedroomItems.length > 0 ? bedroomItems.join(" • ") : "Não informado"}</dd>
              </div>
              <div className="flex justify-between gap-4 border border-border bg-white/4 px-4 py-3">
                <dt>Status comercial</dt>
                <dd>{property.isSoldOut ? "Vendido" : "Disponível"}</dd>
              </div>
            </div> */}
          </section>

          {property.media.length > 0 ? (
            <section className="flex flex-col gap-4">
              <CardTitle className="text-2xl font-semibold text-foreground">
                Galeria
              </CardTitle>
              <PropertyMediaGallery
                title={property.title}
                items={property.media
                  .slice(0, 9)
                  .map((media) => ({
                    id: media.id,
                    url: media.url,
                    alt: media.alt,
                  }))}
              />
            </section>
          ) : null}
        </CardContent>
      </Card>

      {activeCampaigns.length > 0 ? (
        <Card className="mt-14 rounded-none border border-border bg-surface/90 py-0 shadow-[0_22px_70px_rgba(0,0,0,0.22)] ring-0">
          <CardHeader className="flex flex-col gap-2">
            <CardTitle className="text-3xl font-semibold text-foreground">
              Campanhas ligadas
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            {activeCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </CardContent>
        </Card>
      ) : null}

      {property.relatedProperties.length > 0 ? (
        <div className="mt-14  space-y-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-semibold text-foreground">
              Imóveis relacionados
            </h3>
          </div>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {property.relatedProperties
              .map((relation) => relation.relatedProperty)
              .filter((item): item is NonNullable<typeof item> => item !== null)
              .slice(0, 3)
              .map((relatedProperty) => (
                <PropertyCard
                  key={relatedProperty.id}
                  property={relatedProperty}
                />
              ))}
          </div>
        </div>
      ) : null}
    </main>
  );
}
