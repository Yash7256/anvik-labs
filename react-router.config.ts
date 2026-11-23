import type { Config } from "@react-router/dev/config";
import { projects } from "./src/data/projects";
import { journalPosts } from "./src/data/journal";

export default {
  appDirectory: "src",
  ssr: true,
  routeDiscovery: { mode: "initial" },
  prerender: [
    "/",
    "/works",
    "/journal",
    ...journalPosts.filter((p) => p.published).map((p) => `/journal/${p.slug}`),
    ...projects.map((project) => `/works/${project.id}`),
    "/aman-raj",
    "/contact",
    "/services/web-development",
    "/services/product-design",
    "/services/ai-solutions",
    "/services/website-maintenance",
    "/sitemap.xml",
  ],
} satisfies Config;
