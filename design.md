# Anvik Labs Design System

This document describes the current implementation. It replaces the stale TITARVL/Framer specification.

## Principles

- **Editorial, not decorative.** The site is built from type, whitespace, hairlines, and restrained imagery. Avoid cards, glows, gradients, heavy shadows, glass effects, and generic SaaS layouts.
- **Three voices.** Space Grotesk carries headings; Geist carries body copy, navigation, and controls; Geist Mono carries metadata, labels, counters, and short UI controls.
- **One accent.** Orange is a punctuation mark, not a theme. Use it for active states, small labels, links, and quote emphasis only.
- **Structure visible.** Thin rules, numeric indices, and generous spacing make the page feel like a working document.
- **Motion with restraint.** Animation clarifies a transition or adds tactility. It should not run constantly or compete with reading.

## Color

Tokens are defined in `src/app/globals.css`.

| Token | Value | Use |
| --- | --- | --- |
| `--color-background` | `#f5f5f5` | Page background |
| `--color-foreground` | `#171717` | Primary text |
| `--color-text-secondary` / `--color-muted` | `#656565` | Secondary copy |
| `--color-border` | `rgba(23, 23, 23, 0.12)` | Hairlines and dividers |
| `--color-light-surface` / `--color-surface` | `#ffffff` | Media wells and soft surfaces |
| `--color-dark-surface` | `#ebebeb` | Recessed surfaces |
| `--color-accent` | `#ff5a0a` | Primary accent |
| `--color-accent-text` | `#c2410c` | Accent text on light |
| `--color-accent-strong` | `#e04e00` | Accent hover |
| `--color-accent-soft` | `rgba(255, 90, 10, 0.12)` | Quiet accent wash |
| `--color-on-accent` | `#0d0d0d` | Text on accent fills |

Do not introduce a second accent. Keep the light palette; use the warm gray canvas and white surfaces rather than introducing a second theme. Avoid pure black and pure white as large type colors; use the foreground and background tokens instead.

## Typography

### Families

All three families load from Google Fonts in `src/root.tsx`. Tokens live in `src/app/globals.css`.

- **Space Grotesk** — `font-display`. Used for hero, section, and card headings. Weight 600 for the hero, 500 elsewhere.
- **Geist** — `font-sans`. Used for body copy, navigation, buttons, and form values. Weight 400 for body, 500 for UI controls.
- **Geist Mono** — `font-mono`. Used for labels, indices, metadata, counters, and technical annotations at weight 400.

### Scale

- Page title: `clamp(3.5rem, 10vw, 9rem)`, tight leading, `-0.05em` tracking.
- Section heading: `clamp(2.4rem, 6vw, 5.5rem)`, `0.95` leading, `-0.04em` tracking.
- Hero heading: `clamp(2.75rem, 7.5vw, 5.75rem)`, `1.04` leading, weight 600, `-0.045em` tracking; `40ch` measure.
- Hero description: 16px, weight 400, full foreground contrast.
- Section headings: weight 500, `-0.04em` tracking. Card headings: weight 500.
- Body: 14–17px, weight 400, `-0.01em` tracking, relaxed leading.
- Labels and metadata: 12px minimum, Geist Mono, weight 400, uppercase, `0.04em` tracking.
- Do not set body or label text below 12px. Monospace is not for sentences.

## Layout

- The app shell applies page gutters: 16px on mobile, then `4vw`, `5vw`, and `6vw` at larger breakpoints.
- Sections generally use `border-t` hairline separators and vertical padding from 64px to 144px.
- Home sections use a consistent header pattern: a small mono index, a large sans heading, and a short supporting paragraph. The testimonial section intentionally breaks this pattern and is centered.
- Media wells use `--color-light-surface`, a 1px hairline, and small radii (2px for controls, 5–8px for media). Avoid oversized rounded cards.
- Responsive layouts collapse to a single column on mobile. Project grids use 1 column mobile, 3 columns desktop.

## Components

### Navigation

- Fixed header with a translucent background and blur.
- Desktop links: Works, Services, plus a rounded "Let's talk" CTA to `/contact`.
- Mobile: `[ MENU ]` opens a full-screen drawer. Escape closes it; body scroll is locked while open.
- Focus states are always visible. The skip link targets `#main-content`.

### Hero

- Min-height fills the viewport minus the header.
- Centered two-line headline, short supporting paragraph, and a dark "Work With Us" pill that matches the navbar CTA.
- A single "All Work" link to `/works`; no segmented discipline navigation.
- Three compact project cards in one row with subtle scroll-linked cover parallax. The horizontal strip uses `data-lenis-prevent` so native horizontal scrolling is preserved.
- Orange is reserved for hover and focus accents, not primary CTAs.

### Meet the Humans

- Two portrait figures with watermarks, pointer parallax, and hover detail overlays.
- The original visual treatment is intentionally preserved. The section heading follows the same static pattern as other home sections.
- Hover detail sits at the bottom of each portrait.

### Services

- Four hairline rows with three columns: service name, discipline, and technical detail. Numeric indices are intentionally absent.
- Rows reveal on scroll with GSAP. Hover changes type color and adds a quiet row wash.

### Testimonials

- Full-width, centered section with no visible section label; the `h2` is screen-reader only.
- Large Instrument Serif quotation with prominent opening and closing marks.
- Author block directly below: 56px circular avatar, name in Inter semibold, role and organization in muted Inter.
- Avatars are optional. When no image exists, a circular initials fallback is used.
- Data comes from `src/data/testimonials.json`.
- Quotes move in a GSAP-driven continuous marquee; scroll velocity briefly influences speed and direction.
- Hover, keyboard focus, or the Pause control stops the marquee; Play resumes it.
- Reduced-motion users see a static grid of all testimonials instead of the moving track.
- Keep the composition centered and spacious. Do not turn it into a card grid or add testimonial badges.

### Contact

- Contact details, studio description, and a contact form backed by FormSubmit.
- Labels are explicit; required fields are marked.
- The form submits to FormSubmit, which emails the inquiry to `anviklabs@gmail.com`.
- The form shows sending, success, and error states; nothing is stored in this repo.

### Footer

- Studio statement, footer navigation, email, and back-to-top control.
- Tagline words reveal on scroll with GSAP; back-to-top scrolls through Lenis.

### Works and project galleries

- `/works` is a data-driven index from `src/data/works.ts`.
- `/works/:slug` renders project metadata, narrative, gallery, and next-project link.

## Motion

- Framer Motion handles navigation presence, portrait reveals and pointer parallax, accordions, and reduced-motion detection in components that need it.
- GSAP + ScrollTrigger handle homepage entrances, service-row reveals, cover and portrait parallax, the testimonial marquee, and the footer tagline reveal.
- Lenis provides site-wide smooth scrolling, driven by GSAP's ticker. Hash navigation and back-to-top use Lenis with a header offset; native CSS smooth scrolling stays off to avoid double easing.
- Prefer opacity, small translate, scale, hairline, and mask transitions. Avoid long loops, scroll-jacking, elastic easing, and animating layout-driving properties.
- The hero project strip opts out of Lenis with `data-lenis-prevent` so its native horizontal snap scrolling keeps working.
- Route changes fade in only after hydration, so prerendered HTML stays visible without JavaScript. Works filtering, contact status changes, and scroll progress hairlines use short, reduced-motion-aware transitions.
- Respect `prefers-reduced-motion`. Lenis honors it natively, Framer Motion is configured with `reducedMotion="user"`, GSAP blocks are skipped in reduced motion, testimonials become a static grid, and the global stylesheet shortens CSS transitions.

## Content and provenance

- `src/data/works.ts` and `src/data/testimonials.json` are the content sources.
- Project mockups live in `public/mockups/`; team imagery lives in `public/profile/`.
- Some project names, case-study copy, and mockups are provisional portfolio material. Confirm approval before presenting them as verified client work.
- Testimonials currently have no client avatar files; initials fallbacks are intentional until approved portraits are supplied.

## Accessibility

- One `h1` per page.
- Every route exposes a `main#main-content` landmark.
- All images that carry meaning need alt text; decorative images use an empty `alt`.
- Controls have accessible names and visible focus states.
- Accordions expose `aria-expanded` and `aria-controls`.
- Mobile navigation is a labelled dialog and closes with Escape.
- Keep body and label text at 12px or larger.

## Routes

- `/` — home
- `/works` — project index
- `/works/:slug` — project detail
- `/contact` — inquiry
