/**
 * Component Library - Barrel Exports
 *
 * Central export point for all UI and project components.
 * Import components using: import { Button, Card } from '@/components'
 */

// Layout Components
export { Container } from "./ui/container";
export type { ContainerProps } from "./ui/container";

export { Section } from "./ui/section";
export type { SectionProps } from "./ui/section";

export { Grid } from "./ui/grid";
export type { GridProps } from "./ui/grid";

// Typography Components
export { Heading } from "./ui/heading";
export type { HeadingProps } from "./ui/heading";

export { Text } from "./ui/text";
export type { TextProps } from "./ui/text";

export { Badge } from "./ui/badge";
export type { BadgeProps } from "./ui/badge";

// UI Components
export { Button } from "./ui/button";
export type { ButtonProps } from "./ui/button";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from "./ui/card";

export { Input, SearchInput } from "./ui/input";
export type { InputProps, SearchInputProps } from "./ui/input";

export { Select } from "./ui/select";
export type { SelectProps, SelectOption } from "./ui/select";

export { LoadingSpinner, LoadingSkeleton } from "./ui/loading-spinner";
export type { LoadingSpinnerProps, LoadingSkeletonProps } from "./ui/loading-spinner";

export { ErrorMessage, InlineError } from "./ui/error-message";
export type { ErrorMessageProps, InlineErrorProps } from "./ui/error-message";

export { EmptyState } from "./ui/empty-state";
export type { EmptyStateProps } from "./ui/empty-state";

export { Icon } from "./ui/icon";
export type { IconProps } from "./ui/icon";

// Project Components
export { ProjectCard } from "./projects/project-card";
export type { ProjectCardProps } from "./projects/project-card";

export { ProjectGrid } from "./projects/project-grid";
export type { ProjectGridProps } from "./projects/project-grid";

export { ProjectFilters, FilterButton } from "./projects/project-filters";
export type { ProjectFiltersProps, FilterButtonProps } from "./projects/project-filters";

export { ProjectSearch } from "./projects/project-search";
export type { ProjectSearchProps } from "./projects/project-search";

export { ProjectStats } from "./projects/project-stats";
export type { ProjectStatsProps, StatItem } from "./projects/project-stats";
