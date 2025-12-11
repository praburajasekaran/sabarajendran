import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { getVillageName } from '../utils/villageTranslations';
import { Filter, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CheckCircle2, Clock, AlertCircle, LayoutGrid, XCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { ProjectCard } from '../components/ProjectCard';
import { PartyBanner } from '../components/PartyBanner';
import { ProjectStatus, ProjectType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useUrlFilters } from '../hooks/useUrlFilters';
import { validateFilters } from '../utils/urlValidation';

import { wpService } from '../services/wpService';
import { Project } from '../types';

// WhatsApp Shareable Graphic Components
import { ShareableGraphicButton } from '../components/ShareableGraphicButton';
import { GraphicPreviewModal } from '../components/GraphicPreviewModal';
import { ProjectGraphic } from '../components/ProjectGraphic';
import { useGraphicGenerator } from '../hooks/useGraphicGenerator';

const ITEMS_PER_PAGE = 15;

import { SEO, ProjectsSEO } from '../components/SEO';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Get language prefix for all links
  const langPrefix = language === 'ta' ? '/ta' : '';

  // URL-based filter management
  const { filters, updateFilters, resetFilters } = useUrlFilters({ projects });

  // WhatsApp Shareable Graphic State
  const [isGraphicModalOpen, setIsGraphicModalOpen] = useState(false);
  const { state: generatorState, generateImage, shareImage, downloadImage, clearImage } = useGraphicGenerator();

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

  // Validate URL parameters after projects are loaded
  useEffect(() => {
    if (projects.length > 0 && !isLoading) {
      const validation = validateFilters(filters, projects);

      if (!validation.isValid) {
        console.warn('Invalid URL parameters detected:', validation.errors);

        // Redirect to corrected URL or main projects page
        if (validation.correctedFilters) {
          // Try to use corrected filters
          const hasAnyValidFilters =
            validation.correctedFilters.block !== 'All' ||
            validation.correctedFilters.panchayat !== 'All' ||
            validation.correctedFilters.village !== null ||
            validation.correctedFilters.type !== 'All' ||
            validation.correctedFilters.status !== 'All' ||
            validation.correctedFilters.year !== 'All';

          if (hasAnyValidFilters) {
            // Update to corrected filters
            updateFilters(validation.correctedFilters, { replace: true });
          } else {
            // All filters are invalid, go to main page
            navigate(`${langPrefix}/projects`, { replace: true });
          }
        } else {
          // No corrected filters available, go to main page
          navigate(`${langPrefix}/projects`, { replace: true });
        }
      }
    }
  }, [projects.length, isLoading]);

  // Calculate total projects count for sidebar (based on selected block)
  const totalProjectsForSidebar = useMemo(() => {
    if (filters.block !== 'All') {
      return projects.filter(p => p.block === filters.block).length;
    }
    return projects.length;
  }, [projects, filters.block]);

  // Calculate counts per panchayat for the sidebar
  const panchayatCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    // Filter by selected block if any
    const relevantProjects = filters.block !== 'All'
      ? projects.filter(p => p.block === filters.block)
      : projects;

    relevantProjects.forEach(p => {
      if (p.panchayat) {
        counts[p.panchayat] = (counts[p.panchayat] || 0) + 1;
      }
    });
    return counts;
  }, [projects, filters.block]);

  // Derive unique panchayats from projects
  const dynamicPanchayats = useMemo(() => {
    // Filter by selected block if any
    const relevantProjects = filters.block !== 'All'
      ? projects.filter(p => p.block === filters.block)
      : projects;

    const uniquePanchayats = Array.from(new Set(
      relevantProjects
        .map(p => p.panchayat)
        .filter(Boolean) as string[]
    ));

    return uniquePanchayats.sort().map((name, index) => ({
      id: `p-${index}`,
      name
    }));
  }, [projects, filters.block]);

  // Extract unique years from projects for filter dropdown
  const years = useMemo(() => {
    const y = new Set(projects.map(p => p.year));
    return Array.from(y).sort().reverse();
  }, [projects]);

  // Extract unique schemes from projects for filter dropdown
  const schemes = useMemo(() => {
    const uniqueSchemes = new Set<string>();
    projects.forEach(p => {
      if (p.scheme) uniqueSchemes.add(p.scheme);
    });
    return Array.from(uniqueSchemes).sort();
  }, [projects]);

  // Extract unique blocks from projects
  const blocks = useMemo(() => {
    const uniqueBlocks = new Set<string>();
    projects.forEach(p => {
      if (p.block) uniqueBlocks.add(p.block);
    });
    return Array.from(uniqueBlocks).sort();
  }, [projects]);

  // Extract unique panchayats from projects (filtered by selected block if any)
  const panchayats = useMemo(() => {
    const uniquePanchayats = new Set<string>();
    projects.forEach(p => {
      // If a block is selected, only show panchayats from that block
      if (filters.block !== 'All' && p.block !== filters.block) return;
      if (p.panchayat) uniquePanchayats.add(p.panchayat);
    });
    return Array.from(uniquePanchayats).sort();
  }, [projects, filters.block]);



  // Filtering Logic (3-level hierarchy: Block → Panchayat → Village)
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchBlock = filters.block !== 'All' ? project.block === filters.block : true;
      const matchPanchayat = filters.panchayat !== 'All' ? project.panchayat === filters.panchayat : true;
      const matchVillage = filters.village ? project.village === filters.village : true;
      const matchYear = filters.year !== 'All' ? project.year === filters.year : true;
      const matchStatus = filters.status !== 'All' ? project.status === filters.status : true;
      const matchType = filters.type !== 'All' ? project.type === filters.type : true;
      const matchScheme = filters.scheme !== 'All' ? project.scheme === filters.scheme : true;
      const matchSearch = project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.search.toLowerCase());

      return matchBlock && matchPanchayat && matchVillage && matchYear && matchStatus && matchType && matchScheme && matchSearch;
    }).sort((a, b) => (b.rawBudget || 0) - (a.rawBudget || 0));
  }, [projects, filters]);

  // Top 8 projects by budget for shareable graphic
  const top8Projects = useMemo(() => {
    return [...filteredProjects]
      .sort((a, b) => (b.rawBudget || 0) - (a.rawBudget || 0))
      .slice(0, 8);
  }, [filteredProjects]);

  // Handler to open graphic modal and generate image
  const handleOpenGraphicModal = useCallback(async () => {
    setIsGraphicModalOpen(true);
    // Generate image immediately when modal opens
    setTimeout(() => {
      generateImage();
    }, 100); // Small delay to ensure DOM is rendered
  }, [generateImage]);

  // Handler to close modal and cleanup
  const handleCloseGraphicModal = useCallback(() => {
    setIsGraphicModalOpen(false);
    clearImage();
  }, [clearImage]);

  // Reset to page 1 when filters change (except page itself)
  useEffect(() => {
    const { page, ...otherFilters } = filters;
    updateFilters({ page: 1 }, { replace: true });
  }, [filters.block, filters.panchayat, filters.village, filters.year, filters.status, filters.type, filters.scheme, filters.search]);

  // Reset panchayat filter when block changes
  useEffect(() => {
    if (filters.block === 'All' && filters.panchayat !== 'All') {
      updateFilters({ panchayat: 'All' }, { replace: true });
    }
  }, [filters.block]);

  // Clear village selection only when block or panchayat is manually changed
  useEffect(() => {
    if ((filters.block !== 'All' || filters.panchayat !== 'All') && filters.village !== null) {
      const villageProject = projects.find(p => p.village === filters.village);
      const villageMatchesHierarchy = villageProject &&
        (filters.block === 'All' || villageProject.block === filters.block) &&
        (filters.panchayat === 'All' || villageProject.panchayat === filters.panchayat);

      if (!villageMatchesHierarchy) {
        updateFilters({ village: null }, { replace: true });
      }
    }
  }, [filters.block, filters.panchayat, filters.village, projects]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const startIndex = (filters.page - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProjects, filters.page]);

  const handlePageChange = (page: number) => {
    updateFilters({ page }, { replace: false });
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
      if (i === 1 || i === totalPages || (i >= filters.page - delta && i <= filters.page + delta)) {
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
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-white">
        <div className="animate-spin h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <ProjectsSEO filters={filters} resultCount={filteredProjects.length} />

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar (Desktop & Mobile) */}
        <Sidebar
          panchayats={dynamicPanchayats}
          selectedPanchayat={filters.panchayat !== 'All' ? filters.panchayat : null}
          onSelectPanchayat={(panchayat) => {
            if (panchayat === null) {
              updateFilters({ panchayat: 'All' });
            } else {
              updateFilters({ panchayat });
            }
            // Scroll to top when panchayat is selected (especially for mobile)
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isOpenMobile={isMobileSidebarOpen}
          closeMobile={() => setIsMobileSidebarOpen(false)}
          onToggleMobile={() => setIsMobileSidebarOpen(prev => !prev)}
          panchayatCounts={panchayatCounts}
          totalProjectsCount={totalProjectsForSidebar}
        />

        {/* Main Content Area - Solid & Bold */}
        <div className="flex-1 flex flex-col bg-white w-full relative pb-0">

          {/* Toolbar / Filter Bar - Heavy Grid */}
          <div className="bg-neutral-100 border-b-4 border-black z-20 flex-shrink-0">
            <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">

              {/* Party Banner integrated here */}
              <div className="hidden md:block">
                <PartyBanner />
              </div>

              {/* Top Row: Title & Mobile Toggle */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                {/* Title Section - Manifesto Style */}
                <div>
                  <h1 className="font-display text-2xl sm:text-4xl font-black text-black uppercase tracking-tight flex items-center gap-3">
                    {filters.panchayat !== 'All' ? (
                      <>
                        <span className="bg-primary-600 text-white px-2 leading-none py-1 transform -skew-x-12 inline-block">
                          {getVillageName(filters.panchayat, language)}
                        </span>
                        <button
                          onClick={() => updateFilters({ panchayat: 'All' })}
                          className="text-neutral-400 hover:text-red-600 transition-colors"
                          title="Clear panchayat filter"
                        >
                          <XCircle size={28} />
                        </button>
                      </>
                    ) : (
                      <span>{t.projects.allProjects}</span>
                    )}
                  </h1>
                  <p className="text-sm font-bold text-neutral-600 mt-2 uppercase tracking-wide border-l-4 border-accent-400 pl-2">
                    {t.projects.showing} <span className="text-black">{filteredProjects.length}</span> {t.projects.results}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex gap-2 sm:gap-3 w-full lg:w-auto">
                  {/* Mobile Sidebar Button */}
                  {/* Mobile Sidebar Button Removed (Moved to Sidebar Handle) */}

                  {/* Search Bar - Blocky */}
                  <div className="relative flex-grow lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} strokeWidth={3} />
                    <input
                      type="text"
                      placeholder={t.projects.searchPlaceholder}
                      className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-none font-bold placeholder:text-neutral-400 focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0_0_#000] transition-all uppercase text-sm"
                      value={filters.search}
                      onChange={(e) => updateFilters({ search: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Filter Row - Solid Blocks */}
              <div className="flex flex-wrap items-end gap-3 sm:gap-4 p-4 bg-white border-2 border-black shadow-[4px_4px_0_0_#e5e7eb]">

                {/* Filter Item Builder */}
                {[
                  { label: t.projects.labelBlock, value: filters.block, options: blocks, key: 'block', display: (v: string) => getVillageName(v, language) },
                  { label: t.projects.labelPanchayat, value: filters.panchayat, options: panchayats, key: 'panchayat', disabled: filters.block === 'All', display: (v: string) => getVillageName(v, language) },
                  { label: t.projects.labelScheme, value: filters.scheme, options: schemes, key: 'scheme', display: (v: string) => v }
                ].map((filter, idx) => (
                  <div key={idx} className="flex flex-col gap-1 min-w-[140px]">
                    <label className="text-[10px] uppercase font-black text-neutral-500 tracking-wider">
                      {filter.label}
                    </label>
                    <div className="relative">
                      <select
                        value={filter.value}
                        onChange={(e) => updateFilters({ [filter.key]: e.target.value })}
                        disabled={filter.disabled}
                        className={`appearance-none w-full px-4 py-2 border-2 text-sm font-bold uppercase cursor-pointer rounded-none focus:outline-none focus:shadow-[2px_2px_0_0_#000] transition-all
                                ${filter.value !== 'All'
                            ? 'bg-accent-100 border-black text-black'
                            : 'bg-white border-neutral-300 text-neutral-500 hover:border-black'
                          }
                                ${filter.disabled ? 'opacity-50 cursor-not-allowed bg-neutral-100' : ''}
                            `}
                      >
                        <option value="All">All</option>
                        {filter.options.map(opt => (
                          <option key={opt} value={opt}>{filter.display(opt)}</option>
                        ))}
                      </select>
                      {/* Custom Arrow */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-black"></div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Reset Button */}
                {(filters.block !== 'All' || filters.panchayat !== 'All' || filters.scheme !== 'All') && (
                  <div className="flex items-end">
                    <button
                      onClick={() => updateFilters({
                        block: 'All',
                        panchayat: 'All',
                        year: 'All',
                        type: 'All',
                        scheme: 'All'
                      })}
                      className="px-4 py-2 text-xs font-black uppercase text-red-600 border-2 border-transparent hover:border-red-600 hover:bg-red-50 transition-all flex items-center gap-1"
                    >
                      <X size={14} strokeWidth={4} />
                      {t.projects.reset}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable Project Grid */}
          <div id="projects-grid-top" className="flex-1 p-4 md:p-8 scroll-smooth bg-neutral-50">
            {/* Mobile Party Banner */}
            <div className="block md:hidden mb-6">
              <PartyBanner />
            </div>

            {filteredProjects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                  {paginatedProjects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>

                {/* Pagination Controls - Solid Squares */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={filters.page === 1}
                      className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black font-bold disabled:opacity-30 disabled:border-neutral-300 hover:bg-black hover:text-white transition-all shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none"
                    >
                      <ChevronsLeft size={20} />
                    </button>
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                      className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black font-bold disabled:opacity-30 disabled:border-neutral-300 hover:bg-black hover:text-white transition-all shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-2">
                      {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                          {page === '...' ? (
                            <span className="flex items-end px-2 font-black text-black">...</span>
                          ) : (
                            <button
                              onClick={() => handlePageChange(page as number)}
                              className={`w-10 h-10 flex items-center justify-center border-2 border-black font-black transition-all shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none ${filters.page === page
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-black hover:bg-accent-300'
                                }`}
                            >
                              {page}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === totalPages}
                      className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black font-bold disabled:opacity-30 disabled:border-neutral-300 hover:bg-black hover:text-white transition-all shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={filters.page === totalPages}
                      className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black font-bold disabled:opacity-30 disabled:border-neutral-300 hover:bg-black hover:text-white transition-all shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none"
                    >
                      <ChevronsRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[50vh] border-4 border-dashed border-neutral-300 bg-white/50">
                <div className="bg-neutral-200 p-6 rounded-full mb-4">
                  <Search size={48} className="text-neutral-500" />
                </div>
                <h3 className="text-2xl font-black text-black uppercase">{t.projects.noResults}</h3>
                <p className="text-neutral-500 font-medium mt-2">{t.projects.noResultsDesc}</p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-8 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-primary-600 transition-colors shadow-lg"
                >
                  {t.projects.clearFilters}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden layout elements for graphics */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
        <ProjectGraphic
          projects={top8Projects}
          filters={filters}
          lang={language}
        />
      </div>

      {filteredProjects.length > 0 && (
        <ShareableGraphicButton onClick={handleOpenGraphicModal} />
      )}

      <GraphicPreviewModal
        isOpen={isGraphicModalOpen}
        onClose={handleCloseGraphicModal}
        generatorState={generatorState}
        onShare={shareImage}
        onDownload={downloadImage}
      />
    </>
  );
};