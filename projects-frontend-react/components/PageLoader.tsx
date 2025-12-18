import React from 'react';

export const PageLoader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
            <div className="animate-spin h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full mb-4"></div>
            <div className="text-sm font-bold text-neutral-500 uppercase tracking-widest animate-pulse">
                Loading...
            </div>
        </div>
    );
};
