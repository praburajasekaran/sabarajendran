import React, { useState } from 'react';
import {
  MapPin, Calendar, Banknote,
  School, Droplets, Zap, HeartPulse, Users, Sprout, HardHat,
  ZoomIn
} from 'lucide-react';
import { Project, ProjectStatus, ProjectType } from '../types';
import { Lightbox } from './Lightbox';
import { useLanguage } from '../contexts/LanguageContext';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
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
      <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 card-lift flex flex-col h-full">

        {/* Full-Bleed Image */}
        <div className="relative h-64 overflow-hidden image-zoom">
          <img
            src={project.imageUrl || typeConfig.image}
            alt={displayTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails
              e.currentTarget.src = typeConfig.image;
            }}
          />

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

          {/* Type Icon Badge (top-right) */}
          <div className={`absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm ${typeConfig.color} shadow-lg`}>
            <TypeIcon size={20} />
          </div>

          {/* Status Dot (top-left) */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm">
            <span className={getStatusDot(project.status)}></span>
            <span className="text-xs font-medium text-neutral-800">
              {t.status[project.status] || project.status}
            </span>
          </div>

          {/* Zoom Button (bottom-right, shows on hover) */}
          {project.imageUrl && (
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white shadow-lg"
              title={t.card.viewPhoto}
            >
              <ZoomIn size={18} className="text-neutral-800" />
            </button>
          )}
        </div>

        {/* Content Overlay Card (Bottom) */}
        <div className="relative -mt-12 mx-4 mb-4 bg-white rounded-xl shadow-lg p-6 flex flex-col flex-1">
          {/* Title */}
          <h3 className="font-serif text-xl font-bold text-neutral-900 mb-2 leading-tight line-clamp-2" title={displayTitle}>
            {(() => {
              // Always try to split if @ is present
              const splitIndex = displayTitle.indexOf(' @ ');
              if (splitIndex !== -1) {
                return displayTitle.substring(0, splitIndex);
              }
              return displayTitle;
            })()}
          </h3>

          {/* Description */}
          {(() => {
            const splitIndex = displayTitle.indexOf(' @ ');

            // Case 1: Split found - show the second part as description
            if (splitIndex !== -1) {
              return (
                <p className="text-neutral-600 text-sm mb-4 line-clamp-2 flex-1">
                  {displayTitle.substring(splitIndex + 1)}
                </p>
              );
            }

            // Case 2: No split, check if description is repetitive (case-insensitive)
            if (displayTitle.toLowerCase() === displayDescription.toLowerCase()) {
              return null; // Hide if identical
            }

            // Case 3: Different content - show description
            return (
              <p className="text-neutral-600 text-sm mb-4 line-clamp-2 flex-1">
                {displayDescription}
              </p>
            );
          })()}

          {/* Metadata Grid */}
          <div className="mt-auto pt-4 border-t border-accent-100">
            <div className="grid grid-cols-3 gap-4 text-sm">
              {/* Location */}
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 truncate text-xs font-medium">{project.village}</span>
              </div>

              {/* Year */}
              <div className="flex items-start gap-2">
                <Calendar size={16} className="text-secondary-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 text-xs font-medium">{project.year}</span>
              </div>

              {/* Budget */}
              <div className="flex items-start gap-2">
                <Banknote size={16} className="text-accent-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-900 font-mono text-xs font-bold">{project.budget}</span>
              </div>
            </div>
          </div>

          {/* Type Label (Bottom) */}
          <div className="mt-3 pt-3 border-t border-accent-100">
            <span className="text-xs text-neutral-500 uppercase tracking-wide">
              {t.types[project.type] || project.type}
            </span>
          </div>
        </div>
      </div>

      {/* Lightbox for Full Image */}
      {isLightboxOpen && project.imageUrl && (
        <Lightbox
          imageUrl={project.imageUrl}
          altText={displayTitle}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
};
