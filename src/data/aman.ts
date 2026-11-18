export type AmanStat = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  caption: string;
};

export type AmanProject = {
  index: string;
  title: string;
  featured?: boolean;
  status: string;
  description: string;
  stack: string[];
  highlights: string[];
  github: string;
  diagram?: boolean;
};

export type AmanExperienceItem = {
  role: string;
  company: string;
  dates: string;
  description: string;
};

export type AmanStackGroup = {
  group: string;
  items: { name: string; strong?: boolean }[];
};

export type AmanCertification = {
  name: string;
  issuer: string;
  year: string;
};

export const amanProfile = {
  name: "Aman Raj",
  role: "Backend / AI / Security engineer",
  location: "Jabalpur, IN",
  email: "amanrajengg@gmail.com",
  github: "#",
  linkedin: "#",
  status: "Open to work",
};

export const amanHero = {
  headline:
    "I build backends that don't fall over, and tools that find what's broken.",
  body: "Backend, AI and security engineer from India. I design async systems, harden them, and ship them.",
  primaryCta: { label: "See my work", href: "#work" },
  secondaryCta: { label: "Get in touch", href: "#contact" },
};

export const amanStats: AmanStat[] = [
  { value: 1, suffix: "M", caption: "benchmark runs" },
  { value: 3, suffix: "M", caption: "findings processed" },
  {
    value: 0.15,
    prefix: "<",
    suffix: "ms",
    decimals: 2,
    caption: "core query time",
  },
  { value: 440, caption: "automated tests" },
];

export const amanProjects: AmanProject[] = [
  {
    index: "01",
    title: "CyberSec Toolkit",
    featured: true,
    status: "Featured",
    description:
      "Fault-tolerant async security scanning platform hardened for real-world abuse.",
    stack: ["Node.js", "Express.js", "PostgreSQL", "Redis", "BullMQ", "React"],
    highlights: [
      "Fault-tolerant async scanning pipeline with idempotency, fenced workers and automatic job recovery.",
      "All 11 security tools hardened against SSRF with DNS pinning, IP deny lists, layered rate limiting and usage quotas.",
      "Benchmarked at 1M runs and 3M findings, sub-0.15 ms core queries via keyset pagination and partial indexes, backed by 440 tests.",
    ],
    github: "#",
    diagram: true,
  },
  {
    index: "02",
    title: "Designers Room (Backend)",
    status: "Backend",
    description:
      "Modular platform backend for learning roadmaps, challenges, and progression systems.",
    stack: ["NestJS", "PostgreSQL", "Prisma ORM", "Docker"],
    highlights: [
      "Modular backend with 19 database models for roadmaps, challenges, XP, streaks and leaderboards.",
      "Google OAuth, rotating refresh tokens with token-family revocation, RBAC and audit logging.",
      "Serverless optimization with single-flight caching, ETags and connection pool tuning.",
    ],
    github: "#",
  },
  {
    index: "03",
    title: "Notify-ED",
    status: "Full-stack",
    description:
      "Roster-to-notification workflow with validated delivery across multiple channels.",
    stack: ["React", "TypeScript", "Node.js", "Supabase", "PostgreSQL", "Vercel"],
    highlights: [
      "Converts Excel rosters into validated marks entry and automated email, WhatsApp and in-app notifications.",
      "Per-channel retries, provider fallbacks, delivery logs, failed-notification recovery and realtime history.",
      "Supabase RLS and GitHub Actions CI/CD to Vercel.",
    ],
    github: "#",
  },
];

export const amanExperience: AmanExperienceItem[] = [
  {
    role: "Founding Engineer",
    company: "Sedative Physio",
    dates: "20XX - 20XX",
    description:
      "Built the end-to-end EdTech platform for physiotherapy students (course purchasing, enrollment, course management, learning resources), interactive learning features (digital notes, 3D models, quizzes, live classes), a custom AI chatbot, and owned the product from system design to delivery.",
  },
  {
    role: "Web Developer",
    company: "Skedio Creative Agency",
    dates: "20XX - Present",
    description:
      "Builds websites and web apps for agency clients, implements features and backend integrations, and collaborates with designers.",
  },
];

export const amanStackGroups: AmanStackGroup[] = [
  {
    group: "Languages",
    items: [
      { name: "JavaScript" },
      { name: "TypeScript", strong: true },
      { name: "Python" },
      { name: "SQL", strong: true },
      { name: "Bash" },
    ],
  },
  {
    group: "Backend",
    items: [
      { name: "Node.js", strong: true },
      { name: "Express.js", strong: true },
      { name: "NestJS", strong: true },
      { name: "FastAPI" },
      { name: "REST APIs" },
      { name: "SSE" },
      { name: "JWT" },
    ],
  },
  {
    group: "Frontend",
    items: [
      { name: "React.js", strong: true },
      { name: "HTML5" },
      { name: "CSS3" },
      { name: "Tailwind CSS" },
    ],
  },
  {
    group: "Databases & ORM",
    items: [
      { name: "PostgreSQL", strong: true },
      { name: "MongoDB" },
      { name: "Redis", strong: true },
      { name: "Supabase" },
      { name: "Prisma", strong: true },
      { name: "Drizzle ORM" },
    ],
  },
  {
    group: "AI / GenAI",
    items: [
      { name: "LLM APIs" },
      { name: "RAG" },
      { name: "Prompt Engineering" },
      { name: "Groq" },
      { name: "Google Gemini" },
    ],
  },
  {
    group: "DevOps & Cloud",
    items: [
      { name: "Docker", strong: true },
      { name: "Kubernetes" },
      { name: "CI/CD" },
      { name: "Linux" },
      { name: "OCI" },
      { name: "Terraform" },
      { name: "Nginx" },
    ],
  },
  {
    group: "Monitoring & Tools",
    items: [
      { name: "Prometheus" },
      { name: "Grafana" },
      { name: "Git" },
      { name: "GitHub" },
      { name: "Postman" },
    ],
  },
  {
    group: "Core CS",
    items: [
      { name: "DSA" },
      { name: "OOP" },
      { name: "DBMS" },
      { name: "OS" },
      { name: "Computer Networks" },
      { name: "System Design" },
      { name: "Distributed Systems" },
    ],
  },
];

export const amanCertifications: AmanCertification[] = [
  {
    name: "OCI 2025 Certified Generative AI Professional",
    issuer: "Oracle",
    year: "2025",
  },
  {
    name: "OCI 2025 Certified Developer Professional",
    issuer: "Oracle",
    year: "2025",
  },
  {
    name: "OCI 2025 Certified DevOps Professional",
    issuer: "Oracle",
    year: "2025",
  },
];

export const amanEducation =
  "B.Tech in CSE (AI & Robotics), Gyan Ganga Institute of Technology and Sciences, 2023-2027";
