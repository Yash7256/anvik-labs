import type { MetaFunction } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AmanRajPage from "@/components/aman-raj/AmanRajPage";
import { createMeta } from "@/lib/site";

export const meta: MetaFunction = () =>
  createMeta({
    title: "Aman Raj | Backend, AI & Security Engineer | Anvik Labs",
    description:
      "Aman Raj is a backend, AI and security engineer from India. He designs async systems, hardens them, and ships reliable tools and products.",
    path: "/aman-raj",
  });

export default function AmanRajRoute() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex flex-1 flex-col pt-[var(--header-height)]">
        <AmanRajPage />
      </main>
      <Footer />
    </>
  );
}
