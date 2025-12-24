/**
 * Tamil Spelling Corrections
 * 
 * HOW TO USE:
 * -----------
 * 1. Find a spelling error on your website
 * 2. Copy the WRONG spelling from the website
 * 3. Add it to the appropriate section below with the CORRECT spelling
 * 4. Run: npm run generate-projects
 * 5. The corrected spelling will appear on your site
 * 
 * LATER: Transfer these corrections to WordPress database and remove them from here
 * 
 * FORMAT:
 * -------
 * 'wrong_spelling': 'correct_spelling',
 * 
 * EXAMPLE:
 * --------
 * 'முதற்குறிச்சிகுப்பம்': 'முத்துகிருஷ்ணாபுரம்',
 */

// ============================================
// VILLAGE NAME CORRECTIONS
// ============================================
export const villageNameCorrections: Record<string, string> = {
    'முதற்குறிச்சிகுப்பம்': 'முத்துகிருஷ்ணாபுரம்',
    'செம்மான்குப்பம்': 'செம்மங்குப்பம்',
    'செம்மன்குப்பம்': 'செம்மங்குப்பம்',
    'பன்னிகன்குப்பம்': 'பணிக்கன்குப்பம்',
    'வேகாகொள்ளை': 'வேகக்கொல்லை',
    'ஏலாந்தம்பட்டு': 'எலந்தம்பட்டு',
    'மலிகாம்பட்டு': 'மாளிகம்பட்டு',
    'எரிபாளையம்': 'ஏரிபாளையம்',
    'பெருமாந்தூர்': 'பெருமாத்தூர்',
    // Add more village corrections below (one per line):
    // 'wrong_village_name': 'correct_village_name',
};

// ============================================
// PANCHAYAT NAME CORRECTIONS
// ============================================
export const panchayatNameCorrections: Record<string, string> = {
    'சோறத்தூர்': 'சொரத்தூர்',
    'சோரத்தூர்': 'சொரத்தூர்',
    'கட்டுக்கூடலூர்': 'காட்டுக்கூடலூர்',
    'நாடுகுப்பம்': 'நடுகுப்பம்',
    'பதிரக்கோட்டை': 'பத்ரக்கோட்டை',
    'நந்துகுழி': 'நண்டுகுழி',
    'முத்தண்டிக்குப்பம்': 'முத்தாண்டிக்குப்பம்',
    // Add panchayat corrections below (one per line):
    // 'wrong_panchayat_name': 'correct_panchayat_name',
};

// ============================================
// PROJECT TITLE CORRECTIONS
// ============================================
export const projectTitleCorrections: Record<string, string> = {
    // Add project title corrections below (one per line):
    // 'project title with wrong spelling': 'project title with correct spelling',
};

// ============================================
// DO NOT EDIT BELOW THIS LINE
// ============================================
export function correctTamilSpelling(text: string | undefined, type: 'village' | 'panchayat' | 'title'): string | undefined {
    if (!text) return text;

    let corrections: Record<string, string>;

    switch (type) {
        case 'village':
            corrections = villageNameCorrections;
            break;
        case 'panchayat':
            corrections = panchayatNameCorrections;
            break;
        case 'title':
            corrections = projectTitleCorrections;
            break;
        default:
            return text;
    }

    return corrections[text] || text;
}
