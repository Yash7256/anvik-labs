import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("app/page.tsx"),
  route("works", "app/works/page.tsx"),
  route("works/:slug", "app/works/[slug]/page.tsx"),
  route("aman-raj", "app/aman-raj/page.tsx"),
  route("journal", "app/journal/page.tsx"),
  route("contact", "app/contact/page.tsx"),
  route("services/web-development", "app/services/web-development/page.tsx"),
  route("services/product-design", "app/services/product-design/page.tsx"),
  route("services/ai-solutions", "app/services/ai-solutions/page.tsx"),
  route("services/website-maintenance", "app/services/website-maintenance/page.tsx"),
  route("sitemap.xml", "app/sitemap.ts"),
  route("*", "app/not-found.tsx"),
] satisfies RouteConfig;
