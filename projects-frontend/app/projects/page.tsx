import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getProjects, getAllProjects, getAllTaxonomies } from "@/lib/wordpress";
import { ProjectsClient } from "@/components/projects/projects-client";

export const metadata: Metadata = {
  title: "Projects | Saba Rajendran",
  description: "Browse all constituency development projects and initiatives with advanced filtering",
};

/**
 * Projects Page - Hybrid Server/Client Component
 *
 * Server: Fetches ALL projects and taxonomies for client-side filtering
 * Client: Handles real-time filtering, search, and URL state management
 *
 * WHY: Fetch all data once on the server (fast, cached), then filter on client (instant results).
 * This provides the best UX - no page reloads, shareable URLs, and blazing fast filtering.
 */
export default async function ProjectsPage() {
  // Fetch ALL projects (no pagination) and taxonomies in parallel
  // Client-side filtering will handle the display logic
  const [projectsResponse, taxonomies] = await Promise.all([
    getAllProjects({
      orderBy: "date",
      order: "desc",
    }),
    getAllTaxonomies(),
  ]);

  const { data: projects, total } = projectsResponse;

  return (
    <main className="flex-1 min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-900 text-white border-b border-primary-800">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-100 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            Development Projects
          </h1>
          <p className="text-primary-100 text-lg">
            {total > 0
              ? `Transforming our constituency through ${total} dedicated projects`
              : "Transforming our constituency through dedicated service"}
          </p>
        </div>
      </header>

      {/* Main Content with Client-Side Filtering */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            }
          >
            <ProjectsClient projects={projects} taxonomies={taxonomies} />
          </Suspense>
        </div>
      </section>

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
  );
}
