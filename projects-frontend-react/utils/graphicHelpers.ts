/**
 * Graphic Helpers for WhatsApp Shareable Graphics
 *
 * Utilities for generating dynamic titles and formatting project data
 * for WhatsApp-shareable graphics based on current filter context.
 */

import { FilterState } from './urlBuilder';

/**
 * Generates a dynamic hero title based on active filters
 *
 * Priority: Village > Panchayat > Block > Scheme > Type > Status
 *
 * @example
 * generateHeroTitle({ village: 'Vadalur', ...defaults })
 * // Returns: "Vadalur Village Projects"
 *
 * generateHeroTitle({ block: 'Kurinjipadi', type: 'Water Supply', status: 'Completed', ...defaults })
 * // Returns: "Kurinjipadi Block Water Supply Completed Projects"
 *
 * generateHeroTitle({ scheme: 'MLACDS-Neyveli', ...defaults })
 * // Returns: "MLACDS-Neyveli Projects"
 *
 * @param filters - Current filter state from useUrlFilters
 * @returns Dynamic hero title string
 */
export const generateHeroTitle = (filters: FilterState): string => {
  const parts: string[] = [];

  // Location hierarchy: Village > Panchayat > Block
  if (filters.village) {
    parts.push(`${filters.village} Village`);
  } else if (filters.panchayat !== 'All') {
    parts.push(`${filters.panchayat} Panchayat`);
  } else if (filters.block !== 'All') {
    parts.push(`${filters.block} Block`);
  }

  // Scheme takes priority over type
  if (filters.scheme !== 'All') {
    parts.push(filters.scheme);
  } else if (filters.type !== 'All') {
    parts.push(filters.type);
  }

  // Status modifier
  if (filters.status !== 'All') {
    parts.push(filters.status);
  }

  // Always end with "Projects"
  parts.push('Projects');

  return parts.join(' ');
};

/**
 * Generates a rich subtitle showing filter context instead of project count
 *
 * Priority: Year > Type/Scheme > Status > Location (Village > Panchayat > Block)
 *
 * @example
 * generateSubtitle({ year: '2024-2025', type: 'Water Supply', status: 'Completed' })
 * // Returns: "2024-2025 | Water Supply | Completed"
 *
 * generateSubtitle({ scheme: 'MLACDS-Neyveli', block: 'Kurinjipadi' })
 * // Returns: "MLACDS-Neyveli | Kurinjipadi Block"
 *
 * generateSubtitle({ village: 'Vadalur', year: '2023-2024' })
 * // Returns: "2023-2024 | Vadalur Village"
 *
 * @param filters - Current filter state
 * @param lang - Language code ('en' or 'ta')
 * @returns Subtitle string with filter context
 */
export const generateSubtitle = (
  filters: FilterState,
  lang: string = 'en'
): string => {
  const parts: string[] = [];

  // Year (always show if filtered)
  if (filters.year !== 'All') {
    parts.push(filters.year);
  }

  // Scheme takes priority over Type
  if (filters.scheme !== 'All') {
    parts.push(filters.scheme);
  } else if (filters.type !== 'All') {
    parts.push(filters.type);
  }

  // Status
  if (filters.status !== 'All') {
    parts.push(filters.status);
  }

  // Location hierarchy (most specific)
  if (filters.village) {
    parts.push(`${filters.village} Village`);
  } else if (filters.panchayat !== 'All') {
    parts.push(`${filters.panchayat} Panchayat`);
  } else if (filters.block !== 'All') {
    parts.push(`${filters.block} Block`);
  }

  // Fallback if no filters applied
  if (parts.length === 0) {
    return lang === 'ta'
      ? 'அனைத்து வளர்ச்சித் திட்டங்கள்'
      : 'All Development Projects';
  }

  return parts.join(' | ');
};

/**
 * Formats budget for display in graphics
 * Ensures consistent, clean formatting
 *
 * @param budget - Budget string (e.g., "₹50 Lakhs", "₹2 Cr")
 * @returns Formatted budget string
 */
export const formatBudgetForGraphic = (budget: string): string => {
  return budget;
};

/**
 * Truncates project title to fit in graphic card
 *
 * @param title - Full project title
 * @param maxLength - Maximum character length (default: 60)
 * @returns Truncated title with ellipsis if needed
 */
export const truncateTitle = (title: string, maxLength: number = 60): string => {
  if (title.length <= maxLength) {
    return title;
  }
  return title.substring(0, maxLength - 3) + '...';
};

/**
 * Calculates dynamic graphic height based on project count
 *
 * Uses different layouts for different project counts:
 * - 1-3 projects: List view with large cards (220px each)
 * - 4-6 projects: Compact grid (180px per card)
 * - 7-8 projects: Standard grid (160px per card)
 *
 * @param projectCount - Number of projects to display
 * @returns Calculated height in pixels
 */
export const calculateGraphicHeight = (projectCount: number): number => {
  const HEADER_HEIGHT = 280;  // DMK bar + Logo + Title + Subtitle + MLA info
  const FOOTER_HEIGHT = 128;  // Footer section
  const VERTICAL_PADDING = 48; // Top and bottom padding of projects section

  if (projectCount <= 3) {
    // List view: each card is 220px + 16px gap between cards
    const CARD_HEIGHT = 220;
    const GAP = 16;
    const projectsHeight = (projectCount * CARD_HEIGHT) + ((projectCount - 1) * GAP);
    return HEADER_HEIGHT + projectsHeight + VERTICAL_PADDING + FOOTER_HEIGHT;
  } else if (projectCount <= 6) {
    // Compact grid: 2 columns, cards are 180px + 16px gap
    const CARD_HEIGHT = 180;
    const GAP = 16;
    const rows = Math.ceil(projectCount / 2);
    const projectsHeight = (rows * CARD_HEIGHT) + ((rows - 1) * GAP);
    return HEADER_HEIGHT + projectsHeight + VERTICAL_PADDING + FOOTER_HEIGHT;
  } else {
    // Standard grid: 2 columns, cards are 160px + 16px gap
    const CARD_HEIGHT = 160;
    const GAP = 16;
    const rows = Math.ceil(projectCount / 2);
    const projectsHeight = (rows * CARD_HEIGHT) + ((rows - 1) * GAP);
    return HEADER_HEIGHT + projectsHeight + VERTICAL_PADDING + FOOTER_HEIGHT;
  }
};

/**
 * Returns color for project status badges
 *
 * @param status - Project status string
 * @returns Hex color code
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Completed':
      return '#16a34a'; // Green
    case 'Ongoing':
      return '#dc2626'; // Red (DMK primary)
    case 'Planned':
      return '#2563eb'; // Blue
    case 'Halted':
      return '#78716c'; // Gray
    default:
      return '#dc2626'; // Default to DMK primary
  }
};
