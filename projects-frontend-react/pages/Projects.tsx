import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { getVillageName } from '../utils/villageTranslations';

// ... (imports are at the top, I will insert the import at the top and then replace the title line)

// Wait, replace_file_content replaces a contiguous block. I need to add the import AND change the line 312.
// They are far apart. I should use multi_replace_file_content.

import { Filter, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CheckCircle2, Clock, AlertCircle, LayoutGrid, XCircle } from 'lucide-react';
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

const ITEMS_PER_PAGE = 12;

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

  // Helper function to find village's parent block and panchayat
  const getVillageHierarchy = useCallback((villageName: string) => {
    const project = projects.find(p => p.village === villageName);
    return project ? {
      block: project.block || 'All',
      panchayat: project.panchayat || 'All',
      village: villageName
    } : { block: 'All', panchayat: 'All', village: villageName };
  }, [projects]);

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
    });
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

  // Clear village selection only when block or panchayat is manually changed (not when set via village selection)
  // This allows the hierarchy to coexist when a village is selected from the sidebar
  useEffect(() => {
    // Only clear village if block/panchayat changed AND village doesn't match the new hierarchy
    if ((filters.block !== 'All' || filters.panchayat !== 'All') && filters.village !== null) {
      // Check if the current village belongs to the selected block/panchayat
      const villageProject = projects.find(p => p.village === filters.village);
      const villageMatchesHierarchy = villageProject &&
        (filters.block === 'All' || villageProject.block === filters.block) &&
        (filters.panchayat === 'All' || villageProject.panchayat === filters.panchayat);

      // Only clear village if it doesn't match the new hierarchy
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
    updateFilters({ page }, { replace: false }); // Allow back navigation for pagination
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
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <ProjectsSEO filters={filters} resultCount={filteredProjects.length} />

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar (Desktop & Mobile) */}
        <Sidebar
          villages={dynamicVillages}
          selectedVillage={filters.village}
          onSelectVillage={(village) => {
            if (village === null) {
              updateFilters({ village: null, block: 'All', panchayat: 'All' });
            } else {
              const hierarchy = getVillageHierarchy(village);
              updateFilters(hierarchy);
            }
          }}
          isOpenMobile={isMobileSidebarOpen}
          closeMobile={() => setIsMobileSidebarOpen(false)}
          villageCounts={villageCounts}
        />

        {/* Main Content Area - Editorial Style */}
        <div className="flex-1 flex flex-col bg-accent-50 w-full relative pb-0">

          {/* Toolbar / Filter Bar */}
          <div className="bg-white border-b border-accent-200 z-20 shadow-sm flex-shrink-0">
            <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-6">

              {/* Party Banner integrated here */}
              <div className="hidden md:block">
                <PartyBanner />
              </div>

              {/* Top Row: Title & Mobile Toggle Layout */}
              <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">

                {/* Title Section - Editorial Style */}
                <div>
                  <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 flex items-center gap-2 sm:gap-3">
                    {filters.village ? (
                      <>
                        {getVillageName(filters.village, language)}
                        <button
                          onClick={() => updateFilters({ village: null, block: 'All', panchayat: 'All' })}
                          className="text-neutral-400 hover:text-primary-600 transition-colors"
                          title="Clear village filter"
                        >
                          <XCircle size={20} className="sm:w-[22px] sm:h-[22px]" />
                        </button>
                      </>
                    ) : t.projects.allProjects}
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-0.5 sm:mt-1 font-medium">
                    {t.projects.showing} {filteredProjects.length} {t.projects.results}
                  </p>
                </div>

                {/* Controls Section: Stacked on Mobile, Inline on Desktop */}
                <div className="flex gap-2 sm:gap-3 w-full lg:w-auto">
                  {/* Prominent Village Filter Button for Mobile */}
                  <button
                    className="lg:hidden flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-primary-500 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm active:bg-primary-600 transition-all shrink-0 hover:shadow-md"
                    onClick={() => setIsMobileSidebarOpen(true)}
                  >
                    <Filter size={14} className="sm:w-4 sm:h-4" />
                    {t.projects.filterVillages}
                  </button>

                  {/* Search Bar - Editorial Style */}
                  <div className="relative flex-grow lg:w-80">
                    <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-accent-500" size={14} />
                    <input
                      type="text"
                      placeholder={t.projects.searchPlaceholder}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-white border-2 border-accent-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all placeholder:text-accent-400"
                      value={filters.search}
                      onChange={(e) => updateFilters({ search: e.target.value })}
                    />
                  </div>
                </div>
              </div>



              {/* Bottom Row: Pill Filters for Block, Panchayat, Type & Year - Editorial Style */}
              <div className="flex flex-wrap items-end gap-2 sm:gap-4 overflow-x-auto">
                {/* Block Filter */}
                <div className="flex flex-col gap-0.5 sm:gap-1">
                  <label className="text-[10px] sm:text-xs font-medium text-neutral-600 px-1">
                    {t.projects.labelBlock} / பிரிவு
                  </label>
                  <select
                    value={filters.block}
                    onChange={(e) => updateFilters({ block: e.target.value })}
                    className={`appearance-none px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm border-2 font-medium cursor-pointer transition-all ${filters.block !== 'All'
                      ? 'bg-secondary-50 border-secondary-400 text-secondary-700'
                      : 'bg-white border-accent-300 text-neutral-700 hover:border-accent-400'
                      }`}
                  >
                    <option value="All">{t.projects.allBlocks}</option>
                    {blocks.map(block => (
                      <option key={block} value={block}>{getVillageName(block, language)}</option>
                    ))}
                  </select>
                </div>

                {/* Panchayat Filter */}
                <div className="flex flex-col gap-0.5 sm:gap-1">
                  <label className="text-[10px] sm:text-xs font-medium text-neutral-600 px-1">
                    {t.projects.labelPanchayat} / பஞ்சாயத்து
                  </label>
                  <select
                    value={filters.panchayat}
                    onChange={(e) => updateFilters({ panchayat: e.target.value })}
                    className={`appearance-none px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm border-2 font-medium cursor-pointer transition-all ${filters.panchayat !== 'All'
                      ? 'bg-accent-100 border-accent-400 text-accent-700'
                      : 'bg-white border-accent-300 text-neutral-700 hover:border-accent-400'
                      }`}
                    disabled={filters.block === 'All'}
                  >
                    <option value="All">
                      {filters.block === 'All' ? t.projects.selectBlockFirst : t.projects.allPanchayats}
                    </option>
                    {panchayats.map(panchayat => (
                      <option key={panchayat} value={panchayat}>{getVillageName(panchayat, language)}</option>
                    ))}
                  </select>
                </div>





                {/* Scheme Filter */}
                <div className="flex flex-col gap-0.5 sm:gap-1">
                  <label className="text-[10px] sm:text-xs font-medium text-neutral-600 px-1">
                    {t.projects.labelScheme} / திட்டம்
                  </label>
                  <select
                    value={filters.scheme}
                    onChange={(e) => updateFilters({ scheme: e.target.value })}
                    className={`appearance-none px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm border-2 font-medium cursor-pointer transition-all ${filters.scheme !== 'All'
                      ? 'bg-primary-50 border-primary-400 text-primary-700'
                      : 'bg-white border-accent-300 text-neutral-700 hover:border-accent-400'
                      }`}
                  >
                    <option value="All">{t.projects.allSchemes}</option>
                    {schemes.map(scheme => (
                      <option key={scheme} value={scheme}>{scheme}</option>
                    ))}
                  </select>
                </div>

                {/* Reset Button - Editorial Style */}
                {(filters.block !== 'All' || filters.panchayat !== 'All' || filters.year !== 'All' || filters.type !== 'All' || filters.scheme !== 'All') && (
                  <div className="flex flex-col gap-0.5 sm:gap-1">
                    <div className="h-[14px] sm:h-[20px]"></div>
                    <button
                      onClick={() => updateFilters({
                        block: 'All',
                        panchayat: 'All',
                        year: 'All',
                        type: 'All',
                        scheme: 'All'
                      })}
                      className="text-[10px] sm:text-xs text-primary-600 hover:text-primary-700 font-semibold underline px-2 py-1.5 sm:px-3 sm:py-2 transition-colors whitespace-nowrap"
                    >
                      {t.projects.reset}
                    </button>
                  </div>
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
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={filters.page === 1}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all"
                    >
                      <ChevronsLeft size={18} />
                    </button>
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
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
                              className={`w-8 h-8 rounded-md text-sm font-semibold transition-all ${filters.page === page
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
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === totalPages}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={filters.page === totalPages}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all"
                    >
                      <ChevronsRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh]">
                {filteredProjects.length === 0 && filters.village && filters.status === ProjectStatus.ONGOING && projects.some(p => p.village === filters.village && p.status === ProjectStatus.COMPLETED) ? (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-200 rounded-full opacity-20 blur-xl"></div>
                      <div className="bg-white p-6 rounded-full shadow-lg relative z-10">
                        <CheckCircle2 size={48} className="text-emerald-500" />
                      </div>
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-slate-700">Great News!</h3>
                    <p className="text-slate-500 mt-2 max-w-md text-center">
                      All planned projects in <span className="font-semibold text-slate-900">{filters.village}</span> are successfully completed!
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
                  onClick={resetFilters}
                  className="mt-6 px-6 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-full hover:bg-slate-50 hover:border-slate-400 transition-colors"
                >
                  {t.projects.clearFilters}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Hidden Shareable Graphic Component (off-screen) */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
        <ProjectGraphic
          projects={top8Projects}
          filters={filters}
          lang={language}
        />
      </div>

      {/* Shareable Graphic Button (FAB) - Only show when there are projects */}
      {filteredProjects.length > 0 && (
        <ShareableGraphicButton onClick={handleOpenGraphicModal} />
      )}

      {/* Graphic Preview Modal */}
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