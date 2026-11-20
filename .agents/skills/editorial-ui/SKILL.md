---
name: editorial-ui
description: >-
  Provides design engineering specifications, UI styling patterns, typographic scales,
  motion physics, and responsive conventions for the Anvik Labs dark editorial design system.
  Activate when implementing, updating, or reviewing UI components, styles, layouts, or animations.
---

# Editorial UI Design Engineering Skill

This skill guides the implementation of UI components and pages within the **Anvik Labs** design system: a tactile, typography-driven dark editorial studio aesthetic built with **React Router 8**, **Tailwind CSS v4**, and **Framer Motion**.

---

## 1. Visual & Aesthetic Principles

### The "Editorial, Not SaaS" Rule
- **No Decorative SaaS Clutter**: Never add generic SaaS card grids, neon glows, glassmorphism (`backdrop-blur` with heavy borders), 3D button gradients, or floating drop shadows.
- **Structural Legibility**: Use generous whitespace, numeric indexing (`[01]`, `[02]`), and crisp hairline dividers (`border-white/10`).
- **Surface Layering**: The canvas is `--color-background: #080808`. Soft wells and cards use `--color-light-surface: #11100f` with `border border-white/10` and subtle corner radii (`rounded-[6px]` or `rounded-[8px]`).

### Single Accent Color (`#ff6a00`)
- The accent is strictly **orange (`#ff6a00`)**.
- It acts as a typographic punctuation mark: active navigation states, micro-indicators (pulsing dots, small 4px status dots), inline highlights, and focus rings.
- **Never** introduce a second accent color (e.g., purple, blue, green) or pastel variants.

---

## 2. Design Tokens Reference

All design tokens are defined in [`src/app/globals.css`](file:///home/yash/Code/portfolio-new/src/app/globals.css):

```css
@theme {
  --color-background: #080808;           /* Canvas background */
  --color-foreground: #e7e9ee;           /* High-contrast primary copy (~16:1 contrast) */
  --color-text-secondary: rgba(231, 233, 238, 0.62); /* Secondary metadata */
  --color-border: rgba(255, 255, 255, 0.12); /* Hairlines and section rules */
  --color-light-surface: #11100f;        /* Card & media well background */
  --color-dark-surface: #0b0a09;         /* Recessed surface */
  --color-accent: #ff6a00;               /* Primary orange accent */
  --color-accent-text: #ff8a4a;          /* Accessible accent text */
  --color-accent-strong: #ff6a1a;        /* Hover active state */
  --color-on-accent: #080808;            /* Text inside accent fill */
}
```

---

## 3. Typographic System & Hierarchy

The design system employs three typographic voices:

| Role | Font Family | Tailwind Class | Usage Guidelines |
| :--- | :--- | :--- | :--- |
| **Headings** | `Space Grotesk` | `font-display` | Hero at weight 600 (`-0.045em` tracking); section and card headings at weight 500 (`-0.04em` tracking). Use weight contrast deliberately. |
| **Body & UI** | `Geist` | `font-sans` | Body copy at weight 400 (`-0.01em` tracking); navigation and buttons at weight 500. |
| **Annotation & UI** | `Geist Mono` | `font-mono` | Uppercase, weight 400, `0.04em` tracking, 12px minimum. Used for labels, indices, metadata, counters, and tags. |

### Typography Rules:
1. **Never use Monospace for prose or sentences**; monospace is strictly for data, indices, and UI controls.
2. **Never drop body or label text below 12px**.
3. **Primary Body Contrast**: Use `text-foreground` (`#171717`) for body copy against the `#f5f5f5` canvas. Use `text-muted` (`#656565`) for secondary metadata.

---

## 4. Reusable Component Patterns

### Section Header Pattern
Standard editorial sections (`MeetTheHumans`, `Services`, `Articles`, `Testimonials`) share an identical left-aligned header structure:

```tsx
<div className="pb-8 md:pb-10">
  <h2
    id="section-heading"
    className="mt-3 font-sans text-[clamp(2.4rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-foreground"
  >
    Section Title.
  </h2>
</div>
```

### Full-Bleed Infinite Marquee Pattern
To break out of the constrained layout grid into full-bleed viewports:

```tsx
<div className="pause-on-hover relative -mx-4 overflow-hidden sm:-mx-[4vw] lg:-mx-[5vw] xl:-mx-[6vw]">
  {/* Gradient masks for edge fade */}
  <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-20 md:w-32" />
  <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-20 md:w-32" />

  <div className="animate-marquee-cards flex gap-5 py-2 md:gap-6">
    <div className="flex shrink-0 gap-5 md:gap-6">
      {items.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
    <div className="flex shrink-0 gap-5 md:gap-6" aria-hidden="true">
      {items.map((item) => (
        <Card key={`dup-${item.id}`} item={item} />
      ))}
    </div>
  </div>
</div>
```

### Editorial Action Buttons & CTAs
The primary studio button is an unstyled or solid white pill:

```tsx
<Link
  to="/contact"
  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-sans text-[15px] font-semibold tracking-tight text-black shadow-lg transition-colors hover:bg-neutral-200"
>
  Start a conversation
</Link>
```

---

## 5. Motion & Physics Standards

### Framer Motion Spring Presets
Use spring physics instead of linear/cubic easings for organic tactile feel:

```ts
// Quick interactive hover/pointer response
export const springPointer = { stiffness: 180, damping: 24, mass: 0.45 };

// Section and content entrance transitions
export const springEntrance = { stiffness: 110, damping: 22, mass: 0.7 };
```

### Viewport Entrance Guard
Ensure entrances trigger cleanly without infinite re-animations:
```tsx
<motion.div
  initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={springEntrance}
>
  ...
</motion.div>
```

### Accessibility & Reduced Motion
Always respect `useReducedMotion()`. If motion is reduced, render the fallback or cancel transforms immediately.

---

## 6. Responsive Screen Adaptation

- **Mobile Viewports (e.g. 375×667)**:
  - Center standalone CTA buttons for thumb ergonomics: `flex justify-center md:justify-start`.
  - Collapse multi-column tables into inline flex units using `md:contents`.
  - Hide secondary decorative images on narrow screens using `hidden md:block`.
- **Desktop Viewports (1024px+)**:
  - Unfold into structured, multi-column editorial hairlines.

---

## 7. Quality Verification Workflow

After any UI changes:

```bash
# 1. Type check
npm run typecheck

# 2. Lint check
npm run lint

# 3. Production build check
npm run build
```

Verify visual layouts across:
- **Mobile**: 375px × 667px (iPhone SE standard)
- **Tablet**: 768px × 1024px
- **Desktop**: 1280px+ wide display
