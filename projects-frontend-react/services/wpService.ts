import axios from 'axios';
import { get, set } from 'idb-keyval';
import { Project, StaticProjectsData } from '../types';
import { initializeTranslations } from '../utils/villageTranslations';

const STATIC_PROJECTS_URL = '/data/projects.json';
const CACHE_KEY = 'wp_projects_cache_v6';

// Optional: legacy WordPress REST base for grievance / OTP only (not used for project listings).
const GRIEVANCE_API_BASE = import.meta.env.VITE_WP_API_URL || '';

let memoryCache: Project[] | null = null;
let lastFetchTime = 0;

type UpdateCallback = (projects: Project[]) => void;
let updateCallbacks: UpdateCallback[] = [];

async function loadStaticProjectsFromDisk(): Promise<Project[] | null> {
  try {
    const response = await fetch(STATIC_PROJECTS_URL, { cache: 'no-cache' });
    if (!response.ok) {
      console.error('[wpService] Static projects JSON not found:', response.status);
      return null;
    }

    const data = (await response.json()) as StaticProjectsData;
    const projects = data.projects;

    if (data.meta) {
      initializeTranslations(data);
    }

    memoryCache = projects;
    lastFetchTime = Date.now();

    await set(CACHE_KEY, {
      data: projects,
      timestamp: lastFetchTime,
      source: 'static',
    }).catch(() => undefined);

    return projects;
  } catch (error) {
    console.error('[wpService] Failed to load static projects JSON:', error);
    return null;
  }
}

function buildGrievanceUrl(pathSuffix: string): string {
  if (!GRIEVANCE_API_BASE) {
    throw new Error(
      'Grievance API is not configured. Set VITE_WP_API_URL in Netlify if grievance forms should stay live.',
    );
  }

  if (GRIEVANCE_API_BASE.includes('index.php?rest_route=')) {
    const baseUrl = GRIEVANCE_API_BASE.split('?rest_route=')[0];
    return `${baseUrl}?rest_route=${pathSuffix}`;
  }

  if (GRIEVANCE_API_BASE.includes('/wp/v2')) {
    return GRIEVANCE_API_BASE.replace('/wp/v2', pathSuffix);
  }

  return `${GRIEVANCE_API_BASE.replace(/\/$/, '')}${pathSuffix}`;
}

export const wpService = {
  forceRefresh: async (): Promise<Project[]> => {
    memoryCache = null;
    lastFetchTime = 0;
    const projects = (await loadStaticProjectsFromDisk()) ?? [];
    updateCallbacks.forEach((cb) => cb(projects));
    return projects;
  },

  onUpdate: (callback: UpdateCallback) => {
    updateCallbacks.push(callback);
    return () => {
      updateCallbacks = updateCallbacks.filter((cb) => cb !== callback);
    };
  },

  getProjects: async (
    page: number = 1,
    perPage: number = 10,
  ): Promise<{ projects: Project[]; totalPages: number; total: number }> => {
    const all = await wpService.getAllProjects();
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const startIndex = (page - 1) * perPage;
    return {
      projects: all.slice(startIndex, startIndex + perPage),
      totalPages,
      total,
    };
  },

  loadStaticProjects: loadStaticProjectsFromDisk,

  getAllProjects: async (): Promise<Project[]> => {
    if (memoryCache && memoryCache.length > 0) {
      return memoryCache;
    }

    const fromDisk = await loadStaticProjectsFromDisk();
    if (fromDisk && fromDisk.length > 0) {
      return fromDisk;
    }

    try {
      const cached = await get(CACHE_KEY);
      if (cached?.data?.length) {
        memoryCache = cached.data;
        lastFetchTime = cached.timestamp || Date.now();
        return cached.data;
      }
    } catch {
      // ignore IDB errors
    }

    console.error('[wpService] No project data available (missing /data/projects.json)');
    return [];
  },

  loadStaticProjectsForTranslations: async (): Promise<void> => {
    try {
      const response = await fetch(STATIC_PROJECTS_URL);
      if (!response.ok) return;
      const data = (await response.json()) as StaticProjectsData;
      if (data.meta) {
        initializeTranslations(data);
      }
    } catch {
      // ignore
    }
  },

  submitGrievance: async (formData: FormData): Promise<any> => {
    const url = buildGrievanceUrl('/sabarajendran/v1/grievance');
    const response = await axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  sendOTP: async (
    phoneNumber: string,
  ): Promise<{ success: boolean; session_id: string; expires_at: number; resend_count: number }> => {
    const url = buildGrievanceUrl('/sabarajendran/v1/send-otp');
    const response = await axios.post(
      url,
      { phone: phoneNumber },
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response.data;
  },

  verifyOTP: async (
    phoneNumber: string,
    otp: string,
  ): Promise<{ success: boolean; verification_token: string }> => {
    const url = buildGrievanceUrl('/sabarajendran/v1/verify-otp');
    const response = await axios.post(
      url,
      { phone: phoneNumber, otp },
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response.data;
  },

  resendOTP: async (
    phoneNumber: string,
  ): Promise<{ success: boolean; expires_at: number; resend_count: number }> => {
    const url = buildGrievanceUrl('/sabarajendran/v1/resend-otp');
    const response = await axios.post(
      url,
      { phone: phoneNumber },
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response.data;
  },
};

if (import.meta.env.DEV) {
  (window as any).wpService = wpService;
}
