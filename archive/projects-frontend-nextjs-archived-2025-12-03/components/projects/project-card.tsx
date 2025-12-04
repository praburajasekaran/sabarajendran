"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, IndianRupee } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cardHover } from "@/lib/animations";

/**
 * ProjectCard Component
 *
 * Main project display card with image, metadata, and status.
 * Follows governmental design principles with professional styling.
 *
 * @example
 * ```tsx
 * <ProjectCard
 *   title="Road Development Project"
 *   slug="road-development"
 *   description="Improving rural connectivity..."
 *   image="/projects/road.jpg"
 *   status="ongoing"
 *   location="District XYZ"
 *   date="January 2024"
 *   budget="₹50 Lakhs"
 * />
 * ```
 */

export interface ProjectCardProps {
  /** Project title */
  title: string;
  /** URL slug for linking */
  slug: string;
  /** Project description */
  description: string;
  /** Featured image URL */
  image?: string;
  /** Project status */
  status: "completed" | "ongoing" | "planned";
  /** Project location */
  location?: string;
  /** Project date */
  date?: string;
  /** Project budget */
  budget?: string;
  /** Category/tags */
  category?: string;
  /** Additional CSS classes */
  className?: string;
}

const statusLabels = {
  completed: "Completed",
  ongoing: "Ongoing",
  planned: "Planned",
};

export function ProjectCard({
  title,
  slug,
  description,
  image,
  status,
  location,
  date,
  budget,
  category,
  className,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="group block">
      <motion.div
        variants={cardHover}
        initial="initial"
        whileHover="hover"
        transition={{ duration: 0.2 }}
      >
        <Card
          variant="elevated"
          hoverable
          className={cn("overflow-hidden", className)}
        >
        {/* Project Image */}
        {image && (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute left-4 top-4">
              <Badge variant={status} size="md">
                {statusLabels[status]}
              </Badge>
            </div>
          </div>
        )}

        {/* Project Content */}
        <div className="p-6">
          {/* Category */}
          {category && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
              {category}
            </p>
          )}

          {/* Title */}
          <h3 className="mb-3 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
            {title}
          </h3>

          {/* Description */}
          <p className="mb-4 line-clamp-3 text-sm text-gray-600">
            {description}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-gray-400" aria-hidden="true" />
                <span>{location}</span>
              </div>
            )}
            {date && (
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-gray-400" aria-hidden="true" />
                <span>{date}</span>
              </div>
            )}
            {budget && (
              <div className="flex items-center gap-1.5">
                <IndianRupee size={16} className="text-gray-400" aria-hidden="true" />
                <span>{budget}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
      </motion.div>
    </Link>
  );
}
