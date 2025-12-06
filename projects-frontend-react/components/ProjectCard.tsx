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
  const displayDescription = (language === 'ta' && project.description_ta) ? project.description_ta : project.description;

  // Status dot styles
  const getStatusDot = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return 'status-dot completed';
      case ProjectStatus.ONGOING:
        return 'status-dot ongoing';
      default:
        return 'status-dot planned';
    }
  };

  // Type configuration with icons
  const getTypeConfig = (type: ProjectType) => {
    switch (type) {
      case ProjectType.INFRASTRUCTURE:
        return { icon: HardHat, image: '/assets/placeholders/infrastructure.png', color: 'text-neutral-700' };
      case ProjectType.WATER:
        return { icon: Droplets, image: '/assets/placeholders/water.png', color: 'text-cyan-600' };
      case ProjectType.EDUCATION:
        return { icon: School, image: '/assets/placeholders/education.png', color: 'text-primary-600' };
      case ProjectType.HEALTH:
        return { icon: HeartPulse, image: '/assets/placeholders/health.png', color: 'text-rose-600' };
      case ProjectType.ELECTRICITY:
        return { icon: Zap, image: '/assets/placeholders/electricity.png', color: 'text-secondary-600' };
      case ProjectType.COMMUNITY:
        return { icon: Users, image: '/assets/placeholders/community.png', color: 'text-orange-600' };
      case ProjectType.AGRICULTURE:
        return { icon: Sprout, image: '/assets/placeholders/agriculture.png', color: 'text-emerald-600' };
      default:
        return { icon: HardHat, image: '/assets/placeholders/infrastructure.png', color: 'text-neutral-700' };
    }
  };

  const typeConfig = getTypeConfig(project.type);
  const TypeIcon = typeConfig.icon;

  return (
    <>
      {/* Magazine-Style Editorial Card */}
      <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md flex flex-col h-full">

        {/* Content Overlay Card (Bottom) */}
        <div className="relative mx-4 my-4 bg-white rounded-xl shadow-sm p-6 flex flex-col flex-1 border border-neutral-100">
          {/* Title */}
          <TruncatedText
            as="h3"
            maxLines={2}
            className="font-serif text-xl font-bold text-neutral-900 mb-2 leading-tight"
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

          {/* Description */}
          {(() => {
            const splitIndex = displayTitle.indexOf(' @ ');

            // Case 1: Split found - show the second part as description
            if (splitIndex !== -1) {
              return (
                <TruncatedText
                  as="p"
                  maxLines={2}
                  className="text-neutral-600 text-sm mb-4 flex-1"
                >
                  {displayTitle.substring(splitIndex + 1)}
                </TruncatedText>
              );
            }

            // Case 2: No split, check if description is repetitive (case-insensitive)
            if (displayTitle.toLowerCase() === displayDescription.toLowerCase()) {
              return null; // Hide if identical
            }

            // Case 3: Different content - show description
            return (
              <TruncatedText
                as="p"
                maxLines={2}
                className="text-neutral-600 text-sm mb-4 flex-1"
              >
                {displayDescription}
              </TruncatedText>
            );
          })()}

          {/* Metadata - Flex Layout with Right-Aligned Numbers */}
          <div className="mt-auto pt-4 border-t border-accent-100">
            <div className="flex flex-col gap-3 text-sm">
              {/* Top Row: Village (left) + Year (right) */}
              <div className="flex items-center justify-between gap-4">
                {/* Village - Left */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MapPin size={16} className="text-primary-600 flex-shrink-0" />
                  <TruncatedText className="text-neutral-700 text-xs font-medium">
                    {getVillageName(project.village, language)}
                  </TruncatedText>
                </div>

                {/* Year - Right */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Calendar size={16} className="text-secondary-600 flex-shrink-0" />
                  <span className="text-neutral-700 text-xs font-medium whitespace-nowrap">{project.year}</span>
                </div>
              </div>

              {/* Bottom Row: Scheme (left) + Budget (right) */}
              <div className="flex items-end justify-between gap-4">
                {/* Scheme - Left */}
                {project.scheme ? (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText size={16} className="text-primary-600 flex-shrink-0" />
                    <TruncatedText className="text-neutral-700 text-xs font-medium">
                      {project.scheme}
                    </TruncatedText>
                  </div>
                ) : (
                  <div className="flex-1"></div>
                )}

                {/* Budget - Right */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Banknote size={18} className="text-primary-600 flex-shrink-0" />
                  <span className="text-primary-700 font-mono text-lg font-bold whitespace-nowrap leading-none">{project.budget}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};
