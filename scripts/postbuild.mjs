import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const clientDir = path.resolve(import.meta.dirname, "../build/client");
const fallbackFile = path.join(clientDir, "__spa-fallback.html");
const notFoundFile = path.join(clientDir, "404.html");

if (!existsSync(fallbackFile)) {
  console.log("postbuild: no SPA fallback generated; nothing to rewrite");
  process.exit(0);
}

let html = readFileSync(fallbackFile, "utf8");

html = html
  .replace(/<title>[^<]*<\/title>/, "<title>Page not found | Anvik Labs</title>")
  .replace(/<meta name="robots"[^>]*>/g, "")
  .replace(/<link rel="canonical"[^>]*>/g, "")
  .replace(/<meta name="description"[^>]*>/g, "")
  .replace(/<meta name="application-name"[^>]*>/g, "")
  .replace(/<meta name="author"[^>]*>/g, "")
  .replace(/<meta property="og:[^"]*"[^>]*>/g, "")
  .replace(/<meta name="twitter:[^"]*"[^>]*>/g, "");

html = html.replace(
  "</head>",
  '<meta name="robots" content="noindex"/></head>',
);

writeFileSync(fallbackFile, html);
writeFileSync(notFoundFile, html);
console.log("postbuild: wrote noindex SPA fallback and static 404 shell");
