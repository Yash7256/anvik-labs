import type { MetaFunction } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import Faq, { homeFaqData } from "@/components/Faq";
import { createMeta } from "@/lib/site";

export const meta: MetaFunction = () =>
  createMeta({
    title: "Contact Anvik Labs | Start a Project",
    description:
      "Start a project with Anvik Labs. Tell us about your product, website, or AI idea and we'll reply with clear next steps — based in India.",
    path: "/contact",
  });

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex flex-1 flex-col pt-24 md:pt-28">
        <Contact />
        <Faq items={homeFaqData} metaLabel="FAQ / 007" metaTitle="Common questions about Anvik Labs" />
      </main>
      <Footer />
    </>
  );
}
