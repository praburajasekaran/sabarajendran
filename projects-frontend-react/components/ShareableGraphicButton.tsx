/**
 * Shareable Graphic Button Component
 *
 * Sticky floating action button (FAB) that appears on Projects pages.
 * Opens modal to generate and share WhatsApp-optimized graphics.
 */

import React from 'react';
import { Share2 } from 'lucide-react';
import { usePageDetection } from '../hooks/usePageDetection';

interface ShareableGraphicButtonProps {
  onClick: () => void;
}

export const ShareableGraphicButton: React.FC<ShareableGraphicButtonProps> = ({ onClick }) => {
  const isProjectsPage = usePageDetection();

  // Don't render on non-Projects pages
  if (!isProjectsPage) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 bg-primary-600 text-white font-semibold rounded-full shadow-lg hover:bg-primary-700 hover:shadow-xl active:scale-95 transition-all duration-200"
      aria-label="Share projects graphic"
      title="Create shareable graphic"
    >
      <Share2 size={20} className="flex-shrink-0" />
      <span className="hidden sm:inline">Share</span>
    </button>
  );
};
