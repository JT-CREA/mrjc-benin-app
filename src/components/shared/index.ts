/**
 * components/shared/index.ts
 * Barrel export — Composants partagés MRJC-BÉNIN
 *
 * Usage :
 *   import { Button, Card, Badge, Modal } from '@/components/shared';
 */

export { default as Button } from "./Button";
export { default as Badge, StatusBadge } from "./Badge";
export { default as Modal } from "./Modal";
export { default as SectionTitle } from "./SectionTitle";

export { default as Card, ImageCard, StatCard } from "./Card";

export {
  Spinner,
  PageLoader,
  SectionLoader,
  EmptyState,
  ErrorState,
  SkeletonLine,
  SkeletonCard,
} from "./Spinner";

export type { ButtonVariant, ButtonSize } from "./Button";

// Nouveaux composants partagés v1.1
export { default as Pagination } from "./Pagination";
export { default as Breadcrumbs } from "./Breadcrumbs";
export type { BreadcrumbItem } from "./Breadcrumbs";
export { default as ShareButtons } from "./ShareButtons";
export { default as ToastProvider, useToast } from "./Toast";
