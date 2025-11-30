import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface LightboxProps {
  imageUrl: string;
  altText: string;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ imageUrl, altText, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
      >
        <X size={28} />
      </button>
      <div 
        className="relative max-w-6xl max-h-[90vh] w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()} 
      >
        <img 
          src={imageUrl} 
          alt={altText} 
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/10"
        />
        <div className="mt-4 text-center">
            <p className="text-white text-lg font-medium">{altText}</p>
        </div>
      </div>
    </div>
  );
};