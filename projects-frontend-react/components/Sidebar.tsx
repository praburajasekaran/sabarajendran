import React, { useState, useMemo } from 'react';
import { Village } from '../types';
import { MapPin, Search, X } from 'lucide-react';
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar Container - Editorial Style */}
      <div className={`
        fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 w-80 bg-slate-50 border-r border-accent-200 transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        h-full lg:h-[calc(100vh-80px)] overflow-hidden flex flex-col relative
      `}>
        {/* Header */}
        <div className="p-6 border-b border-accent-200 bg-white/60 backdrop-blur-sm shrink-0">
          <h2 className="text-xs font-mono font-bold text-accent-700 uppercase tracking-widest mb-4">
            {t.sidebar.title}
          </h2>

          {/* Editorial Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-500" size={16} />
            <input
              type="text"
              placeholder={t.sidebar.searchPlaceholder}
              className="w-full pl-10 pr-8 py-3 bg-white border-2 border-accent-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all placeholder:text-accent-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-400 hover:text-accent-700 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-accent-300 hover:scrollbar-thumb-accent-400 min-h-0 bg-slate-50">
          {/* All Villages Option */}
          {!searchTerm && (
            <button
              onClick={() => {
                onSelectVillage(null);
                closeMobile();
              }}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-between group ${selectedVillage === null
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-neutral-700 hover:bg-accent-100 border border-accent-200'
                }`}
            >
              <div className="flex items-center gap-3">
                {selectedVillage === null && (
                  <span className="status-dot completed"></span>
                )}
                <span className="font-medium">{t.sidebar.allVillages}</span>
              </div>
              <span className={`font-mono text-xs px-2.5 py-1 rounded-full font-bold ${selectedVillage === null
                  ? 'bg-white/20 text-white'
                  : 'bg-accent-100 text-accent-700'
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
                  className={`w-full text-left px-4 py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-between group ${isSelected
                      ? 'bg-accent-200 text-accent-900 border border-accent-300 shadow-sm'
                      : 'bg-white text-neutral-700 hover:bg-accent-100 border border-accent-200 hover:border-accent-300'
                    }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                    {isSelected ? (
                      <span className="status-dot completed flex-shrink-0"></span>
                    ) : (
                      <MapPin size={16} className="text-accent-500 flex-shrink-0" />
                    )}
                    <span className={`font-medium truncate ${isSelected ? 'text-accent-900' : 'text-neutral-700'}`}>
                      {getVillageName(village.name, language)}
                    </span>
                  </div>
                  <span className={`font-mono text-xs px-2.5 py-1 rounded-full font-bold ml-2 flex-shrink-0 transition-colors ${isSelected
                      ? 'bg-white text-accent-700'
                      : 'bg-accent-100 text-accent-600 group-hover:bg-accent-200'
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="text-center py-12 text-accent-500 text-sm">
              <p>No villages found.</p>
            </div>
          )}
        </div>

      </div>
    </>
  );
};
