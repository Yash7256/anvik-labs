import type { MetaFunction } from "react-router";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MeetTheHumans from "@/components/MeetTheHumans";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { createMeta, site } from "@/lib/site";

export const meta: MetaFunction = () =>
  createMeta({ description: site.description });

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex flex-1 flex-col">
        <Hero />
        <Services />
        <MeetTheHumans />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
