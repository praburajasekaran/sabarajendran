import Link from "next/link";
import { ArrowRight, Building2, Users, MapPin, Calendar } from "lucide-react";
import { getProjectsCount } from "@/lib/wordpress";

export default async function HomePage() {
  const projectsCount = await getProjectsCount();

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Building a Better Future
              <span className="block text-secondary-400 mt-2">
                Together
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
              Discover the development projects and initiatives transforming our constituency
              through dedicated service and community partnership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                View All Projects
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#stats"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 border border-white/20"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-primary-900 mb-2">
                {projectsCount}+
              </div>
              <div className="text-gray-600 font-medium">
                Active Projects
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 text-secondary-600 rounded-full mb-4">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-primary-900 mb-2">
                500K+
              </div>
              <div className="text-gray-600 font-medium">
                People Impacted
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 text-accent-600 rounded-full mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-primary-900 mb-2">
                50+
              </div>
              <div className="text-gray-600 font-medium">
                Villages Covered
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-primary-900 mb-2">
                5+
              </div>
              <div className="text-gray-600 font-medium">
                Years of Service
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Areas */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Key Focus Areas
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our projects span multiple sectors to ensure holistic development
              of the constituency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-3">
                Infrastructure
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Building essential infrastructure including roads, bridges, and
                community centers to improve connectivity and quality of life.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent-100 text-accent-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-3">
                Education & Health
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Enhancing educational facilities and healthcare infrastructure
                to ensure access to quality services for all citizens.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-3">
                Rural Development
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Empowering rural communities through sustainable development
                initiatives and improved amenities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Explore Our Projects
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Browse through our comprehensive project portfolio and see the
            impact of our development initiatives.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            View All Projects
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
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
