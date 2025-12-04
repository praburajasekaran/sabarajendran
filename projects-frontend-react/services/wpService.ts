import axios from 'axios';
import { get, set } from 'idb-keyval';
import { Project, ProjectStatus, ProjectType } from '../types';

// WordPress API Endpoint
// Using query parameter format to avoid permalink issues
const WP_API_URL = import.meta.env.VITE_WP_API_URL || 'http://localhost:8888/sabarajendran/wp-json/wp/v2';

// Cache configuration
const CACHE_KEY = 'wp_projects_cache_v4';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let memoryCache: Project[] | null = null;
let lastFetchTime = 0;

export const wpService = {
    getAllProjects: async (): Promise<Project[]> => {
        const startTime = performance.now();
        console.log('[wpService] Fetching projects...');

        // Check in-memory cache first
        if (memoryCache && (Date.now() - lastFetchTime < CACHE_DURATION)) {
            console.log(`[wpService] Serving from memory cache (${(performance.now() - startTime).toFixed(2)}ms)`);
            return memoryCache;
        }

        // Check IndexedDB cache
        try {
            const cached = await get(CACHE_KEY);
            if (cached) {
                const { data, timestamp } = cached;
                if (Date.now() - timestamp < CACHE_DURATION) {
                    memoryCache = data;
                    lastFetchTime = timestamp;
                    console.log(`[wpService] Serving from IndexedDB cache (${(performance.now() - startTime).toFixed(2)}ms)`);
                    return data;
                } else {
                    console.log('[wpService] IndexedDB cache expired');
                }
            } else {
                console.log('[wpService] No IndexedDB cache found');
            }
        } catch (e) {
            console.warn('[wpService] Error reading from IndexedDB', e);
        }

        try {
            console.log('[wpService] Fetching from API...');
            // Initial fetch to get the first page and total pages
            const response = await axios.get(`${WP_API_URL}/?rest_route=/wp/v2/project&per_page=100&_embed`);
            let allProjects = response.data;

            const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);
            console.log(`[wpService] Total pages: ${totalPages}`);

            if (totalPages > 1) {
                // Create an array of promises for the remaining pages
                const pagePromises = [];
                for (let i = 2; i <= totalPages; i++) {
                    pagePromises.push(
                        axios.get(`${WP_API_URL}/?rest_route=/wp/v2/project&per_page=100&_embed&page=${i}`)
                    );
                }

                // Fetch all remaining pages in parallel
                const responses = await Promise.all(pagePromises);

                // Combine all data
                responses.forEach(res => {
                    allProjects = [...allProjects, ...res.data];
                });
            }

            console.log(`[wpService] Fetched ${allProjects.length} projects from API`);
            const mappedProjects = allProjects.map((item: any) => mapWpProjectToAppProject(item));

            // Update caches
            memoryCache = mappedProjects;
            lastFetchTime = Date.now();

            // Store in IndexedDB (asynchronous)
            set(CACHE_KEY, {
                data: mappedProjects,
                timestamp: lastFetchTime
            }).catch(e => console.warn('[wpService] Error writing to IndexedDB', e));

            console.log(`[wpService] Fetch complete (${(performance.now() - startTime).toFixed(2)}ms)`);
            return mappedProjects;
        } catch (error) {
            console.error('[wpService] Error fetching projects from WP:', error);
            // Fallback to cache if available even if expired
            if (memoryCache) return memoryCache;
            try {
                const cached = await get(CACHE_KEY);
                if (cached) return cached.data;
            } catch (e) { /* ignore */ }

            return [];
        }
    }
};

const mapWpProjectToAppProject = (wpItem: any): Project => {
    // Extract custom fields (meta)
    // Note: The API response structure depends on how meta fields are exposed.
    // Often they are under 'meta' key or top level if registered with 'show_in_rest' => true
    // Based on standard WP REST API behavior for registered meta:

    const meta = wpItem.meta || {};
    const acf = wpItem.acf || {}; // Fallback if ACF is used, though we saw native meta registration

    // Helper to get meta value safely
    // The plugin registers meta keys with underscores like '_project_budget'
    // When 'show_in_rest' is true, they usually appear in the 'meta' object keyed by the registered name.
    // However, sometimes protected meta (starting with _) needs specific exposure.
    // Let's assume standard exposure for now based on the plugin code analysis (it didn't explicitly show 'show_in_rest' => true in the snippet, 
    // but we'll assume the user/plugin handles it or we might need to adjust).
    // actually, looking back at the plugin code, I didn't see 'show_in_rest' => true for the meta fields.
    // If they aren't exposed, we might need to fetch them differently or update the plugin.
    // BUT, for now, let's map what we expect. If it fails, we'll debug.

    // Actually, let's look at the taxonomies.
    // project_village, project_year, project_status, project_scheme (type)

    const toSmartTitleCase = (str: string) => {
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

    const block = getTaxonomyName(wpItem, 'project_block');
    const panchayat = toSmartTitleCase(getTaxonomyName(wpItem, 'project_panchayat') || '');
    const village = toSmartTitleCase(getTaxonomyName(wpItem, 'project_village') || 'Unknown Village');
    const year = getTaxonomyName(wpItem, 'project_year') || '2024';
    const statusRaw = getTaxonomyName(wpItem, 'project_status');
    const typeRaw = getTaxonomyName(wpItem, 'project_category'); // Plugin said project_category maps to type/sector

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
    // Now exposed via register_rest_field at the root level
    const rawBudget = Number(wpItem._project_budget) || 0;
    let formattedBudget = `₹${rawBudget}`;
    if (rawBudget >= 10000000) formattedBudget = `₹${(rawBudget / 10000000).toFixed(2)} Cr`;
    else if (rawBudget >= 100000) formattedBudget = `₹${(rawBudget / 100000).toFixed(2)} L`;

    // Images
    // _embed adds 'wp:featuredmedia'.
    const imageUrl = wpItem._embedded?.['wp:featuredmedia']?.[0]?.source_url;

    return {
        id: wpItem.id.toString(),
        title: toSmartTitleCase(wpItem._project_title_english || wpItem.title.rendered),
        title_ta: wpItem._project_title_tamil,
        description: wpItem._project_description_english || wpItem.content.rendered.replace(/<[^>]+>/g, ''), // Strip HTML
        description_ta: wpItem._project_description_tamil,
        block,
        panchayat,
        village,
        year,
        status,
        type,
        budget: formattedBudget,
        rawBudget,
        imageUrl
    };
};

const getTaxonomyName = (wpItem: any, taxonomy: string): string | undefined => {
    // _embed adds 'wp:term'. We need to find the right term list.
    // The structure is usually wpItem._embedded['wp:term'][index] where index corresponds to the taxonomy registration order?
    // Or we can look at the 'taxonomy' field in the item itself which contains IDs, then look up in _embedded.

    // Easier way: The REST API usually returns taxonomy IDs in a field named after the taxonomy (e.g. wpItem.project_village = [12, 14])
    // And _embedded['wp:term'] contains arrays of term objects.
    // We need to flatten _embedded['wp:term'] and search by ID? 
    // actually _embedded['wp:term'] is an array of arrays. Each inner array corresponds to a taxonomy associated with the post.

    const terms = wpItem._embedded?.['wp:term'];
    if (!terms) return undefined;

    // We have to iterate through all term lists to find one that matches our taxonomy
    for (const termList of terms) {
        if (Array.isArray(termList) && termList.length > 0) {
            // Check the taxonomy of the first item
            if (termList[0].taxonomy === taxonomy) {
                return termList[0].name; // Return the first term name found
            }
        }
    }
    return undefined;
};
