import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TRANSLATIONS } from '../utils/translations';
import { Helmet } from 'react-helmet-async';

// Gallery images
const GALLERY_IMAGES = [
    '/assets/images/gallery/IMG_20240316_121344_Burst01.jpg',
    '/assets/images/gallery/IMG_20240316_121415.jpg',
    '/assets/images/gallery/IMG_20240316_122912.jpg',
    '/assets/images/gallery/IMG_20241026_113335.jpg',
    '/assets/images/gallery/IMG_20241123_112505.jpg',
    '/assets/images/gallery/IMG_20241123_112601.jpg',
    '/assets/images/gallery/IMG_20250329_120721_1.jpg',
    '/assets/images/gallery/IMG_20250520_121900.jpg',
    '/assets/images/gallery/IMG_20250530_114335.jpg',
    '/assets/images/gallery/P1973299.JPG',
    '/assets/images/gallery/P2058787.JPG',
    '/assets/images/gallery/P2058797.JPG',
    '/assets/images/gallery/P2059712.JPG',
    '/assets/images/gallery/P2059739.JPG',
    '/assets/images/gallery/P2059743.JPG',
];

interface LightboxProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose, onNext, onPrev }) => {
    const [isZoomed, setIsZoomed] = useState(false);

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close lightbox"
            >
                <X className="w-6 h-6 text-white" />
            </button>

            {/* Zoom toggle */}
            <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute top-4 right-16 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Toggle zoom"
            >
                <ZoomIn className="w-6 h-6 text-white" />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-50 px-4 py-2 rounded-full bg-white/10 text-white font-medium">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Previous button */}
            <button
                onClick={onPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentIndex === 0}
                aria-label="Previous image"
            >
                <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            {/* Next button */}
            <button
                onClick={onNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentIndex === images.length - 1}
                aria-label="Next image"
            >
                <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {/* Image */}
            <div
                className="w-full h-full flex items-center justify-center p-4 md:p-8 overflow-auto"
                onClick={() => setIsZoomed(false)}
            >
                <img
                    src={images[currentIndex]}
                    alt={`Gallery image ${currentIndex + 1}`}
                    className={`max-w-full max-h-full object-contain transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                        }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsZoomed(!isZoomed);
                    }}
                />
            </div>

            {/* Swipe hint for mobile */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm md:hidden">
                Swipe to navigate
            </div>
        </div>
    );
};

export const GalleryPage: React.FC = () => {
    const { language } = useLanguage();
    const t = TRANSLATIONS[language].gallery;
    const navT = TRANSLATIONS[language].nav;
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
    };

    const nextImage = () => {
        if (lightboxIndex !== null && lightboxIndex < GALLERY_IMAGES.length - 1) {
            setLightboxIndex(lightboxIndex + 1);
        }
    };

    const prevImage = () => {
        if (lightboxIndex !== null && lightboxIndex > 0) {
            setLightboxIndex(lightboxIndex - 1);
        }
    };

    const handleImageLoad = (index: number) => {
        setLoadedImages(prev => new Set(prev).add(index));
    };

    // Keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;

            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') closeLightbox();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex]);

    return (
        <>
            <Helmet>
                <title>{t.pageTitle} | {navT.title}</title>
                <meta name="description" content={t.pageDescription} />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50/30">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 md:py-16">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
                            {t.title}
                        </h1>
                        <p className="text-lg md:text-xl text-primary-100 max-w-2xl">
                            {t.subtitle}
                        </p>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="container mx-auto px-4 py-8 md:py-12">
                    {/* Mobile-first masonry grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        {GALLERY_IMAGES.map((image, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-lg bg-secondary-100 cursor-pointer aspect-square"
                                onClick={() => openLightbox(index)}
                            >
                                {/* Loading skeleton */}
                                {!loadedImages.has(index) && (
                                    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-secondary-200 to-secondary-300" />
                                )}

                                {/* Image */}
                                <img
                                    src={image}
                                    alt={`${t.imageAlt} ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                    onLoad={() => handleImageLoad(index)}
                                />

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                    <div className="flex items-center gap-2 text-white">
                                        <ZoomIn className="w-5 h-5" />
                                        <span className="text-sm font-medium">{t.viewImage}</span>
                                    </div>
                                </div>

                                {/* Mobile tap indicator */}
                                <div className="absolute top-2 right-2 md:hidden">
                                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                        <ZoomIn className="w-4 h-4 text-primary-600" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Gallery info */}
                    <div className="mt-8 md:mt-12 text-center">
                        <p className="text-secondary-600">
                            {t.totalImages.replace('{count}', GALLERY_IMAGES.length.toString())}
                        </p>
                    </div>
                </div>

                {/* Lightbox */}
                {lightboxIndex !== null && (
                    <Lightbox
                        images={GALLERY_IMAGES}
                        currentIndex={lightboxIndex}
                        onClose={closeLightbox}
                        onNext={nextImage}
                        onPrev={prevImage}
                    />
                )}
            </div>
        </>
    );
};
