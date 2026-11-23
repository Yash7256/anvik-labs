export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  coverImage?: string;
  coverAlt?: string;
  href?: string;
  published: boolean;
};

export const journalPosts: JournalPost[] = [
  {
    slug: "designing-products-that-feel-clear",
    title: "Designing products that feel clear",
    excerpt:
      "A practical look at how clarity in hierarchy, copy, and interaction design makes digital products easier to trust and use.",
    date: "2026-04-10",
    readTime: "5 min read",
    category: "Design",
    published: false,
  },
  {
    slug: "building-fast-without-losing-craft",
    title: "Building fast without losing craft",
    excerpt:
      "How we balance speed, engineering quality, and visual polish when shipping modern web products for ambitious teams.",
    date: "2026-04-18",
    readTime: "6 min read",
    category: "Engineering",
    published: false,
  },
  {
    slug: "what-makes-a-website-feel-premium",
    title: "What makes a website feel premium",
    excerpt:
      "Premium is not just visuals. It’s performance, spacing, content confidence, motion restraint, and thoughtful details working together.",
    date: "2026-04-24",
    readTime: "4 min read",
    category: "Studio Notes",
    published: false,
  },
];

export function getPublishedJournalPosts(): JournalPost[] {
  return journalPosts
    .filter((post) => post.published)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
