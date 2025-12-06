/**
 * ProjectGraphic Component
 *
 * Hidden component that renders a WhatsApp-optimized graphic layout
 * showing filtered projects. This component is converted to an image
 * via html2canvas for sharing.
 *
 * Design: Adaptive layout based on project count
 * - 1-3 projects: List view with detailed cards
 * - 4-6 projects: Compact grid (2 columns)
 * - 7-8 projects: Standard grid (2 columns)
 *
 * Dimensions: 1200px width × dynamic height
 */

import React from 'react';
import { Banknote } from 'lucide-react';
import { Project } from '../types';
import { FilterState } from '../utils/urlBuilder';
import { generateHeroTitle, generateSubtitle, calculateGraphicHeight, getStatusColor } from '../utils/graphicHelpers';
import { getVillageName } from '../utils/villageTranslations';

interface ProjectGraphicProps {
  /** Projects to display (sorted by budget) */
  projects: Project[];
  /** Current filter state */
  filters: FilterState;
  /** Language code (en or ta) */
  lang?: string;
}

export const ProjectGraphic: React.FC<ProjectGraphicProps> = ({
  projects,
  filters,
  lang = 'en'
}) => {
  const heroTitle = generateHeroTitle(filters);
  const subtitle = generateSubtitle(filters, lang);
  const graphicHeight = calculateGraphicHeight(projects.length);

  // Detect layout mode based on project count
  const isListView = projects.length <= 3;
  const isCompactGrid = projects.length >= 4 && projects.length <= 6;

  return (
    <div
      id="shareable-graphic"
      className="bg-white"
      style={{
        width: '1200px',
        height: `${graphicHeight}px`,
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* DMK Header Bar - Red/Black gradient */}
      <div
        className="h-2"
        style={{
          background: 'linear-gradient(90deg, #dc2626 0%, #dc2626 50%, #0a0a0a 50%, #0a0a0a 100%)'
        }}
      />

      {/* Hero Section */}
      <div className="bg-white px-16 py-12 text-center">
        {/* DMK Rising Sun Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/dmk.svg"
            alt="DMK Logo"
            className="h-16"
            style={{ height: '64px' }}
          />
        </div>

        {/* Dynamic Title */}
        <h1
          className="font-bold text-neutral-900 mb-3"
          style={{
            fontSize: '48px',
            lineHeight: '1.2',
            fontWeight: '800'
          }}
        >
          {heroTitle}
        </h1>

        {/* Subtitle - Filter Context */}
        <p
          className="text-neutral-600 mb-4"
          style={{
            fontSize: '20px',
            fontWeight: '500'
          }}
        >
          {subtitle}
        </p>

        {/* MLA Info */}
        <p
          className="text-neutral-700"
          style={{
            fontSize: '18px',
            fontWeight: '600'
          }}
        >
          MLA Saba Rajendran | Neyveli Constituency
        </p>
      </div>

      {/* Projects Section - Adaptive Layout */}
      <div className="px-8 py-6">
        {isListView ? (
          // List View (1-3 projects)
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  width: '1120px',
                  height: '220px',
                  borderRadius: '16px',
                  border: '2px solid #e5e5e5',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '24px',
                  padding: '32px'
                }}
              >
                {/* Left: Status Badge & Budget */}
                <div style={{
                  width: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  alignItems: 'flex-start'
                }}>
                  {/* Status Badge */}
                  <div style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    backgroundColor: getStatusColor(project.status),
                    color: 'white'
                  }}>
                    {project.status}
                  </div>

                  {/* Budget - Prominent */}
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#78716c',
                      marginBottom: '4px',
                      fontWeight: '500'
                    }}>
                      Budget
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Banknote size={28} style={{ color: '#dc2626' }} />
                      <span style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: '#dc2626',
                        fontFamily: 'Inter, monospace'
                      }}>
                        {project.budget}
                      </span>
                    </div>
                  </div>

                  {/* Year */}
                  <div style={{
                    fontSize: '13px',
                    color: '#78716c',
                    fontWeight: '500'
                  }}>
                    {project.year}
                  </div>
                </div>

                {/* Right: Project Details */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {/* Title */}
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    lineHeight: '1.3',
                    color: '#0a0a0a',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {lang === 'ta' && project.title_ta ? project.title_ta : project.title}
                  </h3>

                  {/* Description Snippet */}
                  <p style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#525252',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {lang === 'ta' && project.description_ta ? project.description_ta : project.description}
                  </p>

                  {/* Bottom Row: Location & Type/Scheme */}
                  <div style={{
                    marginTop: 'auto',
                    display: 'flex',
                    gap: '16px',
                    fontSize: '13px',
                    color: '#78716c',
                    fontWeight: '500'
                  }}>
                    <div>📍 {getVillageName(project.village, lang as 'en' | 'ta')}</div>
                    {project.scheme && <div>📋 {project.scheme}</div>}
                    {!project.scheme && project.type && <div>🏗️ {project.type}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Grid View (4-8 projects)
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}
          >
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-6"
                style={{
                  minHeight: isCompactGrid ? '180px' : '160px',
                  borderRadius: '12px',
                  border: '2px solid #e5e5e5',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Project Title */}
                <h3
                  className="font-semibold text-neutral-900 mb-3"
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    lineHeight: '1.3',
                    marginBottom: '10px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: '1 1 auto'
                  }}
                >
                  {lang === 'ta' && project.title_ta ? project.title_ta : project.title}
                </h3>

                {/* Budget */}
                <div
                  className="flex items-center gap-2"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Banknote
                    size={20}
                    style={{
                      color: '#dc2626',
                      flexShrink: 0
                    }}
                  />
                  <span
                    className="font-bold text-primary-700"
                    style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#dc2626',
                      fontFamily: 'Inter, monospace'
                    }}
                  >
                    {project.budget}
                  </span>
                </div>

                {/* Village name (subtle) */}
                <p
                  className="text-neutral-500"
                  style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#78716c',
                    marginTop: '6px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {getVillageName(project.village, lang as 'en' | 'ta')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="bg-neutral-900 text-white px-8 py-8 text-center mt-auto"
        style={{
          backgroundColor: '#0a0a0a',
          color: 'white',
          padding: '32px',
          textAlign: 'center',
          marginTop: 'auto'
        }}
      >
        <p
          className="font-bold text-primary-400 mb-2"
          style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#dc2626',
            marginBottom: '8px'
          }}
        >
          sabarajendran.com
        </p>
        <p
          className="text-neutral-400"
          style={{
            fontSize: '14px',
            color: '#a3a3a3'
          }}
        >
          For more development projects and updates
        </p>
      </div>
    </div>
  );
};
