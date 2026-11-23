import { projects } from "@/data/projects";
import { journalPosts } from "@/data/journal";
import { site } from "@/lib/site";

const staticPaths = [
  { path: "/", changefreq: "weekly", priority: "1.0", lastmod: "2026-05-15" },
  { path: "/works", changefreq: "monthly", priority: "0.9", lastmod: "2026-05-15" },
  { path: "/journal", changefreq: "weekly", priority: "0.8", lastmod: "2026-05-15" },
  { path: "/aman-raj", changefreq: "monthly", priority: "0.7", lastmod: "2026-05-15" },
  { path: "/services/web-development", changefreq: "monthly", priority: "0.8", lastmod: "2026-05-15" },
  { path: "/services/product-design", changefreq: "monthly", priority: "0.8", lastmod: "2026-05-15" },
  { path: "/services/ai-solutions", changefreq: "monthly", priority: "0.8", lastmod: "2026-05-15" },
  { path: "/services/website-maintenance", changefreq: "monthly", priority: "0.8", lastmod: "2026-05-15" },
  { path: "/contact", changefreq: "yearly", priority: "0.6", lastmod: "2026-05-15" },
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
      lastmod: `${project.year}-01-01`,
      changefreq: "yearly" as const,
      priority: "0.6",
    })),
    ...journalPosts
      .filter((post) => post.published)
      .map((post) => ({
        loc: url(`/journal/${post.slug}`),
        lastmod: post.date,
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
