/**
 * TypeScript types for WordPress REST API responses
 * Based on Saba Projects custom post type structure
 */

// Base WordPress types
export interface WPRendered {
  rendered: string;
  protected?: boolean;
}

export interface WPLink {
  href: string;
  embeddable?: boolean;
  taxonomy?: string;
}

export interface WPLinks {
  self: WPLink[];
  collection: WPLink[];
  about: WPLink[];
  "wp:attachment"?: WPLink[];
  "wp:term"?: WPLink[];
  curies?: Array<{ name: string; href: string; templated: boolean }>;
}

// Taxonomy term types
export interface WPTerm {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: Record<string, unknown>;
  _links: WPLinks;
}

// Image/Media types
export interface WPMediaDetails {
  width: number;
  height: number;
  file: string;
  filesize?: number;
  sizes?: {
    [key: string]: {
      file: string;
      width: number;
      height: number;
      mime_type: string;
      source_url: string;
    };
  };
  image_meta?: {
    aperture: string;
    credit: string;
    camera: string;
    caption: string;
    created_timestamp: string;
    copyright: string;
    focal_length: string;
    iso: string;
    shutter_speed: string;
    title: string;
    orientation: string;
    keywords: string[];
  };
}

export interface WPMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: WPRendered;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRendered;
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Record<string, unknown>;
  description: WPRendered;
  caption: WPRendered;
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: WPMediaDetails;
  source_url: string;
  _links: WPLinks;
}

// Saba Project custom post type
export interface SabaProject {
  id: number;
  date: string;
  date_gmt: string;
  guid: WPRendered;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, unknown>;
  // Custom taxonomies
  categories: number[];
  project_village?: number[];
  project_year?: number[];
  project_status?: number[];
  project_scheme?: number[];
  // Embedded data (when using _embed parameter)
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPTerm[][];
  };
  _links: WPLinks;
}

// Clean project type for frontend use
export interface Project {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  link: string;
  featuredImage?: {
    id: number;
    url: string;
    alt: string;
    width: number;
    height: number;
    caption?: string;
  };
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  villages: {
    id: number;
    name: string;
    slug: string;
  }[];
  years: {
    id: number;
    name: string;
    slug: string;
  }[];
  statuses: {
    id: number;
    name: string;
    slug: string;
  }[];
  schemes: {
    id: number;
    name: string;
    slug: string;
  }[];
}

// API response types
export interface WPAPIResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
}

// Filter options for projects
export interface ProjectFilters {
  category?: string;
  village?: string;
  year?: string;
  status?: string;
  scheme?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

// Taxonomy collections
export type TaxonomyType = "categories" | "project_village" | "project_year" | "project_status" | "project_scheme";

export interface TaxonomyCollection {
  categories: WPTerm[];
  villages: WPTerm[];
  years: WPTerm[];
  statuses: WPTerm[];
  schemes: WPTerm[];
}
