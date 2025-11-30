import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Award, Briefcase, Flag, Target } from 'lucide-react';
import { SEO } from '../components/SEO';

export const About: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            <SEO
                title="About"
                description="Learn more about Saba Rajendran, MLA of Neyveli Constituency, his vision, and his journey in public service."
                url="/about"
            />
            {/* Header Banner */}
            <div className="bg-black text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-primary-900 to-black opacity-90"></div>
                {/* Background Patterns */}
                <div className="absolute top-0 right-0 text-secondary-500 opacity-5 transform scale-150 translate-x-1/4 -translate-y-1/4">
                    <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" />
                        <path d="M12 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M4.93 4.93L7.05 7.05" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M16.95 16.95L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M2 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M19 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">{t.about.title}</h1>
                    <p className="text-xl text-primary-400 font-medium tracking-wide uppercase">{t.about.subtitle}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Sidebar Profile Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-8 border-primary-600">
                            <div className="h-80 bg-stone-200 relative overflow-hidden group">
                                <img
                                    src="/assets/images/saba_rajendran.webp"
                                    alt="MLA Saba Rajendran"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <p className="text-xs font-bold bg-primary-600 px-2 py-1 rounded inline-block mb-1">MLA</p>
                                    <h3 className="text-xl font-bold">Saba Rajendran</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-stone-100 rounded-lg text-primary-600"><Flag size={20} /></div>
                                    <div>
                                        <p className="text-xs text-stone-400 uppercase font-bold">Party</p>
                                        <p className="font-semibold text-stone-800">Dravida Munnetra Kazhagam (DMK)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-stone-100 rounded-lg text-primary-600"><Briefcase size={20} /></div>
                                    <div>
                                        <p className="text-xs text-stone-400 uppercase font-bold">Constituency</p>
                                        <p className="font-semibold text-stone-800">Neyveli (153)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-stone-100 rounded-lg text-primary-600"><Award size={20} /></div>
                                    <div>
                                        <p className="text-xs text-stone-400 uppercase font-bold">Terms</p>
                                        <p className="font-semibold text-stone-800">2016 - 2021</p>
                                        <p className="font-semibold text-stone-800">2021 - Present</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Intro */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                            <h2 className="text-2xl font-bold text-stone-900 mb-4">{t.about.title}</h2>
                            <p className="text-stone-600 leading-relaxed text-lg">
                                {t.about.intro}
                            </p>
                        </div>

                        {/* Early Life */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-secondary-500"></div>
                            <h3 className="text-xl font-bold text-stone-900 mb-4">{t.about.earlyLifeTitle}</h3>
                            <p className="text-stone-600 leading-relaxed">
                                {t.about.earlyLifeDesc}
                            </p>
                        </div>

                        {/* Political Career Timeline */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                            <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                                <Flag className="text-primary-600" />
                                {t.about.politicalJourneyTitle}
                            </h3>
                            <div className="relative border-l-2 border-primary-200 ml-3 space-y-8 pl-8 py-2">
                                {/* Term 1 */}
                                <div className="relative">
                                    <span className="absolute -left-[41px] top-1 w-5 h-5 bg-primary-600 rounded-full border-4 border-white shadow-sm"></span>
                                    <h4 className="text-lg font-bold text-black">2016</h4>
                                    <p className="text-stone-600 mt-1">
                                        {t.about.term1}
                                    </p>
                                </div>
                                {/* Term 2 */}
                                <div className="relative">
                                    <span className="absolute -left-[41px] top-1 w-5 h-5 bg-primary-600 rounded-full border-4 border-white shadow-sm"></span>
                                    <h4 className="text-lg font-bold text-black">2021</h4>
                                    <p className="text-stone-600 mt-1">
                                        {t.about.term2}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="bg-stone-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                            {/* Decorative pattern */}
                            <div className="absolute -right-10 -bottom-10 opacity-10">
                                <Target size={200} />
                            </div>

                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-secondary-500">
                                <Target />
                                {t.about.visionTitle}
                            </h3>
                            <p className="text-stone-300 mb-6">{t.about.visionDesc}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                                {t.about.focusAreas.map((area, idx) => (
                                    <div key={idx} className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                                        <p className="text-sm font-medium">{area}</p>
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