"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  CampaignChannel,
  CampaignPlacement,
  CampaignStatus,
  PromotionType,
} from "@/generated/prisma/client";
import { requireAdminUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

const optionalString = z.preprocess(
  (value) => {
    const stringValue = value?.toString().trim();
    return stringValue ? stringValue : undefined;
  },
  z.string().optional(),
);

const optionalDate = z.preprocess(
  (value) => {
    const stringValue = value?.toString().trim();
    return stringValue ? new Date(stringValue) : undefined;
  },
  z.date().optional(),
);

const campaignSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2),
  name: z.string().min(2),
  headline: z.string().min(4),
  description: optionalString,
  status: z.nativeEnum(CampaignStatus),
  channel: z.nativeEnum(CampaignChannel),
  placement: z.nativeEnum(CampaignPlacement),
  promotionType: z.nativeEnum(PromotionType),
  ctaLabel: optionalString,
  ctaUrl: optionalString,
  rulesText: optionalString,
  startsAt: optionalDate,
  endsAt: optionalDate,
  budgetInCents: z.preprocess(
    (value) => {
      const stringValue = value?.toString().trim();
      return stringValue ? Number(stringValue) : undefined;
    },
    z.number().int().nonnegative().optional(),
  ),
  isHighlighted: z.boolean(),
  propertyIds: z.array(z.string()).default([]),
});

export async function saveCampaignAction(formData: FormData) {
  const { appUser } = await requireAdminUser();
  const prisma = getPrisma();

  const parsed = campaignSchema.parse({
    id: formData.get("id")?.toString(),
    slug: formData.get("slug")?.toString().trim(),
    name: formData.get("name")?.toString().trim(),
    headline: formData.get("headline")?.toString().trim(),
    description: formData.get("description"),
    status: formData.get("status")?.toString(),
    channel: formData.get("channel")?.toString(),
    placement: formData.get("placement")?.toString(),
    promotionType: formData.get("promotionType")?.toString(),
    ctaLabel: formData.get("ctaLabel"),
    ctaUrl: formData.get("ctaUrl"),
    rulesText: formData.get("rulesText"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    budgetInCents: formData.get("budgetInCents"),
    isHighlighted: formData.get("isHighlighted") === "on",
    propertyIds: formData.getAll("propertyIds").map((value) => value.toString()),
  });

  const data = {
    slug: parsed.slug,
    name: parsed.name,
    headline: parsed.headline,
    description: parsed.description ?? null,
    status: parsed.status,
    channel: parsed.channel,
    placement: parsed.placement,
    promotionType: parsed.promotionType,
    ctaLabel: parsed.ctaLabel ?? null,
    ctaUrl: parsed.ctaUrl ?? null,
    rulesText: parsed.rulesText ?? null,
    startsAt: parsed.startsAt ?? null,
    endsAt: parsed.endsAt ?? null,
    budgetInCents: parsed.budgetInCents ?? null,
    isHighlighted: parsed.isHighlighted,
    updatedById: appUser.id,
  };

  const relationData = parsed.propertyIds.map((propertyId, index) => ({
    propertyId,
    position: index,
  }));

  let campaignId = parsed.id;

  if (parsed.id) {
    await prisma.campaign.update({
      where: { id: parsed.id },
      data,
    });

    await prisma.campaignProperty.deleteMany({
      where: {
        campaignId: parsed.id,
      },
    });

    if (relationData.length > 0) {
      await prisma.campaignProperty.createMany({
        data: relationData.map((item) => ({
          campaignId: parsed.id!,
          propertyId: item.propertyId,
          position: item.position,
        })),
      });
    }
  } else {
    const campaign = await prisma.campaign.create({
      data: {
        ...data,
        createdById: appUser.id,
        properties:
          relationData.length > 0
            ? {
                createMany: {
                  data: relationData,
                },
              }
            : undefined,
      },
      select: {
        id: true,
      },
    });

    campaignId = campaign.id;
  }

  revalidatePath("/");
  revalidatePath("/promocoes");
  revalidatePath("/admin");
  revalidatePath("/admin/campanhas");

  redirect(`/admin/campanhas/${campaignId}`);
}
