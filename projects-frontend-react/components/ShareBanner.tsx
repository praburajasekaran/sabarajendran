/**
 * Share Banner Component
 * 
 * Clickable banner for English version that triggers the share graphic modal.
 * Replaces the PartyBanner when language is English.
 */

import React from 'react';

interface ShareBannerProps {
    onClick: () => void;
}

export const ShareBanner: React.FC<ShareBannerProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-full cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] mb-6 rounded-lg overflow-hidden shadow-lg hover:shadow-xl"
            aria-label="Click to create and share project graphic"
            title="Create shareable graphic"
        >
            <img
                src="/assets/images/share_banner_en.png"
                alt="Neyveli on the rise - Dravidian Model Government Development Projects - Click to Share"
                className="w-full h-auto"
            />
        </button>
    );
};
