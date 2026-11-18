import { projects } from "@/data/projects";
import { site } from "@/lib/site";

const staticPaths = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/works", changefreq: "monthly", priority: "0.9" },
  { path: "/aman-raj", changefreq: "monthly", priority: "0.7" },
  { path: "/services/web-development", changefreq: "monthly", priority: "0.8" },
  { path: "/services/product-design", changefreq: "monthly", priority: "0.8" },
  { path: "/services/ai-solutions", changefreq: "monthly", priority: "0.8" },
  { path: "/services/website-maintenance", changefreq: "monthly", priority: "0.8" },
  { path: "/contact", changefreq: "yearly", priority: "0.6" },
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
      changefreq: entry.changefreq,
      priority: entry.priority,
    })),
    ...projects.map((project) => ({
      loc: url(`/works/${project.id}`),
      changefreq: "yearly" as const,
      priority: "0.6",
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <changefreq>${entry.changefreq}</changefreq>
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
