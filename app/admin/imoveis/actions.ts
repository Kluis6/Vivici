"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  DevelopmentStage,
  PropertyLifecycleStatus,
  PropertyType,
} from "@/generated/prisma/client";
import { parseBedroomSummary } from "@/lib/catalog";
import { requireAdminUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

const optionalEnum = <T extends Record<string, string>>(enumObject: T) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.nativeEnum(enumObject).optional(),
  );

const propertySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().min(2),
  sourceUrl: z.string().optional(),
  stateCode: z.string().min(2),
  regionId: z.string().optional(),
  neighborhood: z.string().min(2),
  propertyType: optionalEnum(PropertyType),
  status: z.nativeEnum(PropertyLifecycleStatus),
  developmentStage: optionalEnum(DevelopmentStage),
  bedroomsLabel: z.string().optional(),
  highlightText: z.string().optional(),
  descriptionText: z.string().optional(),
  coverImageUrl: z.string().optional(),
  heroImageDesktopUrl: z.string().optional(),
  heroImageMobileUrl: z.string().optional(),
  videoTourUrl: z.string().optional(),
  presentationVideoUrl: z.string().optional(),
  isFeatured: z.boolean(),
  isSoldOut: z.boolean(),
  hidePrice: z.boolean(),
});

function normalizeUrl(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

export async function savePropertyAction(formData: FormData) {
  const { appUser } = await requireAdminUser();
  const prisma = getPrisma();

  const parsed = propertySchema.parse({
    id: formData.get("id")?.toString(),
    title: formData.get("title")?.toString().trim(),
    slug: formData.get("slug")?.toString().trim(),
    sourceUrl: formData.get("sourceUrl")?.toString().trim(),
    stateCode: formData.get("stateCode")?.toString().trim(),
    regionId: formData.get("regionId")?.toString().trim(),
    neighborhood: formData.get("neighborhood")?.toString().trim(),
    propertyType: formData.get("propertyType")?.toString(),
    status: formData.get("status")?.toString(),
    developmentStage: formData.get("developmentStage")?.toString(),
    bedroomsLabel: formData.get("bedroomsLabel")?.toString().trim(),
    highlightText: formData.get("highlightText")?.toString().trim(),
    descriptionText: formData.get("descriptionText")?.toString().trim(),
    coverImageUrl: formData.get("coverImageUrl")?.toString().trim(),
    heroImageDesktopUrl: formData.get("heroImageDesktopUrl")?.toString().trim(),
    heroImageMobileUrl: formData.get("heroImageMobileUrl")?.toString().trim(),
    videoTourUrl: formData.get("videoTourUrl")?.toString().trim(),
    presentationVideoUrl: formData.get("presentationVideoUrl")?.toString().trim(),
    isFeatured: formData.get("isFeatured") === "on",
    isSoldOut: formData.get("isSoldOut") === "on",
    hidePrice: formData.get("hidePrice") === "on",
  });

  const bedroomSummary = parseBedroomSummary(parsed.bedroomsLabel);
  const sourceUrl = normalizeUrl(parsed.sourceUrl, `/imoveis/${parsed.slug}`);
  const data = {
    title: parsed.title,
    slug: parsed.slug,
    sourceUrl,
    stateCode: parsed.stateCode,
    regionId: parsed.regionId || null,
    neighborhood: parsed.neighborhood,
    propertyType: parsed.propertyType ?? null,
    status: parsed.status,
    developmentStage: parsed.developmentStage ?? null,
    bedroomsLabel: parsed.bedroomsLabel || null,
    highlightText: parsed.highlightText || null,
    summary: parsed.highlightText || null,
    descriptionText: parsed.descriptionText || null,
    coverImageUrl: parsed.coverImageUrl || null,
    heroImageDesktopUrl: parsed.heroImageDesktopUrl || null,
    heroImageMobileUrl: parsed.heroImageMobileUrl || null,
    videoTourUrl: parsed.videoTourUrl || null,
    presentationVideoUrl: parsed.presentationVideoUrl || null,
    minBedrooms: bedroomSummary.minBedrooms,
    maxBedrooms: bedroomSummary.maxBedrooms,
    hasStudio: bedroomSummary.hasStudio,
    isFeatured: parsed.isFeatured,
    isSoldOut: parsed.isSoldOut,
    hidePrice: parsed.hidePrice,
    updatedById: appUser.id,
  };

  let propertyId = parsed.id;

  if (parsed.id) {
    await prisma.property.update({
      where: { id: parsed.id },
      data,
    });
  } else {
    const property = await prisma.property.create({
      data: {
        ...data,
        createdById: appUser.id,
        publishedAt:
          parsed.status === PropertyLifecycleStatus.ACTIVE ? new Date() : null,
      },
      select: {
        id: true,
      },
    });

    propertyId = property.id;
  }

  revalidatePath("/");
  revalidatePath("/imoveis");
  revalidatePath(`/imoveis/${parsed.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/imoveis");

  redirect(`/admin/imoveis/${propertyId}`);
}
