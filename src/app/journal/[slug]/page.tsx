import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Link, redirect, useLoaderData } from "react-router";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import JsonLd from "@/components/JsonLd";
import Mermaid from "@/components/Mermaid";
import { getJournalPost, getJournalPostText, type JournalContentBlock } from "@/data/journal";
import { createBreadcrumbJsonLd } from "@/lib/schema";
import { createMeta, organizationId, site } from "@/lib/site";

const legacyJournalSlugs: Record<string, string> = {
  "production-ready-architecture-audit": "production-readiness-architecture-audit",
};

export function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug;
  if (slug && legacyJournalSlugs[slug]) {
    throw redirect(`/journal/${legacyJournalSlugs[slug]}`, 301);
  }
  const post = slug ? getJournalPost(slug) : undefined;
  if (!post) throw new Response("Not Found", { status: 404 });
  return { post };
}

export const meta: MetaFunction<typeof loader> = (args) => {
  const a = args as { data?: unknown; loaderData?: unknown };
  const data = (a.data ?? a.loaderData) as { post?: { title: string; seoTitle?: string; description: string; slug: string; date: string; updatedDate?: string; keywords?: string[]; coverImage?: string; coverAlt?: string } } | undefined;
  const post = data?.post;
  if (!post) {
    return createMeta({
      title: "Journal Post Not Found | Anvik Labs",
      description: "The requested journal post could not be found.",
      path: "/journal",
      robots: "noindex, nofollow",
    });
  }
  return createMeta({
    title: post.seoTitle ?? `${post.title} | Anvik Labs Journal`,
    description: post.description,
    path: `/journal/${post.slug}`,
    type: "article",
    image: post.coverImage,
    imageAlt: post.coverAlt,
    publishedTime: post.date,
    modifiedTime: post.updatedDate ?? post.date,
    author: site.name,
    keywords: post.keywords,
  });
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function Block({ block }: { block: JournalContentBlock }) {
  if (block.type === "heading") {
    return (
      <h2 className="mt-12 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.03em] text-foreground first:mt-0">
        {block.text}
      </h2>
    );
  }
  if (block.type === "list") {
    return (
      <ul className="mt-6 list-disc space-y-2 pl-6 text-[15px] leading-relaxed text-muted md:text-[16px]">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.type === "table") {
    return (
      <div className="mt-6 overflow-x-auto rounded-[16px] border border-border">
        <table className="w-full min-w-[480px] border-collapse text-left text-[14px] md:text-[15px]">
          <thead className="bg-light-surface">
            <tr>
              {block.headers.map((header) => (
                <th key={header} className="border-b border-border px-4 py-3 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-b-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 align-top leading-relaxed text-muted">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (block.type === "mermaid") {
    return <Mermaid code={block.code} caption={block.caption} />;
  }
  return (
    <p className="mt-6 text-[15px] leading-relaxed text-muted md:text-[16px]">
      {block.text}
    </p>
  );
}

export default function JournalPostPage() {
  const { post } = useLoaderData<typeof loader>();
  const postUrl = `${site.url}/journal/${post.slug}`;
  const articleText = getJournalPostText(post);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updatedDate ?? post.date,
    author: { "@type": "Organization", "@id": organizationId, name: site.name },
    publisher: { "@type": "Organization", "@id": organizationId, name: site.name },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    url: postUrl,
    inLanguage: "en",
    articleSection: post.category,
    keywords: post.keywords,
    wordCount: articleText.split(/\s+/).filter(Boolean).length,
  };

  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Home", url: `${site.url}/` },
    { name: "Journal", url: `${site.url}/journal` },
    { name: post.title, url: postUrl },
  ]);

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex flex-1 flex-col pt-[var(--header-height)]">
        <JsonLd data={articleJsonLd} />
        <JsonLd data={breadcrumbJsonLd} />
        <article className="py-20 md:py-28 lg:py-36" itemScope itemType="https://schema.org/BlogPosting">
          <div className="mx-auto max-w-[820px] px-4 sm:px-6">
            <nav aria-label="Breadcrumb" className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
              <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
              <span aria-hidden="true" className="px-2">/</span>
              <Link to="/journal" className="transition-colors hover:text-foreground">Journal</Link>
              <span aria-hidden="true" className="px-2">/</span>
              <span className="text-foreground/80">Article</span>
            </nav>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
              <span>{post.category}</span>
              <span aria-hidden="true">/</span>
              <time dateTime={post.date} itemProp="datePublished">{formatDate(post.date)}</time>
              <span aria-hidden="true">/</span>
              <span>{post.readTime}</span>
            </div>

            <h1 itemProp="headline" className="mt-6 font-display text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[0.95] tracking-[-0.045em] text-foreground">
              {post.title}
            </h1>
            <p itemProp="description" className="mt-6 max-w-[60ch] text-[16px] leading-relaxed text-muted md:text-[18px]">
              {post.description}
            </p>

            {post.quickAnswer ? (
              <p className="mt-6 max-w-[68ch] text-[14px] leading-relaxed text-muted md:text-[15px]">
                <strong className="font-medium text-foreground">Quick answer:</strong> {post.quickAnswer}
              </p>
            ) : null}

            <div className="mt-12 border-t border-border pt-2" itemProp="articleBody">
              {post.content?.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
