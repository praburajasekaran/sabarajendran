import axios from 'axios';
import { get, set } from 'idb-keyval';
import { Project, ProjectStatus, ProjectType, StaticProjectsData } from '../types';
import { initializeTranslations } from '../utils/villageTranslations';

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
// Development: 10 seconds, Production: 1 minute (was 5 mins)
const CACHE_DURATION = import.meta.env.DEV ? 10 * 1000 : 60 * 1000;
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



    // Get projects with pagination
    getProjects: async (page: number = 1, perPage: number = 10): Promise<{ projects: Project[], totalPages: number, total: number }> => {
        const startTime = performance.now();
        console.log(`[wpService] Fetching projects page ${page}...`);

        // OPTIMIZATION: Check if we already have the FULL dataset in memory
        // If Home page has already fetched everything, we can just slice it!
        if (memoryCache && memoryCache.length > 0) {
            const total = memoryCache.length;
            const totalPages = Math.ceil(total / perPage);
            const startIndex = (page - 1) * perPage;
            const endIndex = startIndex + perPage;
            const slicedProjects = memoryCache.slice(startIndex, endIndex);

            console.log(`[wpService] Serving Page ${page} from FULL memory cache`);
            return {
                projects: slicedProjects,
                totalPages,
                total
            };
        }

        // Check in-memory cache for this specific page key (if needed)
        // const pageKey = `${CACHE_KEY}_p${page}_${perPage}`;

        try {
            const params = {
                per_page: perPage.toString(),
                page: page.toString(),
                _embed: 'true'
            };

            const url = buildApiUrl('/project', params);
            const response = await axios.get(url);

            const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);
            const total = parseInt(response.headers['x-wp-total'] || '0', 10);

            const mappedProjects = response.data.map((item: any) => mapWpProjectToAppProject(item));

            console.log(`[wpService] Page ${page} fetch complete (${(performance.now() - startTime).toFixed(2)}ms)`);

            return {
                projects: mappedProjects,
                totalPages,
                total
            };
        } catch (error) {
            console.error('[wpService] Error fetching projects page:', error);
            // If page 1 fails, maybe return cached data if accessible via IDB?
            // For now, return empty to prevent infinite loops.
            return { projects: [], totalPages: 0, total: 0 };
        }
    },

    // Load projects from static JSON (generated at build time)
    // This is the fastest path - no API calls needed
    loadStaticProjects: async (): Promise<Project[] | null> => {
        try {
            console.log('[wpService] ⚡ Loading from static JSON...');
            const startTime = performance.now();

            const response = await fetch('/data/projects.json');
            if (!response.ok) {
                console.log('[wpService] Static JSON not found, will use API');
                return null;
            }

            const data = await response.json();
            const projects = data.projects as Project[];

            // Initialize translations from metadata
            if (data.meta) {
                initializeTranslations(data as StaticProjectsData);
                console.log('[wpService] 🌍 Translations initialized from static data');
            }

            console.log(`[wpService] ⚡ Static load complete: ${projects.length} projects in ${(performance.now() - startTime).toFixed(0)}ms`);
            console.log(`[wpService] 📊 Data generated at: ${data.meta?.generatedAt || 'unknown'}`);

            // Update caches with static data
            memoryCache = projects;
            lastFetchTime = Date.now();

            // Also update IndexedDB for consistency
            set(CACHE_KEY, {
                data: projects,
                timestamp: lastFetchTime,
                source: 'static'
            }).catch(e => console.warn('IDB Error', e));

            return projects;
        } catch (error) {
            console.log('[wpService] Static JSON load failed, falling back to API');
            return null;
        }
    },

    // Main method to get all projects - optimized loading order:
    // 1. Memory cache (instant)
    // 2. Static JSON file (very fast, ~50-100ms)
    // 3. IndexedDB cache (fast, ~100-200ms)
    // 4. WordPress API (slow, 2-5s)
    getAllProjects: async (): Promise<Project[]> => {
        const startTime = performance.now();
        console.log('[wpService] Fetching ALL projects...');

        // 1. Check memory cache first (instant)
        if (memoryCache && (Date.now() - lastFetchTime < CACHE_DURATION)) {
            console.log('[wpService] ✅ Served from memory cache');
            return memoryCache;
        }

        // 2. Try static JSON file (very fast - bundled with app)
        const staticProjects = await wpService.loadStaticProjects();
        if (staticProjects && staticProjects.length > 0) {
            // Background refresh from API for latest data (non-blocking)
            setTimeout(() => {
                wpService.fetchFreshProjects().catch(e => console.error('[wpService] Background refresh failed:', e));
            }, 5000); // Wait 5s before background refresh

            return staticProjects;
        }

        // 3. Try IndexedDB cache
        try {
            const cached = await get(CACHE_KEY);
            if (cached && cached.data) {
                console.log('[wpService] ✅ Served from IndexedDB cache');
                memoryCache = cached.data;
                lastFetchTime = cached.timestamp || Date.now();

                // Background refresh if stale
                if (Date.now() - (cached.timestamp || 0) >= CACHE_DURATION) {
                    wpService.fetchFreshProjects().catch(e => console.error(e));
                }
                return cached.data;
            }
        } catch (e) { /* ignore */ }

        // 4. Fetch from WordPress API (slowest, last resort)
        console.log('[wpService] No cache available, fetching from API...');
        return await wpService.fetchFreshProjects();
    },


    // Helper method to fetch fresh projects in the background
    fetchFreshProjects: async (): Promise<Project[]> => {
        try {
            console.log('[wpService] Background fetch of ALL projects started...');
            const firstPageUrl = buildApiUrl('/project', { per_page: '100', _embed: 'true' });
            const response = await axios.get(firstPageUrl);
            let allProjects = response.data;

            const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);

            if (totalPages > 1) {
                console.log(`[wpService] Fetching ${totalPages - 1} additional pages...`);
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
            set(CACHE_KEY, {
                data: mappedProjects,
                timestamp: lastFetchTime
            }).catch(e => console.warn('IDB Error', e));

            console.log('[wpService] Background fetch completed successfully');

            // Notify listeners
            updateCallbacks.forEach(cb => cb(mappedProjects));

            return mappedProjects;
        } catch (error) {
            console.error('[wpService] Background fetch failed:', error);
            return memoryCache || [];
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
    },

    // Send OTP
    sendOTP: async (phoneNumber: string): Promise<{ success: boolean; session_id: string; expires_at: number; resend_count: number }> => {
        try {
            console.log('[wpService] Sending OTP to:', phoneNumber);

            let url = '';
            if (WP_API_URL.includes('index.php?rest_route=')) {
                const baseUrl = WP_API_URL.split('?rest_route=')[0];
                url = `${baseUrl}?rest_route=/sabarajendran/v1/send-otp`;
            } else {
                if (WP_API_URL.includes('/wp/v2')) {
                    url = WP_API_URL.replace('/wp/v2', '/sabarajendran/v1/send-otp');
                } else {
                    url = `${WP_API_URL}/sabarajendran/v1/send-otp`;
                }
            }

            const response = await axios.post(url, { phone: phoneNumber }, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('[wpService] OTP sent successfully:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('[wpService] Error sending OTP:', error);
            throw error.response?.data || error;
        }
    },

    // Verify OTP
    verifyOTP: async (phoneNumber: string, otp: string): Promise<{ success: boolean; verification_token: string }> => {
        try {
            console.log('[wpService] Verifying OTP for:', phoneNumber);

            let url = '';
            if (WP_API_URL.includes('index.php?rest_route=')) {
                const baseUrl = WP_API_URL.split('?rest_route=')[0];
                url = `${baseUrl}?rest_route=/sabarajendran/v1/verify-otp`;
            } else {
                if (WP_API_URL.includes('/wp/v2')) {
                    url = WP_API_URL.replace('/wp/v2', '/sabarajendran/v1/verify-otp');
                } else {
                    url = `${WP_API_URL}/sabarajendran/v1/verify-otp`;
                }
            }

            const response = await axios.post(url, { phone: phoneNumber, otp }, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('[wpService] OTP verified successfully:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('[wpService] Error verifying OTP:', error);
            throw error.response?.data || error;
        }
    },

    // Resend OTP
    resendOTP: async (phoneNumber: string): Promise<{ success: boolean; expires_at: number; resend_count: number }> => {
        try {
            console.log('[wpService] Resending OTP to:', phoneNumber);

            let url = '';
            if (WP_API_URL.includes('index.php?rest_route=')) {
                const baseUrl = WP_API_URL.split('?rest_route=')[0];
                url = `${baseUrl}?rest_route=/sabarajendran/v1/resend-otp`;
            } else {
                if (WP_API_URL.includes('/wp/v2')) {
                    url = WP_API_URL.replace('/wp/v2', '/sabarajendran/v1/resend-otp');
                } else {
                    url = `${WP_API_URL}/sabarajendran/v1/resend-otp`;
                }
            }

            const response = await axios.post(url, { phone: phoneNumber }, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('[wpService] OTP resent successfully:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('[wpService] Error resending OTP:', error);
            throw error.response?.data || error;
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
    const panchayat = toSmartTitleCase(getTaxonomyName(wpItem, 'project_panchayat', true) || '');
    const panchayat_ta = getTaxonomyName(wpItem, 'project_panchayat', false); // Tamil panchayat name

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
        panchayat_ta,
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

                // For project_panchayat, use translation fields if available
                if (taxonomy === 'project_panchayat') {
                    if (preferEnglish && term.panchayat_name_english) {
                        return term.panchayat_name_english;
                    } else if (!preferEnglish && term.panchayat_name_tamil) {
                        return term.panchayat_name_tamil;
                    }
                }

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
