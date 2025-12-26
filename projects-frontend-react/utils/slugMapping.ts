/**
 * Slug Mapping System for Location Hierarchies
 *
 * Provides bidirectional mapping between display names and URL-friendly slugs
 * for blocks, panchayats, and villages.
 *
 * Generated dynamically from actual project data to ensure accuracy.
 */

import { Project } from '../types';
import { slugify, deslugify } from './urlBuilder';

export interface LocationMapping {
  blocks: Map<string, string>;      // slug -> display name
  panchayats: Map<string, string>;
  villages: Map<string, string>;
  types: Map<string, string>;       // slug -> display name for project types
  statuses: Map<string, string>;    // slug -> display name for project statuses
  schemes: Map<string, string>;     // slug -> display name for schemes
}

export interface LocationReverseMapping {
  blocks: Map<string, string>;      // display name -> slug
  panchayats: Map<string, string>;
  villages: Map<string, string>;
  types: Map<string, string>;       // display name -> slug for project types
  statuses: Map<string, string>;    // display name -> slug for project statuses
  schemes: Map<string, string>;     // display name -> slug for schemes
}

/**
 * Generate location mappings from project data
 *
 * Creates bidirectional maps for quick lookup in both directions:
 * - slug -> display name (for parsing URLs)
 * - display name -> slug (for building URLs)
 *
 * @param projects Array of all projects
 * @returns Object with forward and reverse mappings
 */
export const generateLocationMappings = (projects: Project[]): {
  forward: LocationMapping;
  reverse: LocationReverseMapping;
} => {
  const forwardBlocks = new Map<string, string>();
  const forwardPanchayats = new Map<string, string>();
  const forwardVillages = new Map<string, string>();
  const forwardTypes = new Map<string, string>();
  const forwardStatuses = new Map<string, string>();
  const forwardSchemes = new Map<string, string>();

  const reverseBlocks = new Map<string, string>();
  const reversePanchayats = new Map<string, string>();
  const reverseVillages = new Map<string, string>();
  const reverseTypes = new Map<string, string>();
  const reverseStatuses = new Map<string, string>();
  const reverseSchemes = new Map<string, string>();

  // Extract unique locations and filter values from projects
  projects.forEach(project => {
    // Blocks
    if (project.block) {
      const slug = slugify(project.block);
      forwardBlocks.set(slug, project.block);
      reverseBlocks.set(project.block, slug);
    }

    // Panchayats
    if (project.panchayat) {
      const slug = slugify(project.panchayat);
      forwardPanchayats.set(slug, project.panchayat);
      reversePanchayats.set(project.panchayat, slug);
    }

    // Villages
    if (project.village) {
      const slug = slugify(project.village);
      forwardVillages.set(slug, project.village);
      reverseVillages.set(project.village, slug);
    }

    // Types
    if (project.type) {
      const slug = slugify(project.type);
      forwardTypes.set(slug, project.type);
      reverseTypes.set(project.type, slug);
    }

    // Statuses
    if (project.status) {
      const slug = slugify(project.status);
      forwardStatuses.set(slug, project.status);
      reverseStatuses.set(project.status, slug);
    }

    // Schemes
    if (project.scheme) {
      const slug = slugify(project.scheme);
      forwardSchemes.set(slug, project.scheme);
      reverseSchemes.set(project.scheme, slug);
    }
  });

  return {
    forward: {
      blocks: forwardBlocks,
      panchayats: forwardPanchayats,
      villages: forwardVillages,
      types: forwardTypes,
      statuses: forwardStatuses,
      schemes: forwardSchemes
    },
    reverse: {
      blocks: reverseBlocks,
      panchayats: reversePanchayats,
      villages: reverseVillages,
      types: reverseTypes,
      statuses: reverseStatuses,
      schemes: reverseSchemes
    }
  };
};

/**
 * Location Mapper Class
 *
 * Provides convenient methods for converting between slugs and display names.
 * Initialized with project data.
 */
export class LocationMapper {
  private forwardMaps: LocationMapping;
  private reverseMaps: LocationReverseMapping;

  constructor(projects: Project[]) {
    const { forward, reverse } = generateLocationMappings(projects);
    this.forwardMaps = forward;
    this.reverseMaps = reverse;
  }

  /**
   * Get display name from slug
   *
   * @example
   * mapper.getName("kurinjipadi", "block") // "Kurinjipadi"
   * mapper.getName("indira-nagar", "village") // "Indira Nagar"
   * mapper.getName("water-supply", "type") // "Water Supply"
   */
  getName(slug: string, type: 'block' | 'panchayat' | 'village' | 'type' | 'status' | 'scheme'): string | undefined {
    const map = this.forwardMaps[`${type}s` as keyof LocationMapping];
    return map.get(slug);
  }

  /**
   * Get slug from display name
   *
   * @example
   * mapper.getSlug("Kurinjipadi", "block") // "kurinjipadi"
   * mapper.getSlug("Indira Nagar", "village") // "indira-nagar"
   * mapper.getSlug("Water Supply", "type") // "water-supply"
   */
  getSlug(name: string, type: 'block' | 'panchayat' | 'village' | 'type' | 'status' | 'scheme'): string | undefined {
    const map = this.reverseMaps[`${type}s` as keyof LocationReverseMapping];
    return map.get(name);
  }

  /**
   * Check if a slug exists in the mapping
   *
   * @example
   * mapper.hasSlug("kurinjipadi", "block") // true
   * mapper.hasSlug("invalid-block", "block") // false
   */
  hasSlug(slug: string, type: 'block' | 'panchayat' | 'village' | 'type' | 'status' | 'scheme'): boolean {
    const map = this.forwardMaps[`${type}s` as keyof LocationMapping];
    return map.has(slug);
  }

  /**
   * Check if a display name exists in the mapping
   */
  hasName(name: string, type: 'block' | 'panchayat' | 'village' | 'type' | 'status' | 'scheme'): boolean {
    const map = this.reverseMaps[`${type}s` as keyof LocationReverseMapping];
    return map.has(name);
  }

  /**
   * Get all blocks (as display names)
   */
  getAllBlocks(): string[] {
    return Array.from(this.reverseMaps.blocks.keys()).sort();
  }

  /**
   * Get all panchayats (as display names)
   */
  getAllPanchayats(): string[] {
    return Array.from(this.reverseMaps.panchayats.keys()).sort();
  }

  /**
   * Get all villages (as display names)
   */
  getAllVillages(): string[] {
    return Array.from(this.reverseMaps.villages.keys()).sort();
  }

  /**
   * Get all block slugs
   */
  getAllBlockSlugs(): string[] {
    return Array.from(this.forwardMaps.blocks.keys()).sort();
  }

  /**
   * Get all panchayat slugs
   */
  getAllPanchayatSlugs(): string[] {
    return Array.from(this.forwardMaps.panchayats.keys()).sort();
  }

  /**
   * Get all village slugs
   */
  getAllVillageSlugs(): string[] {
    return Array.from(this.forwardMaps.villages.keys()).sort();
  }

  /**
   * Validate location hierarchy
   *
   * Ensures that panchayat belongs to the specified block,
   * and village belongs to the specified panchayat.
   *
   * @param blockSlug Block slug to validate
   * @param panchayatSlug Panchayat slug to validate (optional)
   * @param villageSlug Village slug to validate (optional)
   * @param projects Source project data
   * @returns true if hierarchy is valid
   */
  validateHierarchy(
    blockSlug: string | null,
    panchayatSlug: string | null,
    villageSlug: string | null,
    projects: Project[]
  ): boolean {
    // If no location specified, always valid
    if (!blockSlug) return true;

    const blockName = this.getName(blockSlug, 'block');
    if (!blockName) return false; // Block doesn't exist

    // If only block specified, it's valid
    if (!panchayatSlug) return true;

    const panchayatName = this.getName(panchayatSlug, 'panchayat');
    if (!panchayatName) return false; // Panchayat doesn't exist

    // Check if panchayat belongs to block
    const panchayatBelongsToBlock = projects.some(
      p => p.block === blockName && p.panchayat === panchayatName
    );
    if (!panchayatBelongsToBlock) return false;

    // If only block + panchayat specified, it's valid
    if (!villageSlug) return true;

    const villageName = this.getName(villageSlug, 'village');
    if (!villageName) return false; // Village doesn't exist

    // Check if village belongs to panchayat
    const villageBelongsToPanchayat = projects.some(
      p =>
        p.block === blockName &&
        p.panchayat === panchayatName &&
        p.village === villageName
    );

    return villageBelongsToPanchayat;
  }
}

/**
 * Singleton instance manager
 *
 * Stores a single LocationMapper instance per project dataset
 * to avoid recreating maps unnecessarily.
 */
let cachedMapper: LocationMapper | null = null;
let cachedProjectCount = 0;

/**
 * Get or create a LocationMapper instance
 *
 * Uses caching to avoid regenerating maps unnecessarily.
 * Creates new mapper if project count changes (indicating data refresh).
 */
export const getLocationMapper = (projects: Project[]): LocationMapper => {
  if (!cachedMapper || cachedProjectCount !== projects.length) {
    cachedMapper = new LocationMapper(projects);
    cachedProjectCount = projects.length;
  }
  return cachedMapper;
};

/**
 * Helper: Convert slug to display name with fallback
 *
 * If slug doesn't exist in mapping, returns deslugified version
 * (converts kebab-case to Title Case)
 */
export const slugToDisplayName = (
  slug: string,
  type: 'block' | 'panchayat' | 'village',
  projects: Project[]
): string => {
  const mapper = getLocationMapper(projects);
  const name = mapper.getName(slug, type);
  return name || deslugify(slug);
};

/**
 * Helper: Convert display name to slug with fallback
 *
 * If name doesn't exist in mapping, returns slugified version
 */
export const displayNameToSlug = (
  name: string,
  type: 'block' | 'panchayat' | 'village',
  projects: Project[]
): string => {
  const mapper = getLocationMapper(projects);
  const slug = mapper.getSlug(name, type);
  return slug || slugify(name);
};
