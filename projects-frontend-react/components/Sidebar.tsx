import React, { useState, useMemo } from 'react';
import { Village } from '../types';
import { MapPin, ChevronRight, Search, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate total projects for the "All Villages" badge
  const totalProjects = Object.values(villageCounts).reduce((a, b) => a + b, 0);

  // Filter villages based on search term
  const filteredVillages = useMemo(() => {
    if (!searchTerm.trim()) return villages;
    return villages.filter(v =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

      {/* Sidebar Container */}
      <div className={`
        fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        h-full lg:h-[calc(100vh-64px)] overflow-hidden flex flex-col
      `}>
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 backdrop-blur shrink-0">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            {t.sidebar.title}
          </h2>

          {/* Sidebar Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder={t.sidebar.searchPlaceholder}
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
          {/* All Villages Option (Only show if no search or matches "All") */}
          {!searchTerm && (
            <button
              onClick={() => {
                onSelectVillage(null);
                closeMobile();
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-between group ${selectedVillage === null
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                  : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-3 ${selectedVillage === null ? 'bg-white' : 'bg-primary-500'}`}></span>
                <span className="font-medium">{t.sidebar.allVillages}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${selectedVillage === null
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                }`}>
                {totalProjects}
              </span>
            </button>
          )}

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
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-between group ${isSelected
                      ? 'bg-primary-50 text-primary-700 border border-primary-100'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                >
                  <div className="flex items-center overflow-hidden">
                    <MapPin size={14} className={`mr-3 flex-shrink-0 transition-colors ${isSelected ? 'text-primary-600 fill-primary-100' : 'text-slate-400'}`} />
                    <span className={`font-medium truncate ${isSelected ? 'text-primary-900' : 'text-slate-700'}`}>{village.name}</span>
                  </div>
                  <div className="flex items-center ml-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full mr-1 flex-shrink-0 transition-colors ${isSelected
                        ? 'bg-primary-200 text-primary-800'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}>
                      {count}
                    </span>
                    {isSelected && <ChevronRight size={14} className="text-primary-400 flex-shrink-0" />}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              <p>No villages found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};