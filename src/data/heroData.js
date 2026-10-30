/**
 * Hero section configuration for Anvik Labs.
 * Easy-to-edit copy, numbers, and assets.
 */

export const HERO_CONFIG = {
  // Social Proof Badge
  socialProof: {
    text: 'Shipped 5+ products for founders and teams',
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
      label: 'Book a 15-min Call',
      href: 'mailto:hello@anviklabs.com?subject=Book%20a%2015-min%20call',
      ariaLabel: 'Book a 15-minute call with Anvik Labs',
    },
    secondary: {
      label: 'View Products',
      href: '#products',
      ariaLabel: 'View products built and shipped by Anvik Labs',
    },
  },
}
