import React, { useState } from 'react';
import {
  MapPin, Calendar, Banknote, CheckCircle2, Clock, AlertCircle,
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

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case ProjectStatus.ONGOING:
        return 'bg-secondary-100 text-secondary-800 border-secondary-200';
      case ProjectStatus.PLANNED:
        return 'bg-stone-100 text-stone-800 border-stone-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return <CheckCircle2 size={14} className="mr-1" />;
      case ProjectStatus.ONGOING:
        return <Clock size={14} className="mr-1" />;
      default:
        return <AlertCircle size={14} className="mr-1" />;
    }
  };

  const getTypeConfig = (type: ProjectType) => {
    switch (type) {
      case ProjectType.INFRASTRUCTURE:
        return { color: 'bg-stone-800', icon: HardHat, image: '/assets/placeholders/infrastructure.png' }; // Dark Grey/Black for Roads
      case ProjectType.WATER:
        return { color: 'bg-cyan-700', icon: Droplets, image: '/assets/placeholders/water.png' };
      case ProjectType.EDUCATION:
        return { color: 'bg-primary-700', icon: School, image: '/assets/placeholders/education.png' }; // Red for Education
      case ProjectType.HEALTH:
        return { color: 'bg-rose-600', icon: HeartPulse, image: '/assets/placeholders/health.png' };
      case ProjectType.ELECTRICITY:
        return { color: 'bg-secondary-600', icon: Zap, image: '/assets/placeholders/electricity.png' }; // Yellow/Orange for Power
      case ProjectType.COMMUNITY:
        return { color: 'bg-orange-700', icon: Users, image: '/assets/placeholders/community.png' };
      case ProjectType.AGRICULTURE:
        return { color: 'bg-emerald-700', icon: Sprout, image: '/assets/placeholders/agriculture.png' };
      default:
        return { color: 'bg-stone-600', icon: HardHat, image: '/assets/placeholders/infrastructure.png' };
    }
  };

  const typeConfig = getTypeConfig(project.type);
  const TypeIcon = typeConfig.icon;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md hover:border-primary-200 transition-all duration-300 flex flex-col h-full group relative">

        {/* Party Strip at the top */}
        <div className="h-1.5 w-full flex">
          <div className="w-1/2 bg-black"></div>
          <div className="w-1/2 bg-primary-600"></div>
        </div>

        {/* Header Area: Visuals & Icon */}
        <div className={`relative h-40 ${typeConfig.color} flex items-center justify-center overflow-hidden`}>
          {/* Background pattern/gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>

          {/* Placeholder Image Background */}
          {!project.imageUrl && (
            <div className="absolute inset-0 z-0">
              <img
                src={typeConfig.image}
                alt=""
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          )}

          {/* Project Image Background (if available, overrides placeholder) */}
          {project.imageUrl && (
            <div className="absolute inset-0 z-0">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          )}

          <div className="absolute -right-6 -top-6 text-white opacity-10 transform rotate-12 z-0">
            <TypeIcon size={160} />
          </div>

          {/* Center Icon */}
          <div className="relative z-10 flex flex-col items-center text-white">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full mb-2 border border-white/30 shadow-lg">
              <TypeIcon size={32} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded text-white/95 backdrop-blur-sm">
              {t.types[project.type] || project.type}
            </span>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 left-3 z-20">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm ${getStatusColor(project.status)} bg-white/95 backdrop-blur`}>
              {getStatusIcon(project.status)}
              {t.status[project.status] || project.status}
            </span>
          </div>

          {/* Image Thumbnail (if available) */}
          {project.imageUrl && (
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-3 right-3 z-20 w-12 h-12 rounded-lg border-2 border-white shadow-lg overflow-hidden group/thumb hover:scale-105 transition-transform"
              title={t.card.viewPhoto}
            >
              <img
                src={project.imageUrl}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                <ZoomIn size={16} className="text-white" />
              </div>
            </button>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-stone-900 mb-2 leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors" title={displayTitle}>
            {(() => {
              // Always try to split if @ is present
              const splitIndex = displayTitle.indexOf(' @ ');
              if (splitIndex !== -1) {
                return displayTitle.substring(0, splitIndex);
              }
              return displayTitle;
            })()}
          </h3>
          {(() => {
            const splitIndex = displayTitle.indexOf(' @ ');

            // Case 1: Split found - show the second part as description
            if (splitIndex !== -1) {
              return (
                <p className="text-stone-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
                  {displayTitle.substring(splitIndex + 1)} {/* +1 to skip space, keep @ */}
                </p>
              );
            }

            // Case 2: No split, check if description is repetitive (case-insensitive)
            if (displayTitle.toLowerCase() === displayDescription.toLowerCase()) {
              return null; // Hide if identical
            }

            // Case 3: Different content - show description
            return (
              <p className="text-stone-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
                {displayDescription}
              </p>
            );
          })()}

          <div className="space-y-3 text-sm text-stone-500 mt-auto pt-4 border-t border-stone-100 bg-stone-50/50 -mx-5 -mb-5 px-5 py-3">
            <div className="flex items-center">
              <MapPin size={16} className="mr-2 text-primary-600 flex-shrink-0" />
              <span className="font-medium text-stone-700 truncate">{project.village}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center" title="Project Year">
                <Calendar size={16} className="mr-2 text-primary-600 flex-shrink-0" />
                <span>{project.year}</span>
              </div>
              <div className="flex items-center" title="Budget">
                <Banknote size={16} className="mr-2 text-primary-600 flex-shrink-0" />
                <span className="font-semibold text-stone-900 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">{project.budget}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox for Full Image */}
      {isLightboxOpen && project.imageUrl && (
        <Lightbox
          imageUrl={project.imageUrl}
          altText={project.title}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
};