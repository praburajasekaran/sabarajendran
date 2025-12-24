/**
 * Tamil Spelling Corrections
 * 
 * HOW TO USE:
 * -----------
 * 1. Find a spelling error on your website (in village, panchayat, or project title)
 * 2. Copy the WRONG spelling from the website
 * 3. Add it below with the CORRECT spelling
 * 4. Run the PHP script to apply to database: /Applications/MAMP/bin/php/php8.1.31/bin/php /tmp/apply-corrections.php
 * 5. Run: npm run generate-projects
 * 
 * NOTE: These corrections apply to ALL fields (villages, panchayats, and project titles)
 * 
 * FORMAT:
 * -------
 * 'wrong_spelling': 'correct_spelling',
 */

// ============================================
// UNIFIED TAMIL SPELLING CORRECTIONS
// Applied to: Villages, Panchayats, AND Project Titles
// ============================================
export const tamilSpellingCorrections: Record<string, string> = {
    // Common spelling errors
    'முதற்குறிச்சிகுப்பம்': 'முத்துகிருஷ்ணாபுரம்',
    'செம்மான்குப்பம்': 'செம்மங்குப்பம்',
    'செம்மன்குப்பம்': 'செம்மங்குப்பம்',
    'பன்னிகன்குப்பம்': 'பணிக்கன்குப்பம்',
    'பாணிக்கன்குப்பம்': 'பணிக்கன்குப்பம்',
    'வேகாகொள்ளை': 'வேகக்கொல்லை',
    'வேகாகொள்ளை': 'வேகாக்கொல்லை',
    'வேகக்கொல்லை': 'வேகாக்கொல்லை',
    'வேகக்கோளை': 'வேகாக்கொல்லை',
    'ஏலாந்தம்பட்டு': 'எலந்தம்பட்டு',
    'மலிகாம்பட்டு': 'மாளிகம்பட்டு',
    'தலம்பட்டு': 'தாழம்பட்டு',
    'அன்னதானம்பேட்டை': 'அன்னதானப்பேட்டை',
    'எரிபாளையம்': 'ஏரிபாளையம்',
    'பெருமாந்தூர்': 'பெருமாத்தூர்',
    'கீழாகுப்பம்': 'கீழக்குப்பம்',
    'கட்டடம்': 'கட்டிடம்',
    'வேலங்குப்பம்': 'வேலாங்குப்பம்',
    'வள்ளம்': 'வல்லம்',
    'நடுகுப்பம்': 'நடுக்குப்பம்',
    'நாடுகுப்பம்': 'நடுகுப்பம்',
    'கொள்ளுகரங்குட்டை': 'கொள்ளுகாரங்குட்டை',
    'பதிரகோட்டை': 'பத்திரகோட்டை',
    'பதிரக்கோட்டை': 'பத்ரக்கோட்டை',
    'வீரசிகம்குப்பம்': 'வீரசிங்கன்குப்பம்',
    'சோமாசிபாளையம்': 'சோமாசிப்பாளையம்',
    'கடம்புளியூர்': 'காடாம்புலியூர்',
    'தீதீர்குப்பம்': 'திடீர்க்குப்பம்',
    'வாணவராயபுரம்': 'வானதிராயபுரம்',
    'அரசாடிக்குப்பம்': 'அரசடிக்குப்பம்',
    'சோறத்தூர்': 'சொரத்தூர்',
    'சோரத்தூர்': 'சொரத்தூர்',
    'கட்டுக்கூடலூர்': 'காட்டுக்கூடலூர்',
    'நந்துகுழி': 'நண்டுகுழி',
    'முத்தண்டிக்குப்பம்': 'முத்தாண்டிக்குப்பம்',
    'வடகவேலூர்': 'வடக்குமேலூர்',
    'வாண்ணாரயபுரம்': 'வானதிராயபுரம்',
    'எலவதடி': 'எலவத்தடி',
    'கோரணைப்பட்டு': 'கோரணப்பட்டு',
    'பாணிக்கன்குப்பம்': 'பணிக்கன்குப்பம்',
    'சிவந்தபுரம்': 'சிவந்திபுரம்',
    'தொப்புக்கொள்ளை': 'தோப்புக்கொல்லை'


    // Add more corrections below (one per line):
    // 'wrong_spelling': 'correct_spelling',
};

// ============================================
// BACKWARD COMPATIBILITY (deprecated)
// ============================================
/** @deprecated Use tamilSpellingCorrections instead */
export const villageNameCorrections = tamilSpellingCorrections;
/** @deprecated Use tamilSpellingCorrections instead */
export const panchayatNameCorrections = tamilSpellingCorrections;
/** @deprecated Use tamilSpellingCorrections instead */
export const projectTitleCorrections = tamilSpellingCorrections;

// ============================================
// CORRECTION FUNCTION
// ============================================
export function correctTamilSpelling(text: string | undefined, type?: 'village' | 'panchayat' | 'title'): string | undefined {
    if (!text) return text;

    // Use the unified corrections for all types
    return tamilSpellingCorrections[text] || text;
}
