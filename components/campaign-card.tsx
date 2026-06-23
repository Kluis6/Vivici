import Link from "next/link";

import type { Campaign, CampaignProperty, Property, Region } from "@/generated/prisma/client";
import {
  campaignPlacementOptions,
  campaignStatusOptions,
  getCampaignWindowLabel,
  labelFromOptions,
  promotionTypeOptions,
} from "@/lib/catalog";

type CampaignCardProps = {
  campaign: Pick<
    Campaign,
    | "id"
    | "slug"
    | "name"
    | "headline"
    | "description"
    | "status"
    | "placement"
    | "promotionType"
    | "ctaLabel"
    | "ctaUrl"
    | "startsAt"
    | "endsAt"
    | "isHighlighted"
  > & {
    properties: Array<
      Pick<CampaignProperty, "highlightText"> & {
        property: Pick<Property, "slug" | "title" | "coverImageUrl"> & {
          region: Pick<Region, "name"> | null;
        };
      }
    >;
  };
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const firstProperty = campaign.properties[0]?.property;
  const statusLabel = labelFromOptions(campaignStatusOptions, campaign.status);
  const placementLabel = labelFromOptions(campaignPlacementOptions, campaign.placement);
  const promotionTypeLabel = labelFromOptions(
    promotionTypeOptions,
    campaign.promotionType,
  );

  return (
    <article className="overflow-hidden rounded-[1.9rem] border border-border bg-surface/90 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
      {firstProperty?.coverImageUrl ? (
        <div className="aspect-[16/8]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={firstProperty.coverImageUrl}
            alt={campaign.headline}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          {campaign.isHighlighted ? (
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              Campanha em destaque
            </span>
          ) : null}
          {statusLabel ? (
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              {statusLabel}
            </span>
          ) : null}
          {placementLabel ? (
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              {placementLabel}
            </span>
          ) : null}
          {promotionTypeLabel ? (
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              {promotionTypeLabel}
            </span>
          ) : null}
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
            {campaign.name}
          </p>
          <h3 className="mt-2 text-3xl font-semibold leading-tight text-foreground">
            {campaign.headline}
          </h3>
        </div>

        {campaign.description ? (
          <p className="text-sm leading-7 text-muted-foreground">
            {campaign.description}
          </p>
        ) : null}

        <div className="space-y-1 text-sm text-muted-foreground">
          <p>{getCampaignWindowLabel(campaign.startsAt, campaign.endsAt)}</p>
          {campaign.properties.length > 0 ? (
            <p>
              {campaign.properties.length} imóvel(is) vinculado(s)
              {firstProperty?.region ? ` • ${firstProperty.region.name}` : ""}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          {campaign.ctaUrl ? (
            <Link
              href={campaign.ctaUrl}
              className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {campaign.ctaLabel ?? "Acessar campanha"}
            </Link>
          ) : null}

          {firstProperty ? (
            <Link
              href={`/imoveis/${firstProperty.slug}`}
              className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-white/6"
            >
              Ver imóvel ligado
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
