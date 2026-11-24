# Frontend AI-Slop Audit

**Project:** Anvik Labs portfolio
**Date:** 5 November 2026
**Scope:** Public routes, shared components, design tokens, content, assets, navigation, accessibility, responsive behavior, and build output.

## Verdict

The site no longer reads as a template or an AI-generated landing page. The remaining work is mostly content provenance and final visual sign-off, not structural UI repair.

The strongest signals were not individual colors or shadows. They were the number of unrelated page ideas, fake destinations, placeholder contact details, dead components, and repeated sections with no editorial reason to exist. Those have been removed or replaced.

## Update — 20 November 2026

The findings below record an earlier state. The current implementation differs in these ways:

- Motion now uses GSAP + ScrollTrigger and Lenis alongside Framer Motion. Native CSS smooth scrolling is intentionally disabled so Lenis does not double-ease.
- Testimonials use a GSAP marquee with a static grid for reduced motion, not the auto-advancing quotation described below.
- The standalone Featured Product section and `src/components/FeaturedProduct.tsx` were removed. Designers Room remains only as a hero project card.
- Service rows no longer show numeric indices.
- The contact form posts to FormSubmit, not a `mailto:` draft. The older mailto notes below are superseded by `README.md`.
- Additional motion now covers post-hydration route fades, works filter reflow, contact status feedback, sticky scroll-progress hairlines, the Aman timeline, and offscreen/hidden pausing for the testimonial marquee.
- Typecheck, lint, and build pass after the motion changes. Headless Chrome screenshots at 1440px and 390px render all affected routes; a human visual comparison is still recommended.

## Update — 25 November 2026

- WebGL, Lenis smooth scrolling, and service video media now load only after a deliberate user interaction. Programmatic scrolling and timed audits no longer fetch the WebGL bundle or the service MP4 files.
- Service video posters are compressed WebP files, and reduced-motion layouts use stable markup toggled by CSS so prerendered HTML hydrates cleanly.
- Typecheck, lint, and build pass. Headless checks at 1440px and 390px confirm no horizontal overflow, no console errors, intact hero/work spacing, and no initial WebGL, Lenis, or MP4 requests.
- The CyberSec Toolkit case study now carries its own research, solution, UX/visual approach, final outcome, and clearly labelled estimated impact copy. Non-Sedative case studies no longer inherit Sedative Physio interface imagery.
- Headless checks confirm the CyberSec Toolkit route has one `h1`, no horizontal overflow, no console errors, and no Sedative image references at desktop, mobile, or reduced-motion widths.

## Findings and resolutions

| # | Finding | Severity | Resolution |
| --- | --- | --- | --- |
| 1 | The repository described itself as a Next.js app while running React Router + Vite. `design.md` documented a different product (TITARVL) and a different visual system. | High | Rewrote `README.md`, `AGENTS.md`, and `design.md` for the actual Anvik Labs stack and interface. |
| 2 | Navigation and CTAs pointed at missing or placeholder destinations (`/about`, `/work`, `#`, external template links). | High | Replaced with real routes: `/`, `/works`, `/works/:slug`, `/contact`, `/#services`. |
| 3 | Contact information was placeholding or inconsistent. | High | Standardised on `hello@anviklabs.com`, India-based studio copy, and an explicit `mailto:` draft flow. |
| 4 | The home page mixed unrelated template sections and duplicated heading patterns. | High | Removed `Advantage`, `Awards`, `Pricing`, `Latest`, `WhatIDo`, and the cursor-image component. Home is now a deliberate sequence: hero, featured product, team, services, testimonials, writing. |
| 5 | Large amounts of dead code, unused hooks, unused assets, and a Palmer template asset tree remained in the repo. | Medium | Removed unused components, hooks, utilities, and unused public assets, including `public/palmer`. Renamed project mockups to semantic filenames. |
| 6 | Tiny labels and metadata were common (`8px`–`11px`), especially in overlays. | Medium | Raised visible labels to 12px across the site. Monospace is now reserved for metadata and controls. |
| 7 | Pure black/white surfaces and mixed surface tokens weakened the palette. | Medium | Moved to the near-black `#080808` background, `#e7e9ee` foreground, and named surface tokens. |
| 8 | Decorative motion and marquees ran without a content reason. | Medium | Removed the testimonial marquee and duplicated marquee behavior, removed the auto-advancing testimonial, and preserved reduced-motion handling. |
| 9 | Project images lacked reliable dimensions, loading behavior, or clear alt text. | Medium | Updated `Img` defaults, set eager/lazy loading, added dimensions where needed, and gave project imagery descriptive alt text. |
| 10 | Mobile navigation was not a complete accessible interaction. | Medium | Added a labelled dialog, `aria-expanded`, `aria-controls`, Escape-to-close, and body scroll locking. |
| 11 | The testimonial section read like a generic SaaS card grid with a large visible label and a name-button matrix. | Medium | Replaced with the centered editorial composition specified in `reference/testimonials.png`: serif quotation, prominent quote marks, circular avatar, centered author block, and restrained previous/next navigation. |
| 12 | The site had no consistent route-level `main` target or skip-link destination. | Medium | Added `main#main-content` and a working skip link. |
| 13 | Some imagery and project copy may be AI-generated or fictional, while being presented as case studies. | High (content risk) | Not fully resolved. Treat the current project data as provisional until approved. This risk is documented in `README.md` and `design.md`. |
| 14 | Client testimonial portraits do not exist in the repository. | Low | Added optional `avatar` support and a circular initials fallback. Supply approved portraits before treating the author blocks as final. |
| 15 | The gallery used repeated image paths as React keys, producing duplicate-key warnings. | Low | Changed gallery keys to project slugs. |

## What changed in the interface

- The hero is now a single editorial statement with a product reel and a full-width wordmark, not a stack of competing animations.
- The Designers Room feature uses one clear CTA pattern, matching the footer.
- Meet the Humans keeps its original portrait treatment, with a static heading consistent with the rest of the home page and hover detail anchored at the bottom.
- Services and writing use hairline rows and restrained hover states instead of cards.
- The testimonial section is centered, quiet, and typographic. It uses Instrument Serif for the quote, Inter for the author, and a circular portrait or initials mark.
- Works and project galleries are driven by the same project data, so they cannot drift into separate fake case-study sets.
- Contact is explicit about being a mailto draft, not a backend form.

## Verification performed

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm run build` — pass, including route prerendering.
- Headless browser checks at 1440px and 390px across `/`, `/works`, `/works/chronicae`, and `/contact`:
  - No document-level horizontal overflow.
  - No application console errors after the gallery key fix.
  - No missing `alt` attributes on meaningful images.
  - Testimonial section loads Instrument Serif, stays within the viewport, auto-advances, pauses on the Pause control, resumes on Play, and keeps manual navigation functional.
- The home page’s portrait imagery extends past its section bounds inside an `overflow-hidden` container. It does not create page-level horizontal scrolling.

## Remaining risks and recommendations

1. **Confirm work provenance.** Replace or approve the current project names, case-study copy, and mockups. The copy is well written but still provisional.
2. **Supply client avatars.** Add approved portrait files and an `avatar` field to testimonial entries; the initials fallback is a holding pattern.
3. **Content truthfulness.** The testimonials are carried over from the existing site. Confirm each quote and attribution before launch.
4. **Long testimonial quotes.** Several entries are 70–80 words and run to 7 lines on desktop and 11 on mobile. The layout preserves the full text rather than truncating it. If the section should match the reference’s 3–4 line target, the quotes need editorial trimming.
5. **Intentional exceptions.** Meet the Humans retains its 10px screen-reader metadata, `bg-black` media wells, and gradient overlay because the user explicitly asked for the original visual treatment. Do not “fix” those without revisiting that decision.
6. **Contact delivery.** There is no backend, spam protection, or delivery confirmation. The UI is honest about this, but a production inquiry flow should use a real form endpoint.
7. **Final visual sign-off.** The current model cannot inspect images directly in this environment. Layout, type, overflow, and interaction were verified through computed DOM checks; a human should compare the testimonial section and overall pages against the reference before release.

## Key files

- `src/app/globals.css` — tokens, fonts, focus, reduced motion, shell styles.
- `src/root.tsx` — document shell, font links, skip link, hash scrolling.
- `src/components/Testimonials.tsx` — centered testimonial section.
- `src/data/testimonials.json` — testimonial content.
- `src/components/Navbar.tsx` — navigation and mobile drawer.
- `src/components/FeaturedProduct.tsx` — Designers Room feature.
- `src/components/MeetTheHumans.tsx` — team portraits.
- `src/components/Services.tsx`, `src/components/Articles.tsx` — editorial rows.
- `src/components/Contact.tsx` — mailto inquiry form.
- `src/data/works.ts` — project content.
- `README.md`, `AGENTS.md`, `design.md` — current project and design documentation.
