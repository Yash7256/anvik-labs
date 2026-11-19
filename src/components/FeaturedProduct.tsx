import { Link } from "react-router";

type SelectedProject = {
  number: string;
  name: string;
  category: string;
  href: string;
  image: string;
  alt: string;
};

const featuredProject: SelectedProject = {
  number: "01",
  name: "Designers Room",
  category: "PRODUCT DESIGN & DEVELOPMENT",
  href: "/works/designers-room",
  image: "/mockups/designersroom.webp",
  alt: "Designers Room platform interface shown in a desktop product composition.",
};

const secondaryProjects: SelectedProject[] = [
  {
    number: "02",
    name: "CyberSec Toolkit",
    category: "AI-POWERED SECURITY SAAS",
    href: "/works/cybersec-toolkit",
    image: "/mockups/cybersec-toolkit.webp",
    alt: "CyberSec Toolkit security dashboard shown in a desktop monitor mockup.",
  },
  {
    number: "03",
    name: "Notify-ED",
    category: "COMMUNICATION AUTOMATION PLATFORM",
    href: "/works/notify-ed",
    image: "/mockups/notifyed.webp",
    alt: "Notify-ED grade notification platform shown in a laptop mockup.",
  },
];

function ProjectVisual({
  project,
  featured = false,
}: {
  project: SelectedProject;
  featured?: boolean;
}) {
  return (
    <Link
      to={project.href}
      aria-label={`${project.name} — explore project`}
      className="group block rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A0A]"
    >
      <div
        className={`relative overflow-hidden rounded-[6px] border border-white/10 bg-[#141414] ${
          featured ? "aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        <img
          src={project.image}
          alt={project.alt}
          loading={featured ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover object-center transition-transform duration-300 ease-out will-change-transform group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[#0D0D0D]/0 transition-colors duration-300 ease-out group-hover:bg-[#0D0D0D]/20 group-focus-visible:bg-[#0D0D0D]/20"
        />
        <span className="pointer-events-none absolute bottom-4 right-4 font-mono text-[12px] uppercase tracking-[0.12em] text-[#F4F1EC] opacity-100 transition-opacity duration-300 ease-out md:bottom-5 md:right-5 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
          View project <span aria-hidden="true">↗</span>
        </span>
      </div>

      <div className="mt-4 md:mt-5">
        <h3
          className={`font-sans font-medium tracking-[-0.03em] text-[#F4F1EC] ${
            featured
              ? "text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05]"
              : "text-[clamp(1.35rem,2vw,1.75rem)] leading-[1.1]"
          }`}
        >
          {project.name}
        </h3>
        <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.12em] text-[#A39D95] transition-colors duration-300 group-hover:text-[#FF5A0A] group-focus-visible:text-[#FF5A0A]">
          Explore project <span aria-hidden="true">↗</span>
        </p>
      </div>
    </Link>
  );
}

export default function FeaturedProduct() {
  return (
    <section
      id="featured-product"
      aria-labelledby="selected-work-heading"
      className="border-t border-white/10 bg-[#0D0D0D] px-5 py-16 text-[#F4F1EC] sm:px-[4vw] md:py-24 lg:px-[5vw] lg:py-28 xl:px-[6vw]"
    >
      <header className="border-b border-white/10 pb-8 md:pb-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2
              id="selected-work-heading"
              className="font-sans text-[clamp(2.6rem,6vw,5.25rem)] font-medium leading-[0.95] tracking-[-0.04em] text-[#F4F1EC]"
            >
              Selected work.
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-[16px] leading-[1.7] text-[#A39D95] md:text-[18px]">
              A collection of ideas turned into digital experiences.
            </p>
          </div>
          <p
            aria-label="Projects 1 to 3"
            className="hidden shrink-0 font-mono text-[12px] uppercase tracking-[0.14em] text-[#A39D95] sm:block"
          >
            01 — 03
          </p>
        </div>
      </header>

      <div className="mt-10 space-y-12 md:mt-14 md:space-y-16">
        <article>
          <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.14em] text-[#A39D95]">
            {featuredProject.category}
          </p>
          <ProjectVisual project={featuredProject} featured />
        </article>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8 lg:gap-10">
          {secondaryProjects.map((project) => (
            <article key={project.number}>
              <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.14em] text-[#A39D95]">
                <span className="text-[#F4F1EC]">{project.number}</span>
                <span className="mx-2 text-white/20" aria-hidden="true">
                  /
                </span>
                {project.category}
              </p>
              <ProjectVisual project={project} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
