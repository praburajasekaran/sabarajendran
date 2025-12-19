/**
 * Database-driven translation helper
 * Replaces the legacy villageTranslations.ts system
 */

import { StaticProjectsData } from '../types';

let translationMaps: {
    panchayats: Record<string, string>;
} | null = null;

export const initializeTranslations = (data: StaticProjectsData) => {
    translationMaps = data.meta.translations;
};

export const translatePanchayat = (name: string, language: 'en' | 'ta'): string => {
    if (language === 'ta' && translationMaps?.panchayats[name]) {
        return translationMaps.panchayats[name];
    }
    return name;
};

// For backwards compatibility with existing code
export const getVillageName = (name: string, language: 'en' | 'ta'): string => {
    // This now only handles panchayat/block translations
    // Village translations should use project.village_ta directly
    return translatePanchayat(name, language);
};
