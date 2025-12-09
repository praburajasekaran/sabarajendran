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
  lang?: string;
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
    ? getVillageName(filters.village, 'ta')
    : 'நெய்வேலி தொகுதி';

  return (
    <div
      id="shareable-graphic"
      style={{
        width: '1080px',
        height: '1920px', // Fixed height for template
        backgroundImage: 'url(/assets/images/share_template.png)',
        backgroundSize: '100% 100%', // Stretch to fit exactly
        backgroundRepeat: 'no-repeat',
        fontFamily: 'Inter, sans-serif',
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
        border: '2px solid #fde047',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 10
      }}>
        <MapPin size={32} color="#dc2626" fill="#dc2626" style={{ marginRight: '16px' }} />
        <span style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#422006', // Brown
        }}>
          {villageName}
          {filters.block && filters.block !== 'All' ? `, ${getVillageName(filters.block, 'ta')}` : ''}
        </span>
      </div>


      {/* ================= PROJECT LIST ================= */}
      {/* Container positioned in the "Body" safe zone of the template */}
      <div style={{
        marginTop: '600px', // Push down past header + badge
        marginBottom: '450px', // Reserve space for footer
        padding: '0 80px', // Horizontal margins
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        // overflow: 'hidden' // Prevent spillover
      }}>
        {displayProjects.map((project) => {
          // Format based on mockup: Description - Cost
          // Cost is highlighted in red.
          const description = project.description_ta || project.description;

          return (
            <div
              key={project.id}
              style={{
                backgroundColor: 'white',
                border: '3px solid #60a5fa', // Blue-400 border matches mockup
                borderRadius: '20px',
                padding: '24px 32px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <p style={{
                fontSize: '28px', // Slightly larger for readability on stories
                lineHeight: '1.4',
                color: '#111827', // Gray-900
                fontWeight: '600',
                margin: 0
              }}>
                {description}
                <span style={{ margin: '0 8px' }}>-</span>
                <span style={{
                  color: '#dc2626', // Red-600
                  fontWeight: '800',
                  whiteSpace: 'nowrap'
                }}>
                  ₹ {project.rawBudget} {project.budget.includes('L') ? 'லட்சம்' : 'கோடி'}.
                </span>
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
};
