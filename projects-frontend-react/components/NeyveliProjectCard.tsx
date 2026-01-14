// Simple card component for Neyveli block-specific projects
// Displays only title, description and status (no budget/year)

import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { NeyveliBlockProject } from '../data/neyveliBlockProjects';

interface NeyveliProjectCardProps {
    project: NeyveliBlockProject;
}

export const NeyveliProjectCard: React.FC<NeyveliProjectCardProps> = ({ project }) => {
    const { language } = useLanguage();

    const title = language === 'ta' ? project.titleTa : project.titleEn;
    const description = language === 'ta' ? project.descriptionTa : project.descriptionEn;
    const location = language === 'ta' ? project.locationTa : project.location;
    const isCompleted = project.status === 'Completed';

    // Type badge colors
    const typeColors: Record<string, string> = {
        'Infrastructure': 'bg-blue-100 text-blue-800 border-blue-300',
        'Water Supply': 'bg-cyan-100 text-cyan-800 border-cyan-300',
        'Electricity': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'Community': 'bg-purple-100 text-purple-800 border-purple-300',
        'Education': 'bg-green-100 text-green-800 border-green-300',
    };

    return (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all duration-200 flex flex-col h-full">
            {/* Header with Status Badge */}
            <div className="p-4 border-b-2 border-black bg-neutral-50 flex items-center justify-between">
                <span className={`px-3 py-1 text-xs font-bold uppercase border ${typeColors[project.type] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                    {project.type}
                </span>
                <div className={`flex items-center gap-1 text-xs font-bold ${isCompleted ? 'text-green-600' : 'text-orange-500'}`}>
                    {isCompleted ? <CheckCircle2 size={14} strokeWidth={3} /> : <Clock size={14} strokeWidth={3} />}
                    {isCompleted ? (language === 'ta' ? 'நிறைவுற்றது' : 'Completed') : (language === 'ta' ? 'நடைபெறுகிறது' : 'Ongoing')}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-black leading-tight mb-3">
                    {title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed flex-1">
                    {description}
                </p>
            </div>

            {/* Footer with Location */}
            <div className="p-4 border-t-2 border-neutral-200 bg-neutral-50">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{location}</span>
                </div>
            </div>
        </div>
    );
};
