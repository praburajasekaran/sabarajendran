import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Users, CheckCircle, Clock, PieChart, ChevronRight, Building2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ProjectCard } from '../components/ProjectCard';
import { SEO } from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import { wpService } from '../services/wpService';
import { Project, ProjectStatus } from '../types';
import { generateOrganizationSchema, generatePersonSchema } from '../utils/seo';

export const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get language prefix for all links
  const langPrefix = language === 'ta' ? '/ta' : '';

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const data = await wpService.getAllProjects();
      setProjects(data);
      setIsLoading(false);
    };
    fetchProjects();

    // Subscribe to background updates
    const unsubscribe = wpService.onUpdate((freshData) => {
      console.log('[Home] Received fresh data from background fetch');
      setProjects(freshData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const completedCount = projects.filter(p => p.status === ProjectStatus.COMPLETED).length;
  const ongoingCount = projects.filter(p => p.status === ProjectStatus.ONGOING).length;

  // Calculate total budget dynamically
  const totalBudgetVal = projects.reduce((acc, curr) => acc + (curr.rawBudget || 0), 0);
  let totalBudget = "₹0";
  if (totalBudgetVal >= 10000000) {
    totalBudget = `₹${(totalBudgetVal / 10000000).toFixed(1)} ${t.home.currency.cr}`;
  } else if (totalBudgetVal >= 100000) {
    totalBudget = `₹${(totalBudgetVal / 100000).toFixed(1)} ${t.home.currency.l}`;
  }

  // Get unique villages count
  const uniqueVillages = new Set(projects.map(p => p.village)).size;

  // Calculate block counts
  const blockCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'Panruti': 0,
      'NLC': 0,
      'Kurinjipadi': 0
    };
    projects.forEach(p => {
      if (p.block && counts.hasOwnProperty(p.block)) {
        counts[p.block]++;
      }
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [projects]);

  const recentProjects = projects.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <SEO
        title="Home"
        description="Official website of Saba Rajendran, MLA of Neyveli Constituency. Explore development projects, news, and updates."
      />
      <Helmet>
        {/* Organization Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(generateOrganizationSchema())}
        </script>
        {/* Person Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(generatePersonSchema())}
        </script>
      </Helmet>

      {/* Hero Section - Editorial Split-Screen */}
      <section className="relative bg-neutral-900 text-white overflow-hidden min-h-[700px] flex items-stretch">
        {/* Full-width Hero Image Background */}


        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-5 kolam-texture"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10 w-full">
          <div className="flex flex-col items-center text-center gap-12 lg:gap-16">

            {/* Top Content - Editorial Headline */}
            <div className="w-full max-w-4xl flex flex-col items-center justify-center space-y-8">
              {/* Small eyebrow text */}
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
                <span className="text-sm font-mono uppercase tracking-wider text-accent-300">
                  {t.home.heroSubtitle}
                </span>
                <div className="h-px w-12 bg-gradient-to-r from-secondary-500 to-primary-500"></div>
              </div>

              {/* Large serif headline */}
              <h1 className="font-serif text-display-lg md:text-display-lg lg:text-[5rem] font-bold leading-[0.95] tracking-tight">
                {t.home.heroPrefix} <span className="gradient-text">{t.home.heroHighlight}</span>{t.home.heroSuffix}
              </h1>

              <p className="text-body-lg text-neutral-300 max-w-2xl leading-relaxed">
                {t.home.heroDesc}
              </p>

              {/* MLA Photo - Circular, smaller */}
              <div className="flex items-center gap-4 pt-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-accent-500 shadow-lg">
                  <img
                    src="/assets/images/saba_rajendran.webp"
                    alt="Saba Rajendran"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-lg">{t.home.mlaName}</p>
                  <p className="text-neutral-400 text-sm">{t.home.mlaRole}</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button
                  onClick={() => navigate(`${langPrefix}/projects`)}
                  className="px-8 py-4 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 animate-gentle-pulse"
                >
                  {t.home.viewProjects}
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate(`${langPrefix}/about`)}
                  className="px-8 py-4 border-2 border-neutral-600 text-neutral-200 rounded-lg font-semibold hover:border-white hover:text-white hover:bg-white/5 transition-all flex items-center justify-center link-expand"
                >
                  {t.home.contactOffice}
                </button>
              </div>
            </div>

            {/* Bottom Content - Video Placeholder */}
            <div className="w-full max-w-5xl relative group cursor-pointer mt-8">
              <div className="relative w-full aspect-video bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl border border-neutral-700/50 group-hover:border-primary-500/50 transition-all duration-500">
                {/* Background Gradient/Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('/assets/pattern.svg')] bg-repeat opacity-10"></div>

                {/* Play Button Container */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Pulse Effect */}
                    <div className="absolute inset-0 bg-primary-500 rounded-full blur-xl opacity-20 animate-pulse"></div>

                    {/* Button */}
                    <div className="relative w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-primary-500 transition-colors">
                        <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Label */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-xs font-medium text-white/80">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    Watch Highlights
                  </div>
                </div>
              </div>

              {/* Decorative Elements behind */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-[2rem] blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </div>
        </div>

        {/* Curved divider at bottom */}
        <div className="curved-divider">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="rotate-180">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f9f7f4"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section - Editorial Horizontal Data Bar */}
      <section className="py-20 bg-accent-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border-2 border-accent-100 overflow-hidden">
            {/* Stats Bar */}
            <div className="p-8 md:p-12">
              {isLoading ? (
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="flex-1 animate-pulse">
                      <div className="h-16 bg-neutral-200 rounded w-24 mb-3"></div>
                      <div className="h-4 bg-neutral-200 rounded w-32"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12">
                    {/* Completed Projects */}
                    <div className="flex-1 border-b md:border-b-0 md:border-r border-accent-100 pb-6 md:pb-0 md:pr-8">
                      <div className="font-mono text-5xl md:text-6xl font-bold text-secondary-600 mb-2 count-up">
                        {completedCount}
                      </div>
                      <div className="text-xs md:text-sm font-medium text-neutral-600 uppercase tracking-wider">
                        {t.home.completedProjects}
                      </div>
                    </div>

                    {/* Ongoing Projects */}
                    <div className="flex-1 border-b md:border-b-0 md:border-r border-accent-100 pb-6 md:pb-0 md:pr-8">
                      <div className="font-mono text-5xl md:text-6xl font-bold text-primary-600 mb-2 count-up">
                        {ongoingCount}
                      </div>
                      <div className="text-xs md:text-sm font-medium text-neutral-600 uppercase tracking-wider">
                        {t.home.ongoingWorks}
                      </div>
                    </div>

                    {/* Villages Covered */}
                    <div className="flex-1 border-b md:border-b-0 md:border-r border-accent-100 pb-6 md:pb-0 md:pr-8">
                      <div className="font-mono text-5xl md:text-6xl font-bold text-accent-600 mb-2 count-up">
                        {uniqueVillages}<span className="text-3xl">+</span>
                      </div>
                      <div className="text-xs md:text-sm font-medium text-neutral-600 uppercase tracking-wider">
                        {t.home.villagesCovered}
                      </div>
                    </div>

                    {/* Funds Utilized */}
                    <div className="flex-1">
                      <div className="font-mono text-4xl md:text-5xl font-bold text-neutral-900 mb-2 count-up">
                        {totalBudget}
                      </div>
                      <div className="text-xs md:text-sm font-medium text-neutral-600 uppercase tracking-wider">
                        {t.home.fundsUtilized}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar Visualization */}
                  <div className="mt-12 pt-8 border-t border-accent-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-neutral-700">
                        {t.home.completionRate}
                      </span>
                      <span className="text-sm font-mono font-bold text-secondary-600">
                        {completedCount + ongoingCount > 0
                          ? Math.round((completedCount / (completedCount + ongoingCount)) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: completedCount + ongoingCount > 0
                            ? `${(completedCount / (completedCount + ongoingCount)) * 100}%`
                            : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Block Cards Section - Editorial Style */}
      <section className="py-20 bg-white border-b border-accent-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Editorial Section Header */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
              <span className="text-sm font-mono uppercase tracking-wider text-accent-600">
                Constituency Coverage
              </span>
            </div>
            <h2 className="font-serif text-h1 font-bold text-neutral-900 mb-4">
              {t.home.blockSectionTitle}
            </h2>
            <p className="text-body-lg text-neutral-600 max-w-2xl">
              {t.home.blockSectionDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blockCounts.map(({ name, count }) => (
              <div
                key={name}
                onClick={() => navigate(`${langPrefix}/projects?block=${encodeURIComponent(name)}`)}
                className="group relative p-8 bg-white border-2 border-accent-200 rounded-2xl hover:border-primary-500 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-xl bg-accent-100 text-accent-700 group-hover:bg-primary-600 group-hover:text-white transition-all">
                      <Building2 size={28} />
                    </div>
                    <ArrowRight className="text-accent-400 group-hover:text-primary-600 group-hover:translate-x-2 transition-all" size={24} />
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-3 group-hover:text-primary-700 transition-colors">
                    {name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-mono text-5xl font-bold text-primary-600">{count}</span>
                    <span className="text-neutral-600 font-medium">{t.home.projectsCount}</span>
                  </div>

                  <div className="pt-4 border-t border-accent-100">
                    <span className="text-sm text-primary-600 font-semibold group-hover:text-primary-700 flex items-center gap-1 link-expand relative pb-1">
                      {t.home.viewBlockProjects}
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects - Asymmetric Editorial Layout */}
      <section className="py-20 bg-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Editorial Section Header */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
              <span className="text-sm font-mono uppercase tracking-wider text-accent-600">
                Recent Development
              </span>
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
              <div className="max-w-2xl">
                <h2 className="font-serif text-h1 font-bold text-neutral-900 mb-4 leading-tight">
                  {t.home.recentDev}
                </h2>
                <p className="text-body-lg text-neutral-600 leading-relaxed">
                  {t.home.recentDevDesc}
                </p>
              </div>
              <button
                onClick={() => navigate(`${langPrefix}/projects`)}
                className="hidden lg:flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors group link-expand relative pb-1"
              >
                {t.home.viewAll}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Asymmetric Grid Layout */}
          {recentProjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Featured Project - Large (2/3 width) */}
              {recentProjects[0] && (
                <div className="lg:col-span-2 stagger-item">
                  <ProjectCard project={recentProjects[0]} />
                </div>
              )}

              {/* Secondary Projects - Right Column */}
              <div className="lg:col-span-1 flex flex-col gap-8">
                {recentProjects.slice(1, 3).map((project, index) => (
                  <div key={project.id} className="stagger-item">
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500">No projects available yet.</p>
            </div>
          )}

          {/* View All Link - Mobile */}
          <div className="mt-12 text-center lg:hidden">
            <button
              onClick={() => navigate(`${langPrefix}/projects`)}
              className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors link-expand relative pb-1"
            >
              {t.home.viewAll}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Quote/Vision Section - Editorial Style */}
      <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
        {/* Subtle Kolam Texture Overlay */}
        <div className="absolute inset-0 kolam-texture opacity-[0.03] pointer-events-none"></div>

        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/90 via-neutral-900/95 to-neutral-900/90"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Editorial Quote Icon */}
          <div className="mb-8 text-primary-500 opacity-40">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
            </svg>
          </div>

          {/* Quote Text - Serif Typography */}
          <blockquote className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium leading-tight mb-10 text-neutral-100">
            "{t.home.quote}"
          </blockquote>

          {/* Attribution */}
          <cite className="not-italic flex flex-col items-center">
            <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-6"></div>
            <span className="font-bold text-xl text-white tracking-wide">{t.home.mlaName}</span>
            <span className="text-neutral-400 mt-1 text-sm font-medium">{t.home.role}</span>
          </cite>
        </div>
      </section>
    </div>
  );
};