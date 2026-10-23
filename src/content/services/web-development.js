const metaDescription =
  'Custom website and web application development focused on speed, accessibility and search visibility. Built and maintained by Anvik Labs.'

// TODO_CONFIRM: "maintained" implies ongoing maintenance is offered; keep only if true.
const TODO_CONFIRM = [
  'Meta description: confirm that ongoing maintenance is offered.',
  'Covers: add "E-commerce websites" only if offered.',
  'Technology: fill with the real stack grouped by Front end / Back end / CMS / Hosting.',
  'Process support step: replace with real support terms.',
  'FAQ: replace hosting and maintenance answer with what is actually offered.',
  'FAQ: add typical project timeline ranges.',
  'FAQ: add the pricing model.',
]

export const webDevelopment = {
  path: '/services/web-development',
  title: 'Custom Web Development Services | Anvik Labs',
  metaDescription,
  breadcrumb: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Web development' },
  ],
  sections: ['covers', 'standards', 'technology', 'process', 'faq'],
  heroVariant: 'build',
  h1: 'Web Development Services',
  directAnswer:
    'Anvik Labs builds custom websites and web applications. We focus on speed, accessibility, security basics and search-friendly code, so the result works well for users and is easy for search engines to understand and for your team to maintain.',
  covers: {
    h2: 'What our web development service covers',
    // TODO_CONFIRM: add "E-commerce websites" only if offered.
    items: [
      'Business and marketing websites',
      'Landing pages',
      'Web applications and dashboards',
      'Integrations and APIs',
      'Redesign and rebuild of existing sites',
    ],
  },
  standards: {
    h2: 'How we build',
    items: [
      {
        title: 'Performance',
        text: 'Fast loading on mobile, measured against Core Web Vitals.',
      },
      {
        title: 'Accessibility',
        text: 'Built to follow WCAG guidelines.',
      },
      {
        title: 'Search-ready',
        text: 'Semantic HTML, clean URLs, XML sitemap, structured data and correct metadata from the start.',
      },
      {
        title: 'Security',
        text: 'Standard protections, dependency updates and safe handling of user data.',
      },
      {
        title: 'Maintainable code',
        text: 'Clear structure and documentation so another developer can pick it up.',
      },
    ],
  },
  technology: {
    h2: 'Technologies we use',
    // TODO_CONFIRM: fill with the real stack grouped by Front end / Back end / CMS / Hosting.
    items: [],
  },
  process: {
    h2: 'Our web development process',
    steps: [
      {
        title: 'Discovery and scoping',
        text: 'Goals, users, features and constraints in a written scope.',
      },
      {
        title: 'Architecture and design',
        text: 'Site structure, technical approach and, if needed, UI/UX design.',
      },
      {
        title: 'Development',
        text: 'Built in stages with regular demos.',
      },
      {
        title: 'Testing and launch',
        text: 'Cross-device testing, performance checks and a managed launch.',
      },
      {
        title: 'Support',
        // TODO_CONFIRM: replace with real support terms.
        text: 'We agree support and maintenance options with you before launch.',
      },
    ],
  },
  faq: {
    h2: 'Web development FAQ',
    items: [
      {
        question: 'Should I choose a custom website or a template?',
        answer:
          'Templates are faster and cheaper to start but limit design and functionality. Custom development suits businesses that need specific features, a distinct brand or better performance control.',
      },
      {
        question: 'Will my website rank on Google?',
        answer:
          'We build the technical foundation: fast pages, clean structure, structured data and correct metadata. Rankings also depend on content quality, competition and links, so no studio can honestly guarantee a position.',
      },
      {
        question: 'Do you handle hosting and maintenance?',
        // TODO_CONFIRM: replace with what is actually offered.
        answer:
          'We confirm hosting and maintenance arrangements in the written scope, based on what your project needs.',
      },
      {
        question: 'How long does it take to build a website?',
        // TODO_CONFIRM: add typical ranges.
        answer:
          'It depends on scope. We confirm the timeline in the written scope after discovery.',
      },
      {
        question: 'How much does web development cost?',
        // TODO_CONFIRM: add pricing model.
        answer:
          'Cost depends on features, pages and integrations. We provide a written estimate after discovery.',
      },
      {
        question: 'Can you work with our existing design or brand?',
        answer:
          'Yes. We can build from your designs or provide UI/UX design as part of the project.',
      },
    ],
  },
  cta: {
    headline: 'Share your project brief.',
    buttonLabel: 'Start a project',
  },
  related: [
    { label: 'UI/UX design services', href: '/services/ui-ux-design' },
    { label: 'our approach', href: '/approach' },
  ],
  schema: {
    name: 'Web Development Services',
    serviceType: 'Web development',
    description: metaDescription,
  },
  todoConfirm: TODO_CONFIRM,
}
