/**
 * Graphic Preview Modal Component
 *
 * Full-screen modal that displays generated graphic with options
 * to share or download. Uses pattern similar to existing Lightbox component.
 */

import React, { useEffect } from 'react';
import { X, Share2, Download, Loader2 } from 'lucide-react';
import { GeneratorState } from '../hooks/useGraphicGenerator';

interface GraphicPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  generatorState: GeneratorState;
  onShare: () => void;
  onDownload: () => void;
}

export const GraphicPreviewModal: React.FC<GraphicPreviewModalProps> = ({
  isOpen,
  onClose,
  generatorState,
  onShare,
  onDownload
}) => {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { isGenerating, imageUrl, error } = generatorState;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h2 className="text-xl font-bold text-neutral-900">
            Shareable Graphic
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} className="text-neutral-700" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Loading State */}
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={48} className="text-primary-600 animate-spin mb-4" />
              <p className="text-lg font-medium text-neutral-700">
                Generating graphic...
              </p>
              <p className="text-sm text-neutral-500 mt-2">
                This may take a few seconds
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <X size={32} className="text-red-600" />
              </div>
              <p className="text-lg font-medium text-red-700 mb-2">
                Generation Failed
              </p>
              <p className="text-sm text-neutral-600 text-center max-w-md">
                {error}
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-neutral-200 text-neutral-700 font-medium rounded-full hover:bg-neutral-300 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* Success State - Image Preview */}
          {imageUrl && !isGenerating && (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="bg-neutral-100 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Generated project graphic"
                  className="w-full h-auto"
                  style={{ maxHeight: '60vh', objectFit: 'contain' }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onShare}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 active:scale-95 transition-all"
                >
                  <Share2 size={20} />
                  <span>Share / Download</span>
                </button>
                <button
                  onClick={onDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-neutral-200 text-neutral-700 font-semibold rounded-full hover:bg-neutral-300 active:scale-95 transition-all"
                >
                  <Download size={20} />
                  Download
                </button>
              </div>

              {/* Info Text */}
              <p className="text-xs text-neutral-500 text-center">
                Optimized for WhatsApp sharing • Dynamic height
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
