/**
 * XML Sitemap Generation
 * Automatically generates sitemap for search engines
 * Includes all static pages and dynamic project pages
 */

import { MetadataRoute } from "next";
import { getProjects } from "@/lib/wordpress";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch all projects for dynamic routes
    const { data: projects } = await getProjects();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 1,
      },
      {
        url: `${siteUrl}/projects`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${siteUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${siteUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      },
    ];

    // Dynamic project pages
    const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: project.modified ? new Date(project.modified) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticPages, ...projectPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return static pages only if dynamic content fails
    return [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 1,
      },
      {
        url: `${siteUrl}/projects`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
    ];
  }
}
