import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CheckCircle2, Clock, AlertCircle, LayoutGrid, XCircle } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { ProjectCard } from '../components/ProjectCard';
import { PartyBanner } from '../components/PartyBanner';
import { ProjectStatus, ProjectType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

import { wpService } from '../services/wpService';
import { Project } from '../types';

const ITEMS_PER_PAGE = 12;

import { SEO } from '../components/SEO';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useLanguage();

  // Fetch Projects from WP
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const data = await wpService.getAllProjects();
      setProjects(data);
      setIsLoading(false);
    };
    fetchProjects();
  }, []);

  // Calculate counts per village for the sidebar
  const villageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach(p => {
      counts[p.village] = (counts[p.village] || 0) + 1;
    });
    return counts;
  }, [projects]);

  // Derive unique villages from projects
  const dynamicVillages = useMemo(() => {
    const uniqueVillages = Array.from(new Set(projects.map(p => p.village)));
    return uniqueVillages.sort().map((name, index) => ({
      id: `v-${index}`,
      name
    }));
  }, [projects]);

  // Extract unique years from projects for filter dropdown
  const years = useMemo(() => {
    const y = new Set(projects.map(p => p.year));
    return Array.from(y).sort().reverse();
  }, [projects]);

  // Filtering Logic
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchVillage = selectedVillage ? project.village === selectedVillage : true;
      const matchYear = filterYear !== 'All' ? project.year === filterYear : true;
      const matchStatus = filterStatus !== 'All' ? project.status === filterStatus : true;
      const matchType = filterType !== 'All' ? project.type === filterType : true;
      const matchSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchVillage && matchYear && matchStatus && matchType && matchSearch;
    });
  }, [projects, selectedVillage, filterYear, filterStatus, filterType, searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedVillage, filterYear, filterStatus, filterType, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const gridElement = document.getElementById('projects-grid-top');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar (Desktop & Mobile) */}
      <Sidebar
        villages={dynamicVillages}
        selectedVillage={selectedVillage}
        onSelectVillage={setSelectedVillage}
        isOpenMobile={isMobileSidebarOpen}
        closeMobile={() => setIsMobileSidebarOpen(false)}
        villageCounts={villageCounts}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-slate-50 w-full relative">

        {/* Toolbar / Filter Bar */}
        <div className="bg-white border-b border-slate-200 z-20 shadow-sm flex-shrink-0">
          <div className="p-4 flex flex-col gap-4">

            {/* Party Banner integrated here */}
            <div className="hidden md:block">
              <PartyBanner />
            </div>

            {/* Top Row: Title & Mobile Toggle Layout */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              {/* Title Section - Full Width on Mobile */}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
                  {selectedVillage ? (
                    <>
                      {selectedVillage}
                      <button
                        onClick={() => setSelectedVillage(null)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <XCircle size={20} />
                      </button>
                    </>
                  ) : t.projects.allProjects}
                </h1>
                <p className="text-xs text-slate-500">
                  {t.projects.showing} {filteredProjects.length} {t.projects.results}
                </p>
              </div>

              {/* Controls Section: Stacked on Mobile, Inline on Desktop */}
              <div className="flex gap-3 w-full lg:w-auto">
                {/* Prominent Village Filter Button for Mobile */}
                <button
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium shadow-sm active:bg-primary-700 transition-colors shrink-0"
                  onClick={() => setIsMobileSidebarOpen(true)}
                >
                  <Filter size={16} />
                  {t.projects.filterVillages}
                </button>

                {/* Search Bar */}
                <div className="relative flex-grow lg:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder={t.projects.searchPlaceholder}
                    className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all hover:bg-slate-200 focus:bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Middle Row: Visual Status Tabs */}
            <div className="flex overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex p-1 bg-slate-100 rounded-lg whitespace-nowrap">
                <button
                  onClick={() => setFilterStatus('All')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${filterStatus === 'All'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <LayoutGrid size={16} /> {t.projects.filterAll}
                </button>
                <button
                  onClick={() => setFilterStatus(ProjectStatus.COMPLETED)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${filterStatus === ProjectStatus.COMPLETED
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-emerald-700'
                    }`}
                >
                  <CheckCircle2 size={16} /> {t.projects.filterCompleted}
                </button>
                <button
                  onClick={() => setFilterStatus(ProjectStatus.ONGOING)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${filterStatus === ProjectStatus.ONGOING
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-blue-700'
                    }`}
                >
                  <Clock size={16} /> {t.projects.filterOngoing}
                </button>
              </div>
            </div>

            {/* Bottom Row: Pill Filters for Type & Year */}
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`appearance-none px-4 py-1.5 rounded-full text-sm border font-medium cursor-pointer transition-colors ${filterType !== 'All'
                  ? 'bg-primary-50 border-primary-200 text-primary-700'
                  : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'
                  }`}
              >
                <option value="All">{t.projects.allSectors}</option>
                {Object.values(ProjectType).map(type => (
                  <option key={type} value={type}>{t.types[type] || type}</option>
                ))}
              </select>

              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className={`appearance-none px-4 py-1.5 rounded-full text-sm border font-medium cursor-pointer transition-colors ${filterYear !== 'All'
                  ? 'bg-primary-50 border-primary-200 text-primary-700'
                  : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'
                  }`}
              >
                <option value="All">{t.projects.allYears}</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {(filterYear !== 'All' || filterType !== 'All') && (
                <button
                  onClick={() => {
                    setFilterYear('All');
                    setFilterType('All');
                  }}
                  className="text-xs text-red-500 hover:text-red-700 underline px-2"
                >
                  {t.projects.reset}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Project Grid */}
        <div id="projects-grid-top" className="flex-1 p-4 md:p-6 scroll-smooth">
          {/* Mobile Party Banner */}
          <div className="block md:hidden mb-6">
            <PartyBanner />
          </div>

          {filteredProjects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {paginatedProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 pb-8">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all"
                  >
                    <ChevronsLeft size={18} />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex space-x-1 items-center bg-white rounded-lg border border-slate-200 p-1">
                    {getPageNumbers().map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="px-3 py-1 text-slate-400 text-xs">...</span>
                        ) : (
                          <button
                            onClick={() => handlePageChange(page as number)}
                            className={`w-8 h-8 rounded-md text-sm font-semibold transition-all ${currentPage === page
                              ? 'bg-primary-600 text-white shadow-sm'
                              : 'text-slate-600 hover:bg-slate-50'
                              }`}
                          >
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all"
                  >
                    <ChevronsRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              {filteredProjects.length === 0 && selectedVillage && filterStatus === ProjectStatus.ONGOING && projects.some(p => p.village === selectedVillage && p.status === ProjectStatus.COMPLETED) ? (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-200 rounded-full opacity-20 blur-xl"></div>
                    <div className="bg-white p-6 rounded-full shadow-lg relative z-10">
                      <CheckCircle2 size={48} className="text-emerald-500" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-slate-700">Great News!</h3>
                  <p className="text-slate-500 mt-2 max-w-md text-center">
                    All planned projects in <span className="font-semibold text-slate-900">{selectedVillage}</span> are successfully completed!
                  </p>
                </>
              ) : (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary-200 rounded-full opacity-20 blur-xl"></div>
                    <div className="bg-white p-6 rounded-full shadow-lg relative z-10">
                      <Search size={48} className="text-primary-300" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-slate-700">{t.projects.noResults}</h3>
                  <p className="text-slate-500 mt-2 max-w-xs text-center">
                    {t.projects.noResultsDesc}
                  </p>
                </>
              )}
              <button
                onClick={() => {
                  setFilterYear('All');
                  setFilterStatus('All');
                  setFilterType('All');
                  setSelectedVillage(null);
                  setSearchQuery('');
                }}
                className="mt-6 px-6 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-full hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                {t.projects.clearFilters}
              </button>
            </div>
          )}
        </div>

      </div>
    </div >
  );
};