import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, CheckCircle, Clock, PieChart, ChevronRight } from 'lucide-react';
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
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Home"
        description="Official website of Saba Rajendran, MLA of Neyveli Constituency. Explore development projects, news, and updates."
      />
      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        {/* Rising Sun Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-primary-900 to-primary-700 opacity-90"></div>
        <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[200%] bg-gradient-to-r from-transparent via-primary-500/10 to-transparent transform rotate-12 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              {t.home.heroTitle} <span className="text-primary-500 drop-shadow-lg">{t.home.heroTitleSuffix}</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-300 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed border-l-4 border-primary-600 pl-4">
              {t.home.heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => navigate('/projects')}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-500 transition-colors flex items-center justify-center shadow-lg shadow-primary-900/50"
              >
                {t.home.viewProjects}
                <ArrowRight size={20} className="ml-2" />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="px-8 py-3 border border-stone-600 text-white rounded-lg font-semibold hover:border-white hover:bg-white/5 transition-colors"
              >
                {t.home.contactOffice}
              </button>
            </div>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-4 border-primary-600 overflow-hidden shadow-2xl shadow-primary-900/50 bg-black">
              {/* Image of MLA Saba Rajendran */}
              <img
                src="/assets/images/saba_rajendran.png"
                alt="MLA Saba Rajendran"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Meet MLA Section */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center bg-stone-50 rounded-2xl overflow-hidden shadow-sm border border-stone-100 -mt-10 relative z-20">
            <div className="p-8 md:p-12 flex-1">
              <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-primary-600 block rounded-sm"></span>
                {t.home.meetMlaTitle}
              </h2>
              <p className="text-stone-600 text-lg mb-6 leading-relaxed">
                {t.home.meetMlaDesc}
              </p>
              <button
                onClick={() => navigate('/about')}
                className="text-primary-700 font-bold hover:text-black transition-colors flex items-center gap-2 group"
              >
                {t.home.readMore}
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="hidden md:block w-1/3 h-full min-h-[200px] bg-stone-200 relative">
              <img
                src="/assets/images/mk_stalin.png"
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 mix-blend-multiply"
                alt="Pattern"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-50 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {isLoading ? (
              // Loading Skeletons
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-stone-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-stone-200 rounded w-12"></div>
                    <div className="h-4 bg-stone-200 rounded w-24"></div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100 group hover:border-primary-200 transition-colors">
                  <div className="p-3 rounded-full bg-black text-primary-500">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-stone-900">{completedCount}</p>
                    <p className="text-sm text-stone-500">{t.home.completedProjects}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100 group hover:border-primary-200 transition-colors">
                  <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-stone-900">{ongoingCount}</p>
                    <p className="text-sm text-stone-500">{t.home.ongoingWorks}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100 group hover:border-primary-200 transition-colors">
                  <div className="p-3 rounded-full bg-secondary-100 text-secondary-600">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-stone-900">{uniqueVillages}+</p>
                    <p className="text-sm text-stone-500">{t.home.villagesCovered}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100 group hover:border-primary-200 transition-colors">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <PieChart size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-stone-900">{totalBudget}</p>
                    <p className="text-sm text-stone-500">{t.home.fundsUtilized}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-black border-l-4 border-primary-600 pl-4">{t.home.recentDev}</h2>
              <p className="text-stone-500 mt-2 pl-5">{t.home.recentDevDesc}</p>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="hidden md:flex items-center text-primary-700 font-bold hover:text-black transition-colors"
            >
              {t.home.viewAll} <ArrowRight size={18} className="ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <button
              onClick={() => navigate('/projects')}
              className="inline-flex items-center px-6 py-3 border border-stone-300 shadow-sm text-base font-medium rounded-md text-stone-700 bg-white hover:bg-stone-50"
            >
              {t.home.viewAll}
            </button>
          </div>
        </div>
      </section>

      {/* Quote/Vision Section */}
      <section className="py-20 bg-gradient-to-r from-black to-primary-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-secondary-600 rounded-full opacity-10 blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <blockquote className="text-2xl md:text-3xl font-medium font-serif italic mb-8 leading-relaxed text-stone-100">
            {t.home.quote}
          </blockquote>
          <cite className="not-italic">
            <div className="font-bold text-lg text-secondary-500">Mr. Saba Rajendran</div>
            <div className="text-stone-400 text-sm">{t.home.role}</div>
          </cite>
        </div>
      </section>
    </div>
  );
};