/**
 * Generate Static Projects JSON
 * 
 * This script fetches all projects from WordPress REST API and generates
 * a static JSON file that gets bundled with the app for instant loading.
 * 
 * Run: npx tsx scripts/generate-projects.ts
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { correctTamilSpelling } from './tamil-spelling-corrections.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const WP_API_URL = process.env.VITE_WP_API_URL || 'https://projects.sabarajendran.com/wp-json/wp/v2';
const OUTPUT_DIR = path.join(__dirname, '../dist/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'projects.json');

// Also create a copy in public for development
const PUBLIC_DIR = path.join(__dirname, '../public/data');
const PUBLIC_FILE = path.join(PUBLIC_DIR, 'projects.json');

// Types (matching the app's types.ts)
enum ProjectStatus {
    COMPLETED = 'Completed',
    ONGOING = 'Ongoing',
    PLANNED = 'Planned',
    HALTED = 'Halted'
}

enum ProjectType {
    INFRASTRUCTURE = 'Infrastructure',
    WATER = 'Water Supply',
    EDUCATION = 'Education',
    HEALTH = 'Health',
    ELECTRICITY = 'Electricity',
    COMMUNITY = 'Community Hall',
    AGRICULTURE = 'Agriculture'
}

interface Project {
    id: string;
    title: string;
    title_ta?: string;
    block?: string;
    panchayat?: string;
    panchayat_ta?: string;
    village?: string;
    village_ta?: string;
    year: string;
    status: ProjectStatus;
    type: ProjectType;
    scheme?: string;
    budget: string;
    rawBudget: number;
    imageUrl?: string;
}

interface StaticProjectsData {
    projects: Project[];
    meta: {
        total: number;
        generatedAt: string;
        version: string;
        blocks: string[];
        panchayats: string[];
        years: string[];
        translations: {
            panchayats: Record<string, string>; // English -> Tamil
            villages: Record<string, string>; // English -> Tamil
        };
    };
}

// Helper functions (matching wpService.ts logic)
const toSmartTitleCase = (str: string): string => {
    const smallWords = /^(a|an|the|at|by|for|in|of|on|to|up|and|as|but|or|nor)$/i;
    const abbreviations = /^(PUMS|PUPS|GHSS|ADW|RCC|OHT|FHTC|WMM|BT|CC|MLACDS|MPLADS|NNT|SIDS|CFSIDS|MGSMT|NABARD|RIDF|PDS|RO|LED|CFC|BP|DP)$/i;

    return str.replace(/\w\S*/g, (txt, offset) => {
        if (abbreviations.test(txt)) {
            return txt.toUpperCase();
        }
        if (offset !== 0 && smallWords.test(txt)) {
            return txt.toLowerCase();
        }
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

const getTaxonomyName = (wpItem: any, taxonomy: string, preferEnglish: boolean = true): string | undefined => {
    const terms = wpItem._embedded?.['wp:term'];
    if (!terms) return undefined;

    for (const termList of terms) {
        if (Array.isArray(termList) && termList.length > 0) {
            if (termList[0].taxonomy === taxonomy) {
                const term = termList[0];

                if (taxonomy === 'project_village') {
                    // API returns 'name_english' and 'name_tamil' for villages (see saba-projects.php)
                    if (preferEnglish && (term.name_english || term.village_name_english)) {
                        return term.name_english || term.village_name_english;
                    } else if (!preferEnglish && (term.name_tamil || term.village_name_tamil)) {
                        return term.name_tamil || term.village_name_tamil;
                    }
                }

                if (taxonomy === 'project_panchayat') {
                    if (preferEnglish && term.panchayat_name_english) {
                        return term.panchayat_name_english;
                    } else if (!preferEnglish && term.panchayat_name_tamil) {
                        return term.panchayat_name_tamil;
                    }
                }
                return term.name;
            }
        }
    }
    return undefined;
};

const mapWpProjectToAppProject = (wpItem: any): Project => {
    const block = getTaxonomyName(wpItem, 'project_block');
    const panchayat = toSmartTitleCase(getTaxonomyName(wpItem, 'project_panchayat', true) || '');
    const panchayat_ta = correctTamilSpelling(getTaxonomyName(wpItem, 'project_panchayat', false), 'panchayat');
    const villageRaw = getTaxonomyName(wpItem, 'project_village', true) || 'Unknown Village';
    const village = toSmartTitleCase(villageRaw);
    const village_ta = correctTamilSpelling(getTaxonomyName(wpItem, 'project_village', false), 'village');
    const year = getTaxonomyName(wpItem, 'project_year') || '2024';
    const statusRaw = getTaxonomyName(wpItem, 'project_status');
    const typeRaw = getTaxonomyName(wpItem, 'project_category');
    const scheme = getTaxonomyName(wpItem, 'project_scheme');

    // Map Status
    let status = ProjectStatus.ONGOING;
    if (statusRaw?.toLowerCase().includes('completed')) status = ProjectStatus.COMPLETED;
    else if (statusRaw?.toLowerCase().includes('planned')) status = ProjectStatus.PLANNED;
    else if (statusRaw?.toLowerCase().includes('halted')) status = ProjectStatus.HALTED;

    // Map Type
    let type = ProjectType.INFRASTRUCTURE;
    if (typeRaw) {
        const t = typeRaw.toLowerCase();
        if (t.includes('water')) type = ProjectType.WATER;
        else if (t.includes('education') || t.includes('school')) type = ProjectType.EDUCATION;
        else if (t.includes('health')) type = ProjectType.HEALTH;
        else if (t.includes('electricity') || t.includes('light')) type = ProjectType.ELECTRICITY;
        else if (t.includes('community')) type = ProjectType.COMMUNITY;
        else if (t.includes('agri')) type = ProjectType.AGRICULTURE;
    }

    // Map Budget
    const rawBudget = Number(wpItem._project_budget) || 0;
    let formattedBudget = `₹${rawBudget}`;
    if (rawBudget >= 10000000) formattedBudget = `₹${(rawBudget / 10000000).toFixed(2)} Cr`;
    else if (rawBudget >= 100000) formattedBudget = `₹${(rawBudget / 100000).toFixed(2)} L`;

    // Images
    const imageUrl = wpItem._embedded?.['wp:featuredmedia']?.[0]?.source_url;

    return {
        id: wpItem.id?.toString() || 'unknown',
        title: toSmartTitleCase(wpItem._project_title_english || wpItem.title?.rendered || 'Untitled Project'),
        title_ta: correctTamilSpelling(wpItem._project_title_tamil, 'title'),
        block,
        panchayat,
        panchayat_ta,
        village,
        village_ta,
        year,
        status,
        type,
        scheme,
        budget: formattedBudget,
        rawBudget,
        imageUrl
    };
};

// Helper function with retry logic
async function fetchWithRetry(url: string, retries: number = 3, delay: number = 2000): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await axios.get(url, { timeout: 30000 });
        } catch (error: any) {
            if (attempt === retries) throw error;
            console.log(`   ⚠️ Attempt ${attempt} failed, retrying in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

async function fetchAllProjects(): Promise<any[]> {
    console.log('📡 Fetching projects from WordPress...');
    console.log(`   API URL: ${WP_API_URL}`);

    // Helper to construct URL with params
    const buildUrl = (baseUrl: string, endpoint: string, params: Record<string, string | number>) => {
        const hasQuery = baseUrl.includes('?');
        const separator = hasQuery ? '&' : '?';
        const queryString = Object.entries(params)
            .map(([k, v]) => `${k}=${v}`)
            .join('&');

        // Handle "rest_route" case: if base has rest_route, just append param
        // But we need to append the endpoint path. 
        // If WP_API_URL includes rest_route=/wp/v2, we must append /project to it?
        // No, rest_route in WP takes the full path. e.g. rest_route=/wp/v2/project
        // So we might need to parse the base URL more intelligently.

        const url = new URL(baseUrl);
        const searchParams = url.searchParams;

        // Check if we are using rest_route param (common in plain permalinks)
        if (searchParams.has('rest_route')) {
            const currentRoute = searchParams.get('rest_route') || '';
            // If currentRoute ends with /wp/v2 and endpoint starts with /, join them
            let newRoute = currentRoute;
            if (currentRoute.endsWith('/wp/v2') && endpoint.startsWith('/')) {
                newRoute = currentRoute + endpoint; // e.g. /wp/v2/project
            } else if (!currentRoute.includes(endpoint)) {
                // Fallback: just append if it looks safe, or warn
                newRoute = currentRoute.replace(/\/$/, '') + '/' + endpoint.replace(/^\//, '');
            }
            searchParams.set('rest_route', newRoute);
        } else {
            // Standard permalinks: append endpoint to pathname
            url.pathname = url.pathname.replace(/\/$/, '') + '/' + endpoint.replace(/^\//, '');
        }

        // Add other params
        Object.entries(params).forEach(([k, v]) => {
            searchParams.set(k, String(v));
        });

        return url.toString();
    };

    try {
        const initialUrl = buildUrl(WP_API_URL, 'project', { per_page: 100, _embed: '' });
        const response = await fetchWithRetry(initialUrl);

        let allProjects = response.data;
        const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);
        const total = parseInt(response.headers['x-wp-total'] || '0', 10);

        console.log(`   Found ${total} projects across ${totalPages} page(s)`);

        if (totalPages > 1) {
            for (let i = 2; i <= totalPages; i++) {
                console.log(`   Fetching page ${i}/${totalPages}...`);
                const pageUrl = buildUrl(WP_API_URL, 'project', { per_page: 100, _embed: '', page: i });
                const pageResponse = await fetchWithRetry(pageUrl);
                allProjects = [...allProjects, ...pageResponse.data];
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        console.log(`✅ Fetched ${allProjects.length} total projects`);
        return allProjects;
    } catch (error) {
        console.error('❌ Error fetching projects:', error);
        throw error;
    }
}

async function generateStaticData(): Promise<void> {
    console.log('\n🚀 Starting static projects generation...\n');

    const startTime = Date.now();

    // Fetch all projects
    const wpProjects = await fetchAllProjects();

    // Transform to app format
    const projects = wpProjects.map(mapWpProjectToAppProject);

    // Extract unique values for filters
    const blocks = [...new Set(projects.map(p => p.block).filter(Boolean))] as string[];
    const panchayats = [...new Set(projects.map(p => p.panchayat).filter(Boolean))] as string[];
    const years = [...new Set(projects.map(p => p.year).filter(Boolean))] as string[];

    // Build translation maps from project data
    const panchayatTranslations: Record<string, string> = {};
    projects.forEach(p => {
        if (p.panchayat && p.panchayat_ta) {
            panchayatTranslations[p.panchayat] = p.panchayat_ta;
        }
    });

    const villageTranslations: Record<string, string> = {};
    projects.forEach(p => {
        if (p.village && p.village_ta) {
            villageTranslations[p.village] = p.village_ta;
        }
    });

    // Create static data structure
    const staticData: StaticProjectsData = {
        projects,
        meta: {
            total: projects.length,
            generatedAt: new Date().toISOString(),
            version: '1.0.0',
            blocks: blocks.sort(),
            panchayats: panchayats.sort(),
            years: years.sort().reverse(),
            translations: {
                panchayats: panchayatTranslations,
                villages: villageTranslations
            }
        }
    };

    // Ensure output directories exist
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    if (!fs.existsSync(PUBLIC_DIR)) {
        fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    // Write to dist (for production build)
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(staticData, null, 2));
    console.log(`📁 Written to: ${OUTPUT_FILE}`);

    // Write to public (for development)
    fs.writeFileSync(PUBLIC_FILE, JSON.stringify(staticData, null, 2));
    console.log(`📁 Written to: ${PUBLIC_FILE}`);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Static projects generation complete!');
    console.log(`   Total projects: ${projects.length}`);
    console.log(`   Blocks: ${blocks.length}`);
    console.log(`   Panchayats: ${panchayats.length}`);
    console.log(`   Years: ${years.length}`);
    console.log(`   Duration: ${duration}s`);
    console.log('='.repeat(50) + '\n');
}

// Run
generateStaticData().catch(err => {
    console.error('Failed to generate static data:', err);
    process.exit(1);
});
