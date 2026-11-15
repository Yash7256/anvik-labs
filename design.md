# Anvik Labs Design System

This document describes the current implementation. It replaces the stale TITARVL/Framer specification.

## Principles

- **Editorial, not decorative.** The site is built from type, whitespace, hairlines, and restrained imagery. Avoid cards, glows, gradients, heavy shadows, glass effects, and generic SaaS layouts.
- **Two voices.** Inter Display carries headings and body copy. Monospace carries metadata, labels, counters, and short UI controls.
- **One accent.** Orange is a punctuation mark, not a theme. Use it for active states, small labels, links, and quote emphasis only.
- **Structure visible.** Thin rules, numeric indices, and generous spacing make the page feel like a working document.
- **Motion with restraint.** Animation clarifies a transition or adds tactility. It should not run constantly or compete with reading.

## Color

Tokens are defined in `src/app/globals.css`.

| Token | Value | Use |
| --- | --- | --- |
| `--color-background` | `#080808` | Page background |
| `--color-foreground` | `#e7e9ee` | Primary text |
| `--color-text-secondary` / `--color-muted` | `rgba(231, 233, 238, 0.62)` | Secondary copy |
| `--color-border` | `rgba(255, 255, 255, 0.12)` | Hairlines and dividers |
| `--color-light-surface` / `--color-surface` | `#11100f` | Media wells and soft surfaces |
| `--color-dark-surface` | `#0b0a09` | Deep surfaces |
| `--color-accent` | `#ff6a00` | Primary accent |
| `--color-accent-text` | `#ff8a4a` | Accent text on dark |
| `--color-accent-strong` | `#ff6a1a` | Accent hover |
| `--color-accent-soft` | `rgba(255, 106, 26, 0.12)` | Quiet accent wash |
| `--color-on-accent` | `#080808` | Text on accent fills |

Do not introduce a second accent. Do not switch the site to a light theme. Avoid pure black and pure white as large surfaces; use the near-black and off-white tokens instead.

## Typography

### Families

- **Inter Display** — self-hosted from `public/fonts/`, weights 400/500/600/700. Used for headings, body copy, navigation, and form values.
- **Monospace** — system monospace stack. Used for labels, indices, metadata, counters, and technical annotations.
- **Michroma** — Google Fonts. Used only for the oversized `Anvik Labs` wordmark in the hero.
- **Instrument Serif** — Google Fonts. Used only for testimonial quotations.

### Scale

- Page title: `clamp(3.5rem, 10vw, 9rem)`, tight leading, `-0.05em` tracking.
- Section heading: `clamp(2.4rem, 6vw, 5.5rem)`, `0.95` leading, `-0.04em` tracking.
- Hero heading: `clamp(2.1rem, 3.8vw, 3.6rem)`, `1.08` leading.
- Testimonial quote: `clamp(1.6rem, 3.1vw, 2.7rem)` in Instrument Serif, `1.14` leading, max width `54ch`.
- Body: 14–17px, relaxed leading.
- Labels and metadata: 12px minimum, monospace, uppercase, wide tracking.
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
- Desktop links: Home, Works, Services, Contact.
- Mobile: `[ MENU ]` opens a full-screen drawer. Escape closes it; body scroll is locked while open.
- Focus states are always visible. The skip link targets `#main-content`.

### Hero

- Min-height fills the viewport minus the header.
- Left: kicker, two-line introduction, supporting paragraph, selected-product list.
- Right: autoplaying muted product reel.
- Bottom: full-width Michroma wordmark, hairline rules, and studio metadata.

### Featured product

- Editorial two-column feature for Designers Room.
- Logo, product name, short description, and the standard CTA: a white pill button with a black label and no icon.

### Meet the Humans

- Two portrait figures with watermarks, pointer parallax, and hover detail overlays.
- The original visual treatment is intentionally preserved. The section heading follows the same static pattern as other home sections.
- Hover detail sits at the bottom of each portrait.

### Services

- Four hairline rows: index, service name, discipline, technical detail, and scope.
- Hover changes only type color and a quiet row wash.

### Testimonials

- Full-width, centered section with no visible section label; the `h2` is screen-reader only.
- Large Instrument Serif quotation with prominent opening and closing marks.
- Author block directly below: 56px circular avatar, name in Inter semibold, role and organization in muted Inter.
- Avatars are optional. When no image exists, a circular initials fallback is used.
- Data comes from `src/data/testimonials.json`.
- The quote area reserves the height of the longest testimonial, so rotation never shifts the page.
- Auto-advances every 7 seconds. Rotation pauses on hover, keyboard focus, or when the visitor presses Pause.
- Navigation is also manual: previous/next controls, a pause/play control, and an `01 / 05` counter.
- `aria-live` is polite only while rotation is paused, so automatic changes are not announced repeatedly.
- Transitions use a short fade and vertical shift, disabled for reduced motion.
- Keep the composition centered and spacious. Do not turn it into a card grid or add testimonial badges.

### Contact

- Contact details, studio description, and a contact form backed by FormSubmit.
- Labels are explicit; required fields are marked.
- The form submits to FormSubmit, which emails the inquiry to `anviklabs@gmail.com`.
- The form shows sending, success, and error states; nothing is stored in this repo.

### Footer

- Studio statement, footer navigation, email, and back-to-top control.
- The CTA uses the same white pill button pattern as the featured product.

### Works and project galleries

- `/works` is a data-driven index from `src/data/works.ts`.
- `/works/:slug` renders project metadata, narrative, gallery, and next-project link.

## Motion

- Framer Motion is used for navigation, portrait reveals, accordions, and testimonial transitions.
- Prefer opacity, small translate, and height transitions. Avoid long loops and scroll-jacking.
- Respect `prefers-reduced-motion`; the global stylesheet also shortens animation and transition durations.
- Hash navigation honors reduced motion.

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
