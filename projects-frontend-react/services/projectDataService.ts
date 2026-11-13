import { get, set } from 'idb-keyval';
import { Project, StaticProjectsData } from '../types';
import { initializeTranslations } from '../utils/villageTranslations';

const STATIC_PROJECTS_URL = '/data/projects.json';
const CACHE_KEY = 'projects_data_cache_v1';

let memoryCache: Project[] | null = null;
let lastFetchTime = 0;

type UpdateCallback = (projects: Project[]) => void;
let updateCallbacks: UpdateCallback[] = [];

async function loadStaticProjectsFromDisk(): Promise<Project[] | null> {
  try {
    const response = await fetch(STATIC_PROJECTS_URL, { cache: 'no-cache' });
    if (!response.ok) {
      console.error('[projectData] Static projects JSON not found:', response.status);
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
    console.error('[projectData] Failed to load static projects JSON:', error);
    return null;
  }
}

export const projectDataService = {
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
    const all = await projectDataService.getAllProjects();
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

    console.error('[projectData] No project data available (missing /data/projects.json)');
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
};

if (import.meta.env.DEV) {
  (window as any).projectDataService = projectDataService;
}
