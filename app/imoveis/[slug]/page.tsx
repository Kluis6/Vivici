import { notFound } from "next/navigation";

import { CampaignStatus, PropertyLifecycleStatus } from "@/generated/prisma/client";
import { CampaignCard } from "@/components/campaign-card";
import { PropertyCard } from "@/components/property-card";
import { SiteShell } from "@/components/site-shell";
import {
  developmentStageOptions,
  labelFromOptions,
  propertyTypeOptions,
} from "@/lib/catalog";
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

  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                {property.region?.name ?? "Catálogo Vivici"}
              </p>
              <div>
                <h1 className="text-5xl font-semibold tracking-[-0.04em] text-foreground">
                  {property.title}
                </h1>
                <p className="mt-3 text-lg text-muted-foreground">
                  {property.neighborhood}
                  {property.region ? ` • ${property.region.name}` : ""}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-border bg-surface">
              {property.heroImageDesktopUrl ?? property.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={property.heroImageDesktopUrl ?? property.coverImageUrl ?? ""}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center text-muted-foreground">
                  Sem imagem principal
                </div>
              )}
            </div>

            {property.descriptionText ? (
              <article className="rounded-[2rem] border border-border bg-surface/82 p-6">
                <h2 className="text-2xl font-semibold text-foreground">Sobre o imóvel</h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-8 text-muted-foreground">
                  {property.descriptionText}
                </p>
              </article>
            ) : null}

            {property.media.length > 0 ? (
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Galeria</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {property.media.slice(0, 9).map((media) => (
                    <div
                      key={media.id}
                      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface"
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

          <aside className="space-y-6">
            <article className="rounded-[2rem] border border-border bg-surface/82 p-6">
              <h2 className="text-2xl font-semibold text-foreground">Resumo</h2>
              <dl className="mt-5 space-y-3 text-sm text-muted-foreground">
                <div className="flex justify-between gap-4">
                  <dt>Tipo</dt>
                  <dd>{labelFromOptions(propertyTypeOptions, property.propertyType) ?? "Não informado"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Fase</dt>
                  <dd>{labelFromOptions(developmentStageOptions, property.developmentStage) ?? "Não informada"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Dormitórios</dt>
                  <dd>{property.bedroomsLabel ?? "Não informado"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Status comercial</dt>
                  <dd>{property.isSoldOut ? "Vendido" : "Disponível"}</dd>
                </div>
              </dl>
            </article>

            {property.amenities.length > 0 ? (
              <article className="rounded-[2rem] border border-border bg-surface/82 p-6">
                <h2 className="text-2xl font-semibold text-foreground">Diferenciais</h2>
                <ul className="mt-5 grid gap-3 text-sm text-muted-foreground">
                  {property.amenities.map((item) => (
                    <li
                      key={`${item.propertyId}-${item.amenityId}-${item.source}`}
                      className="rounded-2xl border border-border bg-white/4 px-4 py-3"
                    >
                      {item.amenity.label}
                    </li>
                  ))}
                </ul>
              </article>
            ) : null}

            {property.locations.length > 0 ? (
              <article className="rounded-[2rem] border border-border bg-surface/82 p-6">
                <h2 className="text-2xl font-semibold text-foreground">Localização</h2>
                <div className="mt-5 space-y-4">
                  {property.locations.map((location) => (
                    <div
                      key={location.id}
                      className="rounded-2xl border border-border bg-white/4 p-4 text-sm text-muted-foreground"
                    >
                      <p className="font-medium text-foreground">{location.label}</p>
                      <p className="mt-2 leading-7">{location.address}</p>
                    </div>
                  ))}
                </div>
              </article>
            ) : null}
          </aside>
        </section>

        {activeCampaigns.length > 0 ? (
          <section className="mt-14 space-y-5">
            <h2 className="text-3xl font-semibold text-foreground">Campanhas ligadas</h2>
            <div className="grid gap-6">
              {activeCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </section>
        ) : null}

        {property.relatedProperties.length > 0 ? (
          <section className="mt-14 space-y-5">
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
    </SiteShell>
  );
}
