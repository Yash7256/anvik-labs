import projectData from "./projects.json";

export type ProjectWorkType = "design" | "development" | "both";

export type ProjectDecision = {
  title: string;
  description: string;
};

export type ProjectLinks = {
  behance?: string;
  live?: string;
  github?: string;
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
  coverImageWidth?: number;
  coverImageHeight?: number;
  coverAlt: string;
  links?: ProjectLinks;
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

