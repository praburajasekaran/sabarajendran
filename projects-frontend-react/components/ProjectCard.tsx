import React, { useState } from 'react';
import {
  MapPin, Calendar, Banknote,
  School, Droplets, Zap, HeartPulse, Users, Sprout, HardHat,
  FileText
} from 'lucide-react';
import { Project, ProjectStatus, ProjectType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { TruncatedText } from './TruncatedText';
import { getVillageName } from '../utils/villageTranslations';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { t, language } = useLanguage();

  const displayTitle = (language === 'ta' && project.title_ta) ? project.title_ta : project.title;
  // Fix: Do not fallback to English description if Tamil is selected but empty
  const displayDescription = (language === 'ta') ? (project.description_ta || '') : project.description;

  // Status indicator styles - High Contrast
  const getStatusStyle = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return 'bg-secondary-900 text-white border-2 border-black';
      case ProjectStatus.ONGOING:
        return 'bg-primary-500 text-white border-2 border-black animate-pulse';
      default:
        return 'bg-neutral-200 text-neutral-800 border-2 border-black';
    }
  };

  // Type configuration with icons
  const getTypeConfig = (type: ProjectType) => {
    switch (type) {
      case ProjectType.INFRASTRUCTURE:
        return { icon: HardHat, color: 'text-neutral-900' };
      case ProjectType.WATER:
        return { icon: Droplets, color: 'text-neutral-900' };
      case ProjectType.EDUCATION:
        return { icon: School, color: 'text-neutral-900' };
      case ProjectType.HEALTH:
        return { icon: HeartPulse, color: 'text-neutral-900' };
      case ProjectType.ELECTRICITY:
        return { icon: Zap, color: 'text-neutral-900' };
      case ProjectType.COMMUNITY:
        return { icon: Users, color: 'text-neutral-900' };
      case ProjectType.AGRICULTURE:
        return { icon: Sprout, color: 'text-neutral-900' };
      default:
        return { icon: HardHat, color: 'text-neutral-900' };
    }
  };

  const typeConfig = getTypeConfig(project.type);
  const TypeIcon = typeConfig.icon;

  return (
    <>
      {/* Political Manifesto Card */}
      <div className="group relative bg-white border-2 border-black card-sharp h-full flex flex-col p-0">

        {/* Header Strip */}
        <div className="flex justify-between items-stretch border-b-2 border-black bg-neutral-100 h-10">
          <div className={`px-4 flex items-center justify-center font-bold uppercase tracking-wider text-[10px] ${getStatusStyle(project.status)}`}>
            {t.status[project.status] || project.status}
          </div>
          <div className="flex-1 flex items-center justify-end px-4 gap-2">
            <Calendar size={14} className="text-neutral-600" />
            <span className="font-mono text-xs font-bold">{project.year}</span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          {/* Title - Bold & Uppercase */}
          <TruncatedText
            as="h3"
            maxLines={language === 'ta' ? 3 : 2}
            className={`font-display font-black text-black mb-3 leading-tight tracking-tight ${language === 'en' ? 'text-xl' : 'text-lg'}`}
          >
            {(() => {
              // Always try to split if @ is present
              const splitIndex = displayTitle.indexOf(' @ ');
              if (splitIndex !== -1) {
                return displayTitle.substring(0, splitIndex);
              }
              return displayTitle;
            })()}
          </TruncatedText>

          {/* Description - Hidden for now (data still in database) */}
          {/* {(() => {
            const splitIndex = displayTitle.indexOf(' @ ');

            // Case 1: Split found - show the second part as description
            if (splitIndex !== -1) {
              return (
                <TruncatedText
                  as="p"
                  maxLines={3}
                  className={`text-neutral-700 mb-6 flex-1 font-medium leading-relaxed border-l-4 border-primary-500 pl-3 ${language === 'en' ? 'text-sm' : 'text-xs'}`}
                >
                  {displayTitle.substring(splitIndex + 1)}
                </TruncatedText>
              );
            }

            // Case 2: No split, check if description is repetitive (case-insensitive) OR empty
            if (displayTitle.toLowerCase() === displayDescription.toLowerCase() || !displayDescription.trim()) {
              return <div className="flex-1 min-h-[1rem]"></div>; // Spacer
            }

            // Case 3: Different content - show description
            return (
              <TruncatedText
                as="p"
                maxLines={3}
                className={`text-neutral-700 mb-6 flex-1 font-medium leading-relaxed border-l-4 border-primary-500 pl-3 ${language === 'en' ? 'text-sm' : 'text-xs'}`}
              >
                {displayDescription}
              </TruncatedText>
            );
          })()} */}
          <div className="flex-1 min-h-[1rem]"></div>

          {/* Metadata Grid - Rugged */}
          <div className="mt-auto grid grid-cols-2 gap-4 border-t-2 border-black pt-3 bg-neutral-50 -mx-5 -mb-5 p-4">
            {/* Village */}
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-neutral-500 mb-1">{t.graphic.location}</span>
              <div className="flex items-center gap-1.5 font-bold text-sm text-black">
                <MapPin size={14} className="text-primary-600" />
                <TruncatedText>
                  {getVillageName(project.village, language)}
                </TruncatedText>
              </div>
            </div>

            {/* Budget */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-neutral-500 mb-1">{t.graphic.budget}</span>
              <div className="flex items-center gap-1.5 font-mono font-black text-lg text-white bg-primary-600 px-3 py-1 border-2 border-black transform -rotate-1 shadow-md">
                {project.budget}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
