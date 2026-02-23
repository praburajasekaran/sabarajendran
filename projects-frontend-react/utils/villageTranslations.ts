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
    'Neyveli': 'நெய்வேலி நகரம்',
    'Kurinjipadi': 'குறிஞ்சிப்பாடி',
    'Panruti': 'பண்ருட்டி',
    'Vrudhachalam': 'விருத்தாசலம்',
    'Cuddalore': 'கடலூர்',
    'Bhuvanagiri': 'புவனகிரி',
    'Chidambaram': 'சிதம்பரம்'
};

// Static fallback translations for panchayats (sourced from WordPress term meta)
const PANCHAYAT_TRANSLATIONS: Record<string, string> = {
    'Alagappasamuthiram': 'அழகப்பசமுத்திரம்',
    'Annadanampettai': 'அன்னதானப்பேட்டை',
    'Arasadikuppam': 'அரசடிக்குப்பம்',
    'Elanthampattu': 'எலந்தம்பட்டு',
    'Indira Nagar': 'இந்திரா நகர்',
    'Kadampuliyur': 'காடாம்புலியூர்',
    'Karukkai': 'கருக்கை',
    'Kattukudalur': 'காட்டுக்கூடலூர்',
    'Keelakuppam': 'கீழக்குப்பம்',
    'Keeliruppu': 'கீழிருப்பு',
    'Keelkankeyankuppam': 'கீழ்காங்கேயன்குப்பம்',
    'Keelmampattu': 'கீழ்மாம்பட்டு',
    'Keelur': 'கீழூர்',
    'Koranapattu': 'கோரணப்பட்டு',
    'Kudiyiruppu': 'குடியிருப்பு',
    'Madhanagopalpuram': 'மதனகோபாலபுரம்',
    'Maligampattu': 'மாளிகம்பட்டு',
    'Marungur': 'மருங்கூர்',
    'Meliruppu': 'மேலிருப்பு',
    'Melkankeyankuppam': 'மேல்காங்கேயன்குப்பம்',
    'Melmampattu': 'மேல்மாம்பட்டு',
    'Mettukuppam': 'மேட்டுக்குப்பம்',
    'Nadukuppam': 'நடுக்குப்பம்',
    'Nallathur': 'நல்லத்தூர்',
    'Neyveli': 'நெய்வேலி',
    'Panikkankuppam': 'பணிக்கன்குப்பம்',
    'Periyakattupalayam': 'பெரியகாட்டுப்பாளையம்',
    'Perperiyankuppam': 'பேர்பெரியான்குப்பம்',
    'Perumathur': 'பெருமாத்தூர்',
    'Pudupalayam': 'புதுப்பாளையம்',
    'Puliyur': 'புலியூர்',
    'Purangani': 'புறங்கணி',
    'Samattikkuppam': 'சமட்டிக்குப்பம்',
    'Sathipattu': 'சாத்திப்பட்டு',
    'Semmedu': 'செம்மேடு',
    'Silambinathanpettai': 'சிலம்பிநாதன்பேட்டை',
    'Siruvathur': 'சிறுவத்தூர்',
    'Somasipalayam': 'சோமாசிப்பாளையம்',
    'Sorathur': 'சொரத்தூர்',
    'Thalampattu': 'தாழம்பட்டு',
    'Thiruvamoor': 'திருவாமூர்',
    'Vadakkumelur': 'வடக்குமேலூர்',
    'Vadakuthu': 'வடக்குத்து',
    'Vallam': 'வல்லம்',
    'Vanathirayapuram': 'வானதிராயபுரம்',
    'Vazhuthalampattu': 'வழுதலம்பட்டு',
    'Veerasingankuppam': 'வீரசிங்கன்குப்பம்',
    'Vegakollai': 'வேகாக்கொல்லை',
    'Vengadampettai': 'வெங்கடாம்பேட்டை',
    'Visoor': 'விசூர்',
};

export const initializeTranslations = (data: StaticProjectsData) => {
    translationMaps = data.meta.translations;
};

export const translatePanchayat = (name: string, language: 'en' | 'ta'): string => {
    if (language === 'ta') {
        const dynamic = translationMaps?.panchayats[name];
        // Only use dynamic map value if it's actually Tamil (not an English echo)
        if (dynamic && dynamic !== name) return dynamic;
        // Fall back to static map
        if (PANCHAYAT_TRANSLATIONS[name]) return PANCHAYAT_TRANSLATIONS[name];
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
    } else if (language === 'en' && name === 'Neyveli') {
        return 'Neyveli Town';
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
