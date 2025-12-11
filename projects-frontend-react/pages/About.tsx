import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Award, Briefcase, Flag, Target, MapPin, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { SEO } from '../components/SEO';
import { generatePersonSchema } from '../utils/seo';

export const About: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-white pb-20 font-sans">
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

            {/* Header Banner - Political Mass Appeal style */}
            <div className="bg-gradient-to-r from-secondary-900 via-secondary-900 to-secondary-800 text-white py-24 relative overflow-hidden border-b-8 border-primary-600">
                {/* Sun Rays Texture Overlay */}
                <div className="absolute inset-0 sun-rays-texture opacity-20 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        {/* Party Label */}
                        <div className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-1 mb-6 transform -skew-x-12 shadow-[4px_4px_0_0_#3e2723]">
                            <span className="text-sm font-black uppercase tracking-widest transform skew-x-12">
                                Public Representative
                            </span>
                        </div>

                        {/* Bold Headline */}
                        <h1 className="font-display text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight drop-shadow-lg">
                            {t.about.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-accent-400 font-bold tracking-wide max-w-2xl border-t-4 border-accent-500 pt-6">
                            {t.about.subtitle}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

                    {/* Sidebar Profile Card - Political Leader Style */}
                    <div className="md:col-span-4">
                        <div className="bg-white border-2 border-black card-sharp p-2">
                            <div className="bg-secondary-100 border border-black relative overflow-hidden group">
                                <img
                                    src="/assets/images/saba_rajendran.webp"
                                    alt="MLA Saba Rajendran"
                                    className="w-full h-auto object-cover grayscale-0 group-hover:grayscale transition-all duration-500"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 pt-20">
                                    <div className="inline-block bg-primary-600 text-white text-xs font-black px-3 py-1 mb-2 uppercase tracking-widest">
                                        Neyveli MLA
                                    </div>
                                    <h3 className="font-display text-3xl text-white font-black uppercase leading-none">
                                        Saba Rajendran
                                    </h3>
                                </div>
                            </div>

                            <div className="p-6 space-y-6 bg-white">
                                <div className="flex items-start gap-4 pb-4 border-b-2 border-neutral-100">
                                    <div className="p-3 bg-black text-accent-400 flex-shrink-0 shadow-[4px_4px_0_0_#991b1b]">
                                        <Flag size={24} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 uppercase font-black tracking-widest mb-1">{t.about.mlaCard.party}</p>
                                        <p className="font-bold text-xl text-black leading-tight">{t.about.mlaCard.partyName}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 pb-4 border-b-2 border-neutral-100">
                                    <div className="p-3 bg-black text-accent-400 flex-shrink-0 shadow-[4px_4px_0_0_#991b1b]">
                                        <MapPin size={24} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 uppercase font-black tracking-widest mb-1">{t.about.mlaCard.constituency}</p>
                                        <p className="font-bold text-xl text-black">{t.about.mlaCard.constituencyName}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-black text-accent-400 flex-shrink-0 shadow-[4px_4px_0_0_#991b1b]">
                                        <Award size={24} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 uppercase font-black tracking-widest mb-1">{t.about.mlaCard.terms}</p>
                                        <p className="font-bold text-lg text-black">2006 - 2011</p>
                                        <p className="font-bold text-lg text-black">2016 - 2021</p>
                                        <p className="font-bold text-lg text-primary-600">2021 - {t.about.mlaCard.present}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Political Manifesto Style */}
                    <div className="md:col-span-8 space-y-12 pt-8 md:pt-16">

                        {/* Intro */}
                        <div className="pt-8">
                            <p className="text-neutral-800 leading-relaxed text-xl font-medium border-l-4 border-black pl-6">
                                {t.about.intro}
                            </p>
                        </div>

                        {/* Early Life - Solid Block */}
                        <div className="bg-neutral-50 p-8 border-l-8 border-primary-600 shadow-sm">
                            <h3 className="font-display text-2xl font-black text-black mb-4 uppercase tracking-tight">
                                {t.about.earlyLifeTitle}
                            </h3>
                            <p className="text-neutral-700 leading-relaxed text-lg font-medium">
                                {t.about.earlyLifeDesc}
                            </p>
                        </div>

                        {/* Political Career Timeline - High Contrast */}
                        <div className="bg-white">
                            <h3 className="font-display text-3xl font-black text-black mb-10 flex items-center gap-4">
                                <div className="p-2 bg-primary-600 text-white rounded-none transform -rotate-3">
                                    <Briefcase size={28} strokeWidth={3} />
                                </div>
                                {t.about.politicalJourneyTitle}
                            </h3>

                            <div className="relative border-l-4 border-black ml-4 space-y-12 pl-10 py-2">
                                {/* Term 2006 */}
                                <div className="relative group">
                                    <span className="absolute -left-[54px] top-1 w-6 h-6 bg-white border-4 border-black group-hover:bg-primary-600 transition-colors"></span>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-display text-3xl font-black text-neutral-400">2006</h4>
                                        <div className="h-1 flex-1 bg-neutral-200"></div>
                                    </div>
                                    <p className="text-black text-lg font-bold leading-relaxed">
                                        {t.about.term2006}
                                    </p>
                                </div>
                                {/* Term 1 */}
                                <div className="relative group">
                                    <span className="absolute -left-[54px] top-1 w-6 h-6 bg-white border-4 border-black group-hover:bg-primary-600 transition-colors"></span>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-display text-3xl font-black text-neutral-400">2016</h4>
                                        <div className="h-1 flex-1 bg-neutral-200"></div>
                                    </div>
                                    <p className="text-black text-lg font-bold leading-relaxed">
                                        {t.about.term1}
                                    </p>
                                </div>
                                {/* Term 2 */}
                                <div className="relative group">
                                    <span className="absolute -left-[54px] top-1 w-6 h-6 bg-primary-600 border-4 border-black shadow-[2px_2px_0_0_#3e2723]"></span>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-display text-3xl font-black text-black">2021</h4>
                                        <div className="h-1 flex-1 bg-black"></div>
                                    </div>
                                    <p className="text-black text-lg font-bold leading-relaxed">
                                        {t.about.term2}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Vision - Bold Manifesto Card */}
                        <div className="bg-secondary-900 text-white p-10 border-4 border-black shadow-[12px_12px_0_0_#dc2626] relative overflow-hidden">
                            {/* Sun Rays Texture */}
                            <div className="absolute inset-0 sun-rays-texture opacity-10 pointer-events-none"></div>

                            <div className="absolute top-0 right-0 p-6 opacity-20">
                                <Target size={180} />
                            </div>

                            <h3 className="font-display text-4xl font-black mb-8 flex items-center gap-4 text-accent-400 relative z-10 uppercase">
                                <Target size={40} strokeWidth={3} />
                                {t.about.visionTitle}
                            </h3>

                            <p className="text-white leading-relaxed text-xl font-bold mb-10 relative z-10 max-w-2xl">
                                {t.about.visionDesc}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                {t.about.focusAreas.map((area, idx) => (
                                    <div key={idx} className="bg-black/40 p-4 border-l-4 border-accent-500 flex items-center gap-3 hover:bg-black/60 transition-colors">
                                        <CheckCircle2 className="text-accent-500 flex-shrink-0" size={20} />
                                        <p className="text-base font-bold text-white uppercase tracking-wide">{area}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Key Initiatives Section */}
                        <div className="space-y-8">
                            <h3 className="font-display text-3xl font-black text-black mb-6 uppercase flex items-center gap-3">
                                <span className="w-12 h-2 bg-primary-600 inline-block"></span>
                                {t.about.initiatives.title}
                            </h3>

                            {/* Agriculture */}
                            <div className="bg-white border-l-8 border-primary-600 p-6 shadow-sm">
                                <h4 className="font-display text-xl font-black text-black mb-3 uppercase">
                                    {t.about.initiatives.agriculture.title}
                                </h4>
                                <p className="text-neutral-700 leading-relaxed font-medium">
                                    {t.about.initiatives.agriculture.desc}
                                </p>
                            </div>

                            {/* Entrepreneurship & Education */}
                            <div className="bg-neutral-50 border-l-8 border-black p-6 shadow-sm">
                                <h4 className="font-display text-xl font-black text-black mb-3 uppercase">
                                    {t.about.initiatives.education.title}
                                </h4>
                                <p className="text-neutral-700 leading-relaxed font-medium">
                                    {t.about.initiatives.education.desc}
                                </p>
                            </div>

                            {/* Healthcare */}
                            <div className="bg-white border-l-8 border-primary-600 p-6 shadow-sm">
                                <h4 className="font-display text-xl font-black text-black mb-3 uppercase">
                                    {t.about.initiatives.healthcare.title}
                                </h4>
                                <p className="text-neutral-700 leading-relaxed font-medium">
                                    {t.about.initiatives.healthcare.desc}
                                </p>
                            </div>

                            {/* Labour Welfare */}
                            <div className="bg-neutral-50 border-l-8 border-black p-6 shadow-sm">
                                <h4 className="font-display text-xl font-black text-black mb-3 uppercase">
                                    {t.about.initiatives.labour.title}
                                </h4>
                                <p className="text-neutral-700 leading-relaxed font-medium">
                                    {t.about.initiatives.labour.desc}
                                </p>
                            </div>

                            {/* COVID-19 */}
                            <div className="bg-white border-l-8 border-primary-600 p-6 shadow-sm">
                                <h4 className="font-display text-xl font-black text-black mb-3 uppercase">
                                    {t.about.initiatives.covid.title}
                                </h4>
                                <p className="text-neutral-700 leading-relaxed font-medium">
                                    {t.about.initiatives.covid.desc}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};