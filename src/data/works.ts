export type WorkImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type Work = {
  index: string;
  slug: string;
  name: string;
  year: string;
  category: string;
  services: string[];
  summary: string;
  intro: string;
  body: string[];
  hero: WorkImage;
  gallery: WorkImage[];
};

const IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "aurora-skincare-laptop.png": { width: 1520, height: 1034 },
  "chronicae-editorial-spread.png": { width: 1520, height: 1035 },
  "arcane-studio-laptop.png": { width: 1519, height: 1036 },
  "edifier-magazine-cover.png": { width: 1519, height: 1036 },
  "macbook-scroll-mockup.png": { width: 4000, height: 3000 },
  "wayfarer-screen-in-interior.png": { width: 1519, height: 1035 },
};

const mockup = (file: string, alt: string): WorkImage => {
  const dimensions = IMAGE_DIMENSIONS[file];
  return {
    src: `/mockups/${encodeURIComponent(file)}`,
    alt,
    ...(dimensions ?? {}),
  };
};

const AURORA = "aurora-skincare-laptop.png";
const CHRONICAE = "chronicae-editorial-spread.png";
const ARCANE = "arcane-studio-laptop.png";
const EDIFIER = "edifier-magazine-cover.png";
const MACBOOK = "macbook-scroll-mockup.png";
const WAYFARER = "wayfarer-screen-in-interior.png";

export const works: Work[] = [
  {
    index: "001",
    slug: "chronicae",
    name: "CHRONICAE",
    year: "2025",
    category: "IDENTITY / EDITORIAL / WEB",
    services: ["Brand Identity", "Editorial Design", "Web Design"],
    summary:
      "A living archive for a research collective, organised around time, notation and the quiet authority of a printed index.",
    intro:
      "Chronicae needed a system that could hold years of research without flattening it into a conventional archive. The answer was a modular identity built from rules, indices and a single typographic voice.",
    body: [
      "The identity treats every document as part of a continuous record. A narrow grotesque carries the reading, while a monospaced layer handles dates, references and catalogue numbers. Rules do the work that boxes usually do.",
      "The website extends the same logic on screen: a persistent index, generous margins and a reading rhythm that makes long-form material feel navigable rather than dense.",
    ],
    hero: mockup(
      MACBOOK,
      "Chronicae website shown on a laptop with a scrolling editorial layout.",
    ),
    gallery: [
      mockup(
        CHRONICAE,
        "Chronicae identity applied to a printed editorial spread.",
      ),
      mockup(
        WAYFARER,
        "Chronicae digital archive displayed on a screen in a soft interior.",
      ),
    ],
  },
  {
    index: "003",
    slug: "solara",
    name: "SOLARA",
    year: "2026",
    category: "IDENTITY / PACKAGING / WEB",
    services: ["Brand Identity", "Packaging", "Web Design"],
    summary:
      "A skincare label built around light: warm, direct and deliberately unadorned.",
    intro:
      "Solara began with a simple observation: skincare is mostly a story about light and surface. The identity keeps both visible without turning them into decoration.",
    body: [
      "A warm neutral base lets the product colours carry the range. Typography is set tight and low, with the wordmark acting as a horizon line across packaging and screen.",
      "The e-commerce experience favours close product photography, plain language and a short path from consideration to purchase.",
    ],
    hero: mockup(
      AURORA,
      "Solara skincare website shown on a laptop resting in a mossy landscape.",
    ),
    gallery: [
      mockup(
        WAYFARER,
        "Solara product page shown on a screen in a bright interior.",
      ),
      mockup(
        CHRONICAE,
        "Solara packaging and editorial material arranged in a studio setting.",
      ),
    ],
  },
  {
    index: "004",
    slug: "edifier-magazine",
    name: "EDIFIER® MAGAZINE",
    year: "2024",
    category: "EDITORIAL / ART DIRECTION / WEB",
    services: ["Editorial Design", "Art Direction", "Web Design"],
    summary:
      "An independent music magazine with a strict grid and enough room for sound to remain loud.",
    intro:
      "Edifier covers music with the patience of a long read and the pace of a weekly. The design needed a system that could switch between both without changing its voice.",
    body: [
      "The grid is intentionally narrow. Headlines are allowed to break it, photography is allowed to sit still, and the mono captions keep every issue anchored to the same set of rules.",
      "Online, the issue structure carries over into a scrollable reading experience. Each feature keeps its own rhythm while sharing the same navigation and type scale.",
    ],
    hero: mockup(
      EDIFIER,
      "Edifier magazine cover and feature spread displayed on a laptop.",
    ),
    gallery: [
      mockup(
        MACBOOK,
        "Edifier magazine website shown on a laptop in a studio.",
      ),
      mockup(
        ARCANE,
        "Edifier printed pages laid out on a neutral surface.",
      ),
    ],
  },
  {
    index: "005",
    slug: "rowan-keats",
    name: "ROWAN KEATS",
    year: "2023",
    category: "IDENTITY / WEB / PHOTOGRAPHY",
    services: ["Brand Identity", "Web Design", "Photography"],
    summary:
      "A personal identity for a photographer whose work sits between portraiture and landscape.",
    intro:
      "Rowan Keats needed a portfolio that could hold two bodies of work without splitting into two sites. The answer was a single, quiet frame that changes with the images.",
    body: [
      "The identity is mostly a set of decisions about spacing. A small wordmark, a fixed caption position and a warm off-white surface let the photographs set the temperature.",
      "The site uses full-width sequences and slow transitions, keeping the interface visible only when it is needed.",
    ],
    hero: mockup(
      WAYFARER,
      "Rowan Keats photography portfolio shown on a screen in a cosy room.",
    ),
    gallery: [
      mockup(
        CHRONICAE,
        "Rowan Keats portfolio spread with portrait photography.",
      ),
      mockup(
        AURORA,
        "Rowan Keats website displayed on a laptop outdoors.",
      ),
    ],
  },
  {
    index: "007",
    slug: "cartes-datelier",
    name: "CARTES D'ATELIER",
    year: "2025",
    category: "IDENTITY / PACKAGING / PRINT",
    services: ["Brand Identity", "Packaging", "Print Design"],
    summary:
      "A stationery and print studio identity built from the language of the workshop.",
    intro:
      "Cartes d'Atelier makes things by hand, at a scale you can hold. The identity borrows from the marks, labels and measurements found around a working studio.",
    body: [
      "The system is made of small parts: a compact wordmark, a set of index marks and a palette of paper tones. None of them depend on a single application to make sense.",
      "Packaging uses the same components at a larger scale, with typography printed directly onto the material rather than applied as a separate layer.",
    ],
    hero: mockup(
      ARCANE,
      "Cartes d'Atelier stationery and packaging arranged on a studio surface.",
    ),
    gallery: [
      mockup(
        AURORA,
        "Cartes d'Atelier packaging displayed beside a laptop.",
      ),
      mockup(
        WAYFARER,
        "Cartes d'Atelier print materials shown in a warm interior.",
      ),
    ],
  },
  {
    index: "008",
    slug: "palmira",
    name: "PALMIRA",
    year: "2022",
    category: "IDENTITY / WEB / MOTION",
    services: ["Brand Identity", "Web Design", "Motion"],
    summary:
      "A hospitality identity that moves slowly, with a warmth carried through type, image and motion.",
    intro:
      "Palmira is a place you arrive at rather than pass through. The identity needed to feel calm without becoming anonymous, and distinctive without becoming loud.",
    body: [
      "A wide, low-contrast wordmark sets the tone. Secondary type stays small and practical, leaving the photography to carry the sense of place.",
      "The site uses gentle transitions and a restrained colour palette, with motion reserved for the moments that mark a change of section.",
    ],
    hero: mockup(
      AURORA,
      "Palmira hospitality website shown on a laptop in a natural setting.",
    ),
    gallery: [
      mockup(
        CHRONICAE,
        "Palmira identity applied to a printed guest guide.",
      ),
      mockup(
        MACBOOK,
        "Palmira booking page displayed on a laptop.",
      ),
    ],
  },
  {
    index: "009",
    slug: "scene-pro",
    name: "SCENE PRO",
    year: "2025",
    category: "WEB / PRODUCT / DEVELOPMENT",
    services: ["Web Design", "Product Design", "Development"],
    summary:
      "A production tool for film crews, designed to stay legible on set and fast between takes.",
    intro:
      "Scene Pro is used in poor light, with one hand, while something else is happening. The interface had to prioritise speed and clarity over surface detail.",
    body: [
      "The product system uses a small set of states, large touch targets and a consistent hierarchy across scheduling, callsheets and locations. Colour is reserved for status.",
      "The marketing site mirrors the product: direct language, short sections and interface imagery that shows the tool at work rather than dressing it up.",
    ],
    hero: mockup(
      EDIFIER,
      "Scene Pro product interface shown on a laptop in a production setting.",
    ),
    gallery: [
      mockup(
        WAYFARER,
        "Scene Pro marketing website displayed on a screen in an interior.",
      ),
      mockup(
        MACBOOK,
        "Scene Pro scheduling interface shown on a laptop.",
      ),
    ],
  },
  {
    index: "010",
    slug: "exala",
    name: "EXALA (A)",
    year: "2023",
    category: "IDENTITY / EDITORIAL / WEB",
    services: ["Brand Identity", "Editorial Design", "Web Design"],
    summary:
      "An independent publisher with a flexible identity for essays, images and occasional experiments.",
    intro:
      "Exala publishes across formats and rarely repeats itself. The identity needed to be recognisable without prescribing what each release should look like.",
    body: [
      "A fixed typographic frame and a small set of recurring marks give every publication a family resemblance. Beyond that, each title is free to set its own pace.",
      "The website acts as a shared index rather than a template, listing releases by date and letting the covers do most of the navigation.",
    ],
    hero: mockup(
      CHRONICAE,
      "Exala publication covers and website shown on a laptop.",
    ),
    gallery: [
      mockup(
        ARCANE,
        "Exala editorial spreads arranged on a neutral surface.",
      ),
      mockup(
        EDIFIER,
        "Exala website displayed on a laptop with a minimal layout.",
      ),
    ],
  },
];

export function getWork(slug: string): Work | undefined {
  return works.find((work) => work.slug === slug);
}

export function getNextWork(slug: string): Work {
  const current = works.findIndex((work) => work.slug === slug);
  return works[(current + 1) % works.length];
}
