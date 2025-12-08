import React, { useState, useMemo } from 'react';
import { Village } from '../types';
import { MapPin, Search, X, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getVillageName } from '../utils/villageTranslations';

interface SidebarProps {
  villages: Village[];
  selectedVillage: string | null;
  onSelectVillage: (villageName: string | null) => void;
  isOpenMobile: boolean;
  closeMobile: () => void;
  villageCounts: Record<string, number>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  villages,
  selectedVillage,
  onSelectVillage,
  isOpenMobile,
  closeMobile,
  villageCounts
}) => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate total projects for the "All Villages" badge
  const totalProjects = Object.values(villageCounts).reduce((a: number, b: number) => a + b, 0);

  // Filter villages based on search term
  const filteredVillages = useMemo(() => {
    if (!searchTerm.trim()) return villages;
    const term = searchTerm.toLowerCase();
    return villages.filter(v => {
      const englishName = v.name.toLowerCase();
      const tamilName = getVillageName(v.name, 'ta');
      return englishName.includes(term) || tamilName.includes(term);
    });
  }, [villages, searchTerm]);

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
        fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 w-80 bg-white border-r-4 border-black transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        h-full lg:h-[calc(100vh-80px)] overflow-hidden flex flex-col relative
      `}>
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
          {/* All Villages Option */}
          {!searchTerm && (
            <button
              onClick={() => {
                onSelectVillage(null);
                closeMobile();
              }}
              className={`w-full text-left px-4 py-4 border-2 transition-all duration-200 flex items-center justify-between group rounded-none font-bold uppercase tracking-wide
              ${selectedVillage === null
                  ? 'bg-primary-600 text-white border-black shadow-[4px_4px_0_0_#000] transform -translate-y-1'
                  : 'bg-white text-neutral-800 border-neutral-300 hover:border-black hover:shadow-[4px_4px_0_0_#9ca3af]'
                }`}
            >
              <div className="flex items-center gap-3">
                {selectedVillage === null ? (
                  <div className="bg-white text-primary-600 p-0.5 rounded-sm border border-black"><Check size={14} strokeWidth={4} /></div>
                ) : (
                  <div className="w-5 h-5 border-2 border-neutral-400 rounded-sm"></div>
                )}
                <span>{t.sidebar.allVillages}</span>
              </div>
              <span className={`font-mono text-sm px-2 py-0.5 border-2 transition-colors ${selectedVillage === null
                ? 'bg-white text-primary-600 border-black'
                : 'bg-neutral-200 text-neutral-600 border-neutral-300 group-hover:border-black'
                }`}>
                {totalProjects}
              </span>
            </button>
          )}

          {/* Village List */}
          {filteredVillages.length > 0 ? (
            filteredVillages.map((village) => {
              const count = villageCounts[village.name] || 0;
              const isSelected = selectedVillage === village.name;

              return (
                <button
                  key={village.id}
                  onClick={() => {
                    onSelectVillage(village.name);
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
                      {getVillageName(village.name, language)}
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
              <p>No villages found</p>
            </div>
          )}
        </div>

      </div>
    </>
  );
};
