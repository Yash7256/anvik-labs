import type { Config } from "@react-router/dev/config";
import { projects } from "./src/data/projects";

export default {
  appDirectory: "src",
  ssr: true,
  prerender: [
    "/",
    "/works",
    ...projects.map((project) => `/works/${project.id}`),
    "/contact",
    "/services/web-development",
    "/services/product-design",
    "/services/ai-solutions",
    "/services/website-maintenance",
    "/sitemap.xml",
  ],
} satisfies Config;
