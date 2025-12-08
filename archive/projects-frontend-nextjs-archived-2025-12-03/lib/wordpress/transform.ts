/**
 * WordPress Data Transformation Utilities
 *
 * Converts WordPress REST API responses into clean, React-friendly formats.
 * Handles HTML sanitization, taxonomy denormalization, and image optimization prep.
 *
 * WHY: WordPress returns verbose, deeply nested structures with HTML wrapped
 * in {rendered: "..."} objects. We transform this into simple, type-safe data
 * that React components can consume without knowing about WordPress internals.
 */

import type {
  WPProject,
  WPMedia,
  WPTerm,
  Project,
  FeaturedImage,
  SimpleTerm,
} from "./types";

// ============================================================================
// HTML Sanitization
// ============================================================================

/**
 * Strip WordPress paragraph tags and normalize whitespace
 *
 * WHY: WordPress wraps all content in <p> tags via wpautop().
 * For excerpts and short content, we often want plain text.
 *
 * @param html - WordPress HTML content
 * @returns Clean text without wrapping paragraphs
 *
 * @example
 * stripWrapperTags('<p>Hello world</p>') // 'Hello world'
 * stripWrapperTags('<p>Line 1</p>\n<p>Line 2</p>') // 'Line 1\nLine 2'
 */
export function stripWrapperTags(html: string): string {
  return html
    .replace(/<p>/gi, "")
    .replace(/<\/p>/gi, "\n")
    .replace(/\n+/g, "\n")
    .trim();
}

/**
 * Sanitize WordPress HTML content for safe rendering
 *
 * WHY: While WordPress sanitizes on save, we add defense-in-depth
 * by stripping potentially dangerous tags and normalizing output.
 *
 * NOTE: For production, consider using a robust HTML sanitizer like DOMPurify
 * or integrate with Next.js security headers.
 *
 * @param html - Raw HTML from WordPress
 * @returns Sanitized HTML safe for dangerouslySetInnerHTML
 */
export function sanitizeContent(html: string): string {
  // Remove script tags
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove event handlers (onclick, onerror, etc.)
  clean = clean.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "");

  // Remove javascript: protocol from links
  clean = clean.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');

  // Normalize whitespace
  clean = clean.replace(/\s+/g, " ").trim();

  return clean;
}

/**
 * Extract plain text from HTML (for meta descriptions, search previews)
 *
 * @param html - HTML content
 * @returns Plain text without any HTML tags
 */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Truncate HTML content to specified length preserving word boundaries
 *
 * @param html - HTML content
 * @param maxLength - Maximum character length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateHtml(html: string, maxLength: number = 160): string {
  const plainText = htmlToPlainText(html);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Truncate at word boundary
  const truncated = plainText.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

// ============================================================================
// Media Transformation
// ============================================================================

/**
 * Extract featured image from WordPress project
 *
 * Transforms WPMedia into FeaturedImage with Next.js Image-ready URLs
 * and responsive size variants.
 *
 * @param wpMedia - WordPress media object from _embedded
 * @returns Optimized featured image object or undefined
 */
export function extractFeaturedImage(
  wpMedia?: WPMedia
): FeaturedImage | undefined {
  if (!wpMedia) {
    return undefined;
  }

  const { media_details, source_url, alt_text, caption } = wpMedia;

  return {
    id: wpMedia.id,
    url: source_url,
    alt: alt_text || "",
    width: media_details.width,
    height: media_details.height,
    caption: caption?.rendered ? stripWrapperTags(caption.rendered) : undefined,
    sizes: {
      thumbnail: media_details.sizes?.thumbnail?.source_url,
      medium: media_details.sizes?.medium?.source_url,
      large: media_details.sizes?.large?.source_url,
    },
  };
}

// ============================================================================
// Taxonomy Transformation
// ============================================================================

/**
 * Transform WordPress term to simple term object
 *
 * @param wpTerm - WordPress taxonomy term
 * @returns Simplified term with only essential fields
 */
export function transformTerm(wpTerm: WPTerm): SimpleTerm {
  return {
    id: wpTerm.id,
    name: wpTerm.name,
    slug: wpTerm.slug,
  };
}

/**
 * Extract taxonomy terms from embedded data by index
 *
 * WHY: WordPress embeds terms in a 2D array where each sub-array
 * corresponds to a taxonomy. The order matches the _links order:
 * [0] = project_category
 * [1] = project_village
 * [2] = project_year
 * [3] = project_status
 * [4] = project_scheme
 *
 * @param embeddedTerms - _embedded["wp:term"] array
 * @param index - Taxonomy index
 * @returns Array of simple terms
 */
function extractTermsByIndex(
  embeddedTerms: WPTerm[][] | undefined,
  index: number
): SimpleTerm[] {
  if (!embeddedTerms || !embeddedTerms[index]) {
    return [];
  }

  return embeddedTerms[index].map(transformTerm);
}

// ============================================================================
// Project Transformation
// ============================================================================

/**
 * Transform WordPress project to clean frontend format
 *
 * This is the primary transformation function that converts the verbose
 * WordPress REST API response into a simple, type-safe Project object.
 *
 * Handles:
 * - Extracting rendered HTML from wrapper objects
 * - Sanitizing content for safe rendering
 * - Denormalizing taxonomy relationships
 * - Preparing featured images for Next.js Image component
 * - Stripping WordPress-specific metadata
 *
 * @param wpProject - Raw WordPress project from API
 * @returns Clean, frontend-ready Project object
 *
 * @example
 * ```ts
 * const wpProject = await fetch('/.../wp-json/wp/v2/project/123').then(r => r.json());
 * const project = transformProject(wpProject);
 * // project.title is now a string, not { rendered: string }
 * // project.categories is now SimpleTerm[], not number[]
 * ```
 */
export function transformProject(wpProject: WPProject): Project {
  const embedded = wpProject._embedded;

  // Extract featured media (first item in wp:featuredmedia array)
  const featuredMedia = embedded?.["wp:featuredmedia"]?.[0];
  const featuredImage = extractFeaturedImage(featuredMedia);

  // Extract taxonomy terms from embedded data
  const embeddedTerms = embedded?.["wp:term"];

  // WordPress embeds terms in order matching _links.wp:term
  // Based on actual API response structure:
  // [0] = project_category
  // [1] = project_village
  // [2] = project_year
  // [3] = project_status
  // [4] = project_scheme
  const categories = extractTermsByIndex(embeddedTerms, 0);
  const villages = extractTermsByIndex(embeddedTerms, 1);
  const years = extractTermsByIndex(embeddedTerms, 2);
  const statuses = extractTermsByIndex(embeddedTerms, 3);
  const schemes = extractTermsByIndex(embeddedTerms, 4);

  return {
    id: wpProject.id,
    slug: wpProject.slug,
    title: wpProject.title.rendered,
    content: sanitizeContent(wpProject.content.rendered),
    excerpt: stripWrapperTags(wpProject.excerpt.rendered),
    date: wpProject.date,
    modified: wpProject.modified,
    link: wpProject.link,
    featuredImage,
    categories,
    villages,
    years,
    statuses,
    schemes,
  };
}

// ============================================================================
// Batch Transformation
// ============================================================================

/**
 * Transform multiple WordPress projects
 *
 * @param wpProjects - Array of WordPress projects
 * @returns Array of transformed projects
 */
export function transformProjects(wpProjects: WPProject[]): Project[] {
  return wpProjects.map(transformProject);
}

// ============================================================================
// URL Utilities
// ============================================================================

/**
 * Extract slug from WordPress permalink
 *
 * WHY: WordPress returns full URLs in the `link` field.
 * We often need just the slug for Next.js routing.
 *
 * @param link - Full WordPress URL
 * @returns Slug (last path segment)
 *
 * @example
 * extractSlugFromLink('http://localhost:8888/sabarajendran/project/my-project/')
 * // Returns: 'my-project'
 */
export function extractSlugFromLink(link: string): string {
  const url = new URL(link);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  return pathSegments[pathSegments.length - 1] || "";
}

/**
 * Convert WordPress URL to Next.js route
 *
 * @param wpLink - WordPress permalink
 * @returns Next.js route path
 *
 * @example
 * convertToNextRoute('http://localhost:8888/sabarajendran/project/my-project/')
 * // Returns: '/projects/my-project'
 */
export function convertToNextRoute(wpLink: string): string {
  const slug = extractSlugFromLink(wpLink);
  return `/projects/${slug}`;
}

// ============================================================================
// Meta Data Generation
// ============================================================================

/**
 * Generate Next.js metadata from project
 *
 * Creates SEO-friendly metadata for project detail pages.
 *
 * @param project - Transformed project
 * @returns Metadata object for Next.js
 */
export function generateProjectMetadata(project: Project) {
  return {
    title: project.title,
    description: truncateHtml(project.excerpt, 160),
    openGraph: {
      title: project.title,
      description: truncateHtml(project.excerpt, 160),
      type: "article" as const,
      publishedTime: project.date,
      modifiedTime: project.modified,
      images: project.featuredImage
        ? [
          {
            url: project.featuredImage.url,
            width: project.featuredImage.width,
            height: project.featuredImage.height,
            alt: project.featuredImage.alt,
          },
        ]
        : undefined,
    },
  };
}
