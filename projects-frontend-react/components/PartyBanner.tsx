import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const PartyBanner: React.FC = () => {
    const { language } = useLanguage();

    return (
        <div className="bg-neutral-900 rounded-xl overflow-hidden shadow-sm border border-accent-500/30 mb-6 relative">
            {/* Subtle Kolam Texture */}
            <div className="absolute inset-0 kolam-texture opacity-[0.02] pointer-events-none"></div>

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 via-neutral-900 to-neutral-900/95"></div>

            <div className="relative z-10 flex items-center justify-between px-6 py-4 gap-6">
                {/* CM Acknowledgment */}
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full border-2 border-accent-500/40 overflow-hidden flex-shrink-0 bg-neutral-800">
                        <img
                            src="/assets/images/mk_stalin.png"
                            alt="Hon'ble CM M.K. Stalin"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                    <div className="min-w-0">
                        <span className="block text-[10px] text-accent-500 font-mono uppercase tracking-wider">
                            {language === 'ta' ? 'மாண்புமிகு முதல்வர்' : "Hon'ble CM"}
                        </span>
                        <span className="block text-sm text-neutral-200 font-medium truncate">
                            {language === 'ta' ? 'மு.க. ஸ்டாலின்' : 'Thiru M.K. Stalin'}
                        </span>
                    </div>
                </div>

                {/* Minimal Center Text - No Political Branding */}
                <div className="hidden md:flex flex-col items-center text-center px-4 flex-shrink-0">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-accent-500/40 to-transparent mb-2"></div>
                    <p className="text-neutral-400 text-xs font-medium tracking-wide">
                        {language === 'ta' ? 'அனைவருக்குமான வளர்ச்சி' : 'Governance for All'}
                    </p>
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-accent-500/40 to-transparent mt-2"></div>
                </div>

                {/* Deputy CM Acknowledgment */}
                <div className="flex items-center gap-3 flex-1 justify-end">
                    <div className="min-w-0 text-right">
                        <span className="block text-[10px] text-accent-500 font-mono uppercase tracking-wider">
                            {language === 'ta' ? 'மாண்புமிகு துணை முதல்வர்' : "Hon'ble Dy CM"}
                        </span>
                        <span className="block text-sm text-neutral-200 font-medium truncate">
                            {language === 'ta' ? 'உதயநிதி ஸ்டாலின்' : 'Thiru Udhayanidhi Stalin'}
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-accent-500/40 overflow-hidden flex-shrink-0 bg-neutral-800">
                        <img
                            src="/assets/images/udhayanidhi_stalin.png"
                            alt="Hon'ble Dy CM Udhayanidhi Stalin"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};