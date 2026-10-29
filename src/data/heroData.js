/**
 * Hero section & Navigation configuration for Anvik Labs
 * Easy-to-edit copy, placeholders, numbers, and assets.
 */

export const HERO_CONFIG = {
  // Brand & Eyebrow
  eyebrow: 'Anvik Labs — Technology Studio',

  // Social Proof Badge (replaces the generic "5+ projects delivered" pill)
  socialProof: {
    text: 'Shipped 5+ products for founders and teams',
    // Configurable avatar images (28-32px with 2px dark ring and overlap)
    avatars: [
      {
        name: 'Sarah Chen',
        src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      },
      {
        name: 'Marcus Vance',
        src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
      },
      {
        name: 'Elena Rostova',
        src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
      },
      {
        name: 'David Kim',
        src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
      },
    ],
  },

  // Headline & Subtitle
  headline: 'Anvik Labs',
  subheadline:
    'A product studio that ships its own software and partners with startups and teams on UI/UX design and web development.',

  // Call-to-Action Buttons
  ctas: {
    primary: {
      label: 'Work With Us',
      href: '/contact',
      ariaLabel: 'Work With Us with Anvik Labs',
    },
    secondary: {
      label: 'See Our Products',
      href: '#products',
      ariaLabel: 'Explore products built and shipped by Anvik Labs',
    },
  },

  // Two-path strip directly under the hero CTAs
  paths: [
    {
      id: 'clients',
      badge: 'For clients',
      text: 'UI/UX design and web development, built to convert.',
      linkText: 'See our services',
      href: '#services',
    },
    {
      id: 'products',
      badge: 'Our products',
      text: 'Software we design, build, and run ourselves.',
      linkText: 'Explore products',
      href: '#products',
    },
  ],

  // Featured Product / Project Preview Card (displayed in front of the 3D diamond/streak graphic)
  featuredPreview: {
    badge: 'Featured product',
    status: 'Live',
    title: 'Kanso Cloud Platform',
    category: 'Product Studio Track',
    metric: 'Sub-50ms analytics engine',
    // Swappable UI mockup / screenshot placeholder
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    alt: 'Kanso Cloud Platform dashboard interface mockup',
    href: '#products',
  },

  // "Trusted by teams" partner / client logos
  // Set to empty array [] if you want to hide the row until real logos are added
  trustedLogos: [
    {
      name: 'Canva',
      src: 'https://framerusercontent.com/images/mEIBGBqwotHJ35YaPhM5ljuLc2U.png',
      alt: 'Canva logo',
    },
    {
      name: 'Optum',
      src: 'https://framerusercontent.com/images/2B9gp2gJnBjBX44Yovd3HRxqiXM.png',
      alt: 'Optum logo',
    },
    {
      name: 'Aerin',
      src: 'https://framerusercontent.com/images/B9ROL6BhEMArgbWauFiEj7UZZJY.png',
      alt: 'Aerin logo',
    },
    {
      name: 'Savannah',
      src: 'https://framerusercontent.com/images/lFzmQ3NzC3LG6q2c7lvBf8kw.png',
      alt: 'Savannah logo',
    },
    {
      name: 'Amsterdam',
      src: 'https://framerusercontent.com/images/38I07rfLJ4DXJRQZ7YXCanY6ko.png',
      alt: 'Amsterdam logo',
    },
  ],
}
