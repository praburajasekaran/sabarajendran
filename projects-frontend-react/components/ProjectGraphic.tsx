/**
 * ProjectGraphic Component
 *
 * WhatsApp-optimized graphic layout using a provided Template.
 *
 * - Background: /assets/images/share_template.png
 * - Dimensions: 1080x1920 (Standard Story Format)
 * - Dynamic Content: Village Badge, Project Cards
 */

import React from 'react';
import { MapPin } from 'lucide-react';
import { Project } from '../types';
import { FilterState } from '../utils/urlBuilder';
import { getVillageName } from '../utils/villageTranslations';
import { TRANSLATIONS } from '../utils/translations';

interface ProjectGraphicProps {
  projects: Project[];
  filters: FilterState;
  lang?: 'ta' | 'en';
}

export const ProjectGraphic: React.FC<ProjectGraphicProps> = ({
  projects,
  filters,
  lang = 'ta' // Default to Tamil
}) => {
  // Use first 5 projects to ensure they fit in the template's safe zone
  // Reduced to 5 to avoid overcrowding vertically
  const displayProjects = projects.slice(0, 5);

  // Translation helpers
  const currentLang: 'ta' | 'en' = (lang === 'ta' || lang === 'en') ? lang : 'ta';

  // Determine location display based on filter hierarchy
  const getLocationDisplay = (): string => {
    // Priority: village > panchayat > block > default
    if (filters.village) {
      return getVillageName(filters.village, currentLang);
    }

    if (filters.panchayat && filters.panchayat !== 'All') {
      const panchayatName = getVillageName(filters.panchayat, currentLang);
      const blockName = filters.block && filters.block !== 'All'
        ? getVillageName(filters.block, currentLang)
        : '';
      return blockName ? `${panchayatName}, ${blockName}` : panchayatName;
    }

    if (filters.block && filters.block !== 'All') {
      return getVillageName(filters.block, currentLang);
    }

    return currentLang === 'ta' ? 'நெய்வேலி தொகுதி' : 'Neyveli Constituency';
  };

  const villageName = getLocationDisplay();

  const t = {
    lakhs: currentLang === 'ta' ? 'லட்சம்' : 'Lakhs',
    crore: currentLang === 'ta' ? 'கோடி' : 'Crore',
    location: TRANSLATIONS[currentLang].graphic.location,
    budget: TRANSLATIONS[currentLang].graphic.budget
  };

  return (
    <div
      id="shareable-graphic"
      style={{
        width: '1080px',
        height: '1920px', // Fixed height for template
        backgroundImage: `url(/assets/images/${currentLang === 'en' ? 'share_graphic_bg_en.png' : 'share_template.png'})`,
        backgroundSize: '100% 100%', // Stretch to fit exactly
        backgroundRepeat: 'no-repeat',
        fontFamily: '"Anek Tamil", sans-serif',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* ================= DYNAMIC OVERLAYS ================= */}

      {/* Location Label */}
      <div style={{
        position: 'absolute',
        top: '430px',
        left: '80px',
        fontSize: '20px',
        fontWeight: '700',
        color: '#6b7280',
        letterSpacing: '0.5px'
      }}>
        {t.location}
      </div>

      {/* Location Badge - Positioned below the Header Text area */}
      <div style={{
        position: 'absolute',
        top: '460px', // Adjusted based on visual estimation of header height
        left: '80px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fef9c3', // Yellow-100
        padding: '12px 32px',
        borderRadius: '50px',
        border: '3px solid #fde047',
        boxShadow: '0 6px 12px -2px rgba(0, 0, 0, 0.15)',
        zIndex: 10
      }}>
        <MapPin size={36} color="#dc2626" fill="#dc2626" style={{ marginRight: '16px' }} />
        <span translate="no" style={{
          fontSize: '36px',
          fontWeight: '800',
          color: '#8B6F47', // Lighter Brown
          marginTop: '-4px' // Optical adjustment for font
        }}>
          {villageName}
        </span>
      </div>


      {/* ================= PROJECT LIST ================= */}
      {/* Container positioned in the "Body" safe zone of the template */}
      <div style={{
        marginTop: '570px', // Adjusted for location label
        marginBottom: '400px', // Adjusted bottom
        padding: '0 80px', // Horizontal margins
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '28px', // Increased gap slightly
        justifyContent: 'flex-start' // Ensure list starts from top
      }}>
        {displayProjects.map((project, index) => {
          // Format based on mockup: Description - Cost
          // Cost is highlighted in red.
          const description = currentLang === 'ta'
            ? (project.title_ta || project.title)
            : project.title;

          return (
            <div
              key={project.id}
              style={{
                backgroundColor: 'white',
                border: '3px solid #60a5fa', // Blue-400 border matches mockup
                borderRadius: '24px', // Softer corners
                padding: '24px 36px', // More breathing room
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', // Deeper shadow
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {/* Budget Label - Only show on first project */}
              {index === 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-32px',
                  right: '36px',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#6b7280',
                  letterSpacing: '0.5px'
                }}>
                  {t.budget}
                </div>
              )}
              <p translate="no" style={{
                fontSize: '30px', // Larger text
                lineHeight: '1.5',
                color: '#111827', // Gray-900
                fontWeight: '600',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ flex: 1 }}>{description}</span>
                <span style={{ margin: '0 16px', color: '#9ca3af' }}>-</span>
                <span style={{
                  color: '#b91c1c', // Darker red for better contrast
                  fontWeight: '800',
                  fontSize: '42px', // Larger budget text
                  whiteSpace: 'nowrap'
                }}>
                  {project.rawBudget >= 10000000
                    ? `₹${(project.rawBudget / 10000000).toFixed(2)} ${t.crore}.`
                    : project.rawBudget >= 100000
                      ? `₹${(project.rawBudget / 100000).toFixed(2)} ${t.lakhs}.`
                      : `₹${project.rawBudget}.`
                  }
                </span>
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
};
