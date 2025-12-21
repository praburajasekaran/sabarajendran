/**
 * Database-driven translation helper
 * Replaces the legacy villageTranslations.ts system
 */

import { StaticProjectsData } from '../types';

let translationMaps: {
    panchayats: Record<string, string>;
    villages: Record<string, string>;
} | null = null;

// Static translations for blocks (since there are few and API support might vary)
const BLOCK_TRANSLATIONS: Record<string, string> = {
    'Neyveli': 'நெய்வேலி',
    'Kurinjipadi': 'குறிஞ்சிப்பாடி',
    'Panruti': 'பண்ருட்டி',
    'Vrudhachalam': 'விருத்தாசலம்',
    'Cuddalore': 'கடலூர்',
    'Bhuvanagiri': 'புவனகிரி',
    'Chidambaram': 'சிதம்பரம்'
};

export const initializeTranslations = (data: StaticProjectsData) => {
    translationMaps = data.meta.translations;
};

export const translatePanchayat = (name: string, language: 'en' | 'ta'): string => {
    if (language === 'ta' && translationMaps?.panchayats[name]) {
        return translationMaps.panchayats[name];
    }
    return name;
};

export const translateVillage = (name: string, language: 'en' | 'ta'): string => {
    if (language === 'ta' && translationMaps?.villages[name]) {
        // First strictly check dynamic map
        return translationMaps.villages[name];
    }
    // Fallback? Currently no static fallback for villages as there are too many.
    return name;
};

export const translateBlock = (name: string, language: 'en' | 'ta'): string => {
    if (language === 'ta') {
        // Use static map as primary source for blocks
        if (BLOCK_TRANSLATIONS[name]) return BLOCK_TRANSLATIONS[name];
        // If we ever add dynamic block translations, check here
        // if (translationMaps?.blocks[name]) return translationMaps.blocks[name];
    }
    return name;
};

// For backwards compatibility with existing code
export const getVillageName = (name: string, language: 'en' | 'ta'): string => {
    // This now only handles panchayat/block translations
    // Village translations should use project.village_ta directly
    // For backwards compatibility, but prefer specific functions
    if (language === 'ta') {
        const translatedPanchayat = translatePanchayat(name, language);
        if (translatedPanchayat !== name) return translatedPanchayat;

        const translatedBlock = translateBlock(name, language);
        if (translatedBlock !== name) return translatedBlock;
    }
    return name;
};
