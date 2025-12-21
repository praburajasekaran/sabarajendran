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
import { VideoModal } from '../components/VideoModal';
import { SocialFeeds } from '../components/SocialFeeds';
import { KeyProjectsCarousel } from '../components/KeyProjectsCarousel';
import { WelfareSchemes } from '../components/WelfareSchemes';


export const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(false);

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
      'Neyveli': 0,
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
        description="Official website of Saba. Rajendran, MLA of Neyveli Constituency. Explore development projects, news, and updates."
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

      {/* Hero Section - Political Mass Appeal */}
      <section className="relative bg-secondary-900 text-white overflow-hidden min-h-[800px] md:min-h-[700px] flex items-center border-b-8 border-primary-600">
        {/* Background Image - Responsive */}
        <div className="absolute inset-0 z-0">
          {/* Mobile Background */}
          <img
            src="/assets/images/hero-background-mobile.jpg"
            alt="Hero Background Mobile"
            className="md:hidden w-full h-full object-cover object-top"
          />
          {/* Desktop Background */}
          <img
            src="/assets/images/hero-background.jpg"
            alt="Hero Background Desktop"
            className="hidden md:block w-full h-full object-cover object-top"
          />
        </div>

        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 relative z-10 w-full">
          <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-start gap-8 lg:gap-12">

            {/* Content Left */}
            <div className="w-full max-w-2xl flex flex-col items-start space-y-4 md:space-y-6 animate-zip-in">
              {/* Party Strip */}
              <div className="flex items-center gap-3 bg-neutral-900 p-2 pr-6 rounded-r-full border-l-4 border-primary-500 shadow-lg">
                <div className="h-3 w-3 rounded-full bg-primary-500 animate-pulse"></div>
                <span className="text-sm font-bold uppercase tracking-widest text-accent-400">
                  {t.home.heroSubtitle}
                </span>
              </div>

              {/* Massive Headline */}
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-none tracking-tight text-white drop-shadow-lg">
                {t.home.heroPrefix} <span className="text-primary-500 text-stroke-white">{t.home.heroHighlight}</span>{t.home.heroSuffix}
              </h1>

              <p className="text-lg md:text-xl font-medium text-neutral-200 max-w-xl leading-relaxed border-l-4 border-accent-500 pl-6">
                {t.home.heroDesc}
              </p>

              {/* CTA Buttons - Solid & Blocky */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                <button
                  onClick={() => navigate(`${langPrefix}/projects`)}
                  className="btn-political-primary animate-heartbeat px-6 py-3 text-lg flex items-center justify-center gap-3 min-w-[200px]"
                >
                  {t.home.viewProjects}
                  <ArrowRight size={20} strokeWidth={3} className="animate-attention-arrow" />
                </button>
                <button
                  onClick={() => navigate(`${langPrefix}/about`)}
                  className="px-6 py-3 border-2 border-white text-white rounded-none font-bold text-base hover:bg-white hover:text-black transition-all flex items-center justify-center uppercase tracking-wide min-w-[200px]"
                >
                  {t.home.contactOffice}
                </button>
              </div>

              {/* Play Button - Watch Welcome Video */}
              <button
                onClick={() => setShowWelcomeVideo(true)}
                className="flex items-center gap-3 px-4 py-3 bg-transparent border-2 border-accent-400 text-accent-400 hover:bg-accent-400 hover:text-black transition-all font-bold uppercase tracking-wide group"
                aria-label="Play Welcome Video"
              >
                <div className="relative flex items-center justify-center w-10 h-10 bg-accent-400 rounded-full text-black group-hover:bg-black group-hover:text-accent-400 transition-all">
                  <div className="absolute inset-0 rounded-full bg-accent-400 animate-ping opacity-20"></div>
                  <Play size={20} fill="currentColor" className="ml-0.5 relative z-10" />
                </div>
                <span className="text-sm">Watch Video</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section - Blocky Data Grid */}
      <section className="py-20 bg-secondary-50 relative border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hard Shadow Card */}
          <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] p-10 md:p-14">
            {isLoading ? (
              <div className="flex flex-col md:flex-row justify-between gap-8">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex-1 animate-pulse">
                    <div className="h-16 bg-neutral-200 w-24 mb-3"></div>
                    <div className="h-4 bg-neutral-200 w-32"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row justify-between gap-12 text-center md:text-left">
                  {/* Completed Projects */}
                  <div className="flex-1">
                    <div className="font-display text-6xl md:text-7xl font-extrabold text-secondary-900 mb-2 count-up">
                      {completedCount}
                    </div>
                    <div className="text-sm font-bold text-primary-600 uppercase tracking-wider bg-primary-50 inline-block px-2 py-1">
                      {t.home.completedProjects}
                    </div>
                  </div>

                  {/* Ongoing Projects */}
                  <div className="flex-1">
                    <div className="font-display text-6xl md:text-7xl font-extrabold text-primary-600 mb-2 count-up">
                      {ongoingCount}
                    </div>
                    <div className="text-sm font-bold text-secondary-900 uppercase tracking-wider bg-secondary-100 inline-block px-2 py-1">
                      {t.home.ongoingWorks}
                    </div>
                  </div>

                  {/* Villages Covered */}
                  <div className="flex-1">
                    <div className="font-display text-6xl md:text-7xl font-extrabold text-accent-600 mb-2 count-up">
                      {uniqueVillages}<span className="text-4xl">+</span>
                    </div>
                    <div className="text-sm font-bold text-secondary-900 uppercase tracking-wider bg-accent-50 inline-block px-2 py-1">
                      {t.home.villagesCovered}
                    </div>
                  </div>

                  {/* Funds Utilized */}
                  <div className="flex-1">
                    <div className="font-display text-5xl md:text-6xl font-extrabold text-black mb-2 count-up">
                      {totalBudget}
                    </div>
                    <div className="text-sm font-bold text-secondary-900 uppercase tracking-wider bg-neutral-100 inline-block px-2 py-1">
                      {t.home.fundsUtilized}
                    </div>
                  </div>
                </div>

                {/* Progress Bar Visualization - Thick & Bold */}
                <div className="mt-14 pt-8 border-t-2 border-dashed border-neutral-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-black uppercase">
                      {t.home.completionRate}
                    </span>
                    <span className="text-2xl font-mono font-bold text-primary-600">
                      {completedCount + ongoingCount > 0
                        ? Math.round((completedCount / (completedCount + ongoingCount)) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="progress-bar h-6 bg-neutral-200 border-2 border-black">
                    <div
                      className="progress-bar-fill bg-primary-600"
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
      </section>

      {/* Key Projects Carousel - Major Constituency-Wide Projects */}
      <KeyProjectsCarousel />

      {/* Welfare Schemes Section - High Impact Stats */}
      <WelfareSchemes />


      {/* Block Cards Section - Political Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16 text-center">
            <span className="bg-accent-400 text-black font-bold uppercase tracking-widest px-4 py-1 mb-4 inline-block transform -skew-x-12">
              {t.home.constituencyCoverage}
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-black mt-4 uppercase">
              {t.home.blockSectionTitle}
            </h2>
            <div className="w-24 h-2 bg-primary-600 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blockCounts.map(({ name, count }) => (
              <div
                key={name}
                onClick={() => navigate(`${langPrefix}/projects?block=${encodeURIComponent(name)}`)}
                className="group relative p-8 bg-neutral-50 border-2 border-neutral-200 hover:border-black hover:bg-white transition-all duration-300 cursor-pointer card-sharp"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-display text-3xl font-extrabold text-black uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                        {(() => {
                          const displayName = name;
                          // Simple block name translations
                          const blockTranslations: Record<string, string> = {
                            'Neyveli': 'நெய்வேலி',
                            'Panruti': 'பண்ருட்டி',
                            'Kurinjipadi': 'குறிஞ்சிப்பாடி'
                          };
                          return language === 'ta' ? (blockTranslations[displayName] || displayName) : displayName;
                        })()}
                      </h3>
                      <div className="p-3 bg-white border-2 border-black text-black group-hover:bg-primary-600 group-hover:text-white transition-colors shadow-[4px_4px_0_0_#000]">
                        <Building2 size={24} />
                      </div>
                    </div>

                    <div className="mb-6">
                      <span className="font-display text-6xl font-black text-secondary-900">{count}</span>
                      <p className="text-secondary-600 font-bold uppercase text-sm mt-1">{t.home.projectsCount}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t-2 border-neutral-200 group-hover:border-black transition-colors">
                    <span className="text-base font-bold text-black group-hover:text-primary-600 flex items-center gap-2 uppercase tracking-wide">
                      {t.home.viewBlockProjects}
                      <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform stroke-[3]" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects - Bold Layout */}
      <section className="py-24 bg-neutral-100 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div>
              <span className="bg-black text-white font-bold uppercase tracking-widest px-4 py-1 mb-4 inline-block transform -skew-x-12">
                Recent Development
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-black mt-4 uppercase max-w-2xl">
                {t.home.recentDev}
              </h2>
            </div>

            <button
              onClick={() => navigate(`${langPrefix}/projects`)}
              className="hidden lg:flex items-center gap-2 px-6 py-3 bg-white border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-all shadow-[4px_4px_0_0_#000]"
            >
              {t.home.viewAll}
              <ArrowRight size={20} strokeWidth={3} />
            </button>
          </div>

          {/* Grid Layout */}
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
            <div className="text-center py-12 border-2 border-dashed border-neutral-300">
              <p className="text-neutral-500 font-bold">No projects available yet.</p>
            </div>
          )}

          {/* View All Link - Mobile */}
          <div className="mt-12 text-center lg:hidden">
            <button
              onClick={() => navigate(`${langPrefix}/projects`)}
              className="px-6 py-3 bg-white border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-all shadow-[4px_4px_0_0_#000]"
            >
              {t.home.viewAll}
            </button>
          </div>

        </div>
      </section>

      {/* Social Media Feeds */}
      <SocialFeeds />

      {/* Quote/Vision Section - Political Vision */}
      <section className="py-24 bg-secondary-900 text-white relative overflow-hidden text-center border-t-8 border-accent-500">
        {/* Sun Rays Texture */}
        <div className="absolute inset-0 sun-rays-texture opacity-10 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-10 text-primary-500 opacity-80">
            <span className="text-[8rem] leading-none font-serif font-bold">"</span>
          </div>

          <blockquote className="text-3xl md:text-5xl font-display font-extrabold leading-tight mb-12 text-white">
            {t.home.quote}
          </blockquote>

          <cite className="not-italic flex flex-col items-center">
            <div className="w-24 h-2 bg-gradient-to-r from-primary-600 to-accent-500 mb-6"></div>
            <span className="font-extrabold text-2xl text-accent-400 tracking-wide uppercase">{t.home.mlaName}</span>
            <span className="text-neutral-300 mt-2 text-lg font-bold">{t.home.role}</span>
          </cite>
        </div>
      </section>

      {/* Video Modal - Placeholder content for now */}
      <VideoModal
        isOpen={showWelcomeVideo}
        onClose={() => setShowWelcomeVideo(false)}
        type="html5" // Defaulting to HTML5 for premium feel, can be switched to 'youtube'
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" // Placeholder video
        poster="/assets/images/saba_rajendran.webp" // Reusing hero image as placeholder poster
      />
    </div>
  );
};