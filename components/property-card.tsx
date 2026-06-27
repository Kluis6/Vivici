import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Property, Region } from "@/generated/prisma/client";
import {
  developmentStageOptions,
  labelFromOptions,
  propertyTypeOptions,
} from "@/lib/catalog";
import { normalizeBedroomsLabel } from "@/lib/property";
import { LuBedDouble } from "react-icons/lu";

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
  const typeLabel = labelFromOptions(
    propertyTypeOptions,
    property.propertyType,
  );
  const bedroomItems = normalizeBedroomsLabel(property.bedroomsLabel);

  return (
    <Card className="overflow-hidden rounded-none border border-border bg-surface/90 py-0 shadow-[0_22px_70px_rgba(0,0,0,0.22)] ring-0">
      <div className="relative aspect-4/3 bg-surface-elevated">
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
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[rgba(7,21,37,0.92)] to-transparent" />
        <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
          {property.isFeatured ? <Badge>Destaque</Badge> : null}
          {stageLabel ? (
            <Badge variant="secondary" className="rounded-none">
              {stageLabel}
            </Badge>
          ) : null}
          {typeLabel ? <Badge variant="outline">{typeLabel}</Badge> : null}
        </div>
      </div>

      <CardHeader className="flex flex-col gap-3 px-5 pt-5">
        <CardTitle className="text-2xl font-semibold text-foreground">
          {property.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {property.neighborhood}
          {property.region ?   ` • ${property.region.name}` : ""}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-5">
        <div className="flex flex-col gap-3  bg-[rgba(255,255,255,0.04)] p-3">
          <div className="flex flex-col gap-1  bg-[rgba(255,241,207,0.08)] p-3">
            <span className="text-[11px] uppercase tracking-[0.24em] text-muted">
              Região
            </span>
            <span className="text-sm font-medium text-foreground">
              {property.region?.name ?? "Não informada"}
            </span>
          </div>
          <div className="flex flex-col gap-1 bg-[rgba(255,255,255,0.04)] p-3">
            <span className="text-[11px] uppercase tracking-[0.24em] text-muted">
              Tipologia
            </span>
            {bedroomItems.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {bedroomItems.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-2 bg-black/20 px-2 py-1 text-sm font-normal text-foreground"
                  >
                    <LuBedDouble />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            ) : (
              <span className="flex w-fit items-center gap-2 bg-black/20 px-2 py-1 text-sm font-normal text-foreground">
                <LuBedDouble />
                <span>Sob consulta</span>
              </span>
            )}
          </div>
        </div>
        <p className="text-sm leading-7 text-muted-foreground">
          {property.highlightText ??
            "Consulte os detalhes completos deste imóvel."}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-4 border-t rounded-none border-border bg-[rgba(255,255,255,0.03)] px-5 py-4">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[11px] uppercase tracking-[0.24em] text-muted">
            Vivic Collection
          </span>
          {/* <span className="truncate text-sm text-foreground">{property.slug}</span> */}
        </div>
        <Separator orientation="vertical" className="hidden h-8 md:block" />
        <Link
          href={`/imoveis/${property.slug}`}
          className="inline-flex rounded-none bg-accent-soft px-4 py-2 text-sm font-semibold  hover:opacity-90"
        >
          <p className="text-sm font-medium text-primary-foreground">
            Ver imóvel
          </p>
        </Link>
      </CardFooter>
    </Card>
  );
}
