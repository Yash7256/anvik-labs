export type JournalContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "mermaid"; code: string; caption?: string };

export type JournalPost = {
  slug: string;
  title: string;
  seoTitle?: string;
  description: string;
  excerpt: string;
  date: string;
  updatedDate?: string;
  readTime: string;
  category: string;
  keywords?: string[];
  quickAnswer?: string;
  coverImage?: string;
  coverAlt?: string;
  href?: string;
  content?: JournalContentBlock[];
  published: boolean;
};

export const journalPosts: JournalPost[] = [
  {
    slug: "production-readiness-architecture-audit",
    title: "I Built a Production-Ready Architecture. Then I Audited It.",
    seoTitle: "Production Readiness Architecture Audit: Checklist & Lessons | Anvik Labs",
    description:
      "A practical production readiness architecture audit checklist covering caching, pagination, security, observability, and reliability lessons from a real Resources page.",
    excerpt:
      "Why implementing system design features is only half the job. A practical look at auditing a working Resources page for real production readiness.",
    date: "2026-11-24",
    updatedDate: "2026-11-24",
    readTime: "8 min read",
    category: "Engineering",
    keywords: [
      "production readiness audit",
      "system design audit",
      "architecture audit checklist",
      "web application reliability",
      "caching and observability",
    ],
    quickAnswer:
      "A production-ready architecture is not proven by features working on the happy path. It becomes trustworthy only after auditing failures, caching, pagination, security, observability, and deployment behavior with evidence.",
    content: [
      {
        type: "paragraph",
        text: "Why implementing system design features is only half the job.",
      },
      {
        type: "paragraph",
        text: "When I started building my Resources page, my main concern was simple: make everything work.",
      },
      {
        type: "paragraph",
        text: "The page had three major sections: Courses, Notes, and 3D Models. The architecture was straightforward: React → Express.js → Prisma → PostgreSQL. I was using React Router for navigation, Clerk for authentication, Sharp for image processing, and Vercel for deployment.",
      },
      {
        type: "paragraph",
        text: "Whenever someone opened the Resources page, the frontend made three API requests in parallel to fetch the available resources. It worked. But as I started thinking about production, I realized that working functionality and production readiness are two very different things.",
      },
      {
        type: "paragraph",
        text: "A system can work perfectly with a small dataset and still struggle when traffic increases, APIs fail, users navigate away during requests, or the database becomes unavailable. That made me revisit the architecture.",
      },
      {
        type: "mermaid",
        caption: "Initial Resources page architecture",
        code: `flowchart TD
    U["User"] --> R["React Frontend"]
    R --> E["Express.js API"]
    E --> P["Prisma ORM"]
    P --> DB[("PostgreSQL")]

    R -.-> RR["React Router"]
    R -.-> C["Clerk Authentication"]
    E -.-> S["Sharp Image Processing"]
    E -.-> V["Vercel Deployment"]

    style R fill:#29213D,stroke:#9B7AFF,color:#fff
    style E fill:#29213D,stroke:#9B7AFF,color:#fff
    style DB fill:#183B35,stroke:#55C9A5,color:#fff`,
      },
      { type: "heading", text: "1. Looking beyond the happy path" },
      {
        type: "paragraph",
        text: "I started reviewing the Resources page from a system design perspective. Instead of asking whether the page worked, I started asking different questions:",
      },
      {
        type: "list",
        items: [
          "What happens if one API fails?",
          "What happens if the user refreshes the page?",
          "Are we downloading the entire course catalogue?",
          "What happens when multiple users search simultaneously?",
          "Can public APIs be abused?",
          "Does a 304 response actually save database work?",
          "Can the application recover from temporary failures?",
          "How will I know when something breaks in production?",
        ],
      },
      {
        type: "mermaid",
        caption: "Original request flow and missing production capabilities",
        code: `flowchart TD
    A["User Opens Resources Page"] --> B["React Frontend"]
    B --> C["Promise.all()"]
    C --> D["Courses API"]
    C --> E["Notes API"]
    C --> F["3D Models API"]

    D --> G["Single Loading Flow"]
    E --> G
    F --> G

    G --> H{"Did Every Request Succeed?"}
    H -->|Yes| I["Render Resources"]
    H -->|No| J["Entire Request Flow Can Fail"]

    K["Missing Capabilities"] --> L["No Shared Client Cache"]
    K --> M["No Pagination"]
    K --> N["No Request Cancellation"]
    K --> O["Frontend Search and Filtering"]

    style J fill:#542626,stroke:#F87171,color:#fff
    style K fill:#29213D,stroke:#9B7AFF,color:#fff`,
      },
      {
        type: "paragraph",
        text: "These questions exposed several architectural gaps. The original implementation had HTTP caching through Cache-Control and ETags, but no shared client-side cache. There was no pagination for the course listing. The page used Promise.all(), meaning one failed request could affect the entire loading flow. There was no proper request cancellation, and search and filtering were handled on the frontend. I also needed better rate limiting, observability, and security controls. The application worked, but I hadn't fully considered what would happen under real production conditions.",
      },
      { type: "heading", text: "2. Evolving the architecture" },
      {
        type: "paragraph",
        text: "I started addressing these problems one by one.",
      },
      { type: "heading", text: "Client-side data management" },
      {
        type: "paragraph",
        text: "I introduced TanStack Query to manage resource requests. The objective wasn't simply to add another library. I wanted a shared cache, better request management, background refetching, and independent loading and error states. I also separated Courses, Notes and Models into independent queries. Now, a failure in the Notes API should not prevent Courses and Models from loading.",
      },
      {
        type: "paragraph",
        text: "I worked on bounded retries, exponential backoff, timeouts, request cancellation and stale-data fallback. One important behavior I wanted was this: if a background request fails, don't immediately remove the data users already have. Keep the cached data visible while recovery happens.",
      },
      {
        type: "mermaid",
        caption: "Client-side data management with TanStack Query",
        code: `flowchart TD
    U["User"] --> R["React Resources Page"]

    R --> Q["TanStack Query"]

    Q --> C["Courses Query"]
    Q --> N["Notes Query"]
    Q --> M["3D Models Query"]

    C --> CA["Courses Cache"]
    N --> NA["Notes Cache"]
    M --> MA["Models Cache"]

    C --> API1["Courses API"]
    N --> API2["Notes API"]
    M --> API3["Models API"]

    API1 --> DB[("PostgreSQL")]
    API2 --> DB
    API3 --> DB

    C -.-> RET["Bounded Retries"]
    N -.-> RET
    M -.-> RET

    RET --> BACK["Exponential Backoff"]
    RET --> TIME["Request Timeouts"]
    RET --> STALE["Stale Data Fallback"]

    style Q fill:#29213D,stroke:#9B7AFF,color:#fff
    style CA fill:#183B35,stroke:#55C9A5,color:#fff
    style NA fill:#183B35,stroke:#55C9A5,color:#fff
    style MA fill:#183B35,stroke:#55C9A5,color:#fff`,
      },
      { type: "heading", text: "Backend pagination" },
      {
        type: "paragraph",
        text: "Fetching every published course might be acceptable with a small catalogue, but it isn't a sustainable approach as the dataset grows. I moved toward cursor-based pagination with a default page size of 12, stable ordering, a unique tie-breaker, cursor-based database queries, and a response containing items, nextCursor and hasMore. This allows the frontend to request additional courses instead of downloading the entire catalogue.",
      },
      {
        type: "mermaid",
        caption: "Cursor-based pagination flow",
        code: `sequenceDiagram
    autonumber
    actor User
    participant UI as React Frontend
    participant API as Express API
    participant DB as PostgreSQL

    User->>UI: Open Courses
    UI->>API: GET /courses?limit=12
    API->>DB: Fetch first 12 records
    DB-->>API: Records + next cursor
    API-->>UI: Items, nextCursor, hasMore
    UI-->>User: Display 12 courses

    User->>UI: Load More
    UI->>API: GET /courses?limit=12&cursor=xyz
    API->>DB: Fetch next 12 records
    DB-->>API: Next records + cursor
    API-->>UI: Next page response
    UI-->>User: Append next 12 courses`,
      },
      { type: "heading", text: "Backend search and filtering" },
      {
        type: "paragraph",
        text: "Frontend filtering works when the complete dataset is already available. But as the catalogue grows, downloading everything just to filter it in the browser becomes inefficient. I wanted search, filtering and sorting to happen at the backend, with PostgreSQL returning only the relevant results. Debouncing search input also became important. Instead of sending a request on every keystroke, the application waits briefly after the user stops typing.",
      },
      { type: "heading", text: "Rate limiting and security" },
      {
        type: "paragraph",
        text: "Public APIs introduce another concern: abuse. I considered separate rate-limit policies for anonymous and authenticated users. Anonymous users should have stricter IP-based limits, while authenticated users can have higher limits based on verified Clerk identity. But application-level rate limiting is not the same as DDoS protection. That requires thinking about protection at the CDN and WAF layers too. I also revisited authorization, image processing, SSRF protection, CSP and the handling of paid course content.",
      },
      {
        type: "mermaid",
        caption: "Rate limiting and security layers",
        code: `flowchart TD
    U["Incoming User Request"] --> CDN["CDN Layer"]
    CDN --> WAF["Web Application Firewall"]
    WAF --> RL["Rate Limiter"]

    RL --> AUTH{"Authenticated?"}

    AUTH -->|Yes| CLERK["Verify Clerk Identity"]
    AUTH -->|No| IP["Anonymous IP-Based Limits"]

    CLERK --> API["Express.js API"]
    IP --> API

    API --> AUTHZ["Authorization Checks"]
    AUTHZ --> SSRF["SSRF Protection"]
    SSRF --> DB[("PostgreSQL")]

    API -.-> CSP["Content Security Policy"]
    API -.-> IMG["Secure Image Processing"]

    style WAF fill:#29213D,stroke:#9B7AFF,color:#fff
    style RL fill:#29213D,stroke:#9B7AFF,color:#fff
    style DB fill:#183B35,stroke:#55C9A5,color:#fff`,
      },
      { type: "heading", text: "Caching beyond the browser" },
      {
        type: "paragraph",
        text: "Another important lesson was understanding that caching isn't a single feature. There are different layers: TanStack Query's in-memory cache, IndexedDB persistence if required, browser HTTP caching, CDN/shared caching, and backend caching where justified. Each solves a different problem.",
      },
      {
        type: "paragraph",
        text: "For the initial implementation, I chose to defer IndexedDB rather than introduce persistent caching before it was necessary. I also realized that an ETag returning HTTP 304 does not automatically mean PostgreSQL was skipped. If the server queries the database before generating the ETag, the database work has already happened. That distinction matters.",
      },
      {
        type: "mermaid",
        caption: "Caching layers across the system",
        code: `flowchart TD
    U["User"] --> F["React Frontend"]

    F --> TQ["TanStack Query Cache"]
    TQ --> HTTP["Browser HTTP Cache"]
    HTTP --> CDN["CDN / Shared Cache"]
    CDN --> API["Express.js Backend"]

    API --> BC["Backend Cache (When Justified)"]
    BC --> DB[("PostgreSQL")]

    TQ -.-> IDB["IndexedDB Persistence (Deferred)"]

    HTTP -.-> ETag["ETag / Conditional Requests"]
    ETag -.-> STATUS["HTTP 304 Not Modified"]

    style TQ fill:#29213D,stroke:#9B7AFF,color:#fff
    style CDN fill:#183B35,stroke:#55C9A5,color:#fff
    style DB fill:#183B35,stroke:#55C9A5,color:#fff`,
      },
      {
        type: "heading",
        text: "3. The part I almost overlooked: auditing the implementation",
      },
      {
        type: "paragraph",
        text: "After working through the architecture, I wanted to know whether the implementation actually matched the design. Not whether the packages were installed. Not whether the configuration files existed. Not whether the feature names appeared in the code. I wanted to verify the complete execution flow.",
      },
      {
        type: "paragraph",
        text: "So I used OpenCode to perform a repository-level system design audit. I deliberately split the audit into seven parts and instructed the agent to inspect the actual code, trace requests across layers, identify missing safeguards, and provide evidence using file paths and line numbers. I also made one rule explicit: do not modify anything during the audit. I wanted findings, not automatic fixes.",
      },
      {
        type: "table",
        headers: ["Part", "What I audited"],
        rows: [
          ["1", "Repository and architecture verification"],
          ["2", "Frontend reliability and caching"],
          ["3", "Backend APIs, pagination and database"],
          ["4", "HTTP caching, CDN and image processing"],
          ["5", "Authentication, authorization and security"],
          ["6", "Observability, resilience and scalability"],
          ["7", "Final production readiness assessment"],
        ],
      },
      {
        type: "mermaid",
        caption: "Repository-level system design audit flow",
        code: `flowchart TD
    A["OpenCode AI Agent"] --> B["Repository Inspection"]

    B --> C["Frontend Audit"]
    B --> D["Backend Audit"]
    B --> E["Database Audit"]
    B --> F["Security Audit"]
    B --> G["Infrastructure Audit"]

    C --> H["Trace Actual Execution Flow"]
    D --> H
    E --> H
    F --> H
    G --> H

    H --> I["Identify Architectural Gaps"]
    I --> J["Collect File Paths and Line Numbers"]
    J --> K["Generate Audit Findings"]

    K --> L["Production Readiness Assessment"]

    M["Audit Rule: No Code Modifications"] -.-> A

    style A fill:#29213D,stroke:#9B7AFF,color:#fff
    style L fill:#183B35,stroke:#55C9A5,color:#fff`,
      },
      { type: "heading", text: "4. What the audit taught me" },
      {
        type: "paragraph",
        text: "The most important lesson was that an implementation can be partially correct while the overall architecture remains incomplete. For example: having TanStack Query installed doesn't prove caching is configured correctly; having an AbortController doesn't prove every fetch request consumes its signal; having cursor fields in an API response doesn't prove pagination is actually cursor-based; having Cache-Control headers doesn't prove CDN caching works; having Redis doesn't prove rate limiting is distributed correctly; having Clerk doesn't mean paid content is protected; having structured logs doesn't mean the system has complete observability; passing tests doesn't prove the application can handle production traffic.",
      },
      {
        type: "paragraph",
        text: "The audit highlighted areas needing investigation: database migration consistency, verified cursor pagination and backend search/filtering, rate limiting and SSRF protection, preventing long-lived cache headers on errors, request-level logs/metrics/alerting, and deployment-level CDN/WAF/CSP confirmation.",
      },
      { type: "heading", text: "5. What I would do differently next time" },
      {
        type: "paragraph",
        text: "If I were starting this system again, I would define production requirements much earlier. Before implementing a feature, I would ask: What problem does this solve? Which layer should own the responsibility? What happens when this component fails? How will the behavior be tested? How will I observe it in production? What evidence will prove that it works?",
      },
      {
        type: "paragraph",
        text: "I would also avoid introducing infrastructure just because it is popular. Not every application needs microservices, Kubernetes, Redis caching or a complicated distributed architecture. Sometimes a well-structured modular backend, a properly configured database, sensible caching and good observability are enough. The goal should be to solve actual engineering problems, not to make the architecture look impressive.",
      },
      { type: "heading", text: "Final takeaway" },
      {
        type: "paragraph",
        text: "This exercise changed my understanding of system design. Earlier, I mostly thought about how different components communicate and how to make the application work. Now, I think much more about failure scenarios, data consistency, security boundaries, resource constraints, observability and operational behavior.",
      },
      {
        type: "paragraph",
        text: "Building a feature proves that it works. Auditing its architecture helps establish whether it can be trusted. I'm still working through the production-readiness gaps, but the process itself has been valuable. Because production engineering isn't just about choosing the right technologies. It's about understanding what happens when those technologies don't behave as expected.",
      },
      {
        type: "paragraph",
        text: "I'd be interested in hearing from engineers who have taken an application from a working implementation to production. What do you usually audit first: database performance, caching, security, reliability or observability?",
      },
      {
        type: "mermaid",
        caption: "Production-ready architecture overview",
        code: `flowchart TD
    U["Users"] --> CDN["CDN / WAF"]
    CDN --> FE["React Frontend"]

    FE --> TQ["TanStack Query"]
    TQ --> API["Express.js API"]

    API --> AUTH["Clerk Authentication"]
    API --> RL["Rate Limiting"]
    API --> PAG["Pagination / Search / Filtering"]

    PAG --> ORM["Prisma ORM"]
    ORM --> DB[("PostgreSQL")]

    API --> CACHE["Backend Cache"]
    CACHE --> DB

    API --> IMG["Sharp Image Processing"]

    API --> OBS["Logs / Metrics / Monitoring"]
    DB --> OBS

    OBS --> ALERT["Alerts and Diagnostics"]

    style CDN fill:#29213D,stroke:#9B7AFF,color:#fff
    style API fill:#29213D,stroke:#9B7AFF,color:#fff
    style DB fill:#183B35,stroke:#55C9A5,color:#fff
    style OBS fill:#183B35,stroke:#55C9A5,color:#fff`,
      },
    ],
    published: true,
  },
  {
    slug: "designing-products-that-feel-clear",
    title: "Designing products that feel clear",
    description: "A practical look at how clarity in hierarchy, copy, and interaction design makes digital products easier to trust and use.",
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
    description: "How we balance speed, engineering quality, and visual polish when shipping modern web products for ambitious teams.",
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
    description: "Premium is not just visuals. It’s performance, spacing, content confidence, motion restraint, and thoughtful details working together.",
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

export function getJournalPost(slug: string): JournalPost | undefined {
  return journalPosts.find((post) => post.slug === slug && post.published);
}

export function getJournalPostText(post: JournalPost): string {
  const parts: string[] = [post.title, post.description];
  for (const block of post.content ?? []) {
    if (block.type === "paragraph" || block.type === "heading") parts.push(block.text);
    if (block.type === "list") parts.push(...block.items);
    if (block.type === "table") parts.push(...block.headers, ...block.rows.flat());
    if (block.type === "mermaid" && block.caption) parts.push(block.caption);
  }
  return parts.join("\n");
}
