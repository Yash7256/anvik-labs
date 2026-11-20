import { Link, useParams, type LoaderFunctionArgs, type MetaFunction } from "react-router";
import Image from "@/components/Img";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import {
  getNextProject,
  getProject,
  getProjectWorkType,
  projects,
  type ProjectDecision,
} from "@/data/projects";
import { createMeta, createWorkDescription, site } from "@/lib/site";
import { createBreadcrumbJsonLd, createWorkJsonLd } from "@/lib/schema";

export function loader({ params }: LoaderFunctionArgs) {
  if (!getProject(params.slug ?? "")) throw new Response("Work not found", { status: 404 });
  return null;
}

const mono = "font-mono uppercase tracking-[0.02em] text-[12px] leading-[1.2]";
const WORK_TYPE_LABEL = { design: "Design", development: "Development", both: "Design + Development" } as const;

export const meta: MetaFunction = ({ params }) => {
  const project = getProject(params.slug ?? "");
  if (!project) return [{ title: "Work not found | Anvik Labs" }, { name: "robots", content: "noindex" }];

  return createMeta({
    title: `${project.name} | Anvik Labs`,
    description: createWorkDescription(project),
    path: `/works/${project.id}`,
    image: project.coverImage,
    imageAlt: project.coverAlt,
  });
};

function DecisionSection({ id, index, label, intro, items }: {
  id: string;
  index: string;
  label: string;
  intro: string;
  items: ProjectDecision[];
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="border-t border-border py-16 md:py-24">
      <Reveal>
        <div className="grid gap-10 md:grid-cols-[34%_1fr] md:gap-12">
        <div>
          <p className={`${mono} text-accent`}>[{index}]</p>
          <h2 id={`${id}-heading`} className="mt-4 max-w-[8ch] font-sans text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[0.9] tracking-[-0.05em]">
            {label}
          </h2>
        </div>
        <div>
          <p className="max-w-[55ch] text-[17px] leading-[1.45] text-foreground md:text-[20px]">{intro}</p>
          <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
            {items.map((item, itemIndex) => (
              <article key={item.title} className="grid gap-3 py-5 sm:grid-cols-[52px_0.8fr_1.2fr] sm:gap-5 sm:py-6">
                <span className={`${mono} text-muted`}>{String(itemIndex + 1).padStart(2, "0")}</span>
                <h3 className="font-sans text-[17px] font-medium leading-tight text-foreground">{item.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{item.description}</p>
              </article>
            ))}
          </div>
          </div>
        </div>
        </Reveal>
    </section>
  );
}

export default function WorkPage() {
  const { slug = "" } = useParams();
  const project = getProject(slug);

  if (!project) {
    return (
      <><Navbar /><main id="main-content" className="flex flex-1 flex-col items-start justify-center gap-6 px-4 pt-24 sm:px-[4vw] md:px-[5vw] md:pt-28"><h1 className="font-sans text-[clamp(2rem,7vw,6rem)] font-medium uppercase leading-[0.9] tracking-[-0.05em]">Work not found</h1><Link to="/works" className={`${mono} transition-opacity duration-200 hover:opacity-50`}>[ &larr; ALL WORKS ]</Link></main><Footer /></>
    );
  }

  const workType = getProjectWorkType(project);
  const next = getNextProject(project.id);
  const showDesign = workType === "design" || workType === "both";
  const showDevelopment = workType === "development" || workType === "both";
  const projectIndex = projects.findIndex((item) => item.id === project.id) + 1;
  const nextIndex = projects.findIndex((item) => item.id === next.id) + 1;

  return (
    <><Navbar /><main id="main-content" className="flex flex-1 flex-col px-4 pt-[calc(var(--header-height)+24px)] sm:px-[4vw] md:px-[5vw] md:pt-[calc(var(--header-height)+32px)]">
      <JsonLd data={createBreadcrumbJsonLd([{ name: "Home", url: site.url }, { name: "Works", url: `${site.url}/works` }, { name: project.name, url: `${site.url}/works/${project.id}` }])} />
      <JsonLd data={createWorkJsonLd(project)} />
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 border-b border-black/10 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        <Link to="/" className="transition-colors hover:text-foreground">Home</Link><span aria-hidden="true">/</span><Link to="/works" className="transition-colors hover:text-foreground">Works</Link><span aria-hidden="true">/</span><span className="text-muted">{project.name}</span>
      </nav>

      <article>
        <header className="pb-12 pt-8 md:pb-20 md:pt-12">
          <div className={`${mono} flex items-center justify-between gap-4`}><Link to="/works" className="transition-opacity duration-200 hover:opacity-50">[ &larr; ALL WORKS ]</Link><span>[{String(projectIndex).padStart(3, "0")}]</span></div>
          <div className="mt-8 grid gap-6 sm:mt-10 md:mt-16 md:grid-cols-[1fr_0.6fr] md:items-end md:gap-12">
            <h1 className="max-w-[9ch] font-sans text-[clamp(3.5rem,10vw,9rem)] font-medium uppercase leading-[0.85] tracking-[-0.06em] break-words">{project.name}</h1>
            <p className="max-w-[42ch] text-[17px] leading-[1.4] text-foreground md:pb-2 md:text-[20px]">{project.description}</p>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-border py-5 sm:mt-12 sm:grid-cols-4 sm:gap-8 sm:py-6">
            <div className="flex flex-col gap-2"><dt className={`${mono} text-muted`}>WORK TYPE</dt><dd className={mono}>{WORK_TYPE_LABEL[workType]}</dd></div>
            <div className="flex flex-col gap-2"><dt className={`${mono} text-muted`}>PROJECT</dt><dd className={mono}>{project.projectType}</dd></div>
            <div className="flex flex-col gap-2"><dt className={`${mono} text-muted`}>YEAR</dt><dd className={mono}>{project.year}</dd></div>
            <div className="flex flex-col gap-2"><dt className={`${mono} text-muted`}>FIELD</dt><dd className={mono}>{project.genre}</dd></div>
          </dl>
        </header>

        <Reveal delay={0.05}>
          <figure><div className="relative aspect-[16/9] overflow-hidden rounded-[6px] bg-light-surface"><Image src={project.coverImage} alt={project.coverAlt} fill className="object-cover" /></div><figcaption className={`${mono} mt-3 flex items-baseline justify-between gap-4 text-muted`}><span>{project.name} / {project.year}</span><span>{WORK_TYPE_LABEL[workType]}</span></figcaption></figure>
        </Reveal>

        <section className="py-16 md:py-24"><div className="grid gap-10 md:grid-cols-[34%_1fr] md:gap-12"><h2 className="max-w-[8ch] font-sans text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[0.9] tracking-[-0.05em]">The work</h2><div className="max-w-[58ch]"><p className="font-sans text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.1] tracking-[-0.03em]">{project.name} brings product thinking, clear communication, and careful execution into one focused experience.</p><p className="mt-6 text-[16px] leading-[1.5] text-muted">This case study separates the decisions behind the work so the role Anvik Labs played is clear at a glance.</p></div></div></section>

        {showDesign && <DecisionSection id="design-decisions" index="01" label="Design decisions" intro="The choices that shape how the product is understood, used, and remembered." items={project.designDecisions} />}
        {showDevelopment && <DecisionSection id="development-decisions" index={showDesign ? "02" : "01"} label="Development decisions" intro="The choices that make the experience dependable, adaptable, and ready to use." items={project.developmentDecisions} />}

        <section className="border-t border-border py-16 md:py-24"><Link to={`/works/${next.id}`} className="group block"><div className={`${mono} flex items-center justify-between gap-4 text-muted`}><span>NEXT PROJECT</span><span>{String(nextIndex).padStart(3, "0")}</span></div><div className="mt-6 flex items-end justify-between gap-6"><h2 className="max-w-[11ch] font-sans text-[clamp(2.5rem,6vw,6rem)] font-medium uppercase leading-[0.9] tracking-[-0.05em] transition-opacity duration-200 group-hover:opacity-50">{next.name}</h2><span className={`${mono} shrink-0 pb-2`}>[ &rarr; ]</span></div></Link></section>
      </article>
    </main><Footer /></>
  );
}
