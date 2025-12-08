import React, { useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    /**
     * 'html5' for direct video files (mp4, webm)
     * 'youtube' for YouTube video IDs
     */
    type: 'html5' | 'youtube';
    /**
     * For html5: URL to the video file
     * For youtube: Video ID (e.g., 'dQw4w9WgXcQ')
     */
    src: string;
    poster?: string; // Optional poster image for HTML5
}

export const VideoModal: React.FC<VideoModalProps> = ({
    isOpen,
    onClose,
    type,
    src,
    poster
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Handle auto-play for HTML5 when opened
    useEffect(() => {
        if (isOpen && type === 'html5' && videoRef.current) {
            videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
        } else if (!isOpen && type === 'html5' && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isOpen, type]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                aria-label="Close video"
            >
                <X size={32} />
            </button>

            {/* Video Container */}
            <div
                className="relative w-full max-w-5xl mx-4 aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                onClick={e => e.stopPropagation()}
            >
                {type === 'youtube' ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${src}?autoplay=1&rel=0&modestbranding=1`}
                        title="Video player"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        controls
                        playsInline
                        poster={poster}
                        src={src}
                    >
                        Your browser does not support the video tag.
                    </video>
                )}
            </div>
        </div>
    );
};
