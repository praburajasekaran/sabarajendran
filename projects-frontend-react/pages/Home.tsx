import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, CheckCircle, Clock, PieChart, ChevronRight, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProjectCard } from '../components/ProjectCard';
import { SEO } from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import { wpService } from '../services/wpService';
import { Project, ProjectStatus } from '../types';

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const data = await wpService.getAllProjects();
      setProjects(data);
      setIsLoading(false);
    };
    fetchProjects();
  }, []);

  const completedCount = projects.filter(p => p.status === ProjectStatus.COMPLETED).length;
  const ongoingCount = projects.filter(p => p.status === ProjectStatus.ONGOING).length;

  // Calculate total budget dynamically
  const totalBudgetVal = projects.reduce((acc, curr) => acc + (curr.rawBudget || 0), 0);
  let totalBudget = "₹0";
  if (totalBudgetVal >= 10000000) {
    totalBudget = `₹${(totalBudgetVal / 10000000).toFixed(1)} Cr+`;
  } else if (totalBudgetVal >= 100000) {
    totalBudget = `₹${(totalBudgetVal / 100000).toFixed(1)} L+`;
  }

  // Get unique villages count
  const uniqueVillages = new Set(projects.map(p => p.village)).size;

  const recentProjects = projects.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <SEO
        title="Home"
        description="Official website of Saba Rajendran, MLA of Neyveli Constituency. Explore development projects, news, and updates."
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white overflow-hidden min-h-[600px] flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-5"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 w-full">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">

            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                  {t.home.heroTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">{t.home.heroTitleSuffix}</span>
                </h1>
                <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {t.home.heroDesc}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/projects')}
                  className="px-8 py-4 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/50 hover:shadow-primary-600/30 hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  {t.home.viewProjects}
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="px-8 py-4 border border-stone-600 text-stone-300 rounded-lg font-semibold hover:border-white hover:text-white hover:bg-white/5 transition-all flex items-center justify-center"
                >
                  {t.home.contactOffice}
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 flex justify-center lg:justify-end relative">
              <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-secondary-500 rounded-[2rem] rotate-6 opacity-50 blur-lg"></div>
                <div className="absolute inset-0 bg-stone-800 rounded-[2rem] rotate-3 border border-stone-700"></div>
                <div className="relative h-full w-full rounded-[2rem] overflow-hidden border-4 border-stone-800 shadow-2xl">
                  <img
                    src="/assets/images/saba_rajendran.webp"
                    alt="MLA Saba Rajendran"
                    className="w-full h-full object-cover"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="font-bold text-xl">Saba Rajendran</p>
                    <p className="text-stone-300 text-sm">MLA, Neyveli Constituency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative -mt-8 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-8 md:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-3">
                    <div className="w-12 h-12 bg-stone-200 rounded-full"></div>
                    <div className="h-8 bg-stone-200 rounded w-16"></div>
                    <div className="h-4 bg-stone-200 rounded w-24"></div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex flex-col items-center text-center group">
                    <div className="p-4 rounded-full bg-emerald-50 text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle size={32} />
                    </div>
                    <p className="text-4xl font-bold text-stone-900 mb-1">{completedCount}</p>
                    <p className="text-sm font-medium text-stone-500 uppercase tracking-wide">{t.home.completedProjects}</p>
                  </div>

                  <div className="flex flex-col items-center text-center group">
                    <div className="p-4 rounded-full bg-blue-50 text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Clock size={32} />
                    </div>
                    <p className="text-4xl font-bold text-stone-900 mb-1">{ongoingCount}</p>
                    <p className="text-sm font-medium text-stone-500 uppercase tracking-wide">{t.home.ongoingWorks}</p>
                  </div>

                  <div className="flex flex-col items-center text-center group">
                    <div className="p-4 rounded-full bg-orange-50 text-orange-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users size={32} />
                    </div>
                    <p className="text-4xl font-bold text-stone-900 mb-1">{uniqueVillages}+</p>
                    <p className="text-sm font-medium text-stone-500 uppercase tracking-wide">{t.home.villagesCovered}</p>
                  </div>

                  <div className="flex flex-col items-center text-center group">
                    <div className="p-4 rounded-full bg-purple-50 text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Building2 size={32} />
                    </div>
                    <p className="text-4xl font-bold text-stone-900 mb-1">{totalBudget}</p>
                    <p className="text-sm font-medium text-stone-500 uppercase tracking-wide">{t.home.fundsUtilized}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
                {t.home.recentDev}
              </h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                {t.home.recentDevDesc}
              </p>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="hidden md:flex items-center gap-2 text-primary-700 font-bold hover:text-primary-800 transition-colors group"
            >
              {t.home.viewAll}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <button
              onClick={() => navigate('/projects')}
              className="inline-flex items-center px-6 py-3 border border-stone-300 shadow-sm text-base font-medium rounded-lg text-stone-700 bg-white hover:bg-stone-50 transition-colors"
            >
              {t.home.viewAll}
            </button>
          </div>
        </div>
      </section>

      {/* Quote/Vision Section */}
      <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-600 rounded-full mix-blend-screen filter blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary-600 rounded-full mix-blend-screen filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="mb-8 text-primary-500 opacity-50">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
            </svg>
          </div>
          <blockquote className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium leading-tight mb-10 text-stone-100">
            "{t.home.quote}"
          </blockquote>
          <cite className="not-italic flex flex-col items-center">
            <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-6"></div>
            <span className="font-bold text-xl text-white tracking-wide">Saba Rajendran</span>
            <span className="text-stone-400 mt-1">{t.home.role}</span>
          </cite>
        </div>
      </section>
    </div>
  );
};