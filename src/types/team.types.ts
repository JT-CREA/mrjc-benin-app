/**
 * types/team.types.ts
 * Types pour les membres de l'équipe MRJC-BÉNIN
 */

export type TeamRole =
  | "direction"
  | "coordinator"
  | "field-agent"
  | "finance"
  | "communication"
  | "volunteer"
  | "intern"
  | "board";

export type ExpertiseDomain =
  | "agricultural-council"
  | "community-health"
  | "literacy-education"
  | "women-empowerment"
  | "social-intermediation"
  | "communication"
  | "finance"
  | "administration";

export interface TeamMember {
  id: string;
  slug: string;
  name: string;
  firstName: string;
  lastName: string;
  role: TeamRole;
  title: string; // Intitulé du poste
  department?: string;
  domain?: ExpertiseDomain;
  bio?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  joinedYear?: number;
  location?: string; // Ville / département
  languages?: string[]; // fr, fon, bariba...
  featured: boolean;
  isActive: boolean;
}

export interface TeamFilters {
  role?: TeamRole;
  domain?: ExpertiseDomain;
  department?: string;
  featured?: boolean;
}

export type TeamGroup = {
  label: string;
  members: TeamMember[];
};
