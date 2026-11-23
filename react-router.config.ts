import type { Config } from "@react-router/dev/config";
import { projects } from "./src/data/projects";

export default {
  appDirectory: "src",
  ssr: true,
  prerender: [
    "/",
    "/works",
    "/journal",
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
