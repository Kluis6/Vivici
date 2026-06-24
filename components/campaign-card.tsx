import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="overflow-hidden rounded-[2rem] border border-border bg-surface/92 py-0 shadow-[0_24px_72px_rgba(0,0,0,0.2)] ring-0">
      {firstProperty?.coverImageUrl ? (
        <div className="relative aspect-[16/8]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={firstProperty.coverImageUrl}
            alt={campaign.headline}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[rgba(7,21,37,0.92)] to-transparent" />
          <div className="absolute inset-x-5 bottom-4 flex flex-wrap gap-2">
            {campaign.isHighlighted ? <Badge>Campaign Spotlight</Badge> : null}
            {statusLabel ? <Badge variant="secondary">{statusLabel}</Badge> : null}
            {promotionTypeLabel ? <Badge variant="outline">{promotionTypeLabel}</Badge> : null}
          </div>
        </div>
      ) : null}

      <CardHeader className="flex flex-col gap-3 px-6 pt-6">
        <div className="flex flex-wrap gap-2">
          {placementLabel ? <Badge variant="ghost">{placementLabel}</Badge> : null}
          {campaign.properties.length > 0 ? (
            <Badge variant="outline">{campaign.properties.length} imóveis</Badge>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
            {campaign.name}
          </p>
          <CardTitle className="text-3xl font-semibold leading-tight text-foreground">
            {campaign.headline}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 px-6">
        {campaign.description ? (
          <p className="text-sm leading-7 text-muted-foreground">
            {campaign.description}
          </p>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-1 rounded-[1.3rem] bg-[rgba(255,241,207,0.08)] p-4">
            <span className="text-[11px] uppercase tracking-[0.24em] text-muted">
              Janela da campanha
            </span>
            <span className="text-sm text-foreground">
              {getCampaignWindowLabel(campaign.startsAt, campaign.endsAt)}
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-[1.3rem] bg-[rgba(255,255,255,0.04)] p-4">
            <span className="text-[11px] uppercase tracking-[0.24em] text-muted">
              Região dominante
            </span>
            <span className="text-sm text-foreground">
              {firstProperty?.region?.name ?? "Multirregional"}
            </span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {campaign.properties.length > 0 ? (
            <p>{campaign.properties.length} imóvel(is) vinculado(s) para esta ação.</p>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center gap-3 border-t border-border bg-[rgba(255,255,255,0.03)] px-6 py-4">
        {campaign.ctaUrl ? (
          <Link
            href={campaign.ctaUrl}
            className="inline-flex rounded-full bg-accent-soft px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
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
      </CardFooter>
    </Card>
  );
}
