export const SITE = {
  name: 'Anvik Labs',
  year: 2026,
  cta: {
    label: '● Start a project',
    headline: 'Bring us the question.',
    actionLabel: 'Work with us ↗',
    href: 'mailto:TODO_EMAIL@example.com',
  },
  contact: {
    email: 'TODO_EMAIL@example.com',
    socials: [
      { label: 'GitHub', href: 'https://github.com/TODO_GITHUB', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/TODO_LINKEDIN', external: true },
      { label: 'X', href: 'https://x.com/TODO_X', external: true },
    ],
  },
  routes: {
    designersRoom: '#featured',
    services: {
      uiux: '/services/ui-ux-design',
      webdev: '/services/web-development',
    },
    approach: '/approach',
    about: '/about',
  },
  legal: [],
}

export const getCtaHref = () => SITE.cta.href
