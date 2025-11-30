import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { ArrowLeft, MapPin, Calendar, CheckCircle, Tag } from "lucide-react";
import { getProject, generateProjectMetadata } from "@/lib/wordpress";
import { generateProjectStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo";
import type { Metadata } from "next";

/**
 * Generate metadata for project detail page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return generateProjectMetadata(project);
}

/**
 * Project Detail Page
 *
 * Displays full project information with metadata, content, and related taxonomies.
 */
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  // Generate structured data for SEO
  const projectStructuredData = generateProjectStructuredData({
    ...project,
    description: project.excerpt || "",
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
    { name: project.title, url: `/projects/${project.slug}` },
  ]);

  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="project-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: projectStructuredData }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbData }}
      />

      <main className="flex-1">
        {/* Header */}
        <header className="bg-primary-900 text-white border-b border-primary-800">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-primary-100 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
        </div>
      </header>

      {/* Project Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {project.featuredImage && (
              <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={project.featuredImage.url}
                  alt={project.featuredImage.alt || project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
              {/* Village */}
              {project.villages.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="w-5 h-5 text-primary-500" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <div className="space-y-1">
                    {project.villages.map((village) => (
                      <p key={village.id} className="text-gray-900 font-semibold">
                        {village.name}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Year */}
              {project.years.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="w-5 h-5 text-primary-500" />
                    <span className="text-sm font-medium">Year</span>
                  </div>
                  <div className="space-y-1">
                    {project.years.map((year) => (
                      <p key={year.id} className="text-gray-900 font-semibold">
                        {year.name}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              {project.statuses.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <div className="space-y-1">
                    {project.statuses.map((status) => (
                      <p key={status.id} className="text-gray-900 font-semibold">
                        {status.name}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Scheme */}
              {project.schemes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Tag className="w-5 h-5 text-primary-500" />
                    <span className="text-sm font-medium">Scheme</span>
                  </div>
                  <div className="space-y-1">
                    {project.schemes.map((scheme) => (
                      <p key={scheme.id} className="text-gray-900 font-semibold">
                        {scheme.name}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Categories */}
            {project.categories.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Project Categories
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.categories.map((category) => (
                    <span
                      key={category.id}
                      className="inline-block px-4 py-2 bg-primary-50 text-primary-700 text-sm font-medium rounded-lg"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div
                dangerouslySetInnerHTML={{ __html: project.content }}
                className="text-gray-700 leading-relaxed"
              />
            </div>

            {/* Last Updated */}
            <div className="text-sm text-gray-500 mb-8">
              Last updated:{" "}
              {new Date(project.modified).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            {/* Back to Projects Button */}
            <div className="border-t border-gray-200 pt-8">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to All Projects
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Saba Rajendran. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Serving the constituency with dedication and transparency
            </p>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
}
