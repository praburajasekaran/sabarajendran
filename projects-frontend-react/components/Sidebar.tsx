import React, { useState, useMemo } from 'react';
import { Panchayat } from '../types';
import { MapPin, Search, X, Check, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getVillageName } from '../utils/villageTranslations';

interface SidebarProps {
  panchayats: Panchayat[];
  selectedPanchayat: string | null;
  onSelectPanchayat: (panchayatName: string | null) => void;
  isOpenMobile: boolean;
  closeMobile: () => void;
  onToggleMobile: () => void;
  panchayatCounts: Record<string, number>;
  totalProjectsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  panchayats,
  selectedPanchayat,
  onSelectPanchayat,
  isOpenMobile,
  closeMobile,
  onToggleMobile,
  panchayatCounts,
  totalProjectsCount
}) => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter panchayats based on search term
  const filteredPanchayats = useMemo(() => {
    if (!searchTerm.trim()) return panchayats;
    const term = searchTerm.toLowerCase();
    return panchayats.filter(p => {
      const englishName = p.name.toLowerCase();
      const tamilName = getVillageName(p.name, 'ta');
      return englishName.includes(term) || tamilName.includes(term);
    });
  }, [panchayats, searchTerm]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar Container - Political Style */}
      <div className={`
        fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out lg:transform-none select-none
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}
        h-full lg:h-[calc(100vh-80px)] flex flex-col
      `}>
        {/* Toggle Handle (Visible when closed on mobile) */}
        <button
          onClick={onToggleMobile}
          className={`lg:hidden absolute bottom-8 -right-12 w-12 h-14 bg-black border-y-2 border-r-2 border-white flex flex-col items-center justify-center gap-1 cursor-pointer shadow-[4px_4px_0_0_#000] z-50 transition-opacity duration-300
            ${isOpenMobile ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
        >
          <MapPin size={18} className="text-white" />
          <Filter size={14} className="text-accent-400" />
        </button>

        {/* Inner Content Wrapper (Overflow Hidden) */}
        <div className="w-full h-full flex flex-col bg-white border-r-4 border-black overflow-hidden relative shadow-2xl lg:shadow-none">

          {/* Close Button Mobile (Inside) */}
          <button
            onClick={closeMobile}
            className="lg:hidden absolute top-2 right-2 p-1 bg-black text-white hover:bg-red-600 transition-colors z-50"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="p-6 border-b-4 border-black bg-accent-400 shrink-0">
            <h2 className="text-sm font-black text-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-black" />
              {t.sidebar.title}
            </h2>

            {/* Political Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} strokeWidth={3} />
              <input
                type="text"
                placeholder={t.sidebar.searchPlaceholder}
                className="w-full pl-10 pr-8 py-3 bg-white border-2 border-black font-bold text-black focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0_0_#000] transition-all placeholder:text-neutral-500 rounded-none uppercase text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:bg-black hover:text-white rounded-full p-0.5 transition-colors"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 bg-neutral-100">
            {/* All Panchayats Option */}
            {!searchTerm && (
              <button
                onClick={() => {
                  onSelectPanchayat(null);
                  closeMobile();
                }}
                className={`w-full text-left px-4 py-4 border-2 transition-all duration-200 flex items-center justify-between group rounded-none font-bold uppercase tracking-wide
                ${selectedPanchayat === null
                    ? 'bg-primary-600 text-white border-black shadow-[4px_4px_0_0_#000] transform -translate-y-1'
                    : 'bg-white text-neutral-800 border-neutral-300 hover:border-black hover:shadow-[4px_4px_0_0_#9ca3af]'
                  }`}
              >
                <div className="flex items-center gap-3">
                  {selectedPanchayat === null ? (
                    <div className="bg-white text-primary-600 p-0.5 rounded-sm border border-black"><Check size={14} strokeWidth={4} /></div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-neutral-400 rounded-sm"></div>
                  )}
                  <span>{t.sidebar.allPanchayats}</span>
                </div>
                <span className={`font-mono text-sm px-2 py-0.5 border-2 transition-colors ${selectedPanchayat === null
                  ? 'bg-white text-primary-600 border-black'
                  : 'bg-neutral-200 text-neutral-600 border-neutral-300 group-hover:border-black'
                  }`}>
                  {totalProjectsCount}
                </span>
              </button>
            )}

            {/* Panchayat List */}
            {filteredPanchayats.length > 0 ? (
              filteredPanchayats.map((panchayat) => {
                const count = panchayatCounts[panchayat.name] || 0;
                const isSelected = selectedPanchayat === panchayat.name;

                return (
                  <button
                    key={panchayat.id}
                    onClick={() => {
                      onSelectPanchayat(panchayat.name);
                      closeMobile();
                    }}
                    className={`w-full text-left px-4 py-3 border-2 transition-all duration-200 flex items-center justify-between group rounded-none font-bold text-sm uppercase
                     ${isSelected
                        ? 'bg-accent-400 text-black border-black shadow-[3px_3px_0_0_#000] transform -translate-y-0.5'
                        : 'bg-white text-neutral-600 border-transparent hover:border-black hover:shadow-[3px_3px_0_0_#d1d5db]'
                      }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      <span className={`truncate ${isSelected ? 'text-black' : 'text-neutral-600 group-hover:text-black'}`}>
                        {getVillageName(panchayat.name, language)}
                      </span>
                    </div>
                    <span className={`font-mono text-xs font-bold ${isSelected
                      ? 'text-black'
                      : 'text-neutral-400 group-hover:text-black'
                      }`}>
                      {count}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-12 text-neutral-500 font-bold uppercase tracking-widest text-sm border-2 border-dashed border-neutral-300">
                <p>No panchayats found</p>
              </div>
            )}
          </div>
        </div>
      </div >
    </>
  );
};
