/**
 * Status Mapping Utility
 *
 * Maps detailed WordPress statuses to simplified filter categories.
 * This allows for a cleaner filter UI while preserving detailed status
 * information on project cards.
 */

/**
 * Simplified status categories for filtering
 */
export type StatusCategory = "completed" | "in-progress";

/**
 * Map a detailed status name to a simplified category
 *
 * @param statusName - The detailed status name (e.g., "Corewall Completed", "Earthwork Completed", "Ongoing")
 * @returns The simplified status category ("completed" or "in-progress")
 *
 * @example
 * mapStatusToCategory("Corewall Completed") // "completed"
 * mapStatusToCategory("Ongoing") // "in-progress"
 * mapStatusToCategory("Planned") // "in-progress"
 */
export function mapStatusToCategory(statusName: string): StatusCategory {
  if (!statusName) {
    return "in-progress";
  }

  const normalized = statusName.toLowerCase().trim();

  // Any status containing "completed" is categorized as completed
  if (normalized.includes("completed")) {
    return "completed";
  }

  // All other statuses (ongoing, planned, in-progress, etc.) are in-progress
  return "in-progress";
}

/**
 * Map a status slug to a simplified category
 *
 * @param statusSlug - The status slug (e.g., "corewall-completed", "ongoing")
 * @returns The simplified status category
 */
export function mapStatusSlugToCategory(statusSlug: string): StatusCategory {
  if (!statusSlug) {
    return "in-progress";
  }

  const normalized = statusSlug.toLowerCase().trim();

  if (normalized.includes("completed")) {
    return "completed";
  }

  return "in-progress";
}

/**
 * Check if a project status matches a filter category
 *
 * @param projectStatusName - The project's detailed status name
 * @param filterCategory - The filter category to match against
 * @returns True if the project status matches the filter category
 */
export function statusMatchesCategory(
  projectStatusName: string,
  filterCategory: StatusCategory
): boolean {
  return mapStatusToCategory(projectStatusName) === filterCategory;
}

/**
 * Simplified status filter options for UI
 */
export const SIMPLIFIED_STATUS_OPTIONS = [
  {
    slug: "completed",
    name: "Completed",
    description: "Projects that have been completed",
  },
  {
    slug: "in-progress",
    name: "In Progress",
    description: "Projects that are ongoing or planned",
  },
] as const;



