import React from 'react';

export const HandDrawnArrow: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <svg
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Curved shaft */}
            <path d="M20,90 Q40,30 90,50" />

            {/* Arrowhead */}
            <path d="M70,35 L90,50 L75,70" />
        </svg>
    );
};
