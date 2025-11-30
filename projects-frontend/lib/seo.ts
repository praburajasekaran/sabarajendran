/**
 * SEO Utilities
 * Helper functions for generating SEO-friendly metadata, structured data, and Open Graph tags
 */

import { Metadata } from "next";
import { Project } from "./types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName =
  process.env.NEXT_PUBLIC_SITE_NAME || "Saba Rajendran - Projects Showcase";

/**
 * Generate project-specific metadata
 */
export function generateProjectMetadata(project: Project): Metadata {
  const title = project.title;
  const description =
    project.excerpt || "View project details and progress";
  const imageUrl = project.featuredImage?.url || `${siteUrl}/og-image.png`;
  const url = `${siteUrl}/projects/${project.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_IN",
      type: "article",
      publishedTime: project.date,
      modifiedTime: project.modified,
      authors: ["Saba Rajendran"],
      tags: [
        ...(project.categories?.map(c => c.name) || []),
        ...(project.statuses?.map(s => s.name) || []),
        ...(project.villages?.map(v => v.name) || []),
        ...(project.years?.map(y => y.name) || []),
      ].filter(Boolean) as string[],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    keywords: [
      ...(project.categories?.map(c => c.name) || []),
      ...(project.statuses?.map(s => s.name) || []),
      ...(project.villages?.map(v => v.name) || []),
      "constituency project",
      "development initiative",
      "public welfare",
      siteName,
    ].filter(Boolean) as string[],
  };
}

/**
 * Generate JSON-LD structured data for a project
 * Helps search engines understand the project content
 */
export function generateProjectStructuredData(project: Project & { description?: string }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: project.title,
    description: project.description || project.excerpt || "",
    url: `${siteUrl}/projects/${project.slug}`,
    image: project.featuredImage?.url,
    provider: {
      "@type": "GovernmentOrganization",
      name: siteName,
      url: siteUrl,
    },
    areaServed: {
      "@type": "Place",
      name: project.villages?.[0]?.name || "Constituency",
    },
    ...(project.date && {
      datePublished: project.date,
    }),
    ...(project.modified && {
      dateModified: project.modified,
    }),
    ...(project.statuses?.[0] && {
      serviceType: project.statuses[0].name,
    }),
    ...(project.categories?.[0] && {
      category: project.categories[0].name,
    }),
  };

  return JSON.stringify(structuredData);
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };

  return JSON.stringify(structuredData);
}

/**
 * Generate organization structured data
 */
export function generateOrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      "Constituency development projects and initiatives",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Public Services",
    },
  };

  return JSON.stringify(structuredData);
}

/**
 * Generate ItemList structured data for project listings
 */
export function generateProjectListStructuredData(projects: Project[]) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/projects/${project.slug}`,
      name: project.title,
    })),
  };

  return JSON.stringify(structuredData);
}

/**
 * Generate meta description from content
 * Truncates to optimal length for SEO (150-160 characters)
 */
export function generateMetaDescription(
  content: string,
  maxLength = 160
): string {
  const stripped = content.replace(/<[^>]*>/g, "").trim();
  if (stripped.length <= maxLength) return stripped;

  return stripped.substring(0, maxLength - 3).trim() + "...";
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Extract keywords from text
 */
export function extractKeywords(
  text: string,
  maxKeywords = 10
): string[] {
  const commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "as",
    "is",
    "was",
    "are",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "should",
    "could",
    "may",
    "might",
    "must",
    "can",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !commonWords.has(word));

  const wordFrequency = new Map<string, number>();
  words.forEach((word) => {
    wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
  });

  return Array.from(wordFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Generate alt text for images based on context
 */
export function generateImageAlt(
  projectTitle: string,
  imageContext?: string
): string {
  if (imageContext) {
    return `${projectTitle} - ${imageContext}`;
  }
  return `Image for ${projectTitle} project`;
}

/**
 * Validate and format URL
 */
export function formatUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${cleanPath}`;
}
