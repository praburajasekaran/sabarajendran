export enum ProjectStatus {
  COMPLETED = 'Completed',
  ONGOING = 'Ongoing',
  PLANNED = 'Planned',
  HALTED = 'Halted'
}

export enum ProjectType {
  INFRASTRUCTURE = 'Infrastructure',
  WATER = 'Water Supply',
  EDUCATION = 'Education',
  HEALTH = 'Health',
  ELECTRICITY = 'Electricity',
  COMMUNITY = 'Community Hall',
  AGRICULTURE = 'Agriculture'
}

export interface Project {
  id: string;
  title: string;
  title_ta?: string; // Tamil Title
  description: string;
  description_ta?: string; // Tamil Description
  block?: string; // Block (NLC, Panruti, Kurinjipadi)
  panchayat?: string; // Panchayat name
  village: string;
  year: string; // Changed to string to support "2020-2021" format
  status: ProjectStatus;
  type: ProjectType;
  scheme?: string; // Government scheme name (e.g., "MLACDS-Neyveli", "15th CFC (BP)")
  budget: string; // Display string e.g., "₹50 Lakhs"
  rawBudget: number; // Numeric value for calculations
  completionDate?: string;
  imageUrl?: string;
}

export interface Village {
  id: string;
  name: string;
  population?: number;
}

export interface Panchayat {
  id: string;
  name: string;
}

export interface StaticProjectsData {
  projects: Project[];
  meta: {
    total: number;
    generatedAt: string;
    version: string;
    blocks: string[];
    panchayats: string[];
    years: string[];
  };
}