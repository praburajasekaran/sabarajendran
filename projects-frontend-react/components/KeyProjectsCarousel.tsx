import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { KEY_PROJECTS } from '../data/keyProjects';

export const KeyProjectsCarousel: React.FC = () => {
    const { t, language } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Show all confirmed projects
    const activeProjects = KEY_PROJECTS.filter(p => p.id <= 10);
    const totalSlides = activeProjects.length;

    const goToSlide = useCallback((index: number) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setTimeout(() => setIsTransitioning(false), 50);
        }, 400);
    }, []);

    const goToPrevious = useCallback(() => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
            );
            setTimeout(() => setIsTransitioning(false), 50);
        }, 400);
    }, [totalSlides]);

    const goToNext = useCallback(() => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
            );
            setTimeout(() => setIsTransitioning(false), 50);
        }, 400);
    }, [totalSlides]);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || isPaused || totalSlides <= 1) return;

        const interval = setInterval(() => {
            goToNext();
        }, 3000); // Advance every 3 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, isPaused, goToNext, totalSlides]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToPrevious, goToNext]);

    const currentProject = activeProjects[currentIndex];

    return (
        <section
            className="py-12 md:py-24 bg-gradient-to-br from-secondary-900 via-secondary-800 to-black text-white relative overflow-hidden border-t-4 md:border-t-8 border-primary-600"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-label={t.keyProjects.sectionTitle}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 sun-rays-texture opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-8 md:mb-16">
                    <span className="bg-primary-600 text-white font-bold uppercase tracking-widest px-4 py-1.5 md:px-6 md:py-2 mb-4 inline-block transform -skew-x-12 shadow-[2px_2px_0_0_#000] md:shadow-[4px_4px_0_0_#000] text-xs md:text-sm">
                        {t.keyProjects.sectionSubtitle}
                    </span>
                    <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mt-4 md:mt-6 uppercase">
                        {t.keyProjects.sectionTitle}
                    </h2>
                    <p className="text-sm md:text-lg text-neutral-300 mt-3 md:mt-4 max-w-3xl mx-auto font-medium">
                        {t.keyProjects.sectionDesc}
                    </p>
                    <div className="w-24 h-2 bg-accent-500 mx-auto mt-6"></div>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Main Slide */}
                    <div className="relative bg-white border-2 md:border-4 border-black shadow-[6px_6px_0_0_#000] md:shadow-[12px_12px_0_0_#000] overflow-hidden">
                        {/* Image Section */}
                        <div className={`relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden transition-all duration-[800ms] ease-in-out ${isTransitioning ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
                            }`}>
                            <img
                                src={currentProject.image}
                                alt={language === 'ta' ? currentProject.titleTa : currentProject.titleEn}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback for missing images
                                    (e.target as HTMLImageElement).src = '/assets/images/hero-background.jpg';
                                }}
                            />

                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
                                {/* Impact Badge */}
                                {currentProject.impact && (
                                    <div className="inline-block mb-2 md:mb-4">
                                        <span className="bg-accent-500 text-black font-bold uppercase tracking-wide md:tracking-wider px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm border border-black md:border-2 shadow-[2px_2px_0_0_#000] md:shadow-[4px_4px_0_0_#000]">
                                            {currentProject.impact}
                                        </span>
                                    </div>
                                )}

                                {/* Title */}
                                <h3 className="font-display text-xl md:text-3xl lg:text-4xl font-extrabold text-white mb-2 md:mb-4 leading-tight drop-shadow-lg">
                                    {language === 'ta' ? currentProject.titleTa : currentProject.titleEn}
                                </h3>

                                {/* Description */}
                                <p className="text-sm md:text-lg lg:text-xl text-neutral-200 max-w-4xl leading-relaxed font-medium border-l-2 md:border-l-4 border-primary-600 pl-3 md:pl-6 mb-3 md:mb-6">
                                    {language === 'ta' ? currentProject.descriptionTa : currentProject.descriptionEn}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    {totalSlides > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className="absolute left-2 md:left-4 top-1/3 -translate-y-1/2 bg-white text-black p-2 md:p-4 border border-black md:border-2 shadow-[2px_2px_0_0_#000] md:shadow-[4px_4px_0_0_#000] hover:bg-primary-600 hover:text-white transition-all hover:shadow-[3px_3px_0_0_#000] md:hover:shadow-[6px_6px_0_0_#000] hover:-translate-x-1 hover:-translate-y-1/2 z-20"
                                aria-label={t.keyProjects.previous}
                            >
                                <ChevronLeft size={24} strokeWidth={3} className="md:w-8 md:h-8" />
                            </button>

                            <button
                                onClick={goToNext}
                                className="absolute right-2 md:right-4 top-1/3 -translate-y-1/2 bg-white text-black p-2 md:p-4 border border-black md:border-2 shadow-[2px_2px_0_0_#000] md:shadow-[4px_4px_0_0_#000] hover:bg-primary-600 hover:text-white transition-all hover:shadow-[3px_3px_0_0_#000] md:hover:shadow-[6px_6px_0_0_#000] hover:translate-x-1 hover:-translate-y-1/2 z-20"
                                aria-label={t.keyProjects.next}
                            >
                                <ChevronRight size={24} strokeWidth={3} className="md:w-8 md:h-8" />
                            </button>
                        </>
                    )}

                    {/* Progress Dots */}
                    {totalSlides > 1 && (
                        <div className="flex justify-center gap-3 mt-8">
                            {activeProjects.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`transition-all border-2 border-black ${index === currentIndex
                                        ? 'w-12 h-4 bg-primary-600 shadow-[2px_2px_0_0_#000]'
                                        : 'w-4 h-4 bg-white hover:bg-accent-400 shadow-[2px_2px_0_0_#000]'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                    aria-current={index === currentIndex ? 'true' : 'false'}
                                />
                            ))}
                        </div>
                    )}

                    {/* Slide Counter */}
                    {totalSlides > 1 && (
                        <div className="text-center mt-6">
                            <span className="text-white font-bold text-lg">
                                {currentIndex + 1} / {totalSlides}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
