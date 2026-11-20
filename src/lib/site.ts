import type { MetaDescriptor } from "react-router";
import type { Project } from "@/data/projects";

export const site = {
  name: "Anvik Labs",
  title: "Anvik Labs | Product Design & Engineering",
  studioTagline: "Product design & engineering studio",
  description:
    "Anvik Labs is a Product Design & Engineering Studio in India, helping startups and small businesses build clear interfaces, fast websites, and practical AI solutions.",
  url: "https://anviklabs.site",
  email: "anviklabs@gmail.com",
  areaServed: "Worldwide",
  logo: "/assets/favicon.ico",
  ogImage: "/og.png",
  ogImageWidth: "1200",
  ogImageHeight: "630",
  ogImageType: "image/png",
  ogImageAlt: "Anvik Labs — Product design & engineering studio",
  themeColor: "#f5f5f5",
  backgroundColor: "#f5f5f5",
  // Add verified Anvik Labs profiles here when official company accounts exist.
  // Individual team profiles live in `src/data/socials.json` and are not used here.
  sameAs: [] as string[],
  foundingDate: "2020-11-02",
};

export const organizationId = `${site.url}/#organization`;
export const websiteId = `${site.url}/#website`;

export interface PageMetaOptions {
  title?: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: string | number;
  imageHeight?: string | number;
  imageType?: string;
}

export function createMeta(options: PageMetaOptions): MetaDescriptor[] {
  const title = options.title ?? site.title;
  const description = options.description;
  const path = options.path ?? "/";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${site.url}${normalizedPath}`;
  const image = options.image ?? site.ogImage;
  const isDefaultImage = image === site.ogImage;
  const imageUrl = image.startsWith("http")
    ? image
    : `${site.url}${image.startsWith("/") ? image : `/${image}`}`;
  const imageAlt =
    options.imageAlt ?? (isDefaultImage ? site.ogImageAlt : title);
  const imageWidth =
    options.imageWidth ??
    (isDefaultImage ? site.ogImageWidth : undefined);
  const imageHeight =
    options.imageHeight ??
    (isDefaultImage ? site.ogImageHeight : undefined);
  const imageType =
    options.imageType ?? (isDefaultImage ? site.ogImageType : undefined);

  const imageDescriptors: MetaDescriptor[] = [
    { property: "og:image", content: imageUrl },
    { property: "og:image:secure_url", content: imageUrl },
    { property: "og:image:alt", content: imageAlt },
  ];

  if (imageType) {
    imageDescriptors.push({ property: "og:image:type", content: imageType });
  }
  if (imageWidth) {
    imageDescriptors.push({
      property: "og:image:width",
      content: String(imageWidth),
    });
  }
  if (imageHeight) {
    imageDescriptors.push({
      property: "og:image:height",
      content: String(imageHeight),
    });
  }

  return [
    { title },
    { name: "description", content: description },
    { name: "application-name", content: site.name },
    { name: "author", content: site.name },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { property: "og:site_name", content: site.name },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonicalUrl },
    ...imageDescriptors,
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:image:alt", content: imageAlt },
  ];
}

export function createWorkDescription(work: Project): string {
  const lead = `${work.name} by Anvik Labs — ${work.description}`;
  const withCta = `${lead} Explore the full case study.`;

  if (withCta.length <= 155) {
    return withCta;
  }

  if (lead.length >= 120) {
    return lead;
  }

  return `${lead} Start your own project with us.`;
}
