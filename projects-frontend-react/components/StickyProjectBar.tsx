import React, { useState, useEffect } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const StickyProjectBar: React.FC = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    const langPrefix = language === 'en' ? '/en' : '';

    useEffect(() => {
        // Show after scrolling down a bit
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
            <div className={`max-w-4xl mx-auto bg-green-600 border-t-4 border-primary-600 shadow-2xl flex items-center transition-all duration-500 ease-in-out pointer-events-auto ${isDismissed
                ? 'w-auto rounded-full px-2 py-2 transform translate-y-[-20px] md:translate-y-0 float-right'
                : 'justify-between p-4 md:px-8 rounded-t-xl md:rounded-xl w-full'
                }`}>

                {!isDismissed && (
                    <div className="flex-1 mr-4 animate-fade-in">
                        <p className="text-white font-display font-bold text-lg md:text-xl leading-tight">
                            {t.home.stickyBar.label}
                        </p>
                    </div>
                )}

                <div className={`flex items-center gap-3 ${isDismissed ? 'w-full' : ''}`}>
                    <button
                        onClick={() => navigate(`${langPrefix}/projects`)}
                        className={`flex items-center gap-2 bg-primary-600 hover:bg-white hover:text-black text-white font-bold uppercase tracking-wider transition-all duration-300 shadow-[4px_4px_0_0_#ffffff] hover:shadow-[4px_4px_0_0_#primary-600] border-2 border-transparent hover:border-black ${isDismissed ? 'px-4 py-2 text-sm rounded-full' : 'px-5 py-2.5 rounded-none'
                            }`}
                    >
                        <span className="whitespace-nowrap">{t.home.stickyBar.button}</span>
                        <ArrowRight size={isDismissed ? 16 : 18} strokeWidth={3} />
                    </button>

                    {!isDismissed && (
                        <button
                            onClick={() => setIsDismissed(true)}
                            className="p-2 text-neutral-100/70 hover:text-white transition-colors"
                            aria-label="Dismiss"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};
