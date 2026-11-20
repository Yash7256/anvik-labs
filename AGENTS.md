# AGENTS.md

## Project

This is the Anvik Labs portfolio: a React Router 8 + Vite + React 19 application styled with Tailwind CSS 4 and animated with Framer Motion. It is not a Next.js project.

## Commands

```bash
npm run dev        # Vite dev server
npm run typecheck  # react-router typegen + tsc
npm run lint       # ESLint
npm run build      # production build + route prerender
npm run start      # preview the production build
```

Run `typecheck`, `lint`, and `build` after code changes. For visual or responsive changes, also verify the affected routes at desktop and mobile widths in a browser.

## Structure

- `src/routes.ts` declares routes; route modules live in `src/app/`.
- Shared UI lives in `src/components/`; home sections are composed in `src/app/page.tsx`.
- Content lives in `src/data/works.ts` and `src/data/testimonials.json`.
- Design tokens, fonts, base styles, and reduced-motion rules live in `src/app/globals.css`.
- The document shell, font links, skip link, and hash scrolling are in `src/root.tsx`.
- The site name and metadata live in `src/lib/site.ts`.

## Conventions

- Use the existing light palette and tokens: `#f5f5f5` canvas, `#171717` primary text, `#656565` secondary text. Keep the single warm accent and avoid introducing a second theme.
- Keep the visual language editorial: type, whitespace, hairlines, and a restrained accent. Avoid decorative gradients, glows, heavy shadows, glass cards, and generic SaaS card grids.
- Keep body and label text at 12px or larger. Monospace is for metadata and labels, not sentences.
- Preserve semantic structure: one `h1` per page, `main` landmarks, labelled controls, alt text, and visible focus states.
- Respect `prefers-reduced-motion` for non-essential animation.
- Use existing components and utilities before adding dependencies.
- Do not present placeholder case studies, client quotes, or imagery as verified facts. Note provenance where content is provisional.
- The contact form posts to FormSubmit (`https://formsubmit.co/ajax/anviklabs@gmail.com`), which emails inquiries to `anviklabs@gmail.com`. No submissions are stored in this repo.
- Update `README.md`, `design.md`, or the audit report when a change alters the stack, routes, design system, or documented risks.
