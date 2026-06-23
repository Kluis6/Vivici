import Link from "next/link";

import type { Property, Region } from "@/generated/prisma/client";
import {
  developmentStageOptions,
  labelFromOptions,
  propertyTypeOptions,
} from "@/lib/catalog";

type PropertyCardProps = {
  property: Pick<
    Property,
    | "slug"
    | "title"
    | "neighborhood"
    | "highlightText"
    | "coverImageUrl"
    | "bedroomsLabel"
    | "developmentStage"
    | "propertyType"
    | "isFeatured"
  > & {
    region: Pick<Region, "name"> | null;
  };
};

export function PropertyCard({ property }: PropertyCardProps) {
  const stageLabel = labelFromOptions(
    developmentStageOptions,
    property.developmentStage,
  );
  const typeLabel = labelFromOptions(propertyTypeOptions, property.propertyType);

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-border bg-surface/88 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
      <div className="aspect-[4/3] bg-surface-elevated">
        {property.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.coverImageUrl}
            alt={property.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem imagem
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2">
          {property.isFeatured ? (
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              Destaque
            </span>
          ) : null}
          {stageLabel ? (
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              {stageLabel}
            </span>
          ) : null}
          {typeLabel ? (
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              {typeLabel}
            </span>
          ) : null}
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-foreground">{property.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {property.neighborhood}
            {property.region ? ` • ${property.region.name}` : ""}
          </p>
        </div>

        <p className="text-sm leading-7 text-muted-foreground">
          {property.highlightText ?? "Consulte os detalhes completos deste imóvel."}
        </p>

        {property.bedroomsLabel ? (
          <p className="text-sm font-medium text-accent-soft">{property.bedroomsLabel}</p>
        ) : null}

        <Link
          href={`/imoveis/${property.slug}`}
          className="inline-flex rounded-full border border-border bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-white/10"
        >
          Ver imóvel
        </Link>
      </div>
    </article>
  );
}
