import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export const SocialFeeds: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section className="py-24 bg-white border-t border-neutral-200">
            <Helmet>
                <script src="https://elfsightcdn.com/platform.js" async></script>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="bg-primary-600 text-white font-bold uppercase tracking-widest px-4 py-1 mb-4 inline-block transform -skew-x-12">
                        Social Connect
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-extrabold text-black mt-4 uppercase">
                        {t.home.socialMediaTitle}
                    </h2>
                    <p className="text-xl text-secondary-600 max-w-2xl mx-auto mt-6">
                        {t.home.socialMediaDesc}
                    </p>
                    <div className="w-24 h-2 bg-accent-400 mx-auto mt-8"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Facebook Feed */}
                    <div className="flex flex-col min-h-[500px] border-2 border-neutral-200 bg-neutral-50 relative group hover:border-blue-600 transition-colors duration-300">
                        <div className="bg-blue-600 text-white p-4 flex items-center justify-center gap-3 border-b-2 border-blue-800">
                            <Facebook size={24} fill="currentColor" />
                            <span className="font-display font-bold uppercase tracking-wider">Facebook</span>
                        </div>
                        <div className="flex-1 overflow-hidden bg-white">
                            <div className="elfsight-app-4b228079-b535-49cf-9863-e2daa71b7601" data-elfsight-app-lazy></div>
                        </div>                    </div>

                    {/* Instagram Feed */}
                    <div className="flex flex-col min-h-[500px] border-2 border-neutral-200 bg-neutral-50 relative group hover:border-pink-600 transition-colors duration-300">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-center gap-3 border-b-2 border-pink-800">
                            <Instagram size={24} />
                            <span className="font-display font-bold uppercase tracking-wider">Instagram</span>
                        </div>
                        <div className="flex-1 overflow-hidden bg-white">
                            <div className="elfsight-app-bdd32c37-a9c4-4fb1-886d-cf303027d242" data-elfsight-app-lazy></div>
                        </div>
                    </div>

                    {/* X (Twitter) Feed */}
                    <div className="flex flex-col min-h-[500px] border-2 border-neutral-200 bg-neutral-50 relative group hover:border-black transition-colors duration-300">
                        <div className="bg-black text-white p-4 flex items-center justify-center gap-3 border-b-2 border-neutral-800">
                            <Twitter size={24} fill="currentColor" />
                            <span className="font-display font-bold uppercase tracking-wider">X (Twitter)</span>
                        </div>
                        <div className="flex-1 overflow-hidden bg-white">
                            <div className="elfsight-app-43264d68-2645-41a6-96a1-873f9ea7ac82" data-elfsight-app-lazy></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
