/**
 * types/nav.types.ts
 * Types pour la navigation MRJC-BÉNIN
 */

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  badge?: string;
  external?: boolean;
  children?: NavChild[];
  featured?: boolean;
}

export interface NavChild {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  badge?: string;
  external?: boolean;
}

export type NavSection = {
  id: string;
  title: string;
  items: NavItem[];
};

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type FooterLinkGroup = {
  title: string;
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
};
