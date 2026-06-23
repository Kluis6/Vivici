import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  AmenitySource,
  DevelopmentStage,
  LocationKind,
  MediaKind,
  PropertyLifecycleStatus,
} from "../generated/prisma/client";
import { createScriptPrismaClient } from "./runtime";

type CategoryOption = {
  label: string;
  value: string;
};

type CuryProperty = {
  id: number;
  url: string;
  slug: string;
  state_code: string;
  region_slug: string;
  title: string;
  state: string;
  region: string;
  neighborhood: string;
  status: {
    code: number;
    label: string;
    slug: string;
  };
  status_label: string;
  sold: boolean;
  highlight_text: string | null;
  hide_price: number;
  cover_image: string | null;
  listing_differentials: Array<{
    icon: string | null;
    label: string;
  }>;
  detail_page: {
    url: string;
    status_label: string;
    neighborhood: string;
    title: string;
    bedrooms_label: string | null;
    hero_image_desktop: string | null;
    hero_image_mobile: string | null;
    description_html: string | null;
    description_text: string | null;
    gallery_images: string[];
    plant_images: string[];
    video_tour_url: string | null;
    presentation_video_url: string | null;
    differentials: Array<{
      icon: string | null;
      label: string;
      hidden_until_expand: boolean;
    }>;
    locations: Array<{
      label: string;
      address: string;
      waze_url: string | null;
      google_maps_url: string | null;
      latitude: number | null;
      longitude: number | null;
    }>;
    coordinates: {
      latitude: number | null;
      longitude: number | null;
    } | null;
    about_region: {
      image: string | null;
      html: string | null;
      text: string | null;
    } | null;
    legal_text_html: string | null;
    legal_text: string | null;
    related_properties: Array<{
      url: string;
      title: string;
      neighborhood: string | null;
      summary: string | null;
    }>;
  };
};

type CuryCatalog = {
  source: string;
  generated_at_utc: string;
  totals: unknown;
  categories: {
    states: CategoryOption[];
    regions_by_state: Record<string, CategoryOption[]>;
    status_by_state: Record<string, CategoryOption[]>;
    bedrooms_by_state: Record<string, CategoryOption[]>;
    types_by_state: Record<string, CategoryOption[]>;
  };
  properties: CuryProperty[];
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeHtmlFragment(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return value
    .replace(/src="data:image\/[^"]+"/gi, "")
    .replace(/data-filename="[^"]*"/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeRawProperty(property: CuryProperty) {
  return {
    ...property,
    detail_page: {
      ...property.detail_page,
      description_html: sanitizeHtmlFragment(property.detail_page.description_html),
      legal_text_html: sanitizeHtmlFragment(property.detail_page.legal_text_html),
      about_region: property.detail_page.about_region
        ? {
            ...property.detail_page.about_region,
            html: sanitizeHtmlFragment(property.detail_page.about_region.html),
          }
        : null,
    },
  };
}

function parseDevelopmentStage(statusSlug: string, statusLabel: string) {
  const normalized = `${statusSlug} ${statusLabel}`.toLowerCase();

  if (normalized.includes("release") || normalized.includes("lançamento")) {
    return DevelopmentStage.RELEASE;
  }

  if (normalized.includes("obra")) {
    return DevelopmentStage.UNDER_CONSTRUCTION;
  }

  if (normalized.includes("ready") || normalized.includes("pronto")) {
    return DevelopmentStage.READY;
  }

  return null;
}

function parseLifecycleStatus(property: CuryProperty) {
  if (property.sold) {
    return PropertyLifecycleStatus.SOLD;
  }

  return PropertyLifecycleStatus.ACTIVE;
}

function parseBedroomOptions(label: string | null | undefined) {
  if (!label) {
    return [];
  }

  const chunks = label
    .split(",")
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const unique = Array.from(new Set(chunks));

  return unique.map((item, index) => {
    const normalized = item.toLowerCase();
    const match = normalized.match(/(\d+)/);

    return {
      label: item,
      bedrooms: normalized.includes("studio") ? 0 : match ? Number(match[1]) : null,
      position: index,
    };
  });
}

function getLocationKind(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("stand") || normalized.includes("vendas")) {
    return LocationKind.SALES_STAND;
  }

  if (normalized.includes("empreendimento")) {
    return LocationKind.DEVELOPMENT;
  }

  return LocationKind.OTHER;
}

function getRegionKey(stateCode: string, regionSlug: string) {
  return `${stateCode}:${regionSlug}`;
}

function getRelatedSlug(url: string) {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split("/").filter(Boolean).at(-1) ?? slugify(url);
  } catch {
    return slugify(url);
  }
}

function decimalValue(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  return value.toString();
}

function uniqueByKey<T>(items: T[], getKey: (item: T) => string) {
  const map = new Map<string, T>();

  for (const item of items) {
    map.set(getKey(item), item);
  }

  return Array.from(map.values());
}

async function main() {
  const { prisma, pool } = createScriptPrismaClient();
  let importBatchId: string | null = null;

  try {
    const importPath = process.env.CURY_IMPORT_PATH
      ? path.resolve(process.cwd(), process.env.CURY_IMPORT_PATH)
      : path.resolve(process.cwd(), "..", "cury_imoveis.json");
    const rawFile = await readFile(importPath, "utf8");
    const catalog = JSON.parse(rawFile) as CuryCatalog;

    const stateNames = new Map<string, string>();
    const regionSeedMap = new Map<
      string,
      {
        stateCode: string;
        slug: string;
        name: string;
        externalValue?: string;
        aboutImageUrl?: string | null;
        aboutHtml?: string | null;
        aboutText?: string | null;
      }
    >();
    const amenitySeedMap = new Map<string, { label: string; defaultIconUrl?: string | null }>();

    for (const state of catalog.categories.states) {
      stateNames.set(state.value, state.label);
    }

    for (const property of catalog.properties) {
      stateNames.set(property.state_code, property.state);

      const regionKey = getRegionKey(property.state_code, property.region_slug);
      const existingRegion = regionSeedMap.get(regionKey);
      regionSeedMap.set(regionKey, {
        stateCode: property.state_code,
        slug: property.region_slug,
        name: property.region,
        externalValue: existingRegion?.externalValue,
        aboutImageUrl: property.detail_page.about_region?.image ?? existingRegion?.aboutImageUrl ?? null,
        aboutHtml:
          sanitizeHtmlFragment(property.detail_page.about_region?.html) ??
          existingRegion?.aboutHtml ??
          null,
        aboutText: property.detail_page.about_region?.text ?? existingRegion?.aboutText ?? null,
      });

      for (const amenity of property.listing_differentials) {
        const slug = slugify(amenity.label);
        amenitySeedMap.set(slug, {
          label: amenity.label,
          defaultIconUrl: amenity.icon,
        });
      }

      for (const amenity of property.detail_page.differentials) {
        const slug = slugify(amenity.label);
        amenitySeedMap.set(slug, {
          label: amenity.label,
          defaultIconUrl: amenity.icon,
        });
      }
    }

    for (const [stateCode, regions] of Object.entries(catalog.categories.regions_by_state)) {
      for (const region of regions) {
        const slugFromProperty =
          catalog.properties.find(
            (item) => item.state_code === stateCode && item.region.toLowerCase() === region.label.toLowerCase(),
          )?.region_slug ?? slugify(region.label);
        const key = getRegionKey(stateCode, slugFromProperty);
        const existing = regionSeedMap.get(key);

        regionSeedMap.set(key, {
          stateCode,
          slug: slugFromProperty,
          name: region.label,
          externalValue: region.value,
          aboutImageUrl: existing?.aboutImageUrl ?? null,
          aboutHtml: existing?.aboutHtml ?? null,
          aboutText: existing?.aboutText ?? null,
        });
      }
    }

    for (const [code, name] of stateNames) {
      await prisma.state.upsert({
        where: { code },
        update: { name },
        create: { code, name },
      });
    }

    const regionIdByKey = new Map<string, string>();

    for (const regionSeed of regionSeedMap.values()) {
      const region = await prisma.region.upsert({
        where: {
          stateCode_slug: {
            stateCode: regionSeed.stateCode,
            slug: regionSeed.slug,
          },
        },
        update: {
          name: regionSeed.name,
          externalValue: regionSeed.externalValue,
          aboutImageUrl: regionSeed.aboutImageUrl ?? null,
          aboutHtml: regionSeed.aboutHtml ?? null,
          aboutText: regionSeed.aboutText ?? null,
        },
        create: {
          stateCode: regionSeed.stateCode,
          slug: regionSeed.slug,
          name: regionSeed.name,
          externalValue: regionSeed.externalValue,
          aboutImageUrl: regionSeed.aboutImageUrl ?? null,
          aboutHtml: regionSeed.aboutHtml ?? null,
          aboutText: regionSeed.aboutText ?? null,
        },
      });

      regionIdByKey.set(getRegionKey(regionSeed.stateCode, regionSeed.slug), region.id);
    }

    const amenityIdBySlug = new Map<string, string>();

    for (const [slug, amenitySeed] of amenitySeedMap) {
      const amenity = await prisma.amenity.upsert({
        where: { slug },
        update: {
          label: amenitySeed.label,
          defaultIconUrl: amenitySeed.defaultIconUrl ?? null,
        },
        create: {
          slug,
          label: amenitySeed.label,
          defaultIconUrl: amenitySeed.defaultIconUrl ?? null,
        },
      });

      amenityIdBySlug.set(slug, amenity.id);
    }

    const importBatch = await prisma.catalogImport.create({
      data: {
        sourceUrl: catalog.source,
        generatedAtUtc: new Date(catalog.generated_at_utc),
        totals: catalog.totals as never,
        categories: catalog.categories as never,
      },
    });
    importBatchId = importBatch.id;

    for (const property of catalog.properties) {
      const developmentStage = parseDevelopmentStage(
        property.status.slug,
        property.status.label,
      );
      const bedroomOptions = parseBedroomOptions(property.detail_page.bedrooms_label);
      const bedroomNumbers = bedroomOptions
        .map((item) => item.bedrooms)
        .filter((value): value is number => value !== null);
      const minBedrooms = bedroomNumbers.length > 0 ? Math.min(...bedroomNumbers) : null;
      const maxBedrooms = bedroomNumbers.length > 0 ? Math.max(...bedroomNumbers) : null;
      const regionId = regionIdByKey.get(getRegionKey(property.state_code, property.region_slug));
      const sanitizedDescriptionHtml = sanitizeHtmlFragment(property.detail_page.description_html);
      const sanitizedLegalHtml = sanitizeHtmlFragment(property.detail_page.legal_text_html);
      const sourceRaw = sanitizeRawProperty(property);

      const savedProperty = await prisma.property.upsert({
        where: { slug: property.slug },
        update: {
          externalId: property.id,
          importBatchId: importBatch.id,
          sourceUrl: property.url,
          title: property.title,
          stateCode: property.state_code,
          regionId,
          neighborhood: property.neighborhood,
          status: parseLifecycleStatus(property),
          developmentStage,
          externalStatusCode: property.status.code,
          externalStatusLabel: property.status.label,
          externalStatusSlug: property.status.slug,
          summary: property.highlight_text,
          highlightText: property.highlight_text,
          descriptionHtml: sanitizedDescriptionHtml,
          descriptionText: property.detail_page.description_text,
          legalTextHtml: sanitizedLegalHtml,
          legalText: property.detail_page.legal_text,
          bedroomsLabel: property.detail_page.bedrooms_label,
          minBedrooms,
          maxBedrooms,
          hasStudio: bedroomNumbers.includes(0),
          isSoldOut: property.sold,
          hidePrice: Boolean(property.hide_price),
          coverImageUrl: property.cover_image,
          heroImageDesktopUrl: property.detail_page.hero_image_desktop,
          heroImageMobileUrl: property.detail_page.hero_image_mobile,
          videoTourUrl: property.detail_page.video_tour_url,
          presentationVideoUrl: property.detail_page.presentation_video_url,
          latitude: decimalValue(property.detail_page.coordinates?.latitude),
          longitude: decimalValue(property.detail_page.coordinates?.longitude),
          sourceRaw,
          publishedAt: new Date(),
        },
        create: {
          externalId: property.id,
          importBatchId: importBatch.id,
          sourceUrl: property.url,
          slug: property.slug,
          title: property.title,
          stateCode: property.state_code,
          regionId,
          neighborhood: property.neighborhood,
          status: parseLifecycleStatus(property),
          developmentStage,
          externalStatusCode: property.status.code,
          externalStatusLabel: property.status.label,
          externalStatusSlug: property.status.slug,
          summary: property.highlight_text,
          highlightText: property.highlight_text,
          descriptionHtml: sanitizedDescriptionHtml,
          descriptionText: property.detail_page.description_text,
          legalTextHtml: sanitizedLegalHtml,
          legalText: property.detail_page.legal_text,
          bedroomsLabel: property.detail_page.bedrooms_label,
          minBedrooms,
          maxBedrooms,
          hasStudio: bedroomNumbers.includes(0),
          isSoldOut: property.sold,
          hidePrice: Boolean(property.hide_price),
          coverImageUrl: property.cover_image,
          heroImageDesktopUrl: property.detail_page.hero_image_desktop,
          heroImageMobileUrl: property.detail_page.hero_image_mobile,
          videoTourUrl: property.detail_page.video_tour_url,
          presentationVideoUrl: property.detail_page.presentation_video_url,
          latitude: decimalValue(property.detail_page.coordinates?.latitude),
          longitude: decimalValue(property.detail_page.coordinates?.longitude),
          sourceRaw,
          publishedAt: new Date(),
        },
      });

      await prisma.propertyMedia.deleteMany({
        where: { propertyId: savedProperty.id },
      });
      await prisma.propertyAmenity.deleteMany({
        where: { propertyId: savedProperty.id },
      });
      await prisma.propertyLocation.deleteMany({
        where: { propertyId: savedProperty.id },
      });
      await prisma.propertyBedroomOption.deleteMany({
        where: { propertyId: savedProperty.id },
      });
      await prisma.propertyRelation.deleteMany({
        where: { propertyId: savedProperty.id },
      });

      const mediaData: Array<{
        propertyId: string;
        kind: MediaKind;
        url: string;
        alt: string;
        position: number;
        isPrimary: boolean;
      }> = [];

      if (property.cover_image) {
        mediaData.push({
          propertyId: savedProperty.id,
          kind: MediaKind.COVER,
          url: property.cover_image,
          alt: `${property.title} capa`,
          position: 0,
          isPrimary: true,
        });
      }

      if (property.detail_page.hero_image_desktop) {
        mediaData.push({
          propertyId: savedProperty.id,
          kind: MediaKind.HERO_DESKTOP,
          url: property.detail_page.hero_image_desktop,
          alt: `${property.title} hero desktop`,
          position: 0,
          isPrimary: false,
        });
      }

      if (property.detail_page.hero_image_mobile) {
        mediaData.push({
          propertyId: savedProperty.id,
          kind: MediaKind.HERO_MOBILE,
          url: property.detail_page.hero_image_mobile,
          alt: `${property.title} hero mobile`,
          position: 0,
          isPrimary: false,
        });
      }

      mediaData.push(
        ...property.detail_page.gallery_images.map((url, index) => ({
          propertyId: savedProperty.id,
          kind: MediaKind.GALLERY,
          url,
          alt: `${property.title} galeria ${index + 1}`,
          position: index,
          isPrimary: false,
        })),
        ...property.detail_page.plant_images.map((url, index) => ({
          propertyId: savedProperty.id,
          kind: MediaKind.PLANT,
          url,
          alt: `${property.title} planta ${index + 1}`,
          position: index,
          isPrimary: false,
        })),
      );

      const uniqueMediaData = uniqueByKey(mediaData, (item) => item.url);

      if (uniqueMediaData.length > 0) {
        await prisma.propertyMedia.createMany({
          data: uniqueMediaData,
        });
      }

      const amenityData = [
        ...property.listing_differentials.flatMap((amenity, index) => {
          const amenityId = amenityIdBySlug.get(slugify(amenity.label));

          if (!amenityId) {
            return [];
          }

          return [
            {
              propertyId: savedProperty.id,
              amenityId,
              source: AmenitySource.LISTING,
              position: index,
              iconUrl: amenity.icon,
              hiddenUntilExpand: false,
            },
          ];
        }),
        ...property.detail_page.differentials.flatMap((amenity, index) => {
          const amenityId = amenityIdBySlug.get(slugify(amenity.label));

          if (!amenityId) {
            return [];
          }

          return [
            {
              propertyId: savedProperty.id,
              amenityId,
              source: AmenitySource.DETAIL,
              position: index,
              iconUrl: amenity.icon,
              hiddenUntilExpand: amenity.hidden_until_expand,
            },
          ];
        }),
      ];

      const uniqueAmenityData = uniqueByKey(
        amenityData,
        (item) => `${item.propertyId}:${item.amenityId}:${item.source}`,
      );

      if (uniqueAmenityData.length > 0) {
        await prisma.propertyAmenity.createMany({
          data: uniqueAmenityData,
        });
      }

      if (property.detail_page.locations.length > 0) {
        await prisma.propertyLocation.createMany({
          data: property.detail_page.locations.map((location, index) => ({
            propertyId: savedProperty.id,
            kind: getLocationKind(location.label),
            label: location.label,
            address: location.address,
            wazeUrl: location.waze_url,
            googleMapsUrl: location.google_maps_url,
            latitude: decimalValue(location.latitude),
            longitude: decimalValue(location.longitude),
            position: index,
          })),
        });
      }

      if (bedroomOptions.length > 0) {
        await prisma.propertyBedroomOption.createMany({
          data: bedroomOptions.map((option) => ({
            propertyId: savedProperty.id,
            label: option.label,
            bedrooms: option.bedrooms,
            position: option.position,
          })),
        });
      }

      const relatedPropertyData = uniqueByKey(
        property.detail_page.related_properties.map((related, index) => ({
          propertyId: savedProperty.id,
          relatedSlug: getRelatedSlug(related.url),
          relatedUrl: related.url,
          title: related.title,
          neighborhood: related.neighborhood,
          summary: related.summary,
          position: index,
        })),
        (item) => `${item.propertyId}:${item.relatedSlug}`,
      );

      if (relatedPropertyData.length > 0) {
        await prisma.propertyRelation.createMany({
          data: relatedPropertyData,
        });
      }
    }

    const propertyIdsBySlug = new Map(
      (
        await prisma.property.findMany({
          select: {
            id: true,
            slug: true,
          },
        })
      ).map((property) => [property.slug, property.id]),
    );

    const relations = await prisma.propertyRelation.findMany({
      select: {
        propertyId: true,
        relatedSlug: true,
      },
    });

    for (const relation of relations) {
      const relatedPropertyId = propertyIdsBySlug.get(relation.relatedSlug);

      if (!relatedPropertyId) {
        continue;
      }

      await prisma.propertyRelation.update({
        where: {
          propertyId_relatedSlug: {
            propertyId: relation.propertyId,
            relatedSlug: relation.relatedSlug,
          },
        },
        data: {
          relatedPropertyId,
        },
      });
    }

    console.log(
      JSON.stringify(
        {
          importedProperties: catalog.properties.length,
          importBatchId: importBatch.id,
          source: catalog.source,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    if (importBatchId) {
      await prisma.catalogImport.delete({
        where: { id: importBatchId },
      });
    }

    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
