export type Service = {
  slug: string;
  name: string;
  serviceType: string;
  title: string;
  description: string;
  heroSubline: string;
  lead: string;
  leadVariant?: "default" | "long";
  intro: string;
  glance: [string, string][];
  included: string[];
  process: { step: string; label: string; desc: string }[];
  stack: { area: string; tools: string }[];
  whyUs: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "development",
    name: "Development",
    serviceType: "Development",
    title: "Web Development for Startups | Anvik Labs",
    description:
      "Anvik Labs is a small India-based team building business websites, web apps and dashboards with React, Next.js and Node.js for clients worldwide.",
    heroSubline:
      "Websites, web apps and dashboards for startups and small businesses.",
    lead: "We design and build websites, web apps, mobile apps, and AI-powered tools for startups, businesses, and individuals. Whether you need a new website, a custom application, or an AI chatbot, we can help you build it.",
    leadVariant: "long",
    intro:
      "Before we start, we discuss what you need, how it should work, and what it will take to build. You'll receive a written project scope, timeline, and cost estimate upfront. Whether it's a business website, web application, or AI-powered product, we'll help you choose an approach that fits your requirements and budget.",
    glance: [
      ["Best for", "Startups, small businesses, and individuals"],
      ["Team", "A small, hands-on team. You work directly with the developers building your project."],
      ["Technology", "React, Next.js, Node.js, TypeScript, and modern AI technologies."],
    ],
    included: [
      "Business websites, portfolios and landing pages",
      "Web apps, dashboards and customer portals",
      "Internal tools and admin panels",
      "Backend APIs, login systems and databases",
      "Third-party integrations (payments, email, maps and more)",
      "Fixes, new features and migrations for existing projects",
    ],
    process: [
      { step: "01", label: "Discuss", desc: "You explain the idea. We ask about users, budget and deadline." },
      { step: "02", label: "Plan", desc: "We share scope, timeline and cost in writing before work starts." },
      { step: "03", label: "Build", desc: "We build in small stages and show you progress along the way." },
      { step: "04", label: "Launch", desc: "We deploy, test and walk you through how everything works." },
      { step: "05", label: "Support", desc: "Bug fixes after launch, and ongoing maintenance if you want it." },
    ],
    stack: [
      ["Frontend", "React, Next.js, TypeScript, Tailwind CSS"],
      ["Backend", "Node.js, REST APIs"],
      ["Databases", "PostgreSQL, MongoDB"],
      ["Hosting", "Vercel, AWS, Firebase, Railway"],
    ].map(([area, tools]) => ({ area, tools })),
    whyUs: [
      { title: "Design and development together", desc: "Our UI/UX designer and developer work on the same project." },
      { title: "We build our own products", desc: "We run CyberSec Toolkit, so we know what keeping a live product running involves." },
      { title: "Plain communication", desc: "No jargon. Clear plans and honest timelines." },
      { title: "Small team", desc: "Fewer handoffs. You know who is working on your project." },
    ],
    faqs: [
      { q: "How long does a project take?", a: "It depends on the scope. A small website can take a few weeks. Larger apps take longer. We give an estimate after the first discussion." },
      { q: "How much does it cost?", a: "It depends on pages, features and integrations. We share a written quote before starting." },
      { q: "Do you work with clients outside India?", a: "Yes. We work with clients anywhere and keep in touch by video call, chat and email." },
      { q: "Can you improve my existing website?", a: "Yes. We can fix issues, add features or rebuild parts of it." },
      { q: "Will I own the code?", a: "Yes. Ownership terms are agreed before the project starts." },
    ],
  },
  {
    slug: "product-design",
    name: "UI/UX & Product Design",
    serviceType: "UI/UX design",
    title: "UI/UX & Product Design Services | Anvik Labs",
    description:
      "Anvik Labs designs websites and apps for startups and small businesses: user flows, wireframes, Figma interfaces and design systems.",
    heroSubline:
      "Website and app design for startups and small businesses: flows, wireframes and Figma interfaces.",
    lead: "We design websites, web apps and mobile interfaces for startups, small businesses and individuals.",
    intro:
      "Every project starts with a conversation about your users, goals and what already exists. Our designer works in the same team as our developers, so designs are made with the build in mind.",
    glance: [
      ["Best for", "Founders, small businesses, product teams"],
      ["Based in", "India, working with clients worldwide"],
      ["Tools", "Figma, FigJam"],
      ["Handoff", "To your developers or ours"],
    ],
    included: [
      "Understanding your users and reviewing similar products",
      "Page structure and user flows",
      "Wireframes and clickable prototypes",
      "Screen designs in Figma",
      "Design systems: colours, type, components",
      "Feedback rounds and revisions",
      "Organised Figma files for developers",
    ],
    process: [
      { step: "01", label: "Discuss", desc: "You explain the idea. We ask about users, goals, budget and deadline." },
      { step: "02", label: "Plan", desc: "We share scope, timeline and cost in writing before work starts." },
      { step: "03", label: "Design", desc: "We move from wireframes to full screens, sharing progress at each stage." },
      { step: "04", label: "Refine", desc: "We collect your feedback, revise the designs and test them with a few real users where the project allows." },
      { step: "05", label: "Hand off", desc: "You get organised Figma files. We can also build the design ourselves if you want." },
    ],
    stack: [
      { area: "Design", tools: "Figma, FigJam" },
      { area: "Deliverables", tools: "Wireframes, prototypes, design systems, handoff files" },
      { area: "Works with", tools: "Your developers or ours" },
    ],
    whyUs: [
      { title: "Design and development together", desc: "Our designer and developer work on the same project, so nothing gets lost between design and code." },
      { title: "We design our own products", desc: "We designed and shipped products like CyberSec Toolkit and Designer’s Room, so we know how designs hold up in real use." },
      { title: "Clear communication", desc: "No jargon. Clear plans and honest timelines." },
      { title: "Small team", desc: "Fewer handoffs. You know who is working on your project." },
    ],
    faqs: [
      { q: "How long does a design project take?", a: "It depends on the number of screens and how much research is needed. A small project can take a couple of weeks. We give an estimate after the first discussion." },
      { q: "How much does it cost?", a: "It depends on scope. We share a written quote before starting." },
      { q: "Can you redesign my existing website or app?", a: "Yes. We review what you have, find what is not working and design improvements." },
      { q: "Can you also build the design?", a: "Yes. Our developers can build it, or we can hand the Figma files to your own team." },
      { q: "Do you work with clients outside India?", a: "Yes. We work with clients anywhere by video call, chat and email." },
    ],
  },
  {
    slug: "ai-solutions",
    name: "AI Solutions & Chatbot Development",
    serviceType: "AI development",
    title: "AI Solutions & Chatbot Development | Anvik Labs",
    description:
      "Anvik Labs adds AI features to websites and apps: chatbots, document search, automation and LLM integrations for startups and small businesses.",
    heroSubline: "Chatbots, document search and automation added to your website or app.",
    lead: "We add AI features to websites and web apps for startups, small businesses and individuals.",
    intro:
      "We tell you honestly whether AI is the right tool. If it is, we build a small prototype first so you can judge the quality before spending more, and we plan for the cases where AI gets things wrong.",
    glance: [
      ["Best for", "Teams adding AI to an existing or new product"],
      ["Based in", "India, working with clients worldwide"],
      ["Models", "OpenAI, Gemini, Anthropic"],
      ["Approach", "Prototype first, then build"],
    ],
    included: [
      "Chatbots for websites, support and internal use",
      "Search and Q&A over your own documents",
      "Automation of repetitive tasks and workflows",
      "AI features inside existing web apps",
      "Connecting AI models (OpenAI, Gemini, Anthropic) to your product",
      "Testing answer quality and setting usage limits",
    ],
    process: [
      { step: "01", label: "Discuss", desc: "You explain the problem. We tell you honestly whether AI is the right tool for it." },
      { step: "02", label: "Prototype", desc: "We build a small working version so you can judge the quality before committing further." },
      { step: "03", label: "Build", desc: "We add the feature to your product, with error handling and a fallback when the AI fails." },
      { step: "04", label: "Launch", desc: "We deploy, set usage and cost limits, and walk you through how it works." },
      { step: "05", label: "Support", desc: "We review results after launch and adjust where needed." },
    ],
    stack: [
      { area: "AI models", tools: "OpenAI, Gemini, Anthropic" },
      { area: "Backend", tools: "Node.js, Python, REST APIs" },
      { area: "Data", tools: "PostgreSQL, MongoDB, vector databases" },
      { area: "Hosting", tools: "Vercel, AWS, Oracle Cloud, Railway" },
    ],
    whyUs: [
      { title: "We use AI only where it helps", desc: "If a simple rule or a normal feature does the job better, we will say so." },
      { title: "We plan for wrong answers", desc: "AI models can be wrong. We test answers, add fallbacks and make it clear to users when to double-check." },
      { title: "We build our own AI products", desc: "CyberSec Toolkit uses AI to explain scan results, so we work with these tools in live products." },
      { title: "Design and development together", desc: "Our designer and developer work on the same project, so the AI feature fits the product." },
    ],
    faqs: [
      { q: "Do I need AI for my project?", a: "Not always. We start by checking whether AI solves your problem better than a simpler approach. If it does not, we will tell you." },
      { q: "Can AI answers be wrong?", a: "Yes. Every AI model can make mistakes. We test answers, add fallbacks and design the feature so mistakes are easier to catch." },
      { q: "Is my data safe?", a: "We discuss what data the AI will see before building. Where needed, we limit what is sent to the model and follow your requirements. Terms are agreed before the project starts." },
      { q: "How long does it take and what does it cost?", a: "It depends on scope. A small prototype can take a couple of weeks. We share an estimate and a written quote after the first discussion." },
      { q: "Do you work with clients outside India?", a: "Yes. We work with clients anywhere by video call, chat and email." },
    ],
  },
  {
    slug: "website-maintenance",
    name: "Website Maintenance & Support",
    serviceType: "Website maintenance",
    title: "Website Maintenance & Support | Anvik Labs",
    description:
      "Anvik Labs maintains live websites and web apps: updates, bug fixes, content changes and hosting support for startups and small businesses.",
    heroSubline: "Updates, bug fixes and hosting support for live websites and web apps.",
    lead: "We maintain websites and web apps for startups, small businesses and individuals, monthly or as a one-time fix.",
    intro:
      "We start by reviewing your site, then share a plan and a written quote before any work begins. This works for sites we built and sites we did not. You always know what was changed and why.",
    glance: [
      ["Best for", "Live sites that need regular care"],
      ["Based in", "India, working with clients worldwide"],
      ["Arrangement", "Monthly support or one-time fix"],
      ["Sites", "Ours or built by others"],
    ],
    included: [
      "Software and security updates",
      "Bug fixes and small feature additions",
      "Content and text updates",
      "Speed checks and fixes",
      "Hosting and domain support",
      "Regular check-ins and a summary of work done",
    ],
    process: [
      { step: "01", label: "Review", desc: "We look at your site: how it is built, where it is hosted and what needs attention." },
      { step: "02", label: "Plan", desc: "We list the issues, put the most important first and agree the scope and cost with you in writing." },
      { step: "03", label: "Fix", desc: "We make the changes and test them before they go live." },
      { step: "04", label: "Report", desc: "We share a short summary of what was done and what comes next." },
    ],
    stack: [
      { area: "Websites and apps", tools: "React, Next.js, Node.js, TypeScript" },
      { area: "Hosting", tools: "Vercel, AWS, Firebase, Railway" },
      { area: "Also handled", tools: "Domains, SSL certificates, basic analytics" },
    ],
    whyUs: [
      { title: "We work with sites we did not build", desc: "We review your existing code and setup first, then tell you honestly what shape it is in." },
      { title: "Flexible arrangement", desc: "Choose ongoing monthly support or a one-time fix. You can pause or stop when you need to." },
      { title: "We run our own live products", desc: "We maintain CyberSec Toolkit ourselves, so we know what keeping a site running involves." },
      { title: "Plain communication", desc: "No jargon. You know what was changed and why." },
    ],
    faqs: [
      { q: "What does website maintenance include?", a: "Updates, bug fixes, content changes, speed checks and hosting support. The exact scope is agreed with you in writing before we start." },
      { q: "Do you maintain websites you did not build?", a: "Yes. We review the site first and tell you what we find before agreeing on any work." },
      { q: "Is there a long-term contract?", a: "No. You can choose monthly support or a one-time fix, and stop when you want." },
      { q: "How much does it cost?", a: "It depends on the size of the site and the work needed. We share a written quote after reviewing your site." },
      { q: "Can you fix my website urgently?", a: "Send us the details and we will reply with what we can do and how soon. We cannot promise a fixed response time for every case." },
      { q: "Do you work with clients outside India?", a: "Yes. We work with clients anywhere by video call, chat and email." },
    ],
  },
];

export function getService(slug: string): Service {
  const service = services.find((item) => item.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
}
