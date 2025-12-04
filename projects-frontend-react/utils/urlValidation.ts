/**
 * URL Validation Utilities
 *
 * Validates URL parameters and handles edge cases for filtered project pages.
 * Ensures data integrity and provides helpful error messages.
 */

import { Project, ProjectStatus, ProjectType } from '../types';
import { FilterState } from './urlBuilder';
import { getLocationMapper } from './slugMapping';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  correctedFilters?: FilterState;
}

/**
 * Validate filter state against available project data
 *
 * Checks:
 * - Location exists in actual data
 * - Hierarchy is valid (panchayat belongs to block, village to panchayat)
 * - Enum values are valid (type, status)
 *
 * @param filters Current filter state
 * @param projects All available projects
 * @returns Validation result with errors and corrected filters
 */
export const validateFilters = (
  filters: FilterState,
  projects: Project[]
): ValidationResult => {
  const errors: string[] = [];

  if (projects.length === 0) {
    return { isValid: true, errors: [] }; // Can't validate if no data loaded yet
  }

  const locationMapper = getLocationMapper(projects);

  // Validate block
  if (filters.block && filters.block !== 'All') {
    const blockExists = locationMapper.hasName(filters.block, 'block');
    if (!blockExists) {
      errors.push(`Block "${filters.block}" does not exist`);
    }
  }

  // Validate panchayat
  if (filters.panchayat && filters.panchayat !== 'All') {
    const panchayatExists = locationMapper.hasName(filters.panchayat, 'panchayat');
    if (!panchayatExists) {
      errors.push(`Panchayat "${filters.panchayat}" does not exist`);
    } else if (filters.block !== 'All') {
      // Check if panchayat belongs to the selected block
      const panchayatBelongsToBlock = projects.some(
        p => p.block === filters.block && p.panchayat === filters.panchayat
      );
      if (!panchayatBelongsToBlock) {
        errors.push(
          `Panchayat "${filters.panchayat}" does not belong to block "${filters.block}"`
        );
      }
    }
  }

  // Validate village
  if (filters.village) {
    const villageExists = locationMapper.hasName(filters.village, 'village');
    if (!villageExists) {
      errors.push(`Village "${filters.village}" does not exist`);
    } else if (filters.panchayat !== 'All') {
      // Check if village belongs to the selected panchayat
      const villageBelongsToPanchayat = projects.some(
        p =>
          p.panchayat === filters.panchayat &&
          p.village === filters.village
      );
      if (!villageBelongsToPanchayat) {
        errors.push(
          `Village "${filters.village}" does not belong to panchayat "${filters.panchayat}"`
        );
      }
    }
  }

  // Validate type
  if (filters.type && filters.type !== 'All') {
    const validTypes = Object.values(ProjectType);
    if (!validTypes.includes(filters.type as ProjectType)) {
      errors.push(`Invalid project type: "${filters.type}"`);
    }
  }

  // Validate status
  if (filters.status && filters.status !== 'All') {
    const validStatuses = Object.values(ProjectStatus);
    if (!validStatuses.includes(filters.status as ProjectStatus)) {
      errors.push(`Invalid project status: "${filters.status}"`);
    }
  }

  // Validate year
  if (filters.year && filters.year !== 'All') {
    const availableYears = new Set(projects.map(p => p.year));
    if (!availableYears.has(filters.year)) {
      errors.push(`No projects found for year: "${filters.year}"`);
    }
  }

  // Validate page number
  if (filters.page < 1) {
    errors.push(`Invalid page number: ${filters.page}`);
  }

  // If there are errors, generate corrected filters
  let correctedFilters: FilterState | undefined;
  if (errors.length > 0) {
    correctedFilters = getCorrectedFilters(filters, projects);
  }

  return {
    isValid: errors.length === 0,
    errors,
    correctedFilters
  };
};

/**
 * Get corrected filters by removing invalid values
 */
const getCorrectedFilters = (
  filters: FilterState,
  projects: Project[]
): FilterState => {
  const locationMapper = getLocationMapper(projects);

  const corrected: FilterState = { ...filters };

  // Reset invalid block
  if (corrected.block !== 'All' && !locationMapper.hasName(corrected.block, 'block')) {
    corrected.block = 'All';
    corrected.panchayat = 'All'; // Also reset dependent filters
    corrected.village = null;
  }

  // Reset invalid panchayat
  if (corrected.panchayat !== 'All' && !locationMapper.hasName(corrected.panchayat, 'panchayat')) {
    corrected.panchayat = 'All';
    corrected.village = null;
  }

  // Reset invalid village
  if (corrected.village && !locationMapper.hasName(corrected.village, 'village')) {
    corrected.village = null;
  }

  // Reset invalid type
  const validTypes = Object.values(ProjectType);
  if (corrected.type !== 'All' && !validTypes.includes(corrected.type as ProjectType)) {
    corrected.type = 'All';
  }

  // Reset invalid status
  const validStatuses = Object.values(ProjectStatus);
  if (corrected.status !== 'All' && !validStatuses.includes(corrected.status as ProjectStatus)) {
    corrected.status = 'All';
  }

  // Reset invalid year
  const availableYears = new Set(projects.map(p => p.year));
  if (corrected.year !== 'All' && !availableYears.has(corrected.year)) {
    corrected.year = 'All';
  }

  // Reset invalid page
  if (corrected.page < 1) {
    corrected.page = 1;
  }

  return corrected;
};

/**
 * Validate location hierarchy specifically
 *
 * Ensures panchayat belongs to block, village belongs to panchayat
 */
export const validateLocationHierarchy = (
  blockSlug: string | null,
  panchayatSlug: string | null,
  villageSlug: string | null,
  projects: Project[]
): boolean => {
  if (!blockSlug) return true; // No hierarchy to validate

  const locationMapper = getLocationMapper(projects);

  const blockName = locationMapper.getName(blockSlug, 'block');
  if (!blockName) return false;

  if (!panchayatSlug) return true; // Block is valid, no panchayat to check

  const panchayatName = locationMapper.getName(panchayatSlug, 'panchayat');
  if (!panchayatName) return false;

  // Check if panchayat belongs to block
  const panchayatBelongsToBlock = projects.some(
    p => p.block === blockName && p.panchayat === panchayatName
  );
  if (!panchayatBelongsToBlock) return false;

  if (!villageSlug) return true; // Block and panchayat are valid, no village to check

  const villageName = locationMapper.getName(villageSlug, 'village');
  if (!villageName) return false;

  // Check if village belongs to panchayat
  const villageBelongsToPanchayat = projects.some(
    p =>
      p.block === blockName &&
      p.panchayat === panchayatName &&
      p.village === villageName
  );

  return villageBelongsToPanchayat;
};

/**
 * Sanitize search query
 *
 * Removes potentially harmful characters from search input
 */
export const sanitizeSearchQuery = (query: string): string => {
  return query
    .trim()
    .slice(0, 100) // Limit length
    .replace(/[<>]/g, ''); // Remove angle brackets to prevent XSS
};

/**
 * Check if filter combination will return results
 *
 * Useful for showing warnings before applying filters
 */
export const willHaveResults = (
  filters: FilterState,
  projects: Project[]
): boolean => {
  if (projects.length === 0) return false;

  const matchingProjects = projects.filter(project => {
    const matchBlock = filters.block !== 'All' ? project.block === filters.block : true;
    const matchPanchayat = filters.panchayat !== 'All' ? project.panchayat === filters.panchayat : true;
    const matchVillage = filters.village ? project.village === filters.village : true;
    const matchYear = filters.year !== 'All' ? project.year === filters.year : true;
    const matchStatus = filters.status !== 'All' ? project.status === filters.status : true;
    const matchType = filters.type !== 'All' ? project.type === filters.type : true;
    const matchSearch = filters.search
      ? project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.search.toLowerCase())
      : true;

    return matchBlock && matchPanchayat && matchVillage && matchYear && matchStatus && matchType && matchSearch;
  });

  return matchingProjects.length > 0;
};

/**
 * Get available filter options based on current filters
 *
 * Returns only panchayats that belong to selected block, etc.
 * Useful for dependent dropdowns.
 */
export const getAvailableFilterOptions = (
  currentFilters: FilterState,
  projects: Project[]
): {
  blocks: string[];
  panchayats: string[];
  villages: string[];
  types: string[];
  statuses: string[];
  years: string[];
} => {
  // Filter projects based on current location selections
  const relevantProjects = projects.filter(p => {
    if (currentFilters.block !== 'All' && p.block !== currentFilters.block) return false;
    if (currentFilters.panchayat !== 'All' && p.panchayat !== currentFilters.panchayat) return false;
    return true;
  });

  return {
    blocks: [...new Set(projects.map(p => p.block).filter(Boolean))].sort(),
    panchayats: [...new Set(relevantProjects.map(p => p.panchayat).filter(Boolean))].sort(),
    villages: [...new Set(relevantProjects.map(p => p.village))].sort(),
    types: Object.values(ProjectType),
    statuses: Object.values(ProjectStatus),
    years: [...new Set(projects.map(p => p.year))].sort().reverse()
  };
};
