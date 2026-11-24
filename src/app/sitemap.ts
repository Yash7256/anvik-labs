import { projects } from "@/data/projects";
import { journalPosts } from "@/data/journal";
import { site } from "@/lib/site";

// Refresh lastmod at build time so the sitemap never advertises a stale date.
const generatedLastmod = new Date().toISOString().slice(0, 10);

const staticPaths = [
  { path: "/", changefreq: "weekly", priority: "1.0", lastmod: generatedLastmod },
  { path: "/works", changefreq: "monthly", priority: "0.9", lastmod: generatedLastmod },
  { path: "/journal", changefreq: "weekly", priority: "0.8", lastmod: generatedLastmod },
  { path: "/aman-raj", changefreq: "monthly", priority: "0.7", lastmod: generatedLastmod },
  { path: "/services/web-development", changefreq: "monthly", priority: "0.8", lastmod: generatedLastmod },
  { path: "/services/product-design", changefreq: "monthly", priority: "0.8", lastmod: generatedLastmod },
  { path: "/services/ai-solutions", changefreq: "monthly", priority: "0.8", lastmod: generatedLastmod },
  { path: "/services/website-maintenance", changefreq: "monthly", priority: "0.8", lastmod: generatedLastmod },
  { path: "/contact", changefreq: "yearly", priority: "0.6", lastmod: generatedLastmod },
] as const;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function loader() {
  const url = (path: string) => `${site.url}${path === "/" ? "/" : path}`;

  const entries = [
    ...staticPaths.map((entry) => ({
      loc: url(entry.path),
      lastmod: entry.lastmod,
      changefreq: entry.changefreq,
      priority: entry.priority,
    })),
    ...projects.map((project) => ({
      loc: url(`/works/${project.id}`),
      lastmod: generatedLastmod,
      changefreq: "yearly" as const,
      priority: "0.6",
    })),
    ...journalPosts
      .filter((post) => post.published)
      .map((post) => ({
        loc: url(`/journal/${post.slug}`),
        lastmod: post.updatedDate ?? post.date,
        changefreq: "monthly" as const,
        priority: "0.7",
      })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    ${entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>\n    ` : ""}<changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
