import type { MetaFunction } from "react-router";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Works from "@/components/Works";
import MeetTheHumans from "@/components/MeetTheHumans";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Faq, { homeFaqData } from "@/components/Faq";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { projects } from "@/data/projects";
import { buildDate } from "@/lib/build-date";
import { createMeta, organizationId, site, websiteId } from "@/lib/site";

export const meta: MetaFunction = () =>
  createMeta({
    title: site.title,
    description: site.description,
    path: "/",
  });

const homeWebPageId = `${site.url}/#webpage`;
const homeWorkListId = `${site.url}/#selected-work`;
const homeFaqId = `${site.url}/#faq`;

const homeWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": homeWebPageId,
  url: `${site.url}/`,
  name: "Anvik Labs — Product Design & Development Studio in India",
  description: site.description,
  dateModified: buildDate,
  inLanguage: "en-IN",
  isPartOf: { "@id": websiteId },
  about: { "@id": organizationId },
  mainEntity: [{ "@id": homeWorkListId }, { "@id": homeFaqId }],
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${site.url}${site.ogImage}`,
    width: Number(site.ogImageWidth),
    height: Number(site.ogImageHeight),
  },
};

const homeWorkListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": homeWorkListId,
  name: "Selected digital product work by Anvik Labs",
  itemListElement: projects.slice(0, 4).map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${site.url}/works/${project.id}`,
    name: project.name,
  })),
};

const homeFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": homeFaqId,
  mainEntity: homeFaqData.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function Home() {
  return (
    <>
      <JsonLd data={homeWebPageJsonLd} />
      <JsonLd data={homeWorkListJsonLd} />
      <JsonLd data={homeFaqJsonLd} />
      <Navbar />
      <main id="main-content" className="flex flex-1 flex-col">
        <Hero />
        <Works />
        <Services />
        <MeetTheHumans />
        <Testimonials />
        <Faq items={homeFaqData} metaLabel="FAQ / 007" metaTitle="Common questions about Anvik Labs" />
      </main>
      <Footer />
    </>
  );
}
