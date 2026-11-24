import projectData from "./projects.json";

export type ProjectWorkType = "design" | "development" | "both";

export type ProjectDecision = {
  title: string;
  description: string;
  why?: string;
  outcome?: string;
};

export type ProjectLinks = {
  behance?: string;
  live?: string;
  github?: string;
};

export type ProjectDesignThinking = {
  intro?: string;
  problem: string;
  audience?: string;
  coreChallenge: string;
  designGoal?: string;
  goals: string[];
  research: string;
};

export type ProjectRevenueScenario = {
  label: string;
  monthly: string;
  basis: string;
};

export type ProjectIllustrativeRevenue = {
  note: string;
  assumptions: string;
  scenarios: ProjectRevenueScenario[];
};

export type ProjectOutcome = {
  title: string;
  description: string;
};

export type ProjectCaseSection = {
  id: string;
  label: string;
  intro?: string;
  items: ProjectDecision[];
  variant?: "default" | "technical";
};

export type ProjectImpactMetric = {
  label: string;
  value: string;
  basis: string;
};

export type ProjectImpact = {
  note: string;
  assumptions?: string;
  metrics: ProjectImpactMetric[];
};

export type ProjectOverview = {
  role?: string;
  deliverables?: string[];
  technology?: string[];
  services?: string[];
};

export type ProjectImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  detail?: string;
};

export type Project = {
  id: string;
  name: string;
  genre: string;
  description: string;
  workType: ProjectWorkType | string;
  projectType: string;
  year: string;
  coverImage: string;
  coverVideo?: string;
  coverImageWidth?: number;
  coverImageHeight?: number;
  coverAlt: string;
  gallery?: ProjectImage[];
  links?: ProjectLinks;
  overview?: ProjectOverview;
  designThinking?: ProjectDesignThinking;
  caseSections?: ProjectCaseSection[];
  illustrativeRevenue?: ProjectIllustrativeRevenue;
  outcomesIntro?: string;
  outcomesLabel?: string;
  outcomes?: ProjectOutcome[];
  impact?: ProjectImpact;
  designDecisions: ProjectDecision[];
  developmentDecisions: ProjectDecision[];
};

export const projects = projectData as Project[];

export function getProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getNextProject(id: string): Project {
  const current = projects.findIndex((project) => project.id === id);
  return projects[(current + 1) % projects.length];
}

export function getProjectWorkType(project: Project): ProjectWorkType {
  if (project.workType === "development") return "development";
  if (project.workType === "design" || project.workType === "ui-ux") return "design";
  return "both";
}

