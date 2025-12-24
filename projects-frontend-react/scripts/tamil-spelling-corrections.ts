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

    // Add more village corrections below (one per line):
    // 'wrong_village_name': 'correct_village_name',
};

// ============================================
// PANCHAYAT NAME CORRECTIONS
// ============================================
export const panchayatNameCorrections: Record<string, string> = {
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
