import { existsSync, readFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const legacyRedirects: Record<string, string> = {
  "/work": "/works",
  "/works/arcane-studio": "/works",
  "/works/big-baby-tape-magazine": "/works",
  "/journal/production-ready-architecture-audit": "/journal/production-readiness-architecture-audit",
};

function staticPreviewRouting(): Plugin {
  return {
    name: "static-preview-routing",
    configurePreviewServer(server) {
      const clientDir = path.resolve(server.config.build.outDir);
      const notFoundFile = path.join(clientDir, "404.html");

      server.middlewares.use((req, res, next) => {
        // React Router prerenders through this preview server; keep preview-only
        // routing out of the build pass so prerendered HTML stays intact.
        if (process.env.IS_RR_BUILD_REQUEST === "yes") {
          next();
          return;
        }

        const url = new URL(req.url ?? "/", "http://localhost");
        const pathname = url.pathname;
        const normalized = pathname.length > 1 && pathname.endsWith("/")
          ? pathname.replace(/\/+$/, "")
          : pathname;

        const destination = legacyRedirects[pathname] ?? legacyRedirects[normalized];
        if (destination) {
          res.statusCode = 301;
          res.setHeader("Location", `${destination}${url.search}`);
          res.end();
          return;
        }

        if (normalized !== pathname) {
          res.statusCode = 301;
          res.setHeader("Location", `${normalized}${url.search}`);
          res.end();
          return;
        }

        if (normalized === "/" || path.extname(normalized)) {
          next();
          return;
        }

        const indexPath = path.join(clientDir, normalized, "index.html");
        if (existsSync(indexPath)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(readFileSync(indexPath));
          return;
        }

        if (!existsSync(notFoundFile)) {
          next();
          return;
        }

        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(readFileSync(notFoundFile));
      });
    },
  };
}

export default defineConfig({
  appType: "custom",
  plugins: [staticPreviewRouting(), reactRouter(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    port: 5173,
  },
});
