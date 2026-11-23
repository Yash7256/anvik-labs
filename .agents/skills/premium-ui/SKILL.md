---
name: premium-ui
description: >-
  Provides premium, craft-focused UI specifications for the Anvik Labs homepage
  and portfolio surfaces. Use when designing or implementing hero, work,
  services, team, testimonial, footer, or contact experiences that should feel
  polished, confident, and high-end with minimal editorial stiffness.
---

# Premium UI Skill

Use this skill for Anvik Labs pages/components that should feel **premium, modern, and crafted** rather than overly editorial or document-like.

## 1. Core Direction

- **Premium, not flashy.** Aim for calm confidence: strong type, clear hierarchy, refined spacing, tactile motion, and high-quality surfaces.
- **Minimize editorial stiffness.** Avoid newspaper-like layouts, rigid rule-heavy compositions, and overly muted “print” styling. Keep content breathable and dynamic.
- **Studio credibility first.** The UI should signal a boutique product design + engineering studio: sharp, trustworthy, and conversion-ready.
- **One accent, used with restraint.** Orange (`--color-accent`) is for emphasis, active states, key CTAs, and focus/hover cues - never a full-theme wash.

## 2. Visual System

### Palette & Surfaces
- Use existing theme tokens from `src/app/globals.css`; do not hardcode colors unless intentionally over media.
- Base surfaces: `bg-background`, `bg-light-surface`, `text-foreground`, `text-muted`, `border-border`.
- Premium depth is allowed: soft shadows, layered surfaces, subtle gradients, and controlled glassmorphism in featured areas (especially Services cards).
- Prefer smooth surface contrast over stark hairline-only layouts.

### Typography
- **Display:** `font-display` (Space Grotesk) for hero/section headlines - confident, tight tracking, large scale.
- **Body/UI:** `font-sans` (Geist) for readable copy, nav, buttons, and forms.
- **Meta:** `font-mono` sparingly for small labels/counters; do not make monospace the dominant voice.
- Keep body/label text >= 12px. Headings should feel bold/premium, not thin/archival.

### Layout
- Use generous spacing, but avoid rigid editorial grids. Favor clear focal points, strong CTA placement, and visual flow.
- Section rhythm should be consistent (`py-20 md:py-28 lg:py-36` as default for major homepage sections).
- Full-bleed moments are fine when they add impact (hero, marquee, media).

## 3. Component Patterns

### Hero
- Big, confident headline with restrained motion and clear value proposition.
- Keep CTA/scroll cues elegant and tactile; WebGL/background effects should enhance, not distract.

### Work/Projects
- Let imagery lead. Use clean cards/media frames, subtle hover lift/scale, and clear case-study affordance.
- Avoid text-heavy editorial treatments; prioritize visual proof.

### Services (Premium Exception)
- Services can be the most expressive/premium section: dark glass cards, soft ambient/fluid layers, depth, and polished hover states.
- Keep content scannable: clear service name, short benefit copy, capability pills/marquee, strong visual.

### Team/Testimonials
- Human, confident, and polished. Use warm imagery, clear roles, and readable quotes.
- Avoid museum-like captions; keep metadata secondary.

### Contact
- Premium conversion surface: clear heading, low-friction form, strong CTA, reassuring response copy.
- Contact popup should feel solid/premium (not stark editorial, not over-glassy), with accessible dialog behavior.

## 4. Motion & Interaction

- Motion should feel **smooth and intentional**: GSAP/Framer reveals, subtle parallax, magnetic/tactile hovers.
- Use ease/spring values already in system; avoid bouncy or gimmicky motion.
- Always respect `prefers-reduced-motion` and clean up GSAP/observers/listeners.
- Custom cursor/hover labels are allowed when they add clarity and feel refined.

## 5. Accessibility & Quality

- Preserve semantics: one `h1` per page, landmarks, labels, alt text, visible focus states, keyboard operability.
- Dialogs must trap focus, close on Escape, restore focus, and lock scroll appropriately.
- Maintain contrast in light/dark themes; verify token usage in both modes.

## 6. Do / Don’t

**Do**
- Use premium spacing, depth, and polish.
- Make CTAs obvious and inviting.
- Keep animations purposeful and performant.
- Reuse existing components/tokens/patterns before adding new ones.

**Don’t**
- Don’t make it feel like an editorial magazine/newsprint layout.
- Don’t overuse thin fonts, hairline-only structures, or metadata-heavy presentation.
- Don’t add noisy gradients, neon, or decorative clutter.
- Don’t introduce new dependencies unless necessary.

## 7. Verification

After UI changes:

```bash
npm run typecheck
npm run lint
npm run build
```

For visual/responsive changes, verify affected routes at desktop and mobile widths, in light/dark themes, and with reduced-motion behavior where applicable.