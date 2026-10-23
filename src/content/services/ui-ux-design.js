const TODO_CONFIRM = [
  'FAQ: confirm whether design-only, development-only and combined engagements are all offered.',
  'FAQ: add typical project timeline ranges.',
  'FAQ: add the pricing model.',
  'FAQ: replace the ownership and handover placeholder with real terms.',
]

export const uiUxDesign = {
  path: '/services/ui-ux-design',
  title: 'UI/UX Design Services for Web and Apps | Anvik Labs',
  metaDescription:
    'Research-led UI/UX design for websites, web apps and digital products. User research, wireframes, prototypes and design systems from Anvik Labs.',
  breadcrumb: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'UI/UX design' },
  ],
  sections: ['covers', 'deliverables', 'process', 'audience', 'why', 'faq'],
  sectionAlign: {
    audience: 'left',
    why: 'left',
    faq: 'left',
  },
  h1: 'UI/UX Design Services',
  directAnswer:
    'Anvik Labs provides UI/UX design for websites, web applications and digital products. We start with research to understand users and the problem, then deliver wireframes, interactive prototypes, visual design and a design system your team can build from.',
  covers: {
    h2: 'What our UI/UX design service covers',
    items: [
      'Websites and landing pages',
      'Web applications and dashboards',
      'Mobile-first product interfaces',
      'Design systems and component libraries',
      'Redesigns of existing products',
    ],
  },
  deliverables: {
    h2: 'What you receive',
    items: [
      'User and problem research summary',
      'User flows and wireframes',
      'Interactive prototype for testing',
      'High-fidelity visual design',
      'Design system with typography, color, spacing and components',
      'Developer-ready handoff files',
    ],
  },
  process: {
    h2: 'Our UI/UX design process',
    steps: [
      {
        title: 'Discovery',
        text: 'We learn the goals, users, constraints and success measures.',
      },
      {
        title: 'Research and definition',
        text: 'We study users and alternatives, then define the problem clearly.',
      },
      {
        title: 'Structure',
        text: 'We map user flows and build wireframes.',
      },
      {
        title: 'Visual design and prototype',
        text: 'We design the interface and build a clickable prototype to test before development.',
      },
      {
        title: 'Handoff and support',
        text: 'We deliver files and documentation, and stay available during development.',
      },
    ],
  },
  audience: {
    h2: 'Who this service suits',
    text: 'Startups validating a first product, businesses redesigning a site or app that is hard to use, and teams that need a design system to keep products consistent.',
    items: [
      'Startups validating a first product',
      'Businesses redesigning a site or app that is hard to use',
      'Teams that need a design system to keep products consistent',
    ],
  },
  why: {
    h2: 'Why design with Anvik Labs',
    text: 'Design and engineering sit in the same studio, so designs are drawn with real build constraints in mind and handoff gaps are smaller. We also design and ship our own product, Designers Room, so we work through the same decisions we help clients make.',
    link: {
      label: 'Designers Room',
      href: '/#featured',
    },
  },
  faq: {
    h2: 'UI/UX design FAQ',
    items: [
      {
        question: 'What is the difference between UI and UX design?',
        answer:
          'UX design covers how a product works and how it feels to use: research, flows and structure. UI design covers how it looks: layout, color, typography and components. Most products need both.',
      },
      {
        question: 'Do you offer design only, or design and development?',
        answer:
          'Both. You can hire us for design alone, development alone, or design followed by development.',
        todo: 'TODO_CONFIRM before launch',
      },
      {
        question: 'How long does a UI/UX design project take?',
        answer:
          'It depends on scope. After an intro call we confirm the timeline in a written estimate.',
        todo: 'TODO_CONFIRM: add typical ranges',
      },
      {
        question: 'How much does UI/UX design cost?',
        answer:
          'Cost depends on scope, number of screens and research needed. After an intro call we send a written estimate.',
        todo: 'TODO_CONFIRM: add pricing model',
      },
      {
        question: 'What do you need from us to start?',
        answer:
          'A short brief describing the goal, the users, any existing material, and your timeline and budget range.',
      },
      {
        question: 'Do we own the design files?',
        answer:
          'Ownership and handover terms are confirmed in writing before work begins.',
        todo: 'TODO_CONFIRM: replace with real terms',
      },
    ],
  },
  cta: {
    headline: 'Tell us about your project.',
    buttonLabel: 'Start a project',
  },
  related: [
    { label: 'web development services', href: '/services/web-development' },
    { label: 'our approach', href: '/approach' },
  ],
  schema: {
    serviceName: 'UI/UX Design Services',
    serviceType: 'UI/UX design',
    description:
      'Research-led UI/UX design for websites, web apps and digital products. User research, wireframes, prototypes and design systems from Anvik Labs.',
  },
  todoConfirm: TODO_CONFIRM,
}
