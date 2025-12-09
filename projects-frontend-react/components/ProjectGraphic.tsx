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

  const villageName = filters.village
    ? getVillageName(filters.village, lang)
    : (lang === 'ta' ? 'நெய்வேலி தொகுதி' : 'Neyveli Constituency');

  // Translation helpers
  const t = {
    lakhs: lang === 'ta' ? 'லட்சம்' : 'Lakhs',
    crore: lang === 'ta' ? 'கோடி' : 'Crore'
  };

  return (
    <div
      id="shareable-graphic"
      style={{
        width: '1080px',
        height: '1920px', // Fixed height for template
        backgroundImage: 'url(/assets/images/share_template.png)',
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

      {/* Location Badge - Positioned below the Header Text area */}
      <div style={{
        position: 'absolute',
        top: '480px', // Adjusted based on visual estimation of header height
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
        <span style={{
          fontSize: '36px',
          fontWeight: '800',
          color: '#422006', // Brown
          marginTop: '-4px' // Optical adjustment for font
        }}>
          {villageName}
          {filters.block && filters.block !== 'All' ? `, ${getVillageName(filters.block, lang)}` : ''}
        </span>
      </div>


      {/* ================= PROJECT LIST ================= */}
      {/* Container positioned in the "Body" safe zone of the template */}
      <div style={{
        marginTop: '550px', // Reduced top margin for better balance
        marginBottom: '400px', // Adjusted bottom
        padding: '0 80px', // Horizontal margins
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '28px', // Increased gap slightly
        justifyContent: 'flex-start' // Ensure list starts from top
      }}>
        {displayProjects.map((project) => {
          // Format based on mockup: Description - Cost
          // Cost is highlighted in red.
          const description = lang === 'ta'
            ? (project.description_ta || project.description)
            : project.description;

          return (
            <div
              key={project.id}
              style={{
                backgroundColor: 'white',
                border: '3px solid #60a5fa', // Blue-400 border matches mockup
                borderRadius: '24px', // Softer corners
                padding: '28px 36px', // More breathing room
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', // Deeper shadow
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <p style={{
                fontSize: '30px', // Larger text
                lineHeight: '1.5',
                color: '#111827', // Gray-900
                fontWeight: '600',
                margin: 0
              }}>
                {description}
                <span style={{ margin: '0 12px' }}>-</span>
                <span style={{
                  color: '#dc2626', // Red-600
                  fontWeight: '800',
                  whiteSpace: 'nowrap'
                }}>
                  {project.rawBudget >= 10000000
                    ? `₹ ${(project.rawBudget / 10000000).toFixed(2)} ${t.crore}.`
                    : project.rawBudget >= 100000
                      ? `₹ ${(project.rawBudget / 100000).toFixed(2)} ${t.lakhs}.`
                      : `₹ ${project.rawBudget}.`
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
