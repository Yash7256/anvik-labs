import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getPublishedJournalPosts, journalPosts } from "@/data/journal";
import { createMeta } from "@/lib/site";

export const meta: MetaFunction = () =>
  createMeta({
    title: "Journal | Anvik Labs",
    description:
      "Notes, insights, and perspectives from Anvik Labs on design, engineering, and building premium digital products.",
    path: "/journal",
  });

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function JournalPage() {
  const publishedPosts = getPublishedJournalPosts();
  const upcomingPosts = journalPosts.filter((post) => !post.published);

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex flex-1 flex-col pt-[var(--header-height)]">
        <section className="py-20 md:py-28 lg:py-36">
          <div className="mx-auto max-w-[1180px]">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
              Journal
            </p>
            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-end">
              <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-extralight leading-[0.88] tracking-[-0.055em] text-foreground lg:whitespace-nowrap">
                Thoughts in progress.
              </h1>
              <p className="max-w-[34ch] text-[15px] leading-relaxed text-muted md:text-[16px]">
                Notes on design, engineering, and the craft behind digital products.
                New posts will appear here soon.
              </p>
            </div>

            {publishedPosts.length > 0 ? (
              <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2">
                {publishedPosts.map((post) => {
                  const content = (
                    <>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
                        <span>{post.category}</span>
                        <span aria-hidden="true">/</span>
                        <span>{formatDate(post.date)}</span>
                        <span aria-hidden="true">/</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h2 className="mt-5 font-display text-[clamp(1.75rem,3vw,2.75rem)] font-medium leading-[1] tracking-[-0.04em] text-foreground transition-colors duration-200 group-hover:text-accent">
                        {post.title}
                      </h2>
                      <p className="mt-4 max-w-[42ch] text-[14px] leading-relaxed text-muted md:text-[15px]">
                        {post.excerpt}
                      </p>
                      <span className="mt-8 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-foreground">
                        Read article <span aria-hidden="true">↗</span>
                      </span>
                    </>
                  );

                  const className =
                    "group block rounded-[20px] border border-border bg-light-surface p-6 transition-[border-color,transform,background-color] duration-300 hover:-translate-y-1 hover:border-foreground/15 md:p-8";

                  if (post.href) {
                    return (
                      <a
                        key={post.slug}
                        href={post.href}
                        target={post.href.startsWith("http") ? "_blank" : undefined}
                        rel={post.href.startsWith("http") ? "noreferrer" : undefined}
                        className={className}
                      >
                        {content}
                      </a>
                    );
                  }

                  if (post.published) {
                    return (
                      <Link key={post.slug} to={`/journal/${post.slug}`} className={className}>
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <article key={post.slug} className={className}>
                      {content}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-14 rounded-[24px] border border-border bg-light-surface p-6 md:mt-20 md:p-10">
                <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent-text">
                  Coming soon
                </p>
                <h2 className="mt-4 max-w-[14ch] font-display text-[clamp(2rem,5vw,4rem)] font-medium leading-[0.95] tracking-[-0.04em] text-foreground">
                  The journal is being prepared.
                </h2>
                <p className="mt-5 max-w-[52ch] text-[14px] leading-relaxed text-muted md:text-[15px]">
                  We&apos;re setting up this space for studio notes, process breakdowns,
                  and practical insights. You can add posts in <code className="font-mono text-[0.95em] text-foreground">src/data/journal.ts</code>.
                </p>

                {upcomingPosts.length > 0 ? (
                  <div className="mt-10 grid gap-4 md:grid-cols-3">
                    {upcomingPosts.map((post) => (
                      <div key={post.slug} className="rounded-[16px] border border-border bg-background/60 p-5">
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                          {post.category}
                        </p>
                        <p className="mt-3 font-sans text-[16px] font-medium leading-snug tracking-[-0.02em] text-foreground">
                          {post.title}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-10">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-foreground transition-colors hover:text-accent"
                  >
                    Start a conversation <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
