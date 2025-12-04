/**
 * Loading Skeleton Component
 * Generic skeleton component for loading states
 * Provides pulse animation and customizable shapes
 */

"use client";

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export function LoadingSkeleton({
  className,
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}: LoadingSkeletonProps) {
  const baseClasses = "bg-gray-200 dark:bg-gray-700";

  const variantClasses = {
    text: "h-4 w-full rounded",
    circular: "rounded-full aspect-square",
    rectangular: "w-full",
    rounded: "rounded-lg w-full",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]",
    none: "",
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
      aria-label="Loading..."
      role="status"
    />
  );
}

/**
 * Text Skeleton
 * Pre-configured for text content loading
 */
export function TextSkeleton({
  lines = 1,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingSkeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? "75%" : "100%"}
        />
      ))}
    </div>
  );
}

/**
 * Card Skeleton
 * Pre-configured for card loading states
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <LoadingSkeleton variant="rounded" height={200} />
      <div className="space-y-2">
        <LoadingSkeleton variant="text" width="60%" />
        <LoadingSkeleton variant="text" width="80%" />
        <LoadingSkeleton variant="text" width="40%" />
      </div>
    </div>
  );
}

/**
 * Avatar Skeleton
 * Pre-configured for avatar/profile images
 */
export function AvatarSkeleton({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <LoadingSkeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  );
}
