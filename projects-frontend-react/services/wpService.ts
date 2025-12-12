import axios from 'axios';
import { get, set } from 'idb-keyval';
import { Project, ProjectStatus, ProjectType } from '../types';

// WordPress API Endpoint
const WP_API_URL = import.meta.env.VITE_WP_API_URL || 'http://localhost:8000/index.php?rest_route=/wp/v2';
console.log('[wpService] Using WP API URL:', WP_API_URL);

// Helper to build API URLs correctly
const buildApiUrl = (endpoint: string, params: Record<string, any> = {}) => {
    const isIndexPhpRoute = WP_API_URL.includes('index.php?rest_route=');

    if (isIndexPhpRoute) {
        // Extract base URL and rest_route
        const [baseUrl, restRoute] = WP_API_URL.split('?rest_route=');
        const fullRoute = `${restRoute}${endpoint}`;

        // Build query params
        const queryParams = new URLSearchParams(params);
        const queryString = queryParams.toString();

        return `${baseUrl}?rest_route=${fullRoute}${queryString ? '&' + queryString : ''}`;
    } else {
        // Standard pretty permalink format
        const queryParams = new URLSearchParams(params);
        const queryString = queryParams.toString();
        return `${WP_API_URL}${endpoint}${queryString ? '?' + queryString : ''}`;
    }
};

// Cache configuration
const CACHE_KEY = 'wp_projects_cache_v5';
// Development: 10 seconds, Production: 5 minutes
const CACHE_DURATION = import.meta.env.DEV ? 10 * 1000 : 5 * 60 * 1000;
let memoryCache: Project[] | null = null;
let lastFetchTime = 0;

console.log(`[wpService] Cache duration: ${CACHE_DURATION / 1000}s (${import.meta.env.DEV ? 'DEV' : 'PROD'} mode)`);

// Callback for background updates
type UpdateCallback = (projects: Project[]) => void;
let updateCallbacks: UpdateCallback[] = [];

export const wpService = {
    // Force refresh cache - useful for development
    forceRefresh: async (): Promise<Project[]> => {
        console.log('[wpService] 🔄 Force refreshing cache...');
        memoryCache = null;
        lastFetchTime = 0;
        try {
            await set(CACHE_KEY, null);
        } catch (e) { /* ignore */ }
        const projects = await wpService.getAllProjects();
        console.log('[wpService] ✅ Cache refreshed!');
        return projects;
    },

    // Subscribe to background updates
    onUpdate: (callback: UpdateCallback) => {
        updateCallbacks.push(callback);
        return () => {
            updateCallbacks = updateCallbacks.filter(cb => cb !== callback);
        };
    },

    getAllProjects: async (): Promise<Project[]> => {
        const startTime = performance.now();
        console.log('[wpService] Fetching projects...');

        // Check in-memory cache first (always fast)
        if (memoryCache && (Date.now() - lastFetchTime < CACHE_DURATION)) {
            console.log(`[wpService] Serving from memory cache (${(performance.now() - startTime).toFixed(2)}ms)`);
            return memoryCache;
        }

        // Check IndexedDB cache - STALE-WHILE-REVALIDATE
        let cachedData: Project[] | null = null;
        try {
            const cached = await get(CACHE_KEY);
            if (cached) {
                const { data, timestamp } = cached;
                const isStale = Date.now() - timestamp >= CACHE_DURATION;

                if (!isStale) {
                    // Fresh cache - use it
                    memoryCache = data;
                    lastFetchTime = timestamp;
                    console.log(`[wpService] Serving from IndexedDB cache (${(performance.now() - startTime).toFixed(2)}ms)`);
                    return data;
                } else {
                    // Stale cache - return it immediately but fetch fresh data in background
                    cachedData = data;
                    console.log('[wpService] Using stale cache, fetching fresh data in background...');
                }
            } else {
                console.log('[wpService] No IndexedDB cache found');
            }
        } catch (e) {
            console.warn('[wpService] Error reading from IndexedDB', e);
        }

        // If we have stale cached data, return it immediately and fetch in background
        if (cachedData) {
            // Return stale data immediately
            memoryCache = cachedData;

            // Fetch fresh data in background (non-blocking)
            wpService.fetchFreshProjects().then((freshData) => {
                console.log('[wpService] Background refresh completed, notifying subscribers');
                // Notify all subscribers about the update
                updateCallbacks.forEach(cb => cb(freshData));
            }).catch(err => {
                console.warn('[wpService] Background refresh failed', err);
            });

            return cachedData;
        }

        try {
            console.log('[wpService] Fetching from API...');
            // Initial fetch to get the first page and total pages
            const firstPageUrl = buildApiUrl('/project', { per_page: '100', _embed: 'true' });
            const response = await axios.get(firstPageUrl);
            let allProjects = response.data;

            const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);
            console.log(`[wpService] Total pages: ${totalPages}`);

            if (totalPages > 1) {
                // Create an array of promises for the remaining pages
                const pagePromises = [];
                for (let i = 2; i <= totalPages; i++) {
                    const pageUrl = buildApiUrl('/project', { per_page: '100', _embed: 'true', page: i.toString() });
                    pagePromises.push(axios.get(pageUrl));
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
    },

    // Helper method to fetch fresh projects in the background
    fetchFreshProjects: async (): Promise<Project[]> => {
        try {
            console.log('[wpService] Background fetch started...');
            // Initial fetch to get the first page and total pages
            const firstPageUrl = buildApiUrl('/project', { per_page: '100', _embed: 'true' });
            const response = await axios.get(firstPageUrl);
            let allProjects = response.data;

            const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);

            if (totalPages > 1) {
                const pagePromises = [];
                for (let i = 2; i <= totalPages; i++) {
                    const pageUrl = buildApiUrl('/project', { per_page: '100', _embed: 'true', page: i.toString() });
                    pagePromises.push(axios.get(pageUrl));
                }
                const responses = await Promise.all(pagePromises);
                responses.forEach(res => {
                    allProjects = [...allProjects, ...res.data];
                });
            }

            const mappedProjects = allProjects.map((item: any) => mapWpProjectToAppProject(item));

            // Update caches
            memoryCache = mappedProjects;
            lastFetchTime = Date.now();

            // Store in IndexedDB
            await set(CACHE_KEY, {
                data: mappedProjects,
                timestamp: lastFetchTime
            });

            console.log('[wpService] Background fetch completed successfully');
            return mappedProjects;
        } catch (error) {
            console.error('[wpService] Background fetch failed:', error);
            throw error;
        }
    },

    // Submit Grievance
    submitGrievance: async (formData: FormData): Promise<any> => {
        try {
            console.log('[wpService] Submitting grievance...');

            // Build the URL for the custom endpoint
            // Custom endpoint: /sabarajendran/v1/grievance

            let url = '';
            // Check if we are using index.php route or pretty permalinks
            // logic copied and adapted from buildApiUrl idea but simplified for this specific endpoint
            if (WP_API_URL.includes('index.php?rest_route=')) {
                const baseUrl = WP_API_URL.split('?rest_route=')[0];
                url = `${baseUrl}?rest_route=/sabarajendran/v1/grievance`;
            } else {
                // assume WP_API_URL ends with /wp/v2 or similar, we need to go up two levels?
                // Or just replace /wp/v2
                if (WP_API_URL.includes('/wp/v2')) {
                    url = WP_API_URL.replace('/wp/v2', '/sabarajendran/v1/grievance');
                } else {
                    // Fallback usage
                    url = `${WP_API_URL}/sabarajendran/v1/grievance`;
                }
            }

            console.log('[wpService] Endpoint URL:', url);

            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('[wpService] Grievance submitted successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('[wpService] Error submitting grievance:', error);
            throw error;
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

    // Get village name - prefer English translation from database
    const villageRaw = getTaxonomyName(wpItem, 'project_village', true) || 'Unknown Village';
    const village = toSmartTitleCase(villageRaw);

    const year = getTaxonomyName(wpItem, 'project_year') || '2024';
    const statusRaw = getTaxonomyName(wpItem, 'project_status');
    const typeRaw = getTaxonomyName(wpItem, 'project_category'); // Plugin said project_category maps to type/sector
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
    // Now exposed via register_rest_field at the root level
    const rawBudget = Number(wpItem._project_budget) || 0;
    let formattedBudget = `₹${rawBudget}`;
    if (rawBudget >= 10000000) formattedBudget = `₹${(rawBudget / 10000000).toFixed(2)} Cr`;
    else if (rawBudget >= 100000) formattedBudget = `₹${(rawBudget / 100000).toFixed(2)} L`;

    // Images
    // _embed adds 'wp:featuredmedia'.
    const imageUrl = wpItem._embedded?.['wp:featuredmedia']?.[0]?.source_url;

    const project = {
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
        scheme,
        budget: formattedBudget,
        rawBudget,
        imageUrl
    };

    // Debug: Log projects without Tamil translation
    if (!wpItem._project_title_tamil && wpItem.id) {
        console.warn(`[wpService] Project ${wpItem.id} missing Tamil title:`, wpItem.title.rendered);
    }

    return project;
};

const getTaxonomyName = (wpItem: any, taxonomy: string, preferEnglish: boolean = true): string | undefined => {
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
                const term = termList[0];

                // For project_village, use translation fields if available
                if (taxonomy === 'project_village') {
                    // Check if REST API fields are available
                    if (preferEnglish && term.village_name_english) {
                        return term.village_name_english;
                    } else if (!preferEnglish && term.village_name_tamil) {
                        return term.village_name_tamil;
                    }
                }

                // Fallback to term name
                return term.name;
            }
        }
    }
    return undefined;
};

// Expose wpService to window for development debugging
if (import.meta.env.DEV) {
    (window as any).wpService = wpService;
    console.log('[wpService] 🛠️ Development mode: wpService available in console');
    console.log('[wpService] 💡 Try: wpService.forceRefresh() to refresh data instantly');
}
