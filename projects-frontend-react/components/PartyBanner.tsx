import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const PartyBanner: React.FC = () => {
    const { language } = useLanguage();

    return (
        <div className="bg-gradient-to-r from-black via-stone-900 to-black rounded-xl overflow-hidden shadow-lg border-y-4 border-primary-600 mb-6 relative group">
            {/* Background Rising Sun Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full absolute -top-10 scale-150 text-secondary-500 fill-current animate-pulse-slow">
                    <path d="M0 50 L100 50 M50 50 L50 0 M15 15 L85 85 M15 85 L85 15" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="20" />
                    <path d="M50 50 L50 20 M50 50 L75 35 M50 50 L75 65 M50 50 L50 80 M50 50 L25 65 M50 50 L25 35" stroke="currentColor" strokeWidth="2" />
                </svg>
            </div>

            <div className="relative z-10 flex items-center justify-between px-4 py-4 md:px-12">
                {/* CM Image */}
                <div className="flex flex-col items-center transform transition-transform hover:scale-105 duration-300">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-primary-600 p-0.5 bg-black shadow-lg shadow-primary-900/50 overflow-hidden relative">
                        <img
                            src="/assets/images/mk_stalin.png"
                            alt="Hon'ble CM M.K. Stalin"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                    <div className="mt-2 text-center">
                        <span className="block text-[10px] md:text-xs text-primary-500 font-bold uppercase tracking-wider">{language === 'ta' ? 'மாண்புமிகு முதல்வர்' : "Hon'ble CM"}</span>
                        <span className="block text-xs md:text-sm text-white font-bold">{language === 'ta' ? 'மு.க. ஸ்டாலின்' : 'Thiru M.K. Stalin'}</span>
                    </div>
                </div>

                {/* Center Text Branding */}
                <div className="flex-1 flex flex-col items-center justify-center text-center px-2 md:px-4">
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2 opacity-80">
                        <div className="h-1 md:h-1.5 w-8 md:w-16 bg-dmk-black border border-white/10"></div>
                        <div className="h-1 md:h-1.5 w-8 md:w-16 bg-dmk-red border border-white/10"></div>
                    </div>

                    <div className="relative">
                        <h2 className="text-white font-black text-sm md:text-2xl uppercase tracking-[0.2em] md:tracking-[0.3em] drop-shadow-md">
                            {language === 'ta' ? 'திராவிட மாடல்' : 'Dravidian Model'}
                        </h2>
                        {/* Rising Sun Icon Small */}
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-secondary-500 opacity-80">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" />
                                <path d="M12 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M4.93 4.93L7.05 7.05" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M16.95 16.95L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M2 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M19 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M4.93 19.07L7.05 16.95" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M16.95 7.05L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>

                    <p className="text-stone-400 text-[9px] md:text-xs font-medium mt-1 tracking-wider">
                        {language === 'ta' ? 'அனைவருக்குமான வளர்ச்சி' : 'Governance for All'}
                    </p>

                    <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2 opacity-80">
                        <div className="h-1 md:h-1.5 w-8 md:w-16 bg-dmk-red border border-white/10"></div>
                        <div className="h-1 md:h-1.5 w-8 md:w-16 bg-dmk-black border border-white/10"></div>
                    </div>
                </div>

                {/* Deputy CM Image */}
                <div className="flex flex-col items-center transform transition-transform hover:scale-105 duration-300">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-primary-600 p-0.5 bg-black shadow-lg shadow-primary-900/50 overflow-hidden relative">
                        <img
                            src="/assets/images/udhayanidhi_stalin.png"
                            alt="Hon'ble Dy CM Udhayanidhi Stalin"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                    <div className="mt-2 text-center">
                        <span className="block text-[10px] md:text-xs text-primary-500 font-bold uppercase tracking-wider">{language === 'ta' ? 'மாண்புமிகு துணை முதல்வர்' : "Hon'ble Dy CM"}</span>
                        <span className="block text-xs md:text-sm text-white font-bold">{language === 'ta' ? 'உதயநிதி ஸ்டாலின்' : 'Thiru Udhayanidhi Stalin'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};