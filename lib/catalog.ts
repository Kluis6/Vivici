import {
  CampaignChannel,
  CampaignPlacement,
  CampaignStatus,
  DevelopmentStage,
  PromotionType,
  PropertyLifecycleStatus,
  PropertyType,
} from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";

export const propertyTypeOptions = [
  { value: PropertyType.APARTMENT, label: "Apartamento" },
  { value: PropertyType.HOUSE, label: "Casa" },
  { value: PropertyType.COMMERCIAL, label: "Comercial" },
  { value: PropertyType.LAND, label: "Terreno" },
  { value: PropertyType.STUDIO, label: "Studio" },
  { value: PropertyType.OTHER, label: "Outro" },
] as const;

export const propertyStatusOptions = [
  { value: PropertyLifecycleStatus.DRAFT, label: "Rascunho" },
  { value: PropertyLifecycleStatus.ACTIVE, label: "Ativo" },
  { value: PropertyLifecycleStatus.IN_NEGOTIATION, label: "Em negociação" },
  { value: PropertyLifecycleStatus.SOLD, label: "Vendido" },
  { value: PropertyLifecycleStatus.ARCHIVED, label: "Arquivado" },
] as const;

export const developmentStageOptions = [
  { value: DevelopmentStage.RELEASE, label: "Lançamento" },
  { value: DevelopmentStage.UNDER_CONSTRUCTION, label: "Em obras" },
  { value: DevelopmentStage.READY, label: "Pronto" },
] as const;

export const campaignStatusOptions = [
  { value: CampaignStatus.DRAFT, label: "Rascunho" },
  { value: CampaignStatus.SCHEDULED, label: "Agendada" },
  { value: CampaignStatus.ACTIVE, label: "Ativa" },
  { value: CampaignStatus.PAUSED, label: "Pausada" },
  { value: CampaignStatus.FINISHED, label: "Finalizada" },
  { value: CampaignStatus.ARCHIVED, label: "Arquivada" },
] as const;

export const campaignChannelOptions = [
  { value: CampaignChannel.SITE, label: "Site" },
  { value: CampaignChannel.WHATSAPP, label: "WhatsApp" },
  { value: CampaignChannel.META, label: "Meta Ads" },
  { value: CampaignChannel.GOOGLE, label: "Google" },
  { value: CampaignChannel.EMAIL, label: "Email" },
  { value: CampaignChannel.PARTNER, label: "Parceiro" },
  { value: CampaignChannel.OTHER, label: "Outro" },
] as const;

export const campaignPlacementOptions = [
  { value: CampaignPlacement.HERO, label: "Hero" },
  { value: CampaignPlacement.HIGHLIGHT, label: "Destaque" },
  { value: CampaignPlacement.GRID, label: "Grid" },
  { value: CampaignPlacement.LANDING_PAGE, label: "Landing page" },
  { value: CampaignPlacement.POPUP, label: "Popup" },
  { value: CampaignPlacement.OTHER, label: "Outro" },
] as const;

export const promotionTypeOptions = [
  { value: PromotionType.DISCOUNT, label: "Desconto" },
  { value: PromotionType.BONUS, label: "Bônus" },
  { value: PromotionType.SUBSIDY, label: "Subsídio" },
  { value: PromotionType.LAUNCH, label: "Lançamento" },
  { value: PromotionType.INVESTMENT, label: "Investimento" },
  { value: PromotionType.CASHBACK, label: "Cashback" },
  { value: PromotionType.LIMITED_TIME, label: "Tempo limitado" },
  { value: PromotionType.OTHER, label: "Outro" },
] as const;

export function labelFromOptions<T extends string>(
  options: readonly { value: T; label: string }[],
  value: T | null | undefined,
) {
  if (!value) {
    return null;
  }

  return options.find((option) => option.value === value)?.label ?? value;
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseBedroomSummary(label: string | null | undefined) {
  if (!label) {
    return { minBedrooms: null, maxBedrooms: null, hasStudio: false };
  }

  const normalized = label.toLowerCase();
  const hasStudio = normalized.includes("studio");
  const bedroomNumbers = Array.from(normalized.matchAll(/(\d+)/g)).map((match) =>
    Number(match[1]),
  );

  if (hasStudio) {
    bedroomNumbers.push(0);
  }

  if (bedroomNumbers.length === 0) {
    return { minBedrooms: null, maxBedrooms: null, hasStudio };
  }

  return {
    minBedrooms: Math.min(...bedroomNumbers),
    maxBedrooms: Math.max(...bedroomNumbers),
    hasStudio,
  };
}

export function formatDateTime(value: Date | null | undefined) {
  if (!value) {
    return "Não informado";
  }

  return value.toLocaleString("pt-BR");
}

export function getCampaignWindowLabel(startsAt: Date | null, endsAt: Date | null) {
  if (startsAt && endsAt) {
    return `${formatDateTime(startsAt)} até ${formatDateTime(endsAt)}`;
  }

  if (startsAt) {
    return `A partir de ${formatDateTime(startsAt)}`;
  }

  if (endsAt) {
    return `Até ${formatDateTime(endsAt)}`;
  }

  return "Período livre";
}

export async function getPublicCatalogData() {
  const prisma = getPrisma();
  const now = new Date();

  const [stats, featuredProperties, highlightedCampaigns, imports] = await Promise.all([
    Promise.all([
      prisma.property.count({
        where: {
          status: PropertyLifecycleStatus.ACTIVE,
        },
      }),
      prisma.region.count(),
      prisma.campaign.count({
        where: {
          status: {
            in: [CampaignStatus.ACTIVE, CampaignStatus.SCHEDULED],
          },
        },
      }),
      prisma.lead.count(),
    ]),
    prisma.property.findMany({
      where: {
        status: PropertyLifecycleStatus.ACTIVE,
      },
      orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
      take: 6,
      include: {
        region: true,
        campaigns: {
          include: {
            campaign: true,
          },
        },
      },
    }),
    prisma.campaign.findMany({
      where: {
        status: {
          in: [CampaignStatus.ACTIVE, CampaignStatus.SCHEDULED],
        },
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
      orderBy: [{ isHighlighted: "desc" }, { startsAt: "asc" }, { updatedAt: "desc" }],
      take: 4,
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
    }),
    prisma.catalogImport.findFirst({
      orderBy: {
        importedAt: "desc",
      },
    }),
  ]);

  return {
    stats: {
      activeProperties: stats[0],
      regions: stats[1],
      activeCampaigns: stats[2],
      leads: stats[3],
    },
    featuredProperties,
    highlightedCampaigns,
    latestImport: imports,
  };
}
