export interface DomainColor {
  primary: string;
  bg: string;
  text: string;
  light: string;
}

export interface DomainApproachStep {
  title: string;
  description: string;
}

export interface DomainResult {
  value: string;
  label: string;
  icon: string;
}

export interface Domain {
  id: string;
  slug: string;
  label: string;
  tagline: string;
  description: string;
  fullDescription: string;
  color: DomainColor;
  icon: string;
  image: string;
  coverImage: string;
  approach: DomainApproachStep[];
  keyActivities: string[];
  results: DomainResult[];
  targetGroups: string[];
  relatedProjects: string[];
  order: number;
}
