import type { Config } from "@react-router/dev/config";
import { projects } from "./src/data/projects";
import { journalPosts } from "./src/data/journal";

export default {
  appDirectory: "src",
  // Vercel's React Router preset does not support React Router 8 yet, so the
  // site is deployed as prerendered static output with a real 404 shell.
  ssr: false,
  routeDiscovery: { mode: "initial" },
  prerender: [
    "/",
    "/works",
    "/journal",
    ...journalPosts.filter((p) => p.published).map((p) => `/journal/${p.slug}`),
    ...projects.map((project) => `/works/${project.id}`),
    "/contact",
    "/services/web-development",
    "/services/product-design",
    "/services/ai-solutions",
    "/services/website-maintenance",
    "/sitemap.xml",
  ],
} satisfies Config;
