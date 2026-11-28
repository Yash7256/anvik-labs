import { buildDate } from "@/lib/build-date";
import { organizationId, site, websiteId } from "@/lib/site";
import type { Service } from "@/data/services";
import type { Project } from "@/data/projects";

function serviceUrls(service: Service) {
  const url = `${site.url}/services/${service.slug}`;
  return {
    url,
    webPageId: `${url}#webpage`,
    serviceId: `${url}#service`,
    faqId: `${url}#faq`,
    breadcrumbId: `${url}#breadcrumb`,
  };
}

export function createServiceJsonLd(service: Service) {
  const { url, webPageId, serviceId } = serviceUrls(service);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": serviceId,
    name: service.name,
    serviceType: service.serviceType,
    description: service.description,
    url,
    areaServed: site.areaServed,
    availableLanguage: ["en"],
    provider: { "@id": organizationId, name: site.name, url: site.url },
    mainEntityOfPage: { "@id": webPageId },
  };
}

export function createServiceWebPageJsonLd(service: Service) {
  const { url, webPageId, serviceId, faqId, breadcrumbId } = serviceUrls(service);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": webPageId,
    url,
    name: service.title,
    description: service.description,
    dateModified: buildDate,
    inLanguage: "en-IN",
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    mainEntity: { "@id": serviceId },
    hasPart: { "@id": faqId },
    breadcrumb: { "@id": breadcrumbId },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${site.url}${site.ogImage}`,
      width: Number(site.ogImageWidth),
      height: Number(site.ogImageHeight),
    },
  };
}

export function createFaqJsonLd(service: Service) {
  const { faqId, webPageId } = serviceUrls(service);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": faqId,
    isPartOf: { "@id": webPageId },
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function createBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
  id?: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(id ? { "@id": id } : {}),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createWorkJsonLd(work: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${site.url}/works/${work.id}#work`,
    name: work.name,
    description: work.description,
    url: `${site.url}/works/${work.id}`,
    image: `${site.url}${work.coverImage}`,
    dateCreated: work.year,
    creator: { "@id": organizationId },
    keywords: [work.genre, work.workType],
  };
}
