/**
 * Page Detection Hook
 *
 * Detects which page the user is currently on to conditionally render
 * the WhatsApp shareable graphic button.
 */

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to detect if user is on a Projects page
 *
 * Returns true for:
 * - /projects
 * - /projects/:blockSlug
 * - /projects/:blockSlug/:panchayatSlug
 * - /projects/:blockSlug/:panchayatSlug/:villageSlug
 * - /ta/projects (Tamil)
 * - /ta/projects/... (Tamil variations)
 *
 * Returns false for:
 * - / (home)
 * - /about
 * - /ta (Tamil home)
 * - /ta/about
 *
 * @returns {boolean} True if on a Projects page, false otherwise
 */
export const usePageDetection = (): boolean => {
  const location = useLocation();

  const isProjectsPage = useMemo(() => {
    return location.pathname.includes('/projects');
  }, [location.pathname]);

  return isProjectsPage;
};
