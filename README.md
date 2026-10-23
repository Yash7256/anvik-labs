# Anvik Labs

Technology studio site for Anvik Labs. Editorial hero, WebGL pill stack, preloader sequence, and scroll-driven storytelling.

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- GSAP + ScrollTrigger + SplitText + MorphSVG
- Lenis smooth scrolling
- OGL (WebGL shader pills with a CSS fallback)

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```

## Structure

- `src/components/hero` — preloader, navigation, WebGL pill stack, hero
- `src/components/ui` — cursor, magnetic button, marquee
- `src/hooks` — Lenis and reduced-motion hooks
- `src/index.css` — design tokens and all component styles
