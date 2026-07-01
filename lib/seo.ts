import type { Metadata } from "next";

const SITE_NAME = "Vivici";
const DEFAULT_OG_IMAGE = "/Gemini_Generated_Image_3hkj2c3hkj2c3hkj.png";

function normalizeUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `https://${value}`;
}

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_URL;

  return new URL(
    configuredUrl ? normalizeUrl(configuredUrl) : "http://localhost:3000",
  );
}

export function toAbsoluteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}

export function toAbsoluteImageUrl(imagePath?: string | null) {
  if (!imagePath) {
    return toAbsoluteUrl(DEFAULT_OG_IMAGE);
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return toAbsoluteUrl(imagePath.startsWith("/") ? imagePath : `/${imagePath}`);
}

export function compactText(value: string | null | undefined, maxLength = 160) {
  if (!value) {
    return "";
  }

  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}...`;
}

type BuildPageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
  keywords?: string[];
  type?: "website" | "article";
};

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  keywords,
  type = "website",
}: BuildPageMetadataInput): Metadata {
  const url = toAbsoluteUrl(path);
  const imageUrl = toAbsoluteImageUrl(image);
  const metadataTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type,
      locale: "pt_BR",
      siteName: SITE_NAME,
      title: metadataTitle,
      description,
      url,
      images: [
        {
          url: imageUrl,
          alt: imageAlt ?? description,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description,
      images: [
        {
          url: imageUrl,
          alt: imageAlt ?? description,
        },
      ],
    },
  };
}

export const seoConfig = {
  siteName: SITE_NAME,
  defaultDescription:
    "Imobiliária digital da Vivici com catálogo de imóveis, oportunidades promocionais e atendimento personalizado para encontrar o lar ideal.",
  defaultOgImage: DEFAULT_OG_IMAGE,
};
