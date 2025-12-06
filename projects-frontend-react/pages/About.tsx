import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Award, Briefcase, Flag, Target } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { SEO } from '../components/SEO';
import { generatePersonSchema } from '../utils/seo';

export const About: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-accent-50 pb-20">
            <SEO
                title="About"
                description="Learn more about Saba Rajendran, MLA of Neyveli Constituency, his vision, and his journey in public service."
                url="/about"
            />
            <Helmet>
                {/* Enhanced Person Structured Data for About Page */}
                <script type="application/ld+json">
                    {JSON.stringify(generatePersonSchema())}
                </script>
            </Helmet>
            {/* Header Banner - Editorial Style */}
            <div className="bg-neutral-900 text-white py-20 relative overflow-hidden">
                {/* Subtle Kolam Texture Overlay */}
                <div className="absolute inset-0 kolam-texture opacity-[0.03] pointer-events-none"></div>

                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/95 via-neutral-900 to-neutral-900/90"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    {/* Editorial Label */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
                        <span className="text-sm font-mono uppercase tracking-wider text-accent-400">
                            Public Representative
                        </span>
                        <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
                    </div>

                    {/* Serif Headline */}
                    <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 tracking-tight">{t.about.title}</h1>
                    <p className="text-xl text-primary-400 font-medium tracking-wide">{t.about.subtitle}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Sidebar Profile Card - Editorial Style */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-accent-500">
                            <div className="h-80 bg-neutral-200 relative overflow-hidden group">
                                <img
                                    src="/assets/images/saba_rajendran.webp"
                                    alt="MLA Saba Rajendran"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/30 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <p className="text-xs font-mono font-bold bg-primary-500 px-3 py-1 rounded-full inline-block mb-2 uppercase tracking-wider">MLA</p>
                                    <h3 className="font-serif text-2xl font-bold">Saba Rajendran</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-accent-100 rounded-lg text-primary-600 flex-shrink-0"><Flag size={20} /></div>
                                    <div>
                                        <p className="text-xs text-neutral-500 uppercase font-mono font-bold tracking-wider mb-1">{t.about.mlaCard.party}</p>
                                        <p className="font-semibold text-neutral-900 leading-tight">{t.about.mlaCard.partyName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-accent-100 rounded-lg text-primary-600 flex-shrink-0"><Briefcase size={20} /></div>
                                    <div>
                                        <p className="text-xs text-neutral-500 uppercase font-mono font-bold tracking-wider mb-1">{t.about.mlaCard.constituency}</p>
                                        <p className="font-semibold text-neutral-900">{t.about.mlaCard.constituencyName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-accent-100 rounded-lg text-primary-600 flex-shrink-0"><Award size={20} /></div>
                                    <div>
                                        <p className="text-xs text-neutral-500 uppercase font-mono font-bold tracking-wider mb-1">{t.about.mlaCard.terms}</p>
                                        <p className="font-semibold text-neutral-900">2016 - 2021</p>
                                        <p className="font-semibold text-neutral-900">2021 - {t.about.mlaCard.present}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Editorial Style */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Intro */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-accent-200">
                            <h2 className="font-serif text-3xl font-bold text-neutral-900 mb-6">{t.about.title}</h2>
                            <p className="text-neutral-700 leading-relaxed text-lg">
                                {t.about.intro}
                            </p>
                        </div>

                        {/* Early Life */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-accent-200 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-secondary-500 to-secondary-600 rounded-l-2xl"></div>
                            <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-4 ml-6">{t.about.earlyLifeTitle}</h3>
                            <p className="text-neutral-700 leading-relaxed ml-6">
                                {t.about.earlyLifeDesc}
                            </p>
                        </div>

                        {/* Political Career Timeline */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-accent-200">
                            <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
                                <Flag className="text-primary-500" size={24} />
                                {t.about.politicalJourneyTitle}
                            </h3>
                            <div className="relative border-l-2 border-accent-200 ml-3 space-y-10 pl-8 py-2">
                                {/* Term 1 */}
                                <div className="relative">
                                    <span className="absolute -left-[41px] top-1 w-5 h-5 bg-primary-500 rounded-full border-4 border-white shadow-md"></span>
                                    <h4 className="font-mono text-lg font-bold text-primary-600 mb-2">2016</h4>
                                    <p className="text-neutral-700 leading-relaxed">
                                        {t.about.term1}
                                    </p>
                                </div>
                                {/* Term 2 */}
                                <div className="relative">
                                    <span className="absolute -left-[41px] top-1 w-5 h-5 bg-secondary-500 rounded-full border-4 border-white shadow-md"></span>
                                    <h4 className="font-mono text-lg font-bold text-secondary-600 mb-2">2021</h4>
                                    <p className="text-neutral-700 leading-relaxed">
                                        {t.about.term2}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Vision - Editorial Card */}
                        <div className="bg-neutral-900 text-white p-10 rounded-2xl shadow-lg relative overflow-hidden">
                            {/* Subtle Kolam Texture */}
                            <div className="absolute inset-0 kolam-texture opacity-[0.03] pointer-events-none"></div>

                            {/* Subtle decorative element */}
                            <div className="absolute -right-10 -bottom-10 opacity-5">
                                <Target size={200} />
                            </div>

                            <h3 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3 text-secondary-400 relative z-10">
                                <Target size={28} />
                                {t.about.visionTitle}
                            </h3>
                            <p className="text-neutral-300 leading-relaxed text-lg mb-8 relative z-10">{t.about.visionDesc}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                                {t.about.focusAreas.map((area, idx) => (
                                    <div key={idx} className="bg-white/5 p-5 rounded-xl backdrop-blur-sm border border-accent-500/20 hover:bg-white/10 hover:border-accent-500/40 transition-all duration-300">
                                        <p className="text-sm font-medium text-neutral-100">{area}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};