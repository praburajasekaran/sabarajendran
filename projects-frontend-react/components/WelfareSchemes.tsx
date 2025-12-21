
import React from 'react';
import { WELFARE_SCHEMES } from '../data/welfareSchemes';
import { useLanguage } from '../contexts/LanguageContext';
import { Users, IndianRupee } from 'lucide-react';

export const WelfareSchemes: React.FC = () => {
    const { language, t } = useLanguage();

    return (
        <section className="py-20 bg-white border-t-2 border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="bg-accent-400 text-black font-bold uppercase tracking-widest px-4 py-1 mb-4 inline-block transform -skew-x-12 shadow-[4px_4px_0_0_#000]">
                        {language === 'ta' ? 'சமூக பாதுகாப்பு' : 'Social Impact'}
                    </span>
                    <h2 className="font-display text-3xl md:text-5xl font-extrabold text-black mt-4 uppercase max-w-4xl mx-auto leading-tight">
                        {language === 'ta' ? 'முக்கிய நலத்திட்டங்கள்' : 'Key Welfare Schemes'}
                    </h2>
                    <div className="w-24 h-2 bg-primary-600 mx-auto mt-6"></div>
                    <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto font-medium">
                        {language === 'ta'
                            ? 'மக்களின் வாழ்வாதாரத்தை உயர்த்திடும் அரசின் முக்கிய திட்டங்கள்'
                            : 'Empowering lives through direct benefit schemes and sustainable development initiatives.'}
                    </p>
                </div>

                {/* Schemes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {WELFARE_SCHEMES.map((scheme) => (
                        <div
                            key={scheme.id}
                            className="group relative bg-white border-2 border-black p-6 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] transition-all duration-300 flex flex-col justify-between h-full"
                        >
                            <div>
                                {/* Beneficiary Count - Hero Element */}
                                <div className="mb-2">
                                    <div className={`font-display text-4xl font-black ${scheme.color ? scheme.color.replace('bg-', 'text-') : 'text-primary-600'}`}>
                                        {scheme.beneficiaryCount}
                                    </div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mt-1 flex items-center gap-1">
                                        <Users size={14} />
                                        {language === 'ta' ? scheme.beneficiaryLabelTa : scheme.beneficiaryLabelEn}
                                    </div>
                                </div>

                                {/* Scheme Title */}
                                <h3 className="font-display text-xl font-bold text-black mb-3 leading-tight min-h-[3.5rem] flex items-end">
                                    {language === 'ta' ? scheme.titleTa : scheme.titleEn}
                                </h3>

                                {/* Description */}
                                <p className="text-base text-neutral-600 font-medium leading-relaxed mb-4">
                                    {language === 'ta' ? scheme.descriptionTa : scheme.descriptionEn}
                                </p>
                            </div>

                            {/* Budget Badge (if exists) */}
                            {scheme.budget && (
                                <div className="pt-4 border-t-2 border-dashed border-neutral-200 mt-2">
                                    <div className="flex items-center gap-2 font-bold text-black">
                                        <div className="bg-green-100 p-1.5 rounded-full border border-black">
                                            <IndianRupee size={14} className="text-green-700" />
                                        </div>
                                        <span>{scheme.budget}</span>
                                    </div>
                                </div>
                            )}

                            {/* Decoration */}
                            <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 pointer-events-none ${scheme.color || 'bg-neutral-500'} -mr-8 -mt-8 rounded-full blur-xl group-hover:opacity-20 transition-opacity`}></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
