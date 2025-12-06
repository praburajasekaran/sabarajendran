/**
 * Graphic Generator Hook
 *
 * Converts the ProjectGraphic component to a high-quality PNG image
 * using html2canvas, optimized for WhatsApp sharing.
 */

import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';

export interface GeneratorState {
  isGenerating: boolean;
  imageUrl: string | null;
  error: string | null;
}

export interface UseGraphicGeneratorReturn {
  state: GeneratorState;
  generateImage: () => Promise<void>;
  shareImage: () => Promise<void>;
  downloadImage: () => void;
  clearImage: () => void;
}

/**
 * Hook to generate and share WhatsApp graphics
 *
 * @returns Generator state and control functions
 */
export const useGraphicGenerator = (): UseGraphicGeneratorReturn => {
  const [state, setState] = useState<GeneratorState>({
    isGenerating: false,
    imageUrl: null,
    error: null
  });

  /**
   * Generates PNG image from #shareable-graphic element
   * Uses html2canvas with retina quality settings
   */
  const generateImage = useCallback(async () => {
    setState({ isGenerating: true, imageUrl: null, error: null });

    try {
      // Wait for fonts to load
      await document.fonts.ready;

      const element = document.getElementById('shareable-graphic');
      if (!element) {
        throw new Error('Graphic element not found');
      }

      // Generate canvas with high quality settings
      // Use dynamic dimensions from element (adaptive height based on project count)
      const canvas = await html2canvas(element, {
        scale: 2, // Retina quality
        useCORS: true, // Allow cross-origin images (DMK logo)
        backgroundColor: '#ffffff',
        width: element.offsetWidth,   // Dynamic (1200px)
        height: element.offsetHeight, // Dynamic (calculated based on project count)
        logging: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          // Ensure fonts are applied in cloned document
          const clonedElement = clonedDoc.getElementById('shareable-graphic');
          if (clonedElement) {
            clonedElement.style.fontFamily = 'Inter, sans-serif';
          }
        }
      });

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Check file size - if > 500KB, try JPEG
              if (blob.size > 500 * 1024) {
                canvas.toBlob(
                  (jpegBlob) => {
                    if (jpegBlob) {
                      resolve(jpegBlob);
                    } else {
                      reject(new Error('Failed to create JPEG'));
                    }
                  },
                  'image/jpeg',
                  0.9
                );
              } else {
                resolve(blob);
              }
            } else {
              reject(new Error('Failed to create image'));
            }
          },
          'image/png',
          1.0
        );
      });

      // Create object URL
      const url = URL.createObjectURL(blob);

      setState({
        isGenerating: false,
        imageUrl: url,
        error: null
      });
    } catch (error) {
      console.error('Image generation failed:', error);
      setState({
        isGenerating: false,
        imageUrl: null,
        error: error instanceof Error ? error.message : 'Failed to generate image'
      });
    }
  }, []);

  /**
   * Downloads image to device
   */
  const downloadImage = useCallback(() => {
    if (!state.imageUrl) {
      console.error('No image to download');
      return;
    }

    const link = document.createElement('a');
    link.href = state.imageUrl;
    link.download = `dmk-projects-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state.imageUrl]);

  /**
   * Shares image using Web Share API (mobile) or falls back to download
   */
  const shareImage = useCallback(async () => {
    console.log('shareImage called, imageUrl:', state.imageUrl);

    if (!state.imageUrl) {
      console.error('No image to share');
      return;
    }

    try {
      // Fetch blob from object URL first
      const response = await fetch(state.imageUrl);
      const blob = await response.blob();

      // Detect file type from blob
      const fileType = blob.type.includes('jpeg') ? 'jpg' : 'png';
      const file = new File([blob], `dmk-projects.${fileType}`, {
        type: blob.type
      });

      console.log('File created:', file.name, file.type, file.size, 'bytes');

      // Check if Web Share API is available AND can share files
      if (navigator.share) {
        // Try to check if can share files
        const canShareFiles = navigator.canShare && navigator.canShare({ files: [file] });

        if (canShareFiles) {
          console.log('Web Share API: Can share files, sharing...');
          await navigator.share({
            files: [file],
            title: 'DMK Development Projects',
            text: 'Check out these development projects by MLA Saba Rajendran'
          });
          console.log('Share completed successfully');
          return; // Exit after successful share
        } else {
          console.log('Web Share API: Cannot share files (navigator.canShare returned false or undefined)');
        }
      } else {
        console.log('Web Share API: Not available');
      }

      // Fallback to download for desktop or if sharing failed
      console.log('Falling back to download');
      downloadImage();
    } catch (error) {
      // User cancelled or error occurred
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share failed with error:', error);
        // Fallback to download
        downloadImage();
      } else {
        console.log('Share cancelled by user');
      }
    }
  }, [state.imageUrl, downloadImage]);

  /**
   * Clears generated image and frees memory
   */
  const clearImage = useCallback(() => {
    if (state.imageUrl) {
      URL.revokeObjectURL(state.imageUrl);
    }
    setState({
      isGenerating: false,
      imageUrl: null,
      error: null
    });
  }, [state.imageUrl]);

  return {
    state,
    generateImage,
    shareImage,
    downloadImage,
    clearImage
  };
};
