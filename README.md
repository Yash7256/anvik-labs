# Anvik Labs

**Live site:** [anviklabs.site](https://anviklabs.site)

Portfolio and studio site for Anvik Labs, a product design and engineering studio. The site is a type-led React Router application with a small set of editorial routes: home, selected work, project detail, services, and contact. A light/dark theme toggle in the header persists the visitor's choice in local storage.

## Stack

- React 19
- React Router 8 with Vite
- Tailwind CSS 4
- Framer Motion, GSAP + ScrollTrigger, and Lenis for motion
- Three.js + React Three Fiber for the shader-driven hero WebGL layer
- TypeScript

## Development

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Vite prints the local URL. Run the production build with:

```bash
npm run build
npm run start
```

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

Run all three before considering a change complete.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home: typographic introduction over an interactive WebGL canvas, selected work, services, team, testimonials |
| `/works` | Selected work index |
| `/works/:slug` | Project case study |
| `/contact` | Inquiry details and contact form |
| `/services/web-development` | Web development service |
| `/services/product-design` | UI/UX and product design service |
| `/services/ai-solutions` | AI solutions service |
| `/services/website-maintenance` | Website maintenance service |
| `/sitemap.xml` | Generated sitemap (static routes plus work case studies) |

Routes are declared in `src/routes.ts`. SEO metadata is centralised in `src/lib/site.ts`
(`createMeta()`, `createWorkDescription()`, and organisation config). `public/robots.txt`
and `public/llms.txt` are static; the sitemap is prerendered from `src/app/sitemap.ts`.

## Project structure

```text
src/
  app/                 Route modules and global styles
  components/          Shared UI and home-page sections
  data/                Work and testimonial content
  lib/gsap.ts          GSAP, ScrollTrigger, and SplitText registration
  lib/motion.ts        Shared motion tokens and hooks
  lib/smooth-scroll.ts Lenis setup and programmatic scrolling
  lib/site.ts          Site metadata
  webgl/               Hero canvas, shaders, scroll controller
  root.tsx             Document shell, fonts, skip link, Lenis and hash scrolling
  routes.ts            React Router route config
public/
  mockups/             Project mockups
  profile/             Team imagery
```

## Content

- Project data lives in `src/data/projects.json`, with typed accessors in `src/data/projects.ts`. Each project supplies its work type plus the design and/or development decisions shown on its dedicated case-study page.
- Testimonials live in `src/data/testimonials.json`. Author avatars are optional via an `avatar` field; entries without an image render a circular initials fallback.
- The contact form submits to FormSubmit (`https://formsubmit.co/ajax/anviklabs@gmail.com`), which forwards each inquiry to `anviklabs@gmail.com`. The first submission sends an activation email to that address; click its link once to start receiving messages. Submissions are not stored in this repo.
- Before launch, confirm that project names, case-study copy, mockups, and client quotes are approved for publication. Some current project content is portfolio placeholder material.

## Design and accessibility

- Global tokens and base styles are in `src/app/globals.css`.
- Keep the light palette, restrained accent use, hairline rules, and editorial type hierarchy.
- Avoid decorative gradients, heavy shadows, oversized radii, and generic card grids.
- Use semantic landmarks, one `h1` per page, visible focus states, labelled form controls, and alt text for meaningful images.
- Respect `prefers-reduced-motion` for animated content. The hero WebGL layer is skipped for reduced-motion visitors and when WebGL is unavailable; a static CSS ambience is shown instead.
- Above-the-fold styling is inlined from `src/app/critical.css`; the full stylesheet is loaded asynchronously after first paint.
- The three used typefaces are self-hosted in `public/fonts` with their OFL licences, so no third-party font stylesheet blocks rendering.
- Project mockups ship 320/380/480/640/768/800/1024/1440 WebP variants; grid video posters use the 380px variant so they match their displayed size.
- The WebGL scene and Lenis smooth scrolling load only after user interaction, or after a short idle delay for WebGL, so their bundles stay out of the initial render path.
- The current design system is documented in [`design.md`](./design.md).
- The frontend audit and its remaining risks are in [`docs/frontend-ai-slop-audit.md`](./docs/frontend-ai-slop-audit.md).

## Deployment

The app builds to `build/client` as prerendered static HTML and can be deployed to any static host. React Router runs in SPA mode because Vercel's React Router preset does not support React Router 8. Vercel is configured with the `Other` framework preset, `build/client` as the output directory, clean URLs, and a static `404.html` so unknown paths return a real `404` instead of invoking a server function. Known legacy URLs, the `www` host, and trailing-slash variants are redirected to canonical URLs with `301` in `vercel.json`; set the host to serve `404.html` for unmatched paths. If a domain-level `www` redirect is also configured in Vercel's Domains settings, remove it so the `vercel.json` host rule can return `301` instead of Vercel's default `307`.

Cloudflare Web Analytics and Email Address Obfuscation inject `beacon.min.js` and `email-decode.min.js` into HTML at the edge. Disable both in the Cloudflare dashboard rather than setting `Cache-Control: no-transform`, which would remove HTML compression. Do not add the beacon to the CSP allowlist after the dashboard change.

### Search engine verification

Google's and Bing's public verification tokens are stored in `src/lib/search-verification.ts`. Tokens for other engines are optional and render only when the matching build-time environment variable is set in Vercel:

- `VITE_GOOGLE_SITE_VERIFICATION`
- `VITE_BING_SITE_VERIFICATION`
- `VITE_YANDEX_SITE_VERIFICATION`
- `VITE_BAIDU_SITE_VERIFICATION`
- `VITE_NAVER_SITE_VERIFICATION`
- `VITE_PINTEREST_SITE_VERIFICATION`

Set overrides in Vercel and redeploy. For engines without a public default, an empty value renders no tag.
