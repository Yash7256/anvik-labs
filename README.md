# Anvik Labs

Portfolio and studio site for Anvik Labs, a product design and engineering studio. The site is a type-led React Router application with a small set of editorial routes: home, selected work, project detail, services, and contact. A light/dark theme toggle in the header persists the visitor's choice in local storage.

## Stack

- React 19
- React Router 8 with Vite
- Tailwind CSS 4
- Framer Motion, GSAP + ScrollTrigger, and Lenis for motion
- Three.js + React Three Fiber for shader-driven hero and featured-image WebGL layers
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
  webgl/               Hero canvas, featured image surface, shaders, scroll controller
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
- Respect `prefers-reduced-motion` for animated content. The hero WebGL layer is skipped for reduced-motion visitors and when WebGL is unavailable; a static CSS ambience is shown instead. The featured image surface is lazily mounted near the viewport, pauses offscreen, and falls back to the source image when reduced motion or WebGL is unavailable.
- The current design system is documented in [`design.md`](./design.md).
- The frontend audit and its remaining risks are in [`docs/frontend-ai-slop-audit.md`](./docs/frontend-ai-slop-audit.md).

## Deployment

The app builds to `build/client` and can be deployed to any static host that supports React Router's SPA fallback. The build also prerenders repository routes. Set the host to serve `build/client` and fall back to `build/client/__spa-fallback.html` for unknown paths.
