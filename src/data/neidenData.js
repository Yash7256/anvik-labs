/** Content used by the studio's project, journal, and careers pages. */

const PROJECT_IMAGES = [
  'https://framerusercontent.com/images/KhsMEuf8YeOVTfeZIX7N0GRtjts.png',
  'https://framerusercontent.com/images/N97fVKZ6SNy7gEfd3xX0AtEWXWs.png',
  'https://framerusercontent.com/images/cQRkOw61thT0YL73tWmNOYblF0.png',
  'https://framerusercontent.com/images/UuFHF4dLLkC2LUYsvEwMry76BYk.png',
]

export const ALL_PROJECTS = [
  {
    slug: 'creating-a-scalable-system-for-growth',
    title: 'Scalable Design System for Global Expansion',
    subtitle: 'A flexible product system built to support a growing international team.',
    client: 'Clandesite', services: 'Product design, design systems', team: 'Design and engineering', stack: 'Figma, React',
    coverImage: PROJECT_IMAGES[0], intro: 'Clandesite needed a cohesive interface that could grow with its product and reach new markets.',
    challenge: 'The product had grown faster than its visual language, leaving teams with inconsistent patterns and a slower release process.',
    solution: 'We created a reusable design system with clear foundations and flexible components for the product team.',
    metrics: [{ value: '40%', label: 'Less time spent assembling new screens' }, { value: '2×', label: 'Faster design to development handoff' }],
    gallery: [PROJECT_IMAGES[0]],
  },
  {
    slug: 'strategic-thinking-and-brand-foundations-for-dribbble',
    title: 'Spatial Product Interface & Micro-Interactions',
    subtitle: 'A distinctive interface that makes complex product workflows feel intuitive.',
    client: 'Fjordwave', services: 'Product design, interaction design', team: 'Design and engineering', stack: 'Figma, React',
    coverImage: PROJECT_IMAGES[1], intro: 'Fjordwave set out to make its spatial product approachable without losing the depth its expert users needed.',
    challenge: 'Dense workflows and limited feedback made it difficult for new users to understand where to focus.',
    solution: 'We shaped a clear interface hierarchy and added purposeful motion to make important actions easier to follow.',
    metrics: [{ value: '32%', label: 'Increase in task completion' }, { value: '25%', label: 'Fewer onboarding drop-offs' }],
    gallery: [PROJECT_IMAGES[1]],
  },
  {
    slug: 'data-driven-ux-decisions',
    title: 'Enterprise Platform with Sub-Second Speeds',
    subtitle: 'A faster, clearer analytics experience for teams making high-stakes decisions.',
    client: 'AlphaWave', services: 'Web architecture, UX design', team: 'Product and engineering', stack: 'React, analytics APIs',
    coverImage: PROJECT_IMAGES[2], intro: 'AlphaWave wanted its enterprise platform to surface useful insights without slowing teams down.',
    challenge: 'Large datasets and fragmented workflows made everyday analysis harder than it needed to be.',
    solution: 'We streamlined the information architecture and paired it with a responsive, performance-focused interface.',
    metrics: [{ value: '<1s', label: 'Target dashboard response time' }, { value: '3×', label: 'Faster access to key reports' }],
    gallery: [PROJECT_IMAGES[2]],
  },
  {
    slug: 'featured-1',
    title: 'High-Conversion Lifestyle Flagship Store',
    subtitle: 'A polished storefront designed to make product discovery and purchase feel effortless.',
    client: 'Stackd Lab', services: 'E-commerce, brand identity', team: 'Design and frontend', stack: 'Shopify, React',
    coverImage: PROJECT_IMAGES[3], intro: 'Stackd Lab needed a digital storefront that could express its brand and support a broader product range.',
    challenge: 'The existing shopping experience made it difficult for visitors to compare products and move confidently to checkout.',
    solution: 'We built a considered shopping journey with clearer product storytelling and a responsive storefront.',
    metrics: [{ value: '28%', label: 'More product detail engagement' }, { value: '18%', label: 'Higher checkout completion' }],
    gallery: [PROJECT_IMAGES[3]],
  },
]

export const ALL_ARTICLES = [
  {
    slug: 'creating-a-scalable-system-for-growth', category: 'Design Systems',
    title: 'Creating a Scalable System for Growth',
    excerpt: 'How a shared design language helps product teams move quickly while keeping the experience coherent.',
    image: PROJECT_IMAGES[0], author: 'Anvik Labs', authorRole: 'Product Studio', date: 'October 12, 2025', readTime: '6 min read',
    content: [
      'A design system is most useful when it makes good decisions easier to repeat. Start with the patterns your team already uses, then bring those patterns together into a shared set of foundations.',
      'Clear component guidance gives designers and developers room to focus on the parts of a product that are genuinely new. It also makes consistency easier to maintain as teams and products grow.',
      'Treat the system as a product: document decisions, gather feedback from the people using it, and improve it as real needs emerge.',
    ],
  },
  {
    slug: 'strategic-thinking-and-brand-foundations-for-dribbble', category: 'Branding',
    title: 'Strategic Thinking and Strong Brand Foundations',
    excerpt: "A practical way to connect a brand's visual choices to the product experience people remember.",
    image: PROJECT_IMAGES[1], author: 'Anvik Labs', authorRole: 'Product Studio', date: 'September 18, 2025', readTime: '5 min read',
    content: [
      'Strong brand work begins with a useful point of view. Before choosing colors or type, align on who the product serves and what it should help them feel or do.',
      'A small set of intentional visual principles can guide decisions across a website, product interface, and launch campaign without making every page look identical.',
      'The best foundations stay practical: teams can apply them, test them with customers, and evolve them as the business changes.',
    ],
  },
  {
    slug: 'data-driven-ux-decisions', category: 'Interaction',
    title: 'Making Better UX Decisions with Product Data',
    excerpt: 'Combine observed behavior and user conversations to find the next useful product improvement.',
    image: PROJECT_IMAGES[2], author: 'Anvik Labs', authorRole: 'Product Studio', date: 'August 6, 2025', readTime: '7 min read',
    content: [
      'Product data can show where people hesitate, repeat an action, or leave a flow. It does not explain the reason on its own, so pair it with usability sessions and customer conversations.',
      'Choose a focused question before collecting more metrics. A clear question helps teams connect behavior to an outcome and avoid optimizing a number that does not matter to customers.',
      'Make one change at a time where possible, then review the evidence and decide what to learn next.',
    ],
  },
]

export const CAREER_ROLES = [
  {
    title: 'Product Designer', department: 'Design', location: 'Remote', type: 'Contract',
    description: 'Help shape useful digital products from early discovery through polished, production-ready interfaces.',
    requirements: ['Experience designing web or mobile products', 'Strong interaction and visual design fundamentals', 'Comfort working closely with developers and clients'],
  },
  {
    title: 'Frontend Developer', department: 'Engineering', location: 'Remote', type: 'Contract',
    description: 'Build fast, accessible interfaces and bring thoughtful product designs to life in the browser.',
    requirements: ['Experience with React and modern JavaScript', 'Care for responsive design and accessibility', 'Clear communication in a collaborative team'],
  },
]

export const STUDIO_INFO = {
  email: 'hello@anviklabs.com',
  phone: '+91 98765 43210',
}
